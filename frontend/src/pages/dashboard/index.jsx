import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  getAllPosts,
  deletePost,
  getComments,
  postComment,
  toggleLike,
} from "@/config/redux/action/PostAction";
import UserLayout from "../layouts/UserLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { BASE_URL } from "@/config";
import styles from "./index.module.css";
import Image from "next/image";

function Dashboard() {
  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [openCommentSection, setOpenCommentSection] = useState(null);

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);

  const dispatch = useDispatch();
  const router = useRouter();

 const handlePost = async () => {
  try {
    if (!postContent || postContent.trim() === "") {
      alert("Please write something!");
      return;
    }

    const formData = new FormData();
    formData.append("body", postContent);
    formData.append("token", localStorage.getItem("token"));

    if (fileContent) {
      formData.append("media", fileContent);
    } 

    

    const response = await dispatch(createPost(formData)).unwrap();

    setPostContent("");
    setFileContent(null);
    
    const fileInput = document.getElementById("fileUploading");
    if (fileInput) fileInput.value = "";
    
    dispatch(getAllPosts());
  } catch (error) {
    console.error("❌ Error creating post:", error);
    alert("Failed to create post: " + (error?.message || "Unknown error"));
  }
};


  const handleDeletePost = async (postId) => {
    const ok = confirm("Are you sure you want to delete this post?");
    if (!ok) return;

    try {
      await dispatch(
        deletePost({ postId, token: localStorage.getItem("token") })
      )
      dispatch(getAllPosts());
    } catch (err) {
      alert(err?.message || "Failed to delete post");
    }
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <h1>Welcome, {authState.user?.name || "User"}!</h1>

          {/* CREATE POST */}
          <div className={styles.createPostContainer}>
            <Image
  src={
    authState.user?.profilePicture && authState.user.profilePicture !== ""
      ? authState.user.profilePicture
      : "/default.jpg"
  }
  alt="avatar"
  width={40}
  height={40}
/>

            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className={styles.textAreaHe}
            />

            <input
              type="file"
              hidden
              id="fileUploading"
              onChange={(e) =>{console.log("File selected",e.target.files[0]); setFileContent(e.target.files[0])}}
            />

            <label htmlFor="fileUploading" className={styles.fileLabel}>
              +
            </label>

            {postContent && (
              <button onClick={handlePost} className={styles.postButton}>
                Post
              </button>
            )}
          </div>

          {/* POSTS */}
          <div className={styles.postsContainer}>
            {(postState.posts || []).map((post) => {
              const currentUserId = authState.user?._id;
              const postOwnerId =
                post.userId?._id || post.userId;

              const isOwner =
                currentUserId &&
                postOwnerId &&
                currentUserId.toString() === postOwnerId.toString();

              const isLiked =
  Array.isArray(post.likes) &&
  currentUserId &&
  post.likes.some(
    (id) => id.toString() === currentUserId.toString()
  );

              return (
                <div key={post._id} className={styles.singlePost}>
                  {/* HEADER */}
                  <div className={styles.postHeader}>
                    <Image
  src={
    authState.user?.profilePicture && authState.user.profilePicture !== ""
      ? authState.user.profilePicture
      : "/default.jpg"
  }
  alt="avatar"
  width={40}
  height={40}
/>

                    <div>
                      <h3>{post.userId.name}</h3>
                      <p>@{post.userId.username}</p>
                    </div>

                    {isOwner && (
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {/* BODY */}
                  <p className={styles.postBody}>{post.body}</p>

                  {post.media && (
                    <Image
                      src={post.media}
                      className={styles.postMedia}
                      alt="post media"
                      height={400}
                      width={600}
                    />
                  )}

                  {/* ACTIONS */}
                  <div className={styles.optionsContainer}>
                    {/* LIKE TOGGLE */}
                    <button
                      type="button"
                      className={
                        isLiked
                          ? styles.likedButton
                          : styles.singleOption_optionContainer
                      }
                      onClick={async () => {
                        await dispatch(
                          toggleLike({
                            postId: post._id,
                            token: localStorage.getItem("token"),
                          })
                        );
                        dispatch(getAllPosts());
                      }}
                    >
                      {isLiked ? "❤️" : "🤍"} {post.likes?.length || 0}
                    </button>

                    {/* COMMENT */}
                    <button
                      className={styles.singleOption_optionContainer}
                      onClick={() => {
                        if (openCommentSection === post._id) {
                          setOpenCommentSection(null);
                        } else {
                          setOpenCommentSection(post._id);
                          dispatch(getComments({ postId: post._id }));
                        }
                      }}
                    >
                      💬
                    </button>
                  </div>

                  {/* COMMENTS */}
                  {openCommentSection === post._id && (
                    <div className={styles.commentSection}>
                      {postState.comments?.length > 0 ? (
                        postState.comments.map((comment) => (
                          <div key={comment._id} className={styles.singleComment}>
                            <Image
  src={
    comment.userId?.profilePicture &&
    comment.userId.profilePicture !== ""
      ? comment.userId.profilePicture
      : "/default.jpg"
  }
  alt="user"
  width={40}
  height={40}
/>
                            <div>
                              <p>{comment.userId?.username}</p>
                              <p>{comment.body}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No comments yet</p>
                      )}

                      <div className={styles.addComment}>
                        <input
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          placeholder="Add a comment..."
                        />
                        <button
                          onClick={() => {
                            dispatch(
                              postComment({
                                postId: post._id,
                                token: localStorage.getItem("token"),
                                commentBody: commentContent,
                              })
                            );
                            setCommentContent("");
                          }}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default Dashboard;
