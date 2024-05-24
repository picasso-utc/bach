import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { articleState } from "../features/articles/articleSlice";
import { useAppDispatch } from "../app/hooks";
import { addToBasket } from "../features/basket/basketSlice";

interface Props {
  article: articleState;
}

const Article: React.FC<Props> = ({ article }) => {
  useEffect(() => {}, [article]);
  const dispatch = useAppDispatch();
  if (article.image_url === null) {
    return (
      <Box
        className={
          "aspect-square w-full rounded-2xl bg-white flex items-center justify-center border-border-article border-solid border-3 cursor-pointer p-2 overflow-hidden"
        }
        onClick={() => {
          dispatch(addToBasket(article));
        }}
      >
        <Typography
          variant="subtitle1"
          component="h2"
          className={"text-center"}
        >
          {article.name}
        </Typography>
      </Box>
    );
  } else {
    return (
      <Box
        component="img"
        className={
          "aspect-square w-full rounded-2xl border-border-article border-solid border-3 shadow-article cursor-pointer"
        }
        onClick={() => {
          dispatch(addToBasket(article));
        }}
        alt={article.name}
        src={article.image_url}
      />
    );
  }
};
export default Article;
