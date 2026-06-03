import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/AuthReducer";
import postReducer from "./reducer/PostReducer";
import notificationReducer from "./reducer/NotificationReducer";
export const store = configureStore({
   reducer:{
        auth:authReducer,
        post:postReducer,
        notifications: notificationReducer
   }
});
