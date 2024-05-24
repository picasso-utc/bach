import React from "react";
import { Box, Typography } from "@mui/material";
import {
  categoryState,
  changeCategoriesSelected,
} from "../features/category/categorySlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

interface Props {
  category: categoryState;
  last: boolean;
  index: number;
}

const Category: React.FC<Props> = ({ category, last, index }) => {
  const categorySelectedIndex = useAppSelector(
    (state) => state.category.selected,
  );
  const dispatch = useAppDispatch();

  return (
    <Box
      className={
        "flex align-middle justify-center cursor-pointer flex-grow p-2 border-b-full border-b-border-inter-categories" +
        (last ? "" : " border-b") +
        (index === categorySelectedIndex
          ? " bg-border-component"
          : " hover:bg-border-categories")
      }
      onClick={() => {
        dispatch(changeCategoriesSelected(index));
      }}
    >
      <Typography
        variant="categories"
        component="h2"
        className={
          "text-center" + (index === categorySelectedIndex ? " text-white" : "")
        }
      >
        {category.name}
      </Typography>
    </Box>
  );
};
export default Category;
