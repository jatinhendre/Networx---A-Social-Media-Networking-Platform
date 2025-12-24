import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getAllPosts, 
  toggleLike,
  deletePost 
} from "@/config/redux/action/PostAction";
import styles from "./PostsFeed.module.css";
import { BASE_URL } from "@/config";
import Image from "next/image";

function PostsFeed({ connections }) {
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);

  const token =
    authState.user?.token || localStorage.getItem("token");

  const currentUserId = authState.user?._id;

  /* ---------------- FETCH POSTS ---------------- */
  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  /* ---------------- CONNECTION FILTER ---------------- */
  const connectionIds = connections.map((conn) => {
    if (conn.userId._id === currentUserId) {
      return conn.connectionId._id;
    }
    return conn.userId._id;
  });

  const filteredPosts = postState.posts.filter(
    (post) =>
      connectionIds.includes(post.userId._id) 
  );

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
      <br></br>
      {postState.isLoading ? (
        <p>Loading posts...</p>
      ) : filteredPosts.length === 0 ? (
        <p className={styles.emptyState}>
          No posts yet. Your connections posted nothing.
        </p>
      ) : (
        <div className={styles.postsGrid}>
          {filteredPosts.map((post) => {
            // ✅ CORRECT PLACE FOR isLiked
            const isLiked =
              Array.isArray(post.likes) &&
              currentUserId &&
              post.likes.some(
                (id) => id.toString() === currentUserId.toString()
              );

            return (
              <div key={post._id} className={styles.postCard}>
                {/* HEADER */}
                <div className={styles.postHeader}>
                  <Image
                    src={
                       post.userId?.profilePicture &&
    post.userId.profilePicture !== ""
      ? post.userId.profilePicture
      : "/default.jpg"
                    }
                    alt={post.userId.name}
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
                    width={40}
                    height={40}
                    className={styles.postImage}
                  />
                )}

                {/* ACTIONS */}
                <div className={styles.postActions}>
                  {/* LIKE TOGGLE */}
                  <button
  onClick={() => handleLike(post._id)}
  className={`${styles.likeButton} ${
    isLiked ? styles.likedButton : ""
  }`}
>
  {isLiked ? "❤️" : "🤍"} {post.likes?.length || 0}
</button>


                  {/* COMMENT */}
                  <button className={styles.commentButton}>
                    💬 Comment
                  </button>

                  {/* SHARE (INTACT) */}
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
                    🔗Share
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PostsFeed;
