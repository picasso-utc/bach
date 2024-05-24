import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
const initialState: {
  success?: boolean;
  pending?:boolean;
  solde?: number;
  messageError?: string;
} = {};

export const paymentSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setPayment: (
      state,
      action: PayloadAction<{
        success?: boolean;
        pending?: boolean;
        solde?: number;
        messageError?: string;
      }>,
    ) => {
      return action.payload;
    },
    emptyPayment: (state) => {
      return {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPayment, emptyPayment } = paymentSlice.actions;

export default paymentSlice.reducer;
