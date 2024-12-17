import React from "react";
import {Box, Button, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import Grid from "@mui/material/Grid";
import {emptyBasket, selectTotalPrice} from "../features/basket/basketSlice";
import PaymentItem from "../atom/paymentItem";

export default function PaymentBox() {
    const basket = useAppSelector((state) => state.basket);
    const payment = useAppSelector((state) => state.payment);
    const totalPrice = useAppSelector(selectTotalPrice);
    const dispatch = useAppDispatch();

    return (
        <Box
            className={
                "w-4/12 box-border absolute top-20 right-4 pl-4"
            }
        >
            <Box
                className={"bg-background-component border-full border-border-component border-2 rounded-lg overflow-hidden shadow-component p-3"}>
                <Grid container justifyContent={"space-between"} spacing={2}>
                    <Grid item sm={12}>
                        <Typography variant="header" component="h2" className={"text-center"}>
                            Votre Panier
                        </Typography>
                    </Grid>
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
                            Qte
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        sm={6}
                        className={"border-b-full border-b-border-inter-categories border-b"}
                    >
                        <Typography
                            variant="sub-header"
                            component="h2"
                            className={"text-center"}
                        >
                            Article
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        sm={3}
                        className={"border-b-full border-b-border-inter-categories border-b"}
                    >
                        <Typography
                            variant="sub-header"
                            component="h2"
                            className={"text-center"}
                        >
                            Prix
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        sm={1}
                        className={"border-b-full border-b-border-inter-categories border-b"}
                    ></Grid>
                    {basket.map(function (article, index) {
                        return (
                            <Box
                                className={"w-full"}
                                key={index}
                            >
                                <PaymentItem article={article} index={index}/>
                            </Box>
                        );
                    })}
                    <Grid item sm={12} className={"flex items-center justify-center"}>
                        <Button
                            className={"w-full"}
                            onClick={() => {
                                dispatch(emptyBasket());
                            }}
                            variant="contained"
                            color={"error"}
                            disabled={basket.length === 0}
                        >
                            Annuler Tout
                        </Button>
                    </Grid>
                    <Grid item sm={12}>
                        {payment.success === undefined && payment.pending === undefined ? (
                            <Box
                                className={"w-full"}
                            >
                                <Box
                                    className={
                                        "bg-border-component bg-opacity-35 p-4 rounded-2xl flex flex-col align-middle items-center"
                                    }
                                >
                                    <Typography variant={"categories"}>
                                        Prix Total: {totalPrice.toFixed(2)}€
                                    </Typography>
                                </Box>
                            </Box>
                        ) : payment.pending ? (
                            <Box
                                className={"w-full"}
                            >
                                <Box className={"bg-orange p-4 rounded-2xl"}>
                                    <Typography
                                        variant={"sub-header"}
                                        component="h2"
                                        className={"text-white"}
                                    >
                                        Transaction en cours ...
                                    </Typography>
                                </Box>
                            </Box>
                        ) : payment.success ? (
                            <Box
                                className={"w-full"}
                            >
                                <Box
                                    className={
                                        "bg-green p-4 rounded-2xl flex flex-col align-middle items-center"
                                    }
                                >
                                    <Typography
                                        variant={"categories"}
                                        component="h2"
                                        className={"text-white"}
                                    >
                                        Paiement Réussi
                                    </Typography>
                                    <Typography
                                        variant={"sub-header"}
                                        component="h2"
                                        className={"text-white"}
                                    >
                                        Solde Actuel: {(payment.solde! / 100).toFixed(2)}€
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Box
                                className={"w-full"}
                            >
                                <Box className={"bg-red p-4 rounded-2xl"}>
                                    <Typography
                                        variant={"sub-header"}
                                        component="h2"
                                        className={"text-white"}
                                    >
                                        {payment.messageError}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
