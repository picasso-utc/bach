import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface saleLocationState {
  id: number;
  name: string;
  categories: [number];
}

const initialState: { locations: [saleLocationState?]; selected: number } = {
  locations: [],
  selected: -1,
};

export const saleLocationSlice = createSlice({
  name: "salesLocations",
  initialState,
  reducers: {
    changeSalesLocations: (
      state,
      action: PayloadAction<[saleLocationState?]>,
    ) => {
      state.locations = action.payload;
    },
    changeSelectedLocation: (state, action: PayloadAction<number>) => {
      state.selected = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeSalesLocations, changeSelectedLocation } =
  saleLocationSlice.actions;

export default saleLocationSlice.reducer;
