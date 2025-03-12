import React from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {logOut, typeConnexion} from "../features/connexion/connexionSlice";
import {Box, Button, Typography} from "@mui/material";
import CancelPresentation from "@mui/icons-material/Logout";
import {changeSelectedLocation} from "../features/salelocation/salelocationSlice";
import {changeCategoriesSelected} from "../features/category/categorySlice";
import {emptyBasket} from "../features/basket/basketSlice";
import {emptyPayment} from "../features/payment/paymentSlice";
import {emptyHistory} from "../features/history/historySlice";

export default function Header() {
    const connexion = useAppSelector((state) => state.connexion);
    const salesLocation = useAppSelector(
        (state) => state.salesLocations.locations[state.salesLocations.selected],
    );
    const dispatch = useAppDispatch();

    function handleLogOut() {
        dispatch(changeCategoriesSelected(-1));
        dispatch(changeSelectedLocation(-1));
        dispatch(emptyBasket());
        dispatch(emptyPayment());
        dispatch(emptyHistory());
        dispatch(logOut());
        localStorage.removeItem("@auth_info");
    }

    return (
        <Box
            className={
                "w-full p-3 bg-background-component border-full border-border-component border-2 flex justify-between shadow-component sticky top-0 z-10"
            }
        >
            <Typography variant="header" component="h2">
                {connexion.type !== typeConnexion.SUCCESSFULL
                    ? `Bach - Pas connecté`
                    : "Bach - " + connexion.connect.user.username}
            </Typography>
            <Typography
                className={"cursor-pointer"}
                variant="header"
                component="h2"
                onClick={() => {
                    dispatch(changeCategoriesSelected(-1));
                    dispatch(changeSelectedLocation(-1));
                    dispatch(emptyBasket());
                }}
            >
                {salesLocation === undefined
                    ? "Selectionez un point de vente"
                    : salesLocation.name}
            </Typography>
            <Box>
                <Button
                    variant="contained"
                    style={{backgroundColor:"#fffb6c", color:'#a33b7e'}}
                    onClick={() => handleLogOut()}
                    disabled={connexion.type !== typeConnexion.SUCCESSFULL}
                    endIcon={<CancelPresentation/>}
                >
                    Déconnexion
                </Button>
            </Box>
        </Box>
    );
}
