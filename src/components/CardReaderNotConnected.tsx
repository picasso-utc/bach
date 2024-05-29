import React from "react";
import {typeConnexion} from "../features/connexion/connexionSlice";
import {
    Box, Button,
    Modal, Typography
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {addReconnectAttempts} from "../features/websocket/websocketSlice";
export default function CardReaderNotConnected() {
    const connexion = useAppSelector((state) => state.connexion);
    const wsState = useAppSelector((state) => state.webSocket);
    const dispatch = useAppDispatch();

    return (
        <Modal
            open={connexion.type === typeConnexion.SUCCESSFULL && (!wsState.connected || !wsState.cardReader)}
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
                     Problème de badgeuse
                </Typography>
                <Box className={"flex align-middle justify-center p-4"}>
                    {!wsState.connected ?
                        <Box className={"flex align-middle justify-center flex-col"}>
                            <Typography
                                id="modal-modal-title"
                                variant="h5"
                                component="h2"
                                className={"text-center"}
                            >
                                Impossible de se connecter au WebSocket pour lire les cartes étudiantes
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    dispatch(addReconnectAttempts());
                                }}
                            >
                                Réessayer de force la reconnection au WebSocket
                            </Button>
                        </Box>
                    : !wsState.cardReader ?
                        <Typography
                            id="modal-modal-title"
                            variant="h5"
                            component="h2"
                            className={"text-center"}
                        >
                            Aucune bageuse n'est connecter ou il est impossible de les récupérer
                        </Typography>
                    :
                        <Typography
                            id="modal-modal-title"
                            variant="h5"
                            component="h2"
                            className={"text-center"}
                        >
                            Une erreur avec le server local qui gère la badgeuse
                        </Typography>
                    }

                </Box>
            </Box>
        </Modal>
    )
}
