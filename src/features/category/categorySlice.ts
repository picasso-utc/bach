import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface categoryState {
  id: number;
  name: string;
  fundation_id: number;
}

const initialState: { categories: [categoryState?]; selected: number } = {
  categories: [],
  selected: -1,
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    changeCategories: (state, action: PayloadAction<[categoryState?]>) => {
      state.categories = action.payload;
    },
    changeCategoriesSelected: (state, action: PayloadAction<number>) => {
      state.selected = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeCategories, changeCategoriesSelected } =
  categorySlice.actions;

export default categorySlice.reducer;
