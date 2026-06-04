import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  messages: [],
  isError: false,
  isSuccess: false,
  message: "",
  totalMessages: 0,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // Reset state
    reset: () => initialState,

    // Messages
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    prependMessages: (state, action) => {
      // For pagination - add older messages to the beginning
      state.messages = [...action.payload, ...state.messages];
    },

    updateMessage: (state, action) => {
      const index = state.messages.findIndex(
        (m) => m._id === action.payload._id
      );
      if (index !== -1) {
        state.messages[index] = {
          ...state.messages[index],
          ...action.payload,
        };
      }
    },

    markMessagesAsRead: (state, action) => {
      const readerId = action.payload?.toString() || action.payload;
      state.messages.forEach((msg) => {
        const msgSenderId = msg.senderId?._id?.toString() || msg.senderId?.toString() || msg.senderId;
        if (!msg.isRead && msgSenderId !== readerId) {
          msg.isRead = true;
          msg.readAt = new Date();
        }
      });
    },

    clearMessages: (state) => {
      state.messages = [];
      state.totalMessages = 0;
    },

    setTotalMessages: (state, action) => {
      state.totalMessages = action.payload;
    },

    // Loading states
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setIsError: (state, action) => {
      state.isError = action.payload;
    },

    setIsSuccess: (state, action) => {
      state.isSuccess = action.payload;
    },

    setMessage: (state, action) => {
      state.message = action.payload;
    },

    emptyMessage: (state) => {
      state.message = "";
    },
  },
});

export const {
  reset,
  setMessages,
  addMessage,
  prependMessages,
  updateMessage,
  markMessagesAsRead,
  clearMessages,
  setTotalMessages,
  setIsLoading,
  setIsError,
  setIsSuccess,
  setMessage,
  emptyMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
