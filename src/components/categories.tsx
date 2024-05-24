import React, { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Category from "../atom/category";

export default function Categories() {
  const categories = useAppSelector((state) => state.category.categories);
  const salesLocation = useAppSelector(
    (state) => state.salesLocations.locations[state.salesLocations.selected],
  );
  useEffect(() => {}, [salesLocation]);
  return (
    <Box
      className={
        "bg-background-component border-full border-border-component border-2 w-1/3 box-border rounded-lg overflow-hidden shadow-component"
      }
    >
      <Grid container justifyContent="center">
        {categories.map(function (category, index) {
          if (
            category !== undefined &&
            salesLocation?.categories.includes(category.id)
          ) {
            return (
              <Grid
                item
                sm={12}
                key={index}
                className={"flex align-middle justify-center"}
              >
                <Category
                  category={category}
                  last={index === categories.length - 1}
                  index={index}
                />
              </Grid>
            );
          } else {
            return null;
          }
        })}
      </Grid>
    </Box>
  );
}
