import {
  setMessages,
  addMessage,
  prependMessages,
  markMessagesAsRead,
  clearMessages,
  setTotalMessages,
  setIsLoading,
  setIsError,
  setIsSuccess,
  setMessage as setMessageState,
} from "../../reducer/MessageReducer";
import { clientServer } from "@/config";

// Fetch messages for a conversation
export const fetchMessages =
  (conversationId, limit = 50, skip = 0) =>
  async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.get(
        `/conversations/${conversationId}/messages`,
        {
          params: { limit, skip, token },
        }
      );

      if (skip === 0) {
        dispatch(setMessages(response.data.messages));
      } else {
        dispatch(prependMessages(response.data.messages));
      }

      dispatch(setTotalMessages(response.data.total));
      dispatch(setIsSuccess(true));
    } catch (error) {
      console.error("Error fetching messages:", error);
      dispatch(setIsError(true));
      dispatch(
        setMessageState(error.response?.data?.message || "Error fetching messages")
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

// Send a message
export const sendMessage = (conversationId, content) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await clientServer.post(
      `/conversations/${conversationId}/messages`,
      { content, token }
    );

    dispatch(addMessage(response.data.data));
    dispatch(setIsSuccess(true));
    return response.data.data;
  } catch (error) {
    console.error("Error sending message:", error);
    dispatch(setIsError(true));
    dispatch(
      setMessageState(error.response?.data?.message || "Error sending message")
    );
  }
};

// Mark conversation as read
export const markConversationAsRead =
  (conversationId) => async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      await clientServer.put(`/conversations/${conversationId}/read`, {
        token,
      });

      dispatch(markMessagesAsRead(null));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

// Clear messages (for when changing conversations)
export const clearMessagesAction = () => (dispatch) => {
  dispatch(clearMessages());
};
