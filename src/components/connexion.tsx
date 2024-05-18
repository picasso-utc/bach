import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PinIcon from "@mui/icons-material/Pin";
import LoginIcon from "@mui/icons-material/Login";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  logInFailed,
  logInPending,
  logInSuccess,
  logOut,
  typeConnexion,
} from "../features/connexion/connexionSlice";
import { apiRequest } from "../api/apiClients";
import {
  CircularProgress,
  Button,
  Modal,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";

export default function Connexion() {
  const connexion = useAppSelector((state) => state.connexion);
  const dispatch = useAppDispatch();
  const [cas, setCas] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState({ title: "", message: "" });

  function loginCas() {
    dispatch(logInPending());
    apiRequest("POST", "bach/login/cas", { cas: cas, pin: pin })
      .then(function (res) {
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
        setError(error.response.data);
        dispatch(logInFailed());
        localStorage.removeItem("@auth_info");
      });
  }

  return (
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
        {connexion.type === typeConnexion.LOGOUT ? (
          <Box
            className={"flex flex-col space-y-6 justify-center align-middle"}
          >
            <TextField
              id="cas"
              label="CAS"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
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
                    <PinIcon />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              value={pin}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPin(event.target.value);
              }}
            />
            <Button
              variant="contained"
              onClick={() => loginCas()}
              endIcon={<LoginIcon />}
            >
              Connectez-vous
            </Button>
          </Box>
        ) : connexion.type === typeConnexion.PENDING ? (
          <Box className={"flex align-middle justify-center p-4"}>
            <CircularProgress />
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
              endIcon={<ReplayIcon />}
            >
              Réessayez la connexion
            </Button>
          </Box>
        ) : (
          <div></div>
        )}
      </Box>
    </Modal>
  );
}
