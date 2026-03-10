import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import conversationReducer from "./slices/conversationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationReducer,
  },
});

export default store;
