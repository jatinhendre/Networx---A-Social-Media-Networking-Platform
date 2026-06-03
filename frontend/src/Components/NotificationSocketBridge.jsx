import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket, disconnectSocket } from "@/config/socket";
import {
  addLiveNotification,
  resetNotifications,
  setUnreadNotificationCount,
} from "@/config/redux/reducer/NotificationReducer";
import {
  getNotifications,
  getUnreadNotificationCount,
} from "@/config/redux/action/NotificationAction";

function NotificationSocketBridge() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const token = localStorage.getItem("token");
    const isLoggedIn = authState.loggedIn || authState.isTokenThere || token;

    if (!isLoggedIn || !token) {
      disconnectSocket();
      dispatch(resetNotifications());
      return undefined;
    }

    dispatch(getUnreadNotificationCount());

    const socket = getSocket(token);
    if (!socket) return undefined;

    socket.on("connect", () => {
      dispatch(getUnreadNotificationCount());
      dispatch(getNotifications({ page: 1, limit: 10 }));
    });

    socket.on("notification:new", (notification) => {
      dispatch(addLiveNotification(notification));
    });

    socket.on("notification:unread_count", ({ unreadCount }) => {
      dispatch(setUnreadNotificationCount(unreadCount));
    });

    return () => {
      socket.off("connect");
      socket.off("notification:new");
      socket.off("notification:unread_count");
    };
  }, [authState.loggedIn, authState.isTokenThere, authState.token, dispatch]);

  return null;
}

export default NotificationSocketBridge;

