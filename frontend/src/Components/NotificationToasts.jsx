import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, X } from "lucide-react";
import { dismissLiveToast } from "@/config/redux/reducer/NotificationReducer";
import { markNotificationAsRead as markNotificationAsReadRequest } from "@/config/redux/action/NotificationAction";
import styles from "./NotificationToasts.module.css";

function NotificationToasts() {
  const dispatch = useDispatch();
  const liveToasts = useSelector((state) => state.notifications.liveToasts);

  useEffect(() => {
    if (liveToasts.length === 0) return undefined;

    const timers = liveToasts.map((notification) =>
      window.setTimeout(() => {
        dispatch(dismissLiveToast(notification._id));
      }, 4500)
    );

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [liveToasts, dispatch]);

  const handleDismiss = (notificationId) => {
    dispatch(dismissLiveToast(notificationId));
  };

  const handleToastClick = async (notification) => {
    if (!notification.read) {
      await dispatch(
        markNotificationAsReadRequest({ notificationId: notification._id })
      );
    }

    dispatch(dismissLiveToast(notification._id));
  };

  return (
    <div className={styles.toastStack}>
      {liveToasts.slice(0, 3).map((notification) => (
        <div key={notification._id} className={styles.toast}>
          <button
            className={styles.toastBody}
            onClick={() => handleToastClick(notification)}
          >
            <span className={styles.iconWrap}>
              <Bell size={16} />
            </span>
            <span className={styles.copy}>
              <strong>{notification.title}</strong>
              <small>{notification.body}</small>
            </span>
          </button>

          <button
            className={styles.closeButton}
            onClick={() => handleDismiss(notification._id)}
            aria-label="Dismiss notification"
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotificationToasts;
