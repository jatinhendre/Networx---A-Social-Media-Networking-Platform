import React, { useEffect, useState } from "react";
import UserLayout from "../layouts/UserLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import styles from "./viewProfile.module.css";
import { BASE_URL, clientServer } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  sendConnectionRequest,
  getAboutUser,
  getConnectionStatus,
} from "@/config/redux/action/AuthAction";

function ViewProfile({ username, profile }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);

  const [connectionStatus, setConnectionStatus] = useState("none");
  const [userPosts, setUserPosts] = useState([]);

  // Check if this profile belongs to the logged-in user
  const isMyProfile = authState.user?._id === profile?.userId?._id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !authState.user) {
      dispatch(getAboutUser({ token }));
    }
  }, [dispatch, authState.user]);

  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem("token");
      // Only fetch status if it's NOT my profile
      if (token && profile?.userId?._id && !isMyProfile) {
        const result = await dispatch(
          getConnectionStatus({ token, targetUserId: profile.userId._id })
        );
        if (result.payload?.status) {
          setConnectionStatus(result.payload.status);
        }
      }
    };
    fetchStatus();
  }, [dispatch, profile?.userId?._id, isMyProfile]);

  useEffect(() => {
    const posts = postState.posts.filter(
      (post) => post.userId.username === router.query.username
    );
    setUserPosts(posts);
  }, [postState.posts, router.query.username]);

  const handleConnect = async () => {
    try {
      await dispatch(
        sendConnectionRequest({
          token: localStorage.getItem("token"),
          connectionId: profile.userId._id,
        })
      );
      setConnectionStatus("pending_sent");
    } catch (error) {
      console.error("Connect error:", error);
    }
  };

  if (!profile) {
    return (
      <UserLayout>
        <DashboardLayout>
          <h2>User not found</h2>
        </DashboardLayout>
      </UserLayout>
    );
  }

  const { userId, bio, currentPost, education, pastWork } = profile;

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.header}>
            <img
              src={`${BASE_URL}/${userId.profilePicture}`}
              alt="Profile"
              className={styles.avatar}
            />

            <div className={styles.headerInfo}>
              <h2>{userId.name} {isMyProfile && <span className={styles.meBadge}>(You)</span>}</h2>
              <p className={styles.username}>@{userId.username}</p>
              {bio && <p className={styles.bio}>{bio}</p>}
            </div>

            <div className={styles.buttonWrapper}>
              {/* --- NEW EDIT PROFILE LOGIC --- */}
              {isMyProfile ? (
                <button 
                  className={styles.editBtn} 
                  onClick={() => router.push("/manager/edit_profile")}
                >
                  Edit Profile
                </button>
              ) : (
                /* --- EXISTING CONNECTION LOGIC --- */
                <>
                  {connectionStatus === "connected" && (
                    <button className={styles.connectedBtn} disabled>Connected</button>
                  )}

                  {connectionStatus === "pending_sent" && (
                    <button className={styles.requestSentBtn} disabled>Request Sent</button>
                  )}

                  {connectionStatus === "pending_received" && (
                    <button
                      className={styles.connectBtn}
                      onClick={() => router.push("/manager/connection_request")}
                    >
                      Review Request
                    </button>
                  )}

                  {connectionStatus === "none" && (
                    <button className={styles.connectBtn} onClick={handleConnect}>
                      Connect
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h3>Currently Working On</h3>
            <p>{currentPost || "Not specified"}</p>
          </div>

          <div className={styles.section}>
            <h3>Education</h3>
            {education.length > 0 ? (
              education.map((edu, i) => <p key={i}>• {edu}</p>)
            ) : (
              <p className={styles.empty}>No education added</p>
            )}
          </div>

          <div className={styles.section}>
            <h3>Recent Activity</h3>
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div key={post._id} className={styles.activityCard}>
                  {post.media && (
                    <img
                      src={`${BASE_URL}/${post.media}`}
                      alt="post media"
                      className={styles.activityImage}
                    />
                  )}
                  <div className={styles.activityContent}>
                    <p className={styles.postText}>{post.body}</p>
                    <span className={styles.postDate}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.empty}>No recent activity</p>
            )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default ViewProfile;

export async function getServerSideProps(context) {
  const { username } = context.params;
  try {
    const request = await clientServer.get(
      `/user/getProfileOnUsername?username=${username}`
    );
    return { props: { username, profile: request.data || null } };
  } catch (error) {
    return { props: { username, profile: null } };
  }
}