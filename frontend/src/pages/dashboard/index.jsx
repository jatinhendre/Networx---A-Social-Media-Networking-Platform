import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
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
import styles from "./index.module.css";
import Image from "next/image";
import Lightbox from "../../Components/Lightbox";

function Dashboard() {
  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [openCommentSection, setOpenCommentSection] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [token, setToken] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const handlePost = async () => {
    try {
      if (!postContent || postContent.trim() === "") {
        alert("Please write something!");
        return;
      }

      const formData = new FormData();
      formData.append("body", postContent);
      formData.append("token", token);

      if (fileContent) formData.append("media", fileContent);

      await dispatch(createPost(formData)).unwrap();

      setPostContent("");
      setFileContent(null);
      setPreviewImage(null);

      const fileInput = document.getElementById("fileUploading");
      if (fileInput) fileInput.value = "";

      dispatch(getAllPosts());
    } catch (error) {
      alert("Failed to create post");
    }
  };

  const handleDeletePost = async (postId) => {
    const ok = confirm("Are you sure you want to delete this post?");
    if (!ok) return;

    await dispatch(deletePost({ postId, token }));
    dispatch(getAllPosts());
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <h1>Welcome, {authState.user?.name || "User"}!</h1>
          <br />

          {/* CREATE POST */}
          <div className={styles.createPostContainer}>
            <Image
              src={
                authState.user?.profilePicture &&
                authState.user.profilePicture !== ""
                  ? authState.user.profilePicture
                  : "/default.jpg"
              }
              alt="avatar"
              width={44}
              height={44}
            />

            <div className={styles.createPostRight}>
              <div className={styles.createPostTitle}>
                Create Your Own Post
              </div>

              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Feeling thrilled to announce something?"
                className={styles.textAreaHe}
              />

              {previewImage && (
                <div className={styles.previewWrapper}>
                  <Image
                    src={previewImage}
                    alt="preview"
                    width={500}
                    height={300}
                    className={styles.previewImage}
                  />
                  <button
                    className={styles.removePreview}
                    onClick={() => {
                      setPreviewImage(null);
                      setFileContent(null);
                      const fileInput =
                        document.getElementById("fileUploading");
                      if (fileInput) fileInput.value = "";
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className={styles.createPostActions}>
                <input
                  type="file"
                  hidden
                  id="fileUploading"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setFileContent(file);
                    setPreviewImage(URL.createObjectURL(file));
                  }}
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
            </div>
          </div>

          {/* POSTS */}
          <div className={styles.postsContainer}>
            {(postState.posts || []).map((post) => {
              const currentUserId = authState.user?._id;
              const postOwnerId = post.userId?._id || post.userId;

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
                        post?.userId?.profilePicture &&
                        post?.userId?.profilePicture !== ""
                          ? post?.userId?.profilePicture
                          : "/default.jpg"
                      }
                      alt="avatar"
                      width={44}
                      height={44}
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

                  {/* MEDIA */}
                  {post.media && (
                    <div
                      className={styles.postImageWrapper}
                      onClick={() => setActiveImage(post.media)}
                      style={{ cursor: "pointer" }}
                    >
                      <Image
                        src={post.media}
                        alt="post"
                        fill
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 768px) 100vw, 600px"
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className={styles.optionsContainer}>
                    <button
                      className={
                        isLiked
                          ? styles.likedButton
                          : styles.singleOption_optionContainer
                      }
                      onClick={async () => {
                        await dispatch(
                          toggleLike({
                            postId: post._id,
                            token,
                          })
                        );
                        dispatch(getAllPosts());
                      }}
                    >
                      {isLiked ? "❤️" : "🤍"} {post.likes?.length || 0}
                    </button>

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
                      💬Comment
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

                  {/* COMMENTS BOX */}
                  {openCommentSection === post._id && (
                    <div className={styles.commentSection}>
                      {/* LIST COMMENTS */}
                      {(postState.comments || []).length > 0 ? (
                        postState.comments.map((comment) => (
                          <div
                            key={comment._id}
                            className={styles.singleComment}
                          >
                            <strong>@{comment.userId?.username}</strong>
                            <p>{comment.body}</p>
                          </div>
                        ))
                      ) : (
                        <p>No comments yet</p>
                      )}

                      {/* ADD COMMENT */}
                      <div className={styles.addCommentBox}>
                        <input
                          value={commentContent}
                          onChange={(e) =>
                            setCommentContent(e.target.value)
                          }
                          placeholder="Add a comment..."
                        />
                        <button
                          disabled={!commentContent.trim()}
                          onClick={async () => {
                            await dispatch(
                              postComment({
                                postId: post._id,
                                token,
                                commentBody: commentContent,
                              })
                            );
                            setCommentContent("");
                            dispatch(getComments({ postId: post._id }));
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
          {activeImage && (
            <Lightbox src={activeImage} onClose={() => setActiveImage(null)} />
          )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default Dashboard;
