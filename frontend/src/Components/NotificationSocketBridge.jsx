import { useEffect, useRef } from "react";
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
  setOnlineUsers,
  addUserOnline,
  removeUserOffline,
  setTypingStatus,
} from "@/config/redux/reducer/ConversationReducer";
import {
  getNotifications,
  getUnreadNotificationCount,
} from "@/config/redux/action/NotificationAction";
import { fetchConversations, fetchUnreadCount } from "@/config/redux/action/ConversationAction";

function NotificationSocketBridge() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const { conversations } = useSelector((state) => state.conversations);
  const conversationsRef = useRef(conversations);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

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

    socket.on("online_users", (userIds) => {
      dispatch(setOnlineUsers(userIds));
    });

    socket.on("user_online", ({ userId }) => {
      dispatch(addUserOnline(userId));
    });

    socket.on("user_offline", ({ userId }) => {
      dispatch(removeUserOffline(userId));
    });

    socket.on("typing_status", ({ conversationId, isTyping }) => {
      dispatch(setTypingStatus({ conversationId, isTyping }));
    });

    socket.on("message_received", (payload) => {
      const activePath = window.location.pathname || "";
      const activeConversationId = activePath.startsWith("/messages/")
        ? activePath.split("/")[2]
        : null;

      if (!payload?.conversationId) {
        return;
      }

      const isCurrentlyActive = activeConversationId === payload.conversationId;
      const conversationExists = conversationsRef.current?.some(
        (c) => c._id === payload.conversationId
      );

      if (!conversationExists) {
        dispatch(fetchConversations());
      } else {
        dispatch(
          updateConversation({
            _id: payload.conversationId,
            lastMessage: payload.message,
            lastMessageAt: payload.message?.createdAt,
            ...(isCurrentlyActive ? { unreadCount: 0 } : { incrementUnreadCount: true }),
          })
        );
      }

      if (isCurrentlyActive) {
        dispatch(removeUnreadConversationId(payload.conversationId));
        return;
      }

      dispatch(addUnreadConversationId(payload.conversationId));
    });

    socket.on("messages_read", ({ conversationId, readBy }) => {
      if (conversationId) {
        const currentUserId = authState.user?._id;
        if (readBy === currentUserId) {
          dispatch(removeUnreadConversationId(conversationId));
          dispatch(
            updateConversation({
              _id: conversationId,
              unreadCount: 0,
            })
          );
        }
      }
    });

    return () => {
      socket.off("connect");
      socket.off("notification:new");
      socket.off("notification:unread_count");
      socket.off("message_received");
      socket.off("messages_read");
      socket.off("online_users");
      socket.off("user_online");
      socket.off("user_offline");
      socket.off("typing_status");
    };
  }, [
    authState.loggedIn,
    authState.isTokenThere,
    authState.token,
    authState.user?._id,
    dispatch,
  ]);

  return null;
}

export default NotificationSocketBridge;
