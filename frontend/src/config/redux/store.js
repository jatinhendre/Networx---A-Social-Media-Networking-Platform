import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/AuthReducer";
import postReducer from "./reducer/PostReducer";
export const store = configureStore({
   reducer:{
        auth:authReducer,
        post:postReducer
   }
});