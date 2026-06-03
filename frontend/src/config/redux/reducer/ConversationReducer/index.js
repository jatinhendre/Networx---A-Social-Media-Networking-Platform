import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  conversations: [],
  currentConversation: null,
  isError: false,
  isSuccess: false,
  message: "",
  unreadCount: 0,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    // Reset state
    reset: () => initialState,

    // Conversations
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },

    addConversation: (state, action) => {
      const exists = state.conversations.find(
        (c) => c._id === action.payload._id
      );
      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    },

    updateConversation: (state, action) => {
      const index = state.conversations.findIndex(
        (c) => c._id === action.payload._id
      );
      if (index !== -1) {
        state.conversations[index] = {
          ...state.conversations[index],
          ...action.payload,
        };
      }
    },

    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },

    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },

    // Unread count
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },

    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },

    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
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
  setConversations,
  addConversation,
  updateConversation,
  setCurrentConversation,
  clearCurrentConversation,
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  setIsLoading,
  setIsError,
  setIsSuccess,
  setMessage,
  emptyMessage,
} = conversationSlice.actions;

export default conversationSlice.reducer;
