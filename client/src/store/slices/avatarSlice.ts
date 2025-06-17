import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AvatarState {
  image: string | null;
  cropped: string | null;
  uploading: boolean;
}

const initialState: AvatarState = {
  image: null,
  cropped: null,
  uploading: false,
};

export const avatarSlice = createSlice({
  name: "avatar",
  initialState,
  reducers: {
    setImage: (state, action: PayloadAction<string>) => {
      state.image = action.payload;
    },
    setCropped: (state, action: PayloadAction<string>) => {
      state.cropped = action.payload;
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.uploading = action.payload;
    },
    clearAvatar: (state) => {
      state.image = null;
      state.cropped = null;
    },
  },
});

export const { setImage, setCropped, setUploading, clearAvatar } =
  avatarSlice.actions;
export default avatarSlice.reducer;
