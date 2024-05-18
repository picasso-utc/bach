import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface history {
  badgeId?: string;
  firstname?: string;
  lastname?: string;
  solde?: number;
  messageErreur?: string;
  lastPurchases?: [
    {
      id: number;
      quantity: number;
      price: number;
      removed: boolean;
      name: string;
    }?,
  ];
}

const initialState: history = {};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setHistory: (state, action: PayloadAction<history>) => {
      return action.payload;
    },
    emptyHistory: (state) => {
      return {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setHistory, emptyHistory } = historySlice.actions;

export default historySlice.reducer;
