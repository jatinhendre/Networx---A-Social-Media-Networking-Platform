import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPosts,
  toggleLike,
  deletePost,
  getComments,
  postComment,
} from "@/config/redux/action/PostAction";
import styles from "./PostsFeed.module.css";
import Image from "next/image";

function PostsFeed({ connections }) {
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);

  const [commentContent, setCommentContent] = useState("");
  const [openCommentSection, setOpenCommentSection] = useState(null);

  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);
  const currentUserId = authState.user?._id;

  /* ---------------- FETCH POSTS ---------------- */
  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  /* ---------------- CONNECTION FILTER ---------------- */
  const connectionIds = connections.map((conn) =>
    conn.userId._id === currentUserId
      ? conn.connectionId._id
      : conn.userId._id
  );
  

  const filteredPosts = postState.posts.filter((post) =>
    connectionIds.includes(post.userId._id)
  );
filteredPosts.forEach((post) => {
  console.log(
    post.userId.username,
    "=>",
    post.userId.profilePicture
  );
});
  /* ---------------- HANDLERS ---------------- */
  const handleLike = (postId) => {
    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }
    dispatch(toggleLike({ postId, token }));
  };

  const handleDelete = (postId) => {
    if (window.confirm("Delete this post?")) {
      dispatch(deletePost({ postId, token }));
    }
  };

  return (
    <div className={styles.feedContainer}>
      <h3>Posts from Connections</h3>
      <br />

      {postState.isLoading ? (
        <p>Loading posts...</p>
      ) : filteredPosts.length === 0 ? (
        <p className={styles.emptyState}>
          No posts yet. Your connections posted nothing.
        </p>
      ) : (
        <div className={styles.postsGrid}>
          {filteredPosts.map((post) => {
            const isLiked =
              Array.isArray(post.likes) &&
              currentUserId &&
              post.likes.some(
                (id) => id.toString() === currentUserId.toString()
              );
              console.log("post-->",post);
            return (
              
              <div key={post._id} className={styles.postCard}>
                {/* HEADER */}
                <div className={styles.postHeader}>
                  <Image
                    src={
                      post.userId?.profilePicture
                        ? post.userId.profilePicture
                        : "/default.jpg"
                    }
                    alt="avatar"
                    width={40}
                    height={40}
                    className={styles.avatar}
                  />

                  <div>
                    <div className={styles.userName}>
                      {post.userId.name}
                    </div>
                    <div className={styles.postTime}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {post.userId._id === currentUserId && (
                    <button
                      onClick={() => handleDelete(post._id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* BODY */}
                <div className={styles.postBody}>{post.body}</div>

                {/* MEDIA */}
                {post.media && (
                  <Image
                    src={post.media}
                    alt="Post media"
                    width={600}
                    height={400}
                    className={styles.postImage}
                  />
                )}

                {/* ACTIONS */}
                <div className={styles.postActions}>
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`${styles.likeButton} ${
                      isLiked ? styles.likedButton : ""
                    }`}
                  >
                    {isLiked ? "❤️" : "🤍"} {post.likes?.length || 0}
                  </button>

                  <button
                    className={styles.commentButton}
                    onClick={() => {
                      if (openCommentSection === post._id) {
                        setOpenCommentSection(null);
                      } else {
                        setOpenCommentSection(post._id);
                        dispatch(getComments({ postId: post._id }));
                      }
                    }}
                  >
                    💬 Comment
                  </button>

                  <button
                    className={styles.shareButton}
                    onClick={() => {
                      const text = encodeURIComponent(post.body || "");
                      const url = encodeURIComponent(window.location.href);
                      window.open(
                        `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                        "_blank"
                      );
                    }}
                  >
                    🔗 Share
                  </button>
                </div>

                {/* COMMENTS (Dashboard-style) */}
                {openCommentSection === post._id && (
                  <div className={styles.commentSection}>
                    {postState.comments?.length > 0 ? (
                      postState.comments.map((comment) => (
                        <div
                          key={comment._id}
                          className={styles.singleComment}
                        >
                          <Image
                            src={
                              comment.userId?.profilePicture
                                ? comment.userId.profilePicture
                                : "/default.jpg"
                            }
                            alt="user"
                            width={32}
                            height={32}
                          />
                          <div>
                            <p className={styles.commentUsername}>
                              @{comment.userId?.username}
                            </p>
                            <p className={styles.commentBody}>
                              {comment.body}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={styles.noComments}>No comments yet</p>
                    )}

                    <div className={styles.addComment}>
                      <input
                        value={commentContent}
                        onChange={(e) =>
                          setCommentContent(e.target.value)
                        }
                        placeholder="Add a comment..."
                      />
                      <button
                        disabled={!commentContent.trim()}
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
      )}
    </div>
  );
}

export default PostsFeed;
