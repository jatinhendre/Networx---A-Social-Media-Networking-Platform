import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/AuthReducer";
import postReducer from "./reducer/PostReducer";
import notificationReducer from "./reducer/NotificationReducer";
import conversationReducer from "./reducer/ConversationReducer";
import messageReducer from "./reducer/MessageReducer";

export const store = configureStore({
   reducer:{
        auth: authReducer,
        post: postReducer,
        notifications: notificationReducer,
        conversations: conversationReducer,
        messages: messageReducer,
   }
});
