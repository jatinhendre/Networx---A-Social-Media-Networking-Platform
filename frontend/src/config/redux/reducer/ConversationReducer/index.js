import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  conversations: [],
  currentConversation: null,
  isError: false,
  isSuccess: false,
  message: "",
  unreadCount: 0,
  unreadConversationIds: [],
  onlineUsers: [],
  typingConversations: {},
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
        const currentUnread = state.conversations[index].unreadCount || 0;
        const newUnreadCount = action.payload.incrementUnreadCount
          ? currentUnread + 1
          : action.payload.unreadCount !== undefined
          ? action.payload.unreadCount
          : currentUnread;

        const updatedConversation = {
          ...state.conversations[index],
          ...action.payload,
          unreadCount: newUnreadCount,
        };

        delete updatedConversation.incrementUnreadCount;

        state.conversations.splice(index, 1);
        state.conversations.unshift(updatedConversation);
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

    setUnreadConversationIds: (state, action) => {
      state.unreadConversationIds = Array.from(new Set(action.payload || []));
      state.unreadCount = state.unreadConversationIds.length;
    },

    addUnreadConversationId: (state, action) => {
      const conversationId = action.payload;
      if (!conversationId) {
        return;
      }

      if (!state.unreadConversationIds.includes(conversationId)) {
        state.unreadConversationIds.push(conversationId);
        state.unreadCount = state.unreadConversationIds.length;
      }
    },

    removeUnreadConversationId: (state, action) => {
      const conversationId = action.payload;
      if (!conversationId) {
        return;
      }

      state.unreadConversationIds = state.unreadConversationIds.filter(
        (id) => id !== conversationId
      );
      state.unreadCount = state.unreadConversationIds.length;
    },

    clearUnreadConversationIds: (state) => {
      state.unreadConversationIds = [];
      state.unreadCount = 0;
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

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    addUserOnline: (state, action) => {
      const userId = action.payload;
      if (userId && !state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
    },

    removeUserOffline: (state, action) => {
      const userId = action.payload;
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== userId
      );
    },

    setTypingStatus: (state, action) => {
      const { conversationId, isTyping } = action.payload;
      if (conversationId) {
        state.typingConversations[conversationId] = isTyping;
      }
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
  setUnreadConversationIds,
  addUnreadConversationId,
  removeUnreadConversationId,
  clearUnreadConversationIds,
  setIsLoading,
  setIsError,
  setIsSuccess,
  setMessage,
  emptyMessage,
  setOnlineUsers,
  addUserOnline,
  removeUserOffline,
  setTypingStatus,
} = conversationSlice.actions;

export default conversationSlice.reducer;
