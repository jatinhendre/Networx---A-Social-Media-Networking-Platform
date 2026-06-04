import React, { useCallback, useEffect } from 'react';
import styles from './dashboard.module.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsTokenThere,
  setIsTokenNotThere,
  reset,
} from '@/config/redux/reducer/AuthReducer';
import { getAllPosts } from '@/config/redux/action/PostAction';
import { getAboutUser, getAllUsers, sendConnectionRequest } from '@/config/redux/action/AuthAction';

function DashboardLayout({ children, isSidebarOpen, setIsSidebarOpen }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const handleConnect = useCallback((connectionId) => {
    const token = localStorage.getItem('token');
    if (token && connectionId) {
      dispatch(sendConnectionRequest({ token, connectionId }));
    }
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
  if (token) {
    dispatch(setIsTokenThere());
  }
}, [dispatch]);
  const checkToken = useCallback(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');

    if (!token) {
      dispatch(reset());
      dispatch(setIsTokenNotThere());
      router.push('/login');
      return;
    }

    dispatch(setIsTokenThere());
  }, [dispatch, router]);


  useEffect(() => {
    checkToken();
  }, [checkToken]);

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());

      const token = localStorage.getItem('token');
      if (token) {
        dispatch(getAboutUser({ token }));
      }

      if (!authState.all_profile_fetched) {
        dispatch(getAllUsers());
      }
    }
  }, [authState.isTokenThere, authState.all_profile_fetched, dispatch]);

  return (
    <div className={styles.homeContainer}>
      <div
        className={`${styles.homeContainer_left} ${
          isSidebarOpen ? styles.sidebarOpen : ''
        }`}
      >
        <button
          className={styles.closeBtn}
          onClick={() => setIsSidebarOpen(false)}
        >
          ✕
        </button>

        <div
          className={styles.sideBarOptions}
          onClick={() => {
            router.push('/dashboard');
            setIsSidebarOpen(false);
          }}
        >
          Scroll
        </div>

        <div
          className={styles.sideBarOptions}
          onClick={() => {
            router.push('/discover');
            setIsSidebarOpen(false);
          }}
        >
          Discover
        </div>

        <div
          className={styles.sideBarOptions}
          onClick={() => {
            router.push('/my_connections');
            setIsSidebarOpen(false);
          }}
        >
          My Connections
        </div>
      </div>

      <div className={styles.feedContainer}>{children}</div>

      <div className={styles.homeContainer_right}>
  <h3>Recent Profiles</h3>

  <div className={styles.recentProfiles}>
    {authState.allUsers
      ?.filter((user) => user.connectionStatus !== "self" && user.userId)
      .map((user) => {
        const profile = user.userId;

        return (
          <div
            key={profile._id}
            className={styles.profileCard}
            onClick={() => router.push(`/view_profile/${profile.username}`)}
          >
            <div className={styles.profileLeft}>
              <img
                src={
                  profile.profilePicture && profile.profilePicture !== ""
                    ? profile.profilePicture
                    : "/default.jpg"
                }
                alt={profile.name}
                className={styles.profileAvatar}
              />

              <div className={styles.profileInfo}>
                <div className={styles.profileName}>{profile.name}</div>
                <div className={styles.profileUsername}>
                  @{profile.username}
                </div>
              </div>
            </div>

            <div className={styles.profileActions}>
              {user.connectionStatus === "none" && (
                <button
                  className={styles.connectBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnect(profile._id);
                  }}
                >
                  Connect
                </button>
              )}
              {user.connectionStatus === "pending_sent" && (
                <button className={styles.pendingBtn} disabled>
                  Sent
                </button>
              )}
              {user.connectionStatus === "pending_received" && (
                <button
                  className={styles.reviewBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/my_connections");
                  }}
                >
                  Review
                </button>
              )}
              {user.connectionStatus === "connected" && (
                <button className={styles.connectedBtn} disabled>
                  Connected
                </button>
              )}
            </div>
          </div>
        );
      })}
  </div>
</div>

    </div>
  );
}

export default DashboardLayout;
