import React, {useState} from "react";
import {articleState} from "../features/articles/articleSlice";
import Grid from "@mui/material/Grid";
import {Box, Typography} from "@mui/material";
import {addToBasket, removeFromBasket, removeOneFromBasket,} from "../features/basket/basketSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import {useAppDispatch} from "../app/hooks";
import {useDetectClickOutside} from "react-detect-click-outside";
import {AddCircle, RemoveCircle} from "@mui/icons-material";


interface Props {
    article: { item: articleState; quantity: number } | undefined;
    index: number;
}

const PaymentArticle: React.FC<Props> = ({article, index}) => {
    const dispatch = useAppDispatch();
    const [clicked, setClicked] = useState(false);
    const closeDropdown = () => {
        setClicked(false);
    };

    const ref = useDetectClickOutside({
        onTriggered: closeDropdown,
    });
    return (
        <Grid container>
            <Grid
                item
                sm={2}
                className={"border-b-full border-b-border-inter-categories border-b"}
            >
                <Typography
                    variant="sub-header"
                    component="h2"
                    className={"text-center"}
                >
                    {article!.quantity}
                </Typography>
            </Grid>
            <Grid
                ref={ref}
                item
                sm={6}
                className={"border-b-full border-b-border-inter-categories border-b"}
                onClick={() => {
                    setClicked(true);
                }}
            >
                {!clicked ? ( //On mets un Box et un typography vide pour pas que le componsant ne se rerender si on click dessus ou endehors
                    <Box>
                        <Typography
                            variant="sub-header"
                            component="h2"
                            className={"text-center cursor-pointer"}
                        >
                            {article!.item.name}
                        </Typography>
                    </Box>
                ) : (
                    <Box className={"flex justify-evenly"}>
                        <Typography
                            variant="sub-header"
                            component="h2"
                            className={"text-center cursor-pointer"}
                        ></Typography>
                        <Box className={"w-full flex justify-evenly"}>
                            <AddCircle
                                className={"cursor-pointer"}
                                color={"success"}
                                onClick={() => {
                                    dispatch(addToBasket(article!.item));
                                }}
                            />
                            <RemoveCircle
                                color={"error"}
                                className={"cursor-pointer"}
                                onClick={() => {
                                    dispatch(removeOneFromBasket(article!.item));
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </Grid>

            <Grid
                item
                sm={2}
                className={"border-b-full border-b-border-inter-categories border-b"}
                onClick={() => {
                }}
            >
                <Typography
                    variant="sub-header"
                    component="h2"
                    className={"text-center"}
                >
                    {((article!.item.price * article!.quantity) / 100).toFixed(2)}€
                </Typography>
            </Grid>
            <Grid
                item
                sm={2}
                className={
                    "border-b-full border-b-border-inter-categories border-b cursor-pointer"
                }
                onClick={() => {
                    dispatch(removeFromBasket(index));
                }}
            >
                <DeleteIcon color={"error"}/>
            </Grid>
        </Grid>
    );
};
export default PaymentArticle;
