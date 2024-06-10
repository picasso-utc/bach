import React, {useEffect} from "react";
import {useAppSelector} from "../app/hooks";
import {Box} from "@mui/material";
import Grid from "@mui/material/Grid";
import Article from "../atom/article";


export default function Articles() {
    const categorySelectedId = useAppSelector(
        (state) => state.category.categories[state.category.selected]?.id,
    );
    const articles = useAppSelector(
        (state) => state.article[categorySelectedId ? categorySelectedId : -1],
    );
    useEffect(() => {
    }, [categorySelectedId]);
    return (
        <Box className={"flex w-1/2 box-border relative right-1/3"}>
            <Grid container>
                {articles?.map(function (article, index) {
                    if (article !== undefined) {
                        return (
                            <Grid
                                item
                                sm={3}
                                key={index}
                                className={"pl-4 pr-4 pb-4 box-border"}
                            >
                                <Article article={article}/>
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
