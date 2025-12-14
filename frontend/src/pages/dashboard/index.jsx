import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  getAllPosts,
  deletePost,
  incrementLikes,
} from "@/config/redux/action/PostAction";
import UserLayout from "../layouts/UserLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { BASE_URL } from "@/config";
import styles from "./index.module.css";

function Dashboard() {
  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);

  const dispatch = useDispatch();
  const router = useRouter();

  const handlePost = async () => {
    await dispatch(
      createPost({
        body: postContent,
        media: fileContent,
        token: localStorage.getItem("token"),
      })
    );
    setPostContent("");
    setFileContent(null);
    dispatch(getAllPosts());
  };

  const handleDeletePost = async (postId) => {
    console.log("handleDeletePost called with:", postId);
    if (!postId) {
      alert("Debug: postId is undefined in handleDeletePost");
      return;
    }
    const ok = confirm("Are you sure you want to delete this post?");
    if (!ok) return;
    try {
      await dispatch(
        deletePost({ postId, token: localStorage.getItem("token") })
      ).unwrap();
      dispatch(getAllPosts());
    } catch (err) {
      console.log("Error deleting post:", err);
      alert(err?.message || "Failed to delete post");
    }
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <h1>Welcome to your Dashboard, {authState.user?.name || "User"}!</h1>

          {/* Create post */}
          <div className={styles.createPostContainer}>
            <img
              src={`${BASE_URL}/${authState.user?.profilePicture || ""}`}
              alt="your avatar"
            />

            <textarea
              onChange={(e) => setPostContent(e.target.value)}
              value={postContent}
              placeholder="What's in your mind?"
              className={styles.textAreaHe}
            />

            <label htmlFor="fileUploading" className={styles.fileLabel}>
              <div className={styles.FaB}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
            </label>

            <input
              onChange={(e) => setFileContent(e.target.files[0])}
              type="file"
              id="fileUploading"
              hidden
            />

            {postContent.length > 0 && (
              <button onClick={handlePost} className={styles.postButton}>
                Post
              </button>
            )}
          </div>

          {/* Posts */}
          <div className={styles.postsContainer}>
            {(postState.posts || []).map((post) => {
              const currentUserId = authState.user?._id;
              const postOwnerId = post.userId?._id ? post.userId._id : post.userId;
              const isOwner =
                currentUserId &&
                postOwnerId &&
                currentUserId.toString() === postOwnerId.toString();

              return (
                <div key={post._id} className={styles.singlePost}>
                  <div className={styles.postHeader}>
                    <img
                      src={`${BASE_URL}/${post.userId.profilePicture || ""}`}
                      alt={`${post.userId.name}'s avatar`}
                    />

                    <div className={styles.postHeaderRight}>
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
                  </div>

                  <p className={styles.postBody}>{post.body}</p>

                  {post.media && (
                    <img
                      className={styles.postMedia}
                      src={`${BASE_URL}/${post.media}`}
                      alt="post media"
                    />
                  )}

                  {/* Actions: like / comment / share */}
                  <div className={styles.optionsContainer}>
                    {/* Like */}
                    <button
                      type="button"
                      className={styles.singleOption_optionContainer}
                      onClick={async () => {
                        await dispatch(
                          incrementLikes({
                            postId: post._id,
                            token: localStorage.getItem("token"),
                          })
                        );
                        dispatch(getAllPosts());
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                        />
                      </svg>
                      <span className={styles.likeCount}>{post.likes}</span>
                    </button>

                    {/* Comment (placeholder) */}
                    <div className={styles.singleOption_optionContainer}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                        />
                      </svg>
                    </div>

                    {/* Share to Twitter */}
                    <button
                      type="button"
                      className={styles.singleOption_optionContainer}
                      onClick={() => {
                        const text = encodeURIComponent(post.body || "");
                        const url = encodeURIComponent("https://www.youtube.com");
                        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                        window.open(twitterUrl, "_blank");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                        />
                      </svg>
                    </button>
                  </div>
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
