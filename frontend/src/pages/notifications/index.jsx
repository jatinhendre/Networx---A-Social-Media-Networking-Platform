import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, CheckCheck, Trash2 } from 'lucide-react';
import UserLayout from '../layouts/UserLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/config/redux/action/NotificationAction';
import styles from './notifications.module.css';

const formatDate = (value) => {
  if (!value) return '';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
};

function NotificationsPage() {
  const dispatch = useDispatch();
  const notificationState = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getNotifications({ page: 1, limit: 10 }));
  }, [dispatch]);

  const loadMore = () => {
    if (!notificationState.pagination.hasMore || notificationState.isLoading) {
      return;
    }

    dispatch(
      getNotifications({
        page: notificationState.pagination.page + 1,
        limit: notificationState.pagination.limit,
      })
    );
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <main className={styles.page}>
          <header className={styles.header}>
            <div>
              <h1>Notifications</h1>
              <p>{notificationState.unreadCount} unread</p>
            </div>

            <button
              className={styles.headerButton}
              onClick={() => dispatch(markAllNotificationsAsRead())}
              disabled={notificationState.unreadCount === 0}
            >
              <CheckCheck size={18} />
              Mark all read
            </button>
          </header>

          {notificationState.isError && (
            <p className={styles.error}>{notificationState.message}</p>
          )}

          <section className={styles.list}>
            {notificationState.list.length === 0 && !notificationState.isLoading ? (
              <div className={styles.emptyState}>
                <h2>No notifications yet</h2>
                <p>Your likes, comments, connections, and messages will appear here.</p>
              </div>
            ) : (
              notificationState.list.map((notification) => (
                <article
                  key={notification._id}
                  className={`${styles.notificationRow} ${
                    notification.read ? '' : styles.unread
                  }`}
                >
                  <div className={styles.content}>
                    <div className={styles.rowTop}>
                      <h2>{notification.title}</h2>
                      <time>{formatDate(notification.createdAt)}</time>
                    </div>
                    <p>{notification.body}</p>
                    {notification.actorUserId?.username && (
                      <span>@{notification.actorUserId.username}</span>
                    )}
                  </div>

                  <div className={styles.actions}>
                    {!notification.read && (
                      <button
                        title="Mark as read"
                        aria-label="Mark as read"
                        onClick={() =>
                          dispatch(
                            markNotificationAsRead({
                              notificationId: notification._id,
                            })
                          )
                        }
                      >
                        <Check size={17} />
                      </button>
                    )}
                    <button
                      title="Delete notification"
                      aria-label="Delete notification"
                      onClick={() =>
                        dispatch(
                          deleteNotification({
                            notificationId: notification._id,
                          })
                        )
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>

          <div className={styles.footer}>
            {notificationState.pagination.hasMore && (
              <button
                className={styles.loadMore}
                onClick={loadMore}
                disabled={notificationState.isLoading}
              >
                {notificationState.isLoading ? 'Loading...' : 'Load more'}
              </button>
            )}
          </div>
        </main>
      </DashboardLayout>
    </UserLayout>
  );
}

export default NotificationsPage;

