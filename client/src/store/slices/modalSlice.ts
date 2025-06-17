// store/modalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactNode } from "react";

export interface ModalState {
  id: string;
  component: ReactNode;
  props?: Record<string, any>;
}

interface ModalStackState {
  stack: ModalState[];
}

const initialState: ModalStackState = {
  stack: [],
};

const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalState>) => {
      state.stack.push(action.payload);
    },
    closeModal: (state) => {
      state.stack.pop();
    },
    closeAllModals: (state) => {
      state.stack = [];
    },
  },
});

export const { openModal, closeModal, closeAllModals } = modalSlice.actions;
export default modalSlice.reducer;
