import React, { useState } from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/AuthReducer';
import { getAboutUser } from '@/config/redux/action/AuthAction';
import Image from 'next/image';

function Navbar({ setIsSidebarOpen }) {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggedIn = authState.loggedIn || authState.isTokenThere;
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(reset());
    router.push('/login');
    setIsMoreOpen(false);
  };

  return (
    <div className={styles.container}>
      <nav>
        {/* LEFT */}
        <div className={styles.left}>
          {isLoggedIn && (
            <button
              className={styles.mobileMenu}
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
          )}

          <Image
  src="/images/navbar_logo.png"
  alt="Networx Logo"
  width={140}
  height={40}
  priority
  className={styles.logo}
  onClick={() => router.push('/')}
/>
        </div>

        {/* RIGHT */}
        {isLoggedIn ? (
          <div className={styles.right}>
            {/* Desktop */}
            <p onClick={()=>{
              router.push('/add_testimonial')
            }} className={styles.navbarOptions}>Add a Testimonial</p>
            <p onClick={()=>{
              router.push('/all_testimonials');
            }} className={styles.navbarOptions}>Testimonials</p>
            <p
              className={styles.navbarOptions}
              onClick={async () => {
                const token = localStorage.getItem('token');
                if (token) {
                  await dispatch(getAboutUser({ token }));
                  router.push(`/view_profile/${authState.user?.username}`);
                }
              }}
            >
              Profile
            </p>

            <div className={styles.logOutOption} onClick={handleLogout}>
              <p className={styles.navbarOptions}>LogOut</p>
              <svg
                className={styles.icon}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m16 17 5-5-5-5" />
                <path d="M21 12H9" />
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              </svg>
            </div>

            {/* MOBILE */}
            <div className={styles.moreWrapper}>
              <p
                className={styles.moreText}
                onClick={() => setIsMoreOpen(!isMoreOpen)}
              >
                More ▾
              </p>

              {isMoreOpen && (
                <div className={styles.moreDropdown}>
                  <p  onClick={() => {
    router.push('/add_testimonial');
    setIsMoreOpen(false);
  }}>Add a Testimonial</p>
    <p onClick={()=>{
      router.push('/all_testimonials');
      setIsMoreOpen(false);
    }}>Testimonials</p>
                  <p
                    onClick={async () => {
                      const token = localStorage.getItem('token');
                      if (token) {
                        await dispatch(getAboutUser({ token }));
                        router.push(
                          `/view_profile/${authState.user?.username}`
                        );
                        setIsMoreOpen(false);
                      }
                    }}
                  >
                    Profile
                  </p>

                  <p onClick={handleLogout}>Logout</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            className={styles.heroButton}
            onClick={() => router.push('/login')}
          >
            Be a part!
          </button>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
