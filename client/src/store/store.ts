import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/slices/userSlice";
import avatarReducer from "@/store/slices/avatarSlice";
import modalReducer from "@/store/slices/modalSlice";
// import instanceReducer from "@/store/slices/instanceSlice";
import dropdownReducer from "@/store/slices/dropdownSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    modals: modalReducer,
    avatar: avatarReducer,
    dropdown: dropdownReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
