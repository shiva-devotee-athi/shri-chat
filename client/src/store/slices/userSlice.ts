import { clearAuthCookies, storeAuthInCookies } from "@/utils/auth.util";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  role: string | null;
}

const initialState: UserState = {
  token: null,
  role: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      const { token, role } = action.payload;
      state.token = token;
      state.role = role;
      if (token && role) {
        storeAuthInCookies({ token, role });
      }
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      clearAuthCookies();
      window.location.href = "/";
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
