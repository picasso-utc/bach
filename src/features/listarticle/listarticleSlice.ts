import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { articleState } from "../articles/articleSlice";

// Define a type for the slice state

const initialState: [articleState?] = [];

export const listArticleSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<[articleState?]>) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setArticles } = listArticleSlice.actions;

export default listArticleSlice.reducer;
