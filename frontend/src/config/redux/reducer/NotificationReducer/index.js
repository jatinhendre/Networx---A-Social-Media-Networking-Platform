import { createSlice } from "@reduxjs/toolkit";
import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/config/redux/action/NotificationAction";

const initialState = {
  list: [],
  unreadCount: 0,
  liveToasts: [],
  isLoading: false,
  isError: false,
  message: "",
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
};

const getErrorMessage = (payload, fallback) => {
  return (typeof payload === "string" ? payload : payload?.message) || fallback;
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotifications: () => initialState,
    addLiveNotification: (state, action) => {
      const notification = action.payload;
      if (!notification?._id) return;

      const exists = state.list.some((item) => item._id === notification._id);
      if (!exists) {
        state.list.unshift(notification);
        state.pagination.total += 1;
        state.liveToasts.unshift(notification);

        if (!notification.read) {
          state.unreadCount += 1;
        }
      }
    },
    dismissLiveToast: (state, action) => {
      state.liveToasts = state.liveToasts.filter(
        (notification) => notification._id !== action.payload
      );
    },
    clearLiveToasts: (state) => {
      state.liveToasts = [];
    },
    setUnreadNotificationCount: (state, action) => {
      state.unreadCount = Number(action.payload) || 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        const page = action.payload?.pagination?.page || 1;
        const incoming = action.payload?.notifications || [];

        state.isLoading = false;
        state.isError = false;
        state.unreadCount = action.payload?.unreadCount || 0;
        state.pagination = action.payload?.pagination || initialState.pagination;

        if (page === 1) {
          state.list = incoming;
          return;
        }

        const existingIds = new Set(state.list.map((item) => item._id));
        incoming.forEach((notification) => {
          if (!existingIds.has(notification._id)) {
            state.list.push(notification);
          }
        });
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = getErrorMessage(
          action.payload,
          "Fetching notifications failed"
        );
      })
      .addCase(getUnreadNotificationCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload?.unreadCount || 0;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = action.payload?.notification;
        if (!notification?._id) return;

        const index = state.list.findIndex((item) => item._id === notification._id);
        if (index !== -1) {
          const wasUnread = !state.list[index].read;
          state.list[index] = notification;
          if (wasUnread) {
            state.unreadCount = Math.max(state.unreadCount - 1, 0);
          }
        }
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.list = state.list.map((notification) => ({
          ...notification,
          read: true,
        }));
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload?.notificationId;
        const deleted = state.list.find((item) => item._id === notificationId);

        state.list = state.list.filter((item) => item._id !== notificationId);

        if (deleted && !deleted.read) {
          state.unreadCount = Math.max(state.unreadCount - 1, 0);
        }
      });
  },
});

export const {
  addLiveNotification,
  clearLiveToasts,
  dismissLiveToast,
  resetNotifications,
  setUnreadNotificationCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
