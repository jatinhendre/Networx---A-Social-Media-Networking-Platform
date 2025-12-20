import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  incrementLikes, 
  deletePost, 
  getAllPosts,
  getComments,
  postComment 
} from "@/config/redux/action/PostAction";
import { BASE_URL } from "@/config";
import styles from "./PostCard.module.css";

function PostCard({ post, showDelete = false }) {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);
  
  const [openCommentSection, setOpenCommentSection] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  
  const token = authState.user?.token || 
                authState.token ||
                localStorage.getItem('userToken') ||
                localStorage.getItem('token');
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };
  
  // Handle like
  const handleLike = async () => {
    if (!token) {
      alert("Please log in to like posts");
      return;
    }
    await dispatch(incrementLikes({ postId: post._id, token }));
    dispatch(getAllPosts());
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!token) {
      alert("Please log in to delete posts");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await dispatch(deletePost({ postId: post._id, token })).unwrap();
        dispatch(getAllPosts());
      } catch (err) {
        console.log("Error deleting post:", err);
        alert(err?.message || "Failed to delete post");
      }
    }
  };
  
  // Handle comment section toggle
  const handleCommentToggle = () => {
    if (openCommentSection) {
      setOpenCommentSection(false);
    } else {
      setOpenCommentSection(true);
      dispatch(getComments({ postId: post._id }));
    }
  };
  
  // Handle post comment
  const handlePostComment = () => {
    if (!token) {
      alert("Please log in to comment");
      return;
    }
    if (commentContent.trim() !== "") {
      dispatch(postComment({
        postId: post._id,
        token: token,
        commentBody: commentContent
      }));
      setCommentContent("");
    }
  };
  
  // Handle share to Twitter
  const handleShare = () => {
    const text = encodeURIComponent(post.body || "");
    const url = encodeURIComponent("https://www.youtube.com");
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(twitterUrl, "_blank");
  };
  
  // Check if current user owns the post
  const currentUserId = authState.user?._id;
  const postOwnerId = post.userId?._id ? post.userId._id : post.userId;
  const isOwner = currentUserId && postOwnerId && 
                  currentUserId.toString() === postOwnerId.toString();
  
  return (
    <div className={styles.postCard}>
      {/* Post Header */}
      <div className={styles.postHeader}>
        <img 
          src={`${BASE_URL}/${post.userId?.profilePicture || ""}`}
          alt={post.userId?.name}
          className={styles.avatar}
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />
        <div className={styles.userInfo}>
          <div className={styles.userName}>
            {post.userId?.name || "Unknown User"}
          </div>
          <div className={styles.userUsername}>
            @{post.userId?.username}
          </div>
          <div className={styles.postTime}>
            {formatDate(post.createdAt)}
          </div>
        </div>
        
        {/* Delete button - only show for own posts if showDelete is true */}
        {(showDelete && isOwner) && (
          <button 
            onClick={handleDelete}
            className={styles.deleteButton}
            title="Delete post"
          >
            Delete
          </button>
        )}
      </div>
      
      {/* Post Content */}
      <div className={styles.postBody}>
        {post.body}
      </div>
      
      {/* Post Media */}
      {post.media && (
        <div className={styles.mediaContainer}>
          {post.filetype?.startsWith('image/') ? (
            <img 
              src={`${BASE_URL}/${post.media}`}
              alt="Post media"
              className={styles.postImage}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : post.filetype?.startsWith('video/') ? (
            <video 
              src={`${BASE_URL}/${post.media}`}
              controls
              className={styles.postVideo}
            />
          ) : null}
        </div>
      )}
      
      {/* Post Actions */}
      <div className={styles.postActions}>
        {/* Like Button */}
        <button 
          onClick={handleLike}
          className={styles.actionButton}
          title="Like post"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.icon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
            />
          </svg>
          <span>{post.likes || 0}</span>
        </button>
        
        {/* Comment Button */}
        <button 
          onClick={handleCommentToggle}
          className={styles.actionButton}
          title="Comment on post"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.icon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
        </button>
        
        {/* Share Button */}
        <button 
          onClick={handleShare}
          className={styles.actionButton}
          title="Share post"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.icon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
            />
          </svg>
        </button>
      </div>
      
      {/* Comment Section */}
      {openCommentSection && (
        <div className={styles.commentSection}>
          {/* Existing comments */}
          {postState.comments && postState.comments.length > 0 ? (
            postState.comments.map((comment) => (
              <div key={comment._id} className={styles.singleComment}>
                <img
                  src={`${BASE_URL}/${comment.userId?.profilePicture}`}
                  alt="user"
                  className={styles.commentAvatar}
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <div className={styles.commentContent}>
                  <p className={styles.commentUser}>
                    {comment.userId?.username}
                  </p>
                  <p className={styles.commentText}>{comment.body}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noComment}>Be the first to comment</p>
          )}

          {/* Add comment */}
          <div className={styles.addComment}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className={styles.commentInput}
            />
            <button 
              onClick={handlePostComment}
              className={styles.postCommentButton}
              disabled={commentContent.trim() === ""}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;