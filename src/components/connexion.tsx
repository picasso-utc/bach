import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PinIcon from "@mui/icons-material/Pin";
import ReplayIcon from "@mui/icons-material/Replay";
import {logInFailed, logInPending, logInSuccess, logOut, typeConnexion,} from "../features/connexion/connexionSlice";
import {apiRequest} from "../api/apiClients";
import {Box, Button, CircularProgress, InputAdornment, Modal, TextField, Typography,} from "@mui/material";
import {alpha, createTheme, getContrastRatio, ThemeProvider,} from "@mui/material/styles";

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

export default function Connexion() {
    const connexion = useAppSelector((state) => state.connexion);
    const wsState = useAppSelector((state) => state.webSocket);
    const dispatch = useAppDispatch();
    const [cas, setCas] = useState("");
    const [pin, setPin] = useState("");
    const [error, setError] = useState({title: "", message: ""});


    function loginCas(casFunc: string, pinFunc: string) {
        dispatch(logInPending());
        apiRequest("POST", "bach/login/cas", {cas: casFunc, pin: pinFunc})
            .then(function (res) {
                setCas("");
                setPin("");
                if (res !== undefined) {
                    dispatch(
                        logInSuccess({
                            username: res.data.username,
                            sessionId: res.data.sessionid,
                        }),
                    );
                    localStorage.setItem(
                        "@auth_info",
                        JSON.stringify({
                            username: res.data.username,
                            sessionId: res.data.sessionid,
                        }),
                    );
                } else {
                    setError({
                        title: "Reponse du serveur vide",
                        message:
                            "Le serveur n'as rien renvoyer après votre demande de connexion",
                    });
                    dispatch(logInFailed());
                    localStorage.removeItem("@auth_info");
                }
            })
            .catch(function (error) {
                setCas("");
                setPin("");
                setError(error.response.data);
                dispatch(logInFailed());
                localStorage.removeItem("@auth_info");
            });
    }


    function loginBadge(pinFunc: string) {
        let badge_uid = connexion.connect.user.badgeId
        dispatch(logInPending())
        apiRequest("POST", "bach/login/badge", {badge_uid: badge_uid, pin: pinFunc})
            .then(function (res) {
                setCas("");
                setPin("");
                if (res !== undefined) {
                    dispatch(
                        logInSuccess({
                            username: res.data.username,
                            sessionId: res.data.sessionid,
                        }),
                    );
                    localStorage.setItem(
                        "@auth_info",
                        JSON.stringify({
                            username: res.data.username,
                            sessionId: res.data.sessionid,
                        }),
                    );
                } else {
                    setError({
                        title: "Reponse du serveur vide",
                        message:
                            "Le serveur n'as rien renvoyer après votre demande de connexion",
                    });
                    dispatch(logInFailed());
                    localStorage.removeItem("@auth_info");
                }
            })
            .catch(function (error) {
                setCas("");
                setPin("");
                setError(error.response.data);
                dispatch(logInFailed());
                localStorage.removeItem("@auth_info");
            });
    }

    useEffect(() => {
        if (pin.length === 4) {
            if (connexion.type === typeConnexion.PENDING) {
                loginBadge(pin)
            } else {
                loginCas(cas, pin)
                setCas("");
                setPin("");
            }
        }
        // eslint-disable-next-line
    }, [pin]);

    return (
        <ThemeProvider theme={theme}>
            <Modal
                open={connexion.type !== typeConnexion.SUCCESSFULL}
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
                        - Connexion -
                    </Typography>
                    {connexion.type === typeConnexion.LOGOUT && !wsState.cardReader ? (
                        <Box
                            className={"flex flex-col space-y-6 justify-center align-middle"}
                        >
                            <TextField
                                id="cas"
                                label="CAS"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle/>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                                value={cas}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setCas(event.target.value);
                                }}
                            />
                            <TextField
                                id="pin"
                                label="PIN"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PinIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                                value={pin}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setPin(event.target.value);
                                }}
                            />
                        </Box>
                    ) : connexion.type === typeConnexion.LOGOUT && wsState.cardReader ? (
                        <Box className={"flex align-middle justify-center p-4"}>
                            <Typography
                                id="modal-modal-title"
                                variant="h5"
                                component="h2"
                                className={"text-center"}
                            >
                                Badgez votre carte
                            </Typography>
                        </Box>
                    ) : connexion.type === typeConnexion.PENDING && connexion.connect.user.badgeId !== undefined ? (
                            <Box className={"flex flex-col align-middle justify-center p-4 gap-4"}>
                                <Typography
                                    id="modal-modal-title"
                                    variant="h5"
                                    component="h2"
                                    className={"text-center mb-4"}
                                >
                                    PIN: {"*".repeat(pin.length)}
                                </Typography>
                                <Box className={"flex align-middle justify-center my-2 gap-4"}>
                                    <Button
                                        variant="contained"
                                        color={"violet"}
                                        onClick={() => setPin((pin) => pin.concat("1"))}
                                        size={"small"}
                                        className={"aspect-square"}
                                    >
                                        1
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={"violet"}
                                        onClick={() => setPin((pin) => pin.concat("2"))}
                                        size={"small"}
                                        className={"aspect-square"}
                                    >
                                        2
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={"violet"}
                                        onClick={() => setPin((pin) => pin.concat("3"))}
                                        size={"small"}
                                        className={"aspect-square"}
                                    >
                                        3
                                    </Button>
                                </Box>
                                <Box className={"flex align-middle justify-center my-2 gap-4"}>
                                    <Button
                                        variant="contained"
                                        color={"violet"}
                                        onClick={() => setPin((pin) => pin.concat("4"))}
                                        size={"small"}
                                        className={"aspect-square"}
                                    >
                                        4
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={"violet"}
                                        onClick={() => setPin((pin) => pin.concat("5"))}
                                        size={"small"}
                                        className={"aspect-square"}
                                    >
                                        5
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={"violet"}
                                        onClick={() => setPin((pin) => pin.concat("6"))}
                                        size={"small"}
                                        className={"aspect-square"}
                                    >
                                        6
                                    </Button>
                                </Box>
                                <Box className={"flex align-middle justify-center my-2 gap-4"}>
                                    <Button
                                        variant="contained"
                                        color={"violet"}
                                        onClick={() => setPin((pin) => pin.concat("7"))}
                                        size={"small"}
                                        className={"aspect-square"}
                                    >
                                        7
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={"violet"}
                                        onClick={() => setPin((pin) => pin.concat("8"))}
                                        size={"small"}
                                        className={"aspect-square"}
                                    >
                                        8
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={"violet"}
                                        onClick={() => setPin((pin) => pin.concat("9"))}
                                        size={"small"}
                                        className={"aspect-square"}
                                    >
                                        9
                                    </Button>
                                </Box>
                                <Box className={"flex align-middle justify-center my-2 gap-4"}>
                                    <Button
                                        variant="contained"
                                        color={"violet"}
                                        onClick={() => setPin((pin) => pin.concat("0"))}
                                        size={"small"}
                                        className={"aspect-square"}
                                    >
                                        0
                                    </Button>
                                </Box>
                                <Box className={"flex align-middle justify-center my-2 gap-4"}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => setPin("")}
                                    >
                                        Supprimer Pin
                                    </Button>
                                </Box>
                            </Box>
                        )
                        : connexion.type === typeConnexion.PENDING && connexion.connect.user.badgeId === undefined ? (
                            <Box className={"flex align-middle justify-center p-4"}>
                                <CircularProgress/>
                            </Box>
                        ) : connexion.type === typeConnexion.ERROR ? (
                            <Box className={"flex flex-col space-y-2"}>
                                <Typography
                                    id="modal-modal-title"
                                    variant="h5"
                                    component="h2"
                                    className={"text-center"}
                                >
                                    {error.title}
                                </Typography>
                                <Typography
                                    id="modal-modal-title"
                                    variant="subtitle1"
                                    component="h2"
                                    className={"text-center"}
                                >
                                    {error.message}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => dispatch(logOut())}
                                    endIcon={<ReplayIcon/>}
                                >
                                    Réessayez la connexion
                                </Button>
                            </Box>
                        ) : (
                            <div></div>
                        )}
                </Box>
            </Modal>
        </ThemeProvider>
    );
}
