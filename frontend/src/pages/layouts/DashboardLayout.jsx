import React, { useCallback, useEffect } from 'react';
import styles from './dashboard.module.css';
import { useRouter } from 'next/router';
import { setIsTokenThere, reset, setIsTokenNotThere } from '@/config/redux/reducer/AuthReducer';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/PostAction';
import { getAboutUser, getAllUsers } from '@/config/redux/action/AuthAction';

function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const checkToken = useCallback(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');

    if (!token) {
      dispatch(reset());
      dispatch(setIsTokenNotThere());
      router.push('/login');
      return;
    }

    // token hai
    dispatch(setIsTokenThere());
  }, [dispatch, router]);

  // ✅ 1. Mount pe token check + storage listener
  useEffect(() => {
    checkToken();

    window.addEventListener('storage', checkToken);
    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, [checkToken]);

  // ✅ 2. Token mil gaya toh posts + user fetch
  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());

      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (token) {
        dispatch(getAboutUser({ token }));
      }
    }
    if(!authState.all_profile_fetched){
          dispatch(getAllUsers());
        }
  }, [authState.isTokenThere, dispatch]);

  return (
    <div>
      <div className="container">
        <div className={styles.homeContainer}>
          <div className={styles.homeContainer_left}>
            <div
              onClick={() => router.push('/dashboard')}
              className={styles.sideBarOptions}
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
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <p>Scroll</p>
            </div>

            <div
              onClick={() => router.push('/discover')}
              className={styles.sideBarOptions}
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
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <p>Discover</p>
            </div>

            <div
              onClick={() => router.push('/my_connections')}
              className={styles.sideBarOptions}
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>

              <p>My Connections</p>
            </div>
          </div>

          <div className={styles.feedContainer}>{children}</div>

          <div className={styles.homeContainer_right}>
            <h3>Top Profiles</h3>
            <div className="showTopProfiles">
              {authState.allUsers && authState.allUsers.map((user)=>{
                return (<div
                key={user._id}
                  className="topProfileCard"
                >
                  {user.userId.name}
                </div>)
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
