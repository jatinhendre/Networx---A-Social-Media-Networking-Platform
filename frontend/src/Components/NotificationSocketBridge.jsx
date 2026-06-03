import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket, disconnectSocket } from "@/config/socket";
import {
  addLiveNotification,
  resetNotifications,
  setUnreadNotificationCount,
} from "@/config/redux/reducer/NotificationReducer";
import {
  addUnreadConversationId,
  clearUnreadConversationIds,
  removeUnreadConversationId,
  updateConversation,
} from "@/config/redux/reducer/ConversationReducer";
import {
  getNotifications,
  getUnreadNotificationCount,
} from "@/config/redux/action/NotificationAction";
import { fetchUnreadCount } from "@/config/redux/action/ConversationAction";

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
      dispatch(clearUnreadConversationIds());
      return undefined;
    }

    dispatch(getUnreadNotificationCount());
    dispatch(fetchUnreadCount());

    const socket = getSocket(token);
    if (!socket) return undefined;

    socket.on("connect", () => {
      dispatch(getUnreadNotificationCount());
      dispatch(fetchUnreadCount());
      dispatch(getNotifications({ page: 1, limit: 10 }));
    });

    socket.on("notification:new", (notification) => {
      dispatch(addLiveNotification(notification));
    });

    socket.on("notification:unread_count", ({ unreadCount }) => {
      dispatch(setUnreadNotificationCount(unreadCount));
    });

    socket.on("message_received", (payload) => {
      const activePath = window.location.pathname || "";
      const activeConversationId = activePath.startsWith("/messages/")
        ? activePath.split("/")[2]
        : null;

      if (!payload?.conversationId) {
        return;
      }

      dispatch(
        updateConversation({
          _id: payload.conversationId,
          lastMessage: payload.message,
          lastMessageAt: payload.message?.createdAt,
        })
      );

      if (activeConversationId === payload.conversationId) {
        dispatch(removeUnreadConversationId(payload.conversationId));
        return;
      }

      dispatch(addUnreadConversationId(payload.conversationId));
    });

    socket.on("messages_read", ({ conversationId }) => {
      if (conversationId) {
        dispatch(removeUnreadConversationId(conversationId));
      }
    });

    return () => {
      socket.off("connect");
      socket.off("notification:new");
      socket.off("notification:unread_count");
      socket.off("message_received");
      socket.off("messages_read");
    };
  }, [authState.loggedIn, authState.isTokenThere, authState.token, dispatch]);

  return null;
}

export default NotificationSocketBridge;

