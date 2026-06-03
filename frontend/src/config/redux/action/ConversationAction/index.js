import axios from "axios";
import {
  setConversations,
  addConversation,
  setCurrentConversation,
  setUnreadCount,
  setUnreadConversationIds,
  setIsLoading,
  setIsError,
  setIsSuccess,
  setMessage,
} from "../../reducer/ConversationReducer";
import { clientServer } from "@/config";

// Fetch all conversations for the current user
export const fetchConversations = () => async (dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const token = localStorage.getItem("token");
    const response = await clientServer.get("/conversations", {
      params: { token },
    });

    dispatch(setConversations(response.data.conversations));
    dispatch(setIsSuccess(true));
  } catch (error) {
    console.error("Error fetching conversations:", error);
    dispatch(setIsError(true));
    dispatch(
      setMessage(error.response?.data?.message || "Error fetching conversations")
    );
  } finally {
    dispatch(setIsLoading(false));
  }
};

// Find or create conversation with another user
export const findOrCreateConversation = (otherUserId) => async (dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await clientServer.post(
      "/conversations",
      { otherUserId, token }
    );

    const conversation = response.data.conversation;
    dispatch(addConversation(conversation));
    dispatch(setCurrentConversation(conversation));
    dispatch(setIsSuccess(true));
    return conversation;
  } catch (error) {
    console.error("Error finding/creating conversation:", error);
    dispatch(setIsError(true));
    dispatch(
      setMessage(
        error.response?.data?.message || error.message || "Error finding conversation"
      )
    );
    throw error;
  } finally {
    dispatch(setIsLoading(false));
  }
};

// Fetch unread message count
export const fetchUnreadCount = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await clientServer.get("/conversations/unread/count", {
      params: { token },
    });

    dispatch(setUnreadCount(response.data.unreadCount));
    dispatch(setUnreadConversationIds(response.data.unreadConversationIds || []));
  } catch (error) {
    console.error("Error fetching unread count:", error);
  }
};
