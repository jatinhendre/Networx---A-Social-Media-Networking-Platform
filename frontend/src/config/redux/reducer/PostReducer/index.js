import { createSlice } from "@reduxjs/toolkit";
import {
  deletePost,
  getAllPosts,
  getComments,
  incrementLikes,
  postComment,
} from "@/config/redux/action/PostAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching Posts......";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;

        state.posts = Array.isArray(action.payload)
          ? action.payload.reverse()
          : action.payload?.posts?.reverse() ?? [];
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.postFetched = false;
        state.isError = true;
        state.message =
          (typeof action.payload === "string"
            ? action.payload
            : action.payload?.message) || "Fetching Posts Failed";
      })

      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.filter(
          (p) => p._id !== action.payload.postId
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (typeof action.payload === "string"
            ? action.payload
            : action.payload?.message) || "Delete failed";
      })

      .addCase(incrementLikes.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        state.posts = state.posts.map((post) =>
          post._id === postId ? { ...post, likes } : post
        );
      })

      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.comments = Array.isArray(action.payload)
        ? action.payload.reverse()
        : action.payload?.comments?.reverse() ?? [];
        state.isLoading = false;
        state.postId = action.payload.postId;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isError = true;
        state.isLoading=false;
        state.message =
          (typeof action.payload === "string"
            ? action.payload
            : action.payload?.message) || "Fetching Comments Failed";
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        state.isLoading=false;
      })
      .addCase(postComment.rejected, (state, action) => {
        state.isLoading=false;
        state.message =  
          (typeof action.payload === "string"
            ? action.payload
            : action.payload?.message) || "Posting Comment Failed";
      })
      .addCase(postComment.pending,(state,action)=>{
        state.isLoading=true;
      })
      
  }, 
});

export default postSlice.reducer;
export const { reset, resetPostId } = postSlice.actions;
