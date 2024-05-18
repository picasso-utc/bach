import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { articleState } from "../articles/articleSlice";
import { RootState } from "../../app/store";

const initialState: [{ item: articleState; quantity: number }?] = [];

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action: PayloadAction<articleState>) => {
      const index = state.findIndex(
        (item) => item?.item.id === action.payload.id,
      );
      if (index === -1) {
        state.push({ item: action.payload, quantity: 1 });
      } else {
        state[index]!.quantity += 1;
      }
    },
    removeOneFromBasket: (state, action: PayloadAction<articleState>) => {
      const index = state.findIndex(
        (item) => item?.item.id === action.payload.id,
      );
      if (index !== -1) {
        if (state[index]!.quantity > 1) {
          state[index]!.quantity -= 1;
        } else {
          state.splice(index, 1);
        }
      }
    },
    removeFromBasket: (state, action: PayloadAction<number>) => {
      state.splice(action.payload, 1);
    },
    emptyBasket: (state) => {
      return [];
    },
  },
});

export const selectTotalPrice = (state: RootState) => {
  let total: number = 0;
  for (let i = 0; i < state.basket.length; i++) {
    total += state.basket[i]!.item.price * state.basket[i]!.quantity;
  }
  return total / 100;
};

// Action creators are generated for each case reducer function
export const {
  addToBasket,
  removeFromBasket,
  emptyBasket,
  removeOneFromBasket,
} = basketSlice.actions;

export default basketSlice.reducer;
