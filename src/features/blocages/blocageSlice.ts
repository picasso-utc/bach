import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: [string?] = [];

export const blocageSlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        changeBlocage: (
            state,
            action: PayloadAction<[string?]>,
        ) => {
            return action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { changeBlocage } = blocageSlice.actions;

export default blocageSlice.reducer;
