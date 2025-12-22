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
    async (postData, thunkAPI) => {
        
        try {
            const {media, body} = postData;
            const formData = new FormData();
            formData.append("media", media);
            formData.append("body", body);
            formData.append("token", postData.token);

            const response = await clientServer.post("/create_post", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if(response.status === 200){
                return thunkAPI.fulfillWithValue(response.data);
            }else{
                return thunkAPI.rejectWithValue("Post creation failed");
            }
        }catch(err) {
    console.log("🔥 ERROR RESPONSE:", err.response);
    console.log("🔥 ERROR MESSAGE:", err.message);
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
}
    }
)

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

export const incrementLikes = createAsyncThunk(
    "post/incrementLikes",
    async (user, thunkAPI) => {
        try{
            const {postId, token} = user;
            const response = await clientServer.post("/incrementLikes", {
                postId,
                token
            });
            if(response.status === 200){
                return thunkAPI.fulfillWithValue(response.data);
            }else{
                return thunkAPI.rejectWithValue("Increment Likes failed");
            }
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const getComments = createAsyncThunk(
    "post/getComments",
    async (postId, thunkAPI) => {
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
    async(data, thunkAPI)=>{
        try{
            const response = await clientServer.post("/add_testimonial",data);
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)