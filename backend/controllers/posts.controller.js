import Post from "../models/posts.model.js";
import User from "../models/users.model.js";

export const activeCheck = (req, res) => {
    return res.status(200).json({ message: "Posts controller is active && Server Is Also Running" })
}

export const createPost = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(401).json({ message: "User not found!!" });
        }
        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file ? req.file.filename : '',
            filetype: req.file ? req.file.mimetype.split('/')[1] : '',
        })
        await post.save();
        return res.status(201).json({ message: "Post created successfully", post: post });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

export const getAllPosts = async (req, res) => {
    try{
        const posts = await Post.find().populate('userId', 'name username profilePicture');
        return res.status(200).json(posts);
    }catch(err){
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

export const deletePost = async(req, res) => {
    try{
        const { postId, token } = req.body;
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(401).json({ message: "User not found!!" });
        }
        const deleted = await Post.findOneAndDelete({ _id: postId, userId: user._id });
if (!deleted) {
  return res.status(404).json({ message: "Post not found or you are not authorized to delete this post." });
}
return res.status(200).json({ message: "Post deleted successfully", postId });
    }catch(err){
        return res.status(500).json({ message: "Server error", error: err.message });       
    }
      
}

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
        return res.status(201).json({ message: "Comment added successfully", post: post }); 
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

export const incrementLike = async(req, res) => {
    try{
        const { postId } = req.body;
        const post = await Post.findOne({ _id: postId });   
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        post.likes += 1;
        await post.save();
        return res.status(200).json({ message: "Post liked successfully", likes: post.likes });
    }catch(err){
        return res.status(500).json({ message: "Server error", error: err.message });       
    }
}