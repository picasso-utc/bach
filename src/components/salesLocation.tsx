import React from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import Grid from "@mui/material/Grid";
import {typeConnexion} from "../features/connexion/connexionSlice";
import {Box, Button, Modal, Typography} from "@mui/material";
import {alpha, createTheme, getContrastRatio, ThemeProvider,} from "@mui/material/styles";
import {changeSelectedLocation} from "../features/salelocation/salelocationSlice";

declare module "@mui/material/styles" {
    interface Palette {
        violet: Palette["primary"];
    }

    interface PaletteOptions {
        violet?: PaletteOptions["primary"];
    }
}

declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        violet: true;
    }
}

const violetBase = "#7486de";
const violetMain = alpha(violetBase, 0.7);

const theme = createTheme({
    palette: {
        violet: {
            main: violetMain,
            light: alpha(violetBase, 0.5),
            dark: alpha(violetBase, 0.9),
            contrastText:
                getContrastRatio(violetMain, "#fff") > 4.5 ? "#fff" : "#111",
        },
    },
});

export default function SalesLocation() {
    const connexion = useAppSelector((state) => state.connexion);
    const salesLocations = useAppSelector((state) => state.salesLocations);
    const dispatch = useAppDispatch();

    return (
        <ThemeProvider theme={theme}>
            <Modal
                open={
                    connexion.type === typeConnexion.SUCCESSFULL &&
                    salesLocations.selected === -1
                }
                aria-labelledby="modal-modal-title"
            >
                <Box
                    className={
                        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-light p-16 rounded-lg flex flex-col align-middle justify-center space-y-6"
                    }
                >
                    <Typography
                        id="modal-modal-title"
                        variant="h3"
                        component="h2"
                        className={"text-center"}
                    >
                        - Point de Vente -
                    </Typography>
                    <Box className={"flex-grow"}>
                        <Grid container spacing={2} justifyContent="center">
                            {salesLocations.locations.map(function (saleLocation, index) {
                                return (
                                    <Grid
                                        item
                                        sm={4}
                                        key={index}
                                        className={"flex align-middle justify-center"}
                                    >
                                        <Button
                                            variant="contained"
                                            className={"flex-grow"}
                                            color={"violet"}
                                            onClick={() => {
                                                dispatch(changeSelectedLocation(index));
                                            }}
                                        >
                                            {saleLocation?.name}
                                        </Button>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </Box>
            </Modal>
        </ThemeProvider>
    );
}
