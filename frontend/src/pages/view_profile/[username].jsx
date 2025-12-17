import React, { useEffect, useState } from "react";
import UserLayout from "../layouts/UserLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import styles from "./viewProfile.module.css";
import { BASE_URL, clientServer } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  sendConnectionRequest,
  getMyConnections,
} from "@/config/redux/action/AuthAction";

function ViewProfile({ username, profile }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);

  const [isConnected, setIsConnected] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  /* ---------------------------------------------
     1️⃣ FETCH MY CONNECTIONS ON PAGE LOAD / REFRESH
  ----------------------------------------------*/
  useEffect(() => {
    if (!authState.connections.length) {
      dispatch(
        getMyConnections({
          token: localStorage.getItem("token"),
        })
      );
    }
  }, [dispatch]);

  /* ---------------------------------------------
     2️⃣ DETERMINE CONNECTION STATUS
  ----------------------------------------------*/
  useEffect(() => {
    if (!authState.connections || !profile?.userId?._id) return;

    const relation = authState.connections.find(
      (c) => String(c.connectionId?._id) === String(profile.userId._id)
    );

    if (!relation) {
      setIsConnected(false);
      setIsPending(false);
      return;
    }

    if (relation.status_accepted === true) {
      setIsConnected(true);
      setIsPending(false);
    } else if (relation.status_accepted === null) {
      setIsConnected(false);
      setIsPending(true);
    } else {
      setIsConnected(false);
      setIsPending(false);
    }
  }, [authState.connections, profile?.userId?._id]);

  /* ---------------------------------------------
     3️⃣ FILTER POSTS FOR THIS USER
  ----------------------------------------------*/
  useEffect(() => {
    const posts = postState.posts.filter(
      (post) => post.userId.username === router.query.username
    );
    setUserPosts(posts);
  }, [postState.posts, router.query.username]);
  console.log("AUTH CONNECTIONS 👉", authState.connections);
console.log("PROFILE USER ID 👉", profile?.userId?._id);

  /* ---------------------------------------------
     SAFETY CHECK
  ----------------------------------------------*/
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
          {/* ---------------- HEADER ---------------- */}
          <div className={styles.header}>
            <img
              src={`${BASE_URL}/${userId.profilePicture}`}
              alt="Profile"
              className={styles.avatar}
            />

            <div className={styles.headerInfo}>
              <h2>{userId.name}</h2>
              <p className={styles.username}>@{userId.username}</p>
              {bio && <p className={styles.bio}>{bio}</p>}
            </div>

            {/* ---------------- BUTTON ---------------- */}
            <div className={styles.buttonWrapper}>
              {isConnected ? (
                <button className={styles.connectedBtn} disabled>
                  Connected
                </button>
              ) : isPending ? (
                <button className={styles.requestSentBtn} disabled>
                  Request Sent
                </button>
              ) : (
                <button
                  className={styles.connectBtn}
                  onClick={async () => {
                    await dispatch(
                      sendConnectionRequest({
                        token: localStorage.getItem("token"),
                        connectionId: profile.userId._id,
                      })
                    );

                    // 🔥 refresh redux after DB mutation
                    dispatch(
                      getMyConnections({
                        token: localStorage.getItem("token"),
                      })
                    );
                  }}
                >
                  Connect
                </button>
              )}
            </div>
          </div>

          {/* ---------------- CURRENT POST ---------------- */}
          {currentPost && (
            <div className={styles.section}>
              <h3>Currently Working On</h3>
              <p>{currentPost}</p>
            </div>
          )}

          {/* ---------------- EDUCATION ---------------- */}
          <div className={styles.section}>
            <h3>Education</h3>
            {education.length > 0 ? (
              education.map((edu, i) => <p key={i}>• {edu}</p>)
            ) : (
              <p className={styles.empty}>No education added</p>
            )}
          </div>

          {/* ---------------- PAST WORK ---------------- */}
          <div className={styles.section}>
            <h3>Past Work</h3>
            {pastWork.length > 0 ? (
              pastWork.map((work, i) => <p key={i}>• {work}</p>)
            ) : (
              <p className={styles.empty}>No past work added</p>
            )}
          </div>

          {/* ---------------- RECENT ACTIVITY ---------------- */}
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

/* ---------------------------------------------
   SSR: FETCH PROFILE BY USERNAME
----------------------------------------------*/
export async function getServerSideProps(context) {
  const { username } = context.params;

  const request = await clientServer.get(
    `/user/getProfileOnUsername?username=${username}`
  );

  return {
    props: {
      username,
      profile: request.data || null,
    },
  };
}
