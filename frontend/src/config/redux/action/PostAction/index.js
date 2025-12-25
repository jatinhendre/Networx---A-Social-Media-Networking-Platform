import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

export const getAllPosts = createAsyncThunk(
    "posts/getAll",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/posts");
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err) {
    console.log("🔥 ERROR RESPONSE:", err.response);
    console.log("🔥 ERROR MESSAGE:", err.message);
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
}

        }
)

export const createPost = createAsyncThunk(
  "post/createPost",
  async (formData, thunkAPI) => {
    try {
      const res = await clientServer.post(
        "/create_post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.post;
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);


export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (postData, thunkAPI) => {
        try{
            const {postId, token} = postData;
            const response = await clientServer.post("/delete_post", {
                postId,
                token
            });
            if(response.status === 200){
                return thunkAPI.fulfillWithValue({postId});
            }else{
                return thunkAPI.rejectWithValue("Post deletion failed");
            }
        }catch(err){
    console.log(" ERROR RESPONSE:", err.response);
        }
    }
)

export const toggleLike = createAsyncThunk(
  "post/toggleLike",
  async ({ postId, token }, thunkAPI) => {
    try {
      const response = await clientServer.post("/toggle_Like", {
        postId,
        token,
      });

      if (response.status === 200) {
        return thunkAPI.fulfillWithValue({
          postId,
          likes: response.data.likes, // array of userIds
        });
      } else {
        return thunkAPI.rejectWithValue("Toggle like failed");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Toggle like error"
      );
    }
  }
);



export const getComments = createAsyncThunk(
    "post/getComments",
    async ({postId}, thunkAPI) => {
    try{
        const response = await clientServer.get("/getComments",{
            params:{
                postId: postId
            }
        });

        if(response.status === 200){
            return thunkAPI.fulfillWithValue(response.data)
        }else{
            return thunkAPI.rejectWithValue("Fetching Comments failed");
        }
    }catch(err){
        return thunkAPI.rejectWithValue(err.response.data);
    }
}
)

export const postComment = createAsyncThunk(
    "post/postComment",
    async (commentData, thunkAPI) => {
        try{
            const response = await clientServer.post("/comment", commentData);
            if(response.status === 201){
                return thunkAPI.fulfillWithValue(response.data);
            }else{
                return thunkAPI.rejectWithValue("Posting Comment failed");
            }
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const postTestimonial = createAsyncThunk(
  "post/postTestimonial",
  async (data, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await clientServer.post(
        "/postTestimonial",
        {
          ...data,
          token,
        }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Post testimonial failed"
      );
    }
  }
);

export const getAllTestimonials = createAsyncThunk(
   "testimonial/getAll",
  async (_, thunkAPI)=>{
    try{
      const response = await clientServer.get('/getTestimonials');
      console.log(response);
      return thunkAPI.fulfillWithValue(response.data);
    }catch(err){
      return thunkAPI.rejectWithValue(
        err.response?.data || "Post testimonial failed"
      );
    }
  }
)
export const getAllTestimonialsForPage = createAsyncThunk(
   "testimonial/getAllForPage",
  async (_, thunkAPI)=>{
    try{
      const response = await clientServer.get('/getTestimonialsAll');
      console.log(response);
      return thunkAPI.fulfillWithValue(response.data);
    }catch(err){
      return thunkAPI.rejectWithValue(
        err.response?.data || "Post testimonial failed"
      );
    }
  }
)