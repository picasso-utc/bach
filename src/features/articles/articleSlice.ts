import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface articleState {
  id: number;
  name: string;
  categorie_id: number;
  fundation_id: number;
  image_url: string;
  price: number;
}

export interface articleImport {
  id: number;
  name: string;
  categorie_id: number;
  fundation_id: number;
  image_url: string;
  price: number;
  removed_in_event: string | null;
}
const initialState: { [key: number]: [articleState?] } = {};

export const articleSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    changeArticles: (
      state,
      action: PayloadAction<{ [key: number]: [articleState?] }>,
    ) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeArticles } = articleSlice.actions;

export default articleSlice.reducer;
