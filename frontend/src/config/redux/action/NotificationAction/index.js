import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const getErrorPayload = (err, fallback) => {
  const data = err.response?.data;

  if (data?.message) return data;
  if (typeof data === "string" && !data.trim().startsWith("<!DOCTYPE")) {
    return data;
  }

  return fallback;
};

export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async ({ page = 1, limit = 10 } = {}, thunkAPI) => {
    try {
      const token = getToken();
      const response = await clientServer.get("/notifications", {
        params: { token, page, limit },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorPayload(
        err,
        "Fetching notifications failed"
      ));
    }
  }
);

export const getUnreadNotificationCount = createAsyncThunk(
  "notifications/getUnreadCount",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const response = await clientServer.get("/notifications/unread-count", {
        params: { token },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorPayload(
        err,
        "Fetching unread notifications failed"
      ));
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async ({ notificationId }, thunkAPI) => {
    try {
      const token = getToken();
      const response = await clientServer.post(
        `/notifications/${notificationId}/read`,
        { token }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorPayload(
        err,
        "Marking notification as read failed"
      ));
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      const token = getToken();
      const response = await clientServer.post("/notifications/read-all", {
        token,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorPayload(
        err,
        "Marking notifications as read failed"
      ));
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async ({ notificationId }, thunkAPI) => {
    try {
      const token = getToken();
      const response = await clientServer.delete(
        `/notifications/${notificationId}`,
        { data: { token } }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorPayload(
        err,
        "Deleting notification failed"
      ));
    }
  }
);
