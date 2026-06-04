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
import { findOrCreateConversation } from "@/config/redux/action/ConversationAction";
import Image from "next/image";
import { User, Briefcase, GraduationCap, Award, Activity, MessageSquare, Plus, Mail, MessageCircle, Edit2, Calendar } from "lucide-react";

function ViewProfile({ username, profile }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);

  const [connectionStatus, setConnectionStatus] = useState("none");

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

  const userPosts = React.useMemo(() => {
  return postState.posts.filter(
    (post) => post.userId.username === router.query.username
  );
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

  const handleMessage = async () => {
    try {
      const conversation = await dispatch(
        findOrCreateConversation(profile.userId._id)
      );
      if (conversation) {
        router.push(`/messages/${conversation._id}`);
      }
    } catch (error) {
      console.error("Message error:", error);
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
          <div className={styles.profileHeader}>
            <div className={styles.coverPhoto}></div>
            <div className={styles.headerContent}>
              <div className={styles.avatarWrapper}>
                <Image
                  src={
                    userId?.profilePicture && userId.profilePicture !== ""
                      ? userId.profilePicture
                      : "/default.jpg"
                  }
                  alt="Profile Avatar"
                  className={styles.avatar}
                  width={110}
                  height={110}
                />
              </div>

              <div className={styles.headerMain}>
                <div className={styles.headerInfo}>
                  <h2>
                    {userId.name}{" "}
                    {isMyProfile && <span className={styles.meBadge}>(You)</span>}
                  </h2>
                  <p className={styles.username}>@{userId.username}</p>
                  {currentPost && (
                    <p className={styles.headline}>
                      <Briefcase size={14} style={{ marginRight: "4px" }} /> {currentPost}
                    </p>
                  )}
                </div>

                <div className={styles.buttonWrapper}>
                  {isMyProfile ? (
                    <button
                      className={styles.editBtn}
                      onClick={() => router.push("/edit_profile")}
                    >
                      <Edit2 size={14} style={{ marginRight: "6px" }} /> Edit Profile
                    </button>
                  ) : (
                    <>
                      {connectionStatus === "connected" && (
                        <>
                          <button className={styles.connectedBtn} disabled>
                            Connected
                          </button>
                          <button className={styles.messageBtn} onClick={handleMessage}>
                            <MessageCircle size={14} style={{ marginRight: "6px" }} /> Message
                          </button>
                        </>
                      )}

                      {connectionStatus === "pending_sent" && (
                        <button className={styles.requestSentBtn} disabled>
                          Request Sent
                        </button>
                      )}

                      {connectionStatus === "pending_received" && (
                        <button
                          className={styles.connectBtn}
                          onClick={() => router.push("/my_connections")}
                        >
                          Review Request
                        </button>
                      )}

                      {connectionStatus === "none" && (
                        <button className={styles.connectBtn} onClick={handleConnect}>
                          <Plus size={14} style={{ marginRight: "6px" }} /> Connect
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {bio && (
            <div className={styles.section}>
              <h3>
                <User size={18} /> Bio
              </h3>
              <div className={styles.infoCard}>
                <p>{bio}</p>
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h3>
              <Award size={18} /> Current Work
            </h3>
            <div className={styles.infoCard}>
              <p>{currentPost || "No current work position specified"}</p>
            </div>
          </div>

          <div className={styles.section}>
            <h3>
              <GraduationCap size={18} /> Education
            </h3>
            {education && education.length > 0 ? (
              <div className={styles.timeline}>
                {education.map((edu) => (
                  <div key={edu._id} className={styles.timelineItem}>
                    <div className={styles.timelineDot}>
                      <GraduationCap size={14} />
                    </div>
                    <div className={styles.timelineContent}>
                      <h4 className={styles.timelineTitle}>
                        {edu.degree} in {edu.fieldOfStudy}
                      </h4>
                      <p className={styles.timelineSubtitle}>{edu.school}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.empty}>No education added yet</p>
            )}
          </div>

          <div className={styles.section}>
            <h3>
              <Briefcase size={18} /> Work Experience
            </h3>
            {pastWork && pastWork.length > 0 ? (
              <div className={styles.timeline}>
                {pastWork.map((work) => (
                  <div key={work._id} className={styles.timelineItem}>
                    <div className={styles.timelineDot}>
                      <Briefcase size={14} />
                    </div>
                    <div className={styles.timelineContent}>
                      <h4 className={styles.timelineTitle}>{work.position}</h4>
                      <p className={styles.timelineSubtitle}>{work.company}</p>
                      <span className={styles.timelineDate}>
                        <Calendar size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                        {work.years}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.empty}>No work experience added yet</p>
            )}
          </div>

          <div className={styles.section}>
            <h3>
              <Activity size={18} /> Recent Activity
            </h3>
            {userPosts.length > 0 ? (
              <div className={styles.activityList}>
                {userPosts.map((post) => (
                  <div key={post._id} className={styles.activityCard}>
                    {post.media && (
                      <div className={styles.activityImageWrapper}>
                        <Image
                          src={post.media}
                          alt="post media"
                          className={styles.activityImage}
                          width={70}
                          height={70}
                        />
                      </div>
                    )}
                    <div className={styles.activityContent}>
                      <p className={styles.postText}>{post.body}</p>
                      <span className={styles.postDate}>
                        <Calendar size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.empty}>No recent activity found</p>
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