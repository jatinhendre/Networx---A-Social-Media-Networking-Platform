import Post from "../models/posts.model.js";
import User from "../models/users.model.js";
import Comment from "../models/comments.model.js";
import cloudinary from "../config/cloudinary.js";
import Testimonial from "../models/testimonials.model.js";



export const createPost = async (req, res) => {
    try {
        console.log("CREATE POST REQUEST");
        console.log("Body:", req.body);
        console.log("File:", req.file);
        console.log("Content-Type:", req.headers["content-type"]);

        const { token, body } = req.body;
        
        if (!token) {
            return res.status(401).json({ message: "Token required" });
        }

        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(401).json({ message: "User not found!!" });
        }

        if (!body || body.trim() === "") {
            return res.status(400).json({ message: "Post body cannot be empty" });
        }

        const post = new Post({
            userId: user._id,
            body: body,
            media: req.file ? req.file.path : '',
            filetype: req.file ? req.file.mimetype : '',
            mediaPublicId: req.file ? req.file.filename : ''
        });

        await post.save();
        
        console.log("Post created successfully:", post._id);
        return res.status(201).json({ 
            message: "Post created successfully", 
            post: post 
        });
    } catch (err) {
        console.error("CREATE POST ERROR:", err);
        return res.status(500).json({ 
            message: "Server error", 
            error: err.message 
        });
    }
};

export const getAllPosts = async (req, res) => {
    try{
        const posts = await Post.find().populate('userId', 'name username profilePicture');
        return res.status(200).json(posts);
    }catch(err){
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

export const deletePost = async (req, res) => {
  try {
    const { postId, token } = req.body;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "User not found!!" });
    }

    const post = await Post.findOne({ _id: postId, userId: user._id });
    if (!post) {
      return res.status(404).json({
        message: "Post not found or you are not authorized to delete this post."
      });
    }

    if (post.mediaPublicId) {
      await cloudinary.uploader.destroy(post.mediaPublicId);
    }

    const deleted = await Post.findByIdAndDelete(postId);

    if (!deleted) {
      return res.status(404).json({
        message: "Post was not found"
      });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
      postId
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};


export const postComment = async(req, res) => {
    try{
        const { postId, token, commentBody } = req.body;
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(401).json({ message: "User not found!!" });
        }
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        const comment = new Comment({
            postId: post._id,
            userId: user._id,
            body: commentBody,  
        })
        await comment.save();
        const populatedComment = await comment.populate('userId', 'name username profilePicture');
        return res.status(201).json(populatedComment); 
    }catch(err){
        return res.status(500).json({ message: "Server error", error: err.message });       
    }
}

export const getComments = async(req, res) => {
    try{
        const { postId } = req.query;
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        const comments = await Comment.find({ postId: post._id }).populate('userId', 'name username profilePicture');
        return res.status(200).json(comments);
    }catch(err){
        return res.status(500).json({ message: "Server error", error: err.message });       
    }}

export const delete_comment = async(req, res) => {  
    try{
        const { commentId, token } = req.body;
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(401).json({ message: "User not found!!" });
        }
        const comment = await Comment.findOne({ _id: commentId, userId: user._id });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found or you are not authorized to delete this comment." });
        }
        await comment.remove();
        return res.status(200).json({ message: "Comment deleted successfully" });
    }catch(err){
        return res.status(500).json({ message: "Server error", error: err.message });       
    }
}

export const toggleLike = async (req, res) => {
  try {
    const { postId, token } = req.body;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === user._id.toString()
    );

    if (alreadyLiked) {
      // UNLIKE
      post.likes = post.likes.filter(
        (id) => id.toString() !== user._id.toString()
      );
    } else {
      // LIKE
      post.likes.push(user._id);
    }

    await post.save();

    return res.status(200).json({
      postId: post._id,
      likes: post.likes,
      liked: !alreadyLiked,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const getTestimonials = async(req, res)=>{
  try {
    const testimonials = await Testimonial.find()
      .populate("userId", "name profilePicture")
      .sort({ _id: -1 }).limit(3);

    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
}
export const getTestimonialsAll = async(req, res)=>{
  try {
    const testimonials = await Testimonial.find()
      .populate("userId", "name profilePicture")
      .sort({ _id: -1 });

    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
}
export const postTestimonial = async (req, res) => {
  try {
    const { token, role, testimonial } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!testimonial || testimonial.trim() === "") {
      return res.status(400).json({
        message: "Testimonial is required",
      });
    }

    const newTestimonial = await Testimonial.create({
      userId: user._id,
      role: role || "Other",
      testimonial,
    });

    res.status(201).json({
      message: "Testimonial added successfully",
      testimonial: newTestimonial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to post testimonial",
    });
  }
};
