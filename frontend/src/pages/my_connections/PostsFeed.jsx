import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getAllPosts, 
  incrementLikes,
  deletePost 
} from "@/config/redux/action/PostAction";
import styles from "./PostsFeed.module.css";
import { BASE_URL } from "@/config";

function PostsFeed({ connections }) {
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);
  
  // Get token
  const token = authState.user?.token || 
                localStorage.getItem('userToken');
  
  // Fetch posts when component loads
  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);
  
  // Filter posts: only show posts from connections
  const getConnectionUserIds = () => {
    return connections.map(conn => {
      // Get the other user's ID
      if (conn.userId._id === authState.user?._id) {
        return conn.connectionId._id;
      }
      return conn.userId._id;
    });
  };
  
  const connectionIds = getConnectionUserIds();
  
  const filteredPosts = postState.posts.filter(post => 
    connectionIds.includes(post.userId._id) || 
    post.userId._id === authState.user?._id  // Also show own posts
  );
  
  // Handle like
  const handleLike = (postId) => {
    dispatch(incrementLikes({ postId, token }));
  };
  
  // Handle delete
  const handleDelete = (postId) => {
    if (window.confirm("Delete this post?")) {
      dispatch(deletePost({ postId, token }));
    }
  };
  
  return (
    <div className={styles.feedContainer}>
      <h3>Posts from Connections</h3>
      
      {postState.isLoading ? (
        <p>Loading posts...</p>
      ) : filteredPosts.length === 0 ? (
        <p className={styles.emptyState}>
          No posts yet. Your connections haven't posted anything.
        </p>
      ) : (
        <div className={styles.postsGrid}>
          {filteredPosts.map((post) => (
            <div key={post._id} className={styles.postCard}>
              {/* User Info */}
              <div className={styles.postHeader}>
                <img 
                  src={post.userId.profilePicture || `${BASE_URL}/default.jpg`}
                  alt={post.userId.name}
                  className={styles.avatar}
                />
                <div>
                  <div className={styles.userName}>{post.userId.name}</div>
                  <div className={styles.postTime}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                {/* Delete button (only for own posts) */}
                {post.userId._id === authState.user?._id && (
                  <button 
                    onClick={() => handleDelete(post._id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                )}
              </div>
              
              {/* Post Content */}
              <div className={styles.postBody}>
                {post.body}
              </div>
              
              {/* Post Image (if exists) */}
              {post.media && (
                <img 
                  src={`http://localhost:YOUR_PORT/${post.media}`}
                  alt="Post media"
                  className={styles.postImage}
                />
              )}
              
              {/* Actions (Like, Comment) */}
              <div className={styles.postActions}>
                <button 
                  onClick={() => handleLike(post._id)}
                  className={styles.likeButton}
                >
                  ❤️ {post.likes}
                </button>
                <button className={styles.commentButton}>
                  💬 Comment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostsFeed;