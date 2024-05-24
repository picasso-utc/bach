import React, { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Article from "../atom/article";

export default function Articles() {
  const categorySelectedId = useAppSelector(
    (state) => state.category.categories[state.category.selected]?.id,
  );
  const articles = useAppSelector(
    (state) => state.article[categorySelectedId ? categorySelectedId : -1],
  );
  useEffect(() => {}, [categorySelectedId]);
  return (
    <Box className={"flex w-1/2 box-border"}>
      <Grid container>
        {articles?.map(function (article, index) {
          if (article !== undefined) {
            return (
              <Grid
                item
                sm={4}
                key={index}
                className={"pl-6 pr-6 pb-6 box-border"}
              >
                <Article article={article} />
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
