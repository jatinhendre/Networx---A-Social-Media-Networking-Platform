import React, { useState } from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/AuthReducer';
import {
  acceptConnectionRequest,
  getAboutUser,
  getConnectionRequests,
  getMyConnections,
} from '@/config/redux/action/AuthAction';
import Image from 'next/image';
import { Bell, CheckCheck, LogOut, Menu, MessageCircle } from 'lucide-react';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/config/redux/action/NotificationAction';
import { resetNotifications } from '@/config/redux/reducer/NotificationReducer';

function Navbar({ setIsSidebarOpen }) {
  const authState = useSelector((state) => state.auth);
  const notificationState = useSelector((state) => state.notifications);
  const conversationState = useSelector((state) => state.conversations);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggedIn = authState.loggedIn || authState.isTokenThere;
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const latestNotifications = notificationState.list.slice(0, 5);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(reset());
    dispatch(resetNotifications());
    router.push('/login');
    setIsMoreOpen(false);
    setIsNotificationOpen(false);
  };

  const openProfile = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await dispatch(getAboutUser({ token }));
      router.push(`/view_profile/${authState.user?.username}`);
    }
  };

  const openNotifications = () => {
    setIsNotificationOpen((current) => !current);
    setIsMoreOpen(false);

    if (!isNotificationOpen) {
      dispatch(getNotifications({ page: 1, limit: 10 }));
    }
  };

  const getNotificationPath = (notification) => {
    if (notification?.type === 'connection_request') {
      return '/my_connections';
    }

    if (
      notification?.type === 'like' ||
      notification?.type === 'comment' ||
      notification?.metadata?.postId
    ) {
      return '/dashboard';
    }

    return '/notifications';
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await dispatch(markNotificationAsRead({ notificationId: notification._id }));
    }

    setIsNotificationOpen(false);
    router.push(getNotificationPath(notification));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleConnectionRequestAction = async (event, notification, actionType) => {
    event.stopPropagation();

    const token = localStorage.getItem('token');
    const requestId = notification?.metadata?.connectionId || notification?.entityId;

    if (!token || !requestId) {
      return;
    }

    await dispatch(
      acceptConnectionRequest({
        token,
        requestId,
        action_type: actionType,
      })
    );

    await dispatch(markNotificationAsRead({ notificationId: notification._id }));
    await Promise.all([
      dispatch(getNotifications({ page: 1, limit: 10 })),
      dispatch(getConnectionRequests({ token })),
      dispatch(getMyConnections({ token })),
    ]);
  };

  return (
    <div className={styles.container}>
      <nav>
        <div className={styles.left}>
          {isLoggedIn && (
            <button
              className={styles.mobileMenu}
              onClick={() => setIsSidebarOpen(true)}
              title="Open menu"
              aria-label="Open menu"
            >
              <Menu size={22} />
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

        {isLoggedIn ? (
          <div className={styles.right}>
            <p
              onClick={() => router.push('/add_testimonial')}
              className={styles.navbarOptions}
            >
              Add a Testimonial
            </p>
            <p
              onClick={() => router.push('/all_testimonials')}
              className={styles.navbarOptions}
            >
              Testimonials
            </p>
            <p className={styles.navbarOptions} onClick={openProfile}>
              Profile
            </p>

            <div className={styles.notificationWrapper}>
              <button
                className={styles.iconButton}
                onClick={openNotifications}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {notificationState.unreadCount > 0 && (
                  <span className={styles.badge}>
                    {notificationState.unreadCount > 99
                      ? '99+'
                      : notificationState.unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className={styles.notificationDropdown}>
                  <div className={styles.notificationHeader}>
                    <span>Notifications</span>
                    <button
                      className={styles.markAllButton}
                      onClick={handleMarkAllRead}
                      title="Mark all as read"
                      aria-label="Mark all notifications as read"
                      disabled={notificationState.unreadCount === 0}
                    >
                      <CheckCheck size={16} />
                    </button>
                  </div>

                  <div className={styles.notificationList}>
                    {notificationState.isLoading && latestNotifications.length === 0 ? (
                      <p className={styles.notificationStatus}>Loading...</p>
                    ) : latestNotifications.length === 0 ? (
                      <p className={styles.notificationStatus}>No notifications yet.</p>
                    ) : (
                      latestNotifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`${styles.notificationItem} ${
                            notification.read ? '' : styles.unreadNotification
                          }`}
                        >
                          <button
                            className={styles.notificationContentButton}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <span>{notification.title}</span>
                            <small>{notification.body}</small>
                          </button>

                          {notification.type === 'connection_request' && !notification.read && (
                            <div className={styles.notificationActionRow}>
                              <button
                                className={styles.notificationAcceptButton}
                                onClick={(event) =>
                                  handleConnectionRequestAction(
                                    event,
                                    notification,
                                    'accept'
                                  )
                                }
                              >
                                Accept
                              </button>
                              <button
                                className={styles.notificationRejectButton}
                                onClick={(event) =>
                                  handleConnectionRequestAction(
                                    event,
                                    notification,
                                    'reject'
                                  )
                                }
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    className={styles.viewAllButton}
                    onClick={() => {
                      setIsNotificationOpen(false);
                      router.push('/notifications');
                    }}
                  >
                    View all
                  </button>
                </div>
              )}
            </div>

            <button
              className={styles.iconButton}
              onClick={() => router.push('/messages')}
              title="Messages"
              aria-label="Messages"
            >
              <MessageCircle size={20} />
                {conversationState.unreadCount > 0 && (
                  <span className={styles.badge}>
                    {conversationState.unreadCount > 99
                      ? '99+'
                      : conversationState.unreadCount}
                  </span>
                )}
            </button>

            <div className={styles.logOutOption} onClick={handleLogout}>
              <p className={styles.navbarOptions}>LogOut</p>
              <LogOut className={styles.icon} size={20} />
            </div>

            <div className={styles.moreWrapper}>
              <button
                className={styles.moreText}
                onClick={() => {
                  setIsMoreOpen(!isMoreOpen);
                  setIsNotificationOpen(false);
                }}
              >
                More
              </button>

              {isMoreOpen && (
                <div className={styles.moreDropdown}>
                  <p
                    onClick={() => {
                      router.push('/add_testimonial');
                      setIsMoreOpen(false);
                    }}
                  >
                    Add a Testimonial
                  </p>
                  <p
                    onClick={() => {
                      router.push('/all_testimonials');
                      setIsMoreOpen(false);
                    }}
                  >
                    Testimonials
                  </p>
                  <p
                    onClick={() => {
                      router.push('/notifications');
                      setIsMoreOpen(false);
                    }}
                  >
                    Notifications
                    {notificationState.unreadCount > 0
                      ? ` (${notificationState.unreadCount})`
                      : ''}
                  </p>
                  <p
                    onClick={() => {
                      router.push('/messages');
                      setIsMoreOpen(false);
                    }}
                  >
                    Messages
                    {conversationState.unreadCount > 0
                      ? ` (${conversationState.unreadCount})`
                      : ''}
                  </p>
                  <p
                    onClick={async () => {
                      await openProfile();
                      setIsMoreOpen(false);
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
