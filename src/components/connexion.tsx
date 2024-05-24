import React, {useCallback, useEffect, useState} from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PinIcon from "@mui/icons-material/Pin";
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
  const wsState = useAppSelector((state) => state.webSocket);
  const dispatch = useAppDispatch();
  const [cas, setCas] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState({ title: "", message: "" });

  const loginCas = useCallback((casFunc:string, pinFunc:string) => {
    dispatch(logInPending());
    apiRequest("POST", "bach/login/cas", { cas: casFunc, pin: pinFunc })
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
  },[dispatch]);

  const loginBadge = useCallback((pinFunc:string) => {
      console.log(connexion.connect.user.badgeId)
    apiRequest("POST", "bach/login/badge", { badge_uid: connexion.connect.user.badgeId, pin: pinFunc })
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
    // eslint-disable-next-line
  },[dispatch]);

  useEffect(() => {
    if(pin.length===4){
      if(connexion.type===typeConnexion.PENDING){
        loginBadge(pin)
      }
      else{
        loginCas(cas,pin)
      }
    }
    // eslint-disable-next-line
  }, [pin]);

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
          </Box>
        ) : connexion.type === typeConnexion.LOGOUT && wsState.cardReader? (
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
        ): connexion.type === typeConnexion.PENDING && wsState.cardReader? (
          <Box className={"flex flex-col align-middle justify-center p-4 gap-4"}>
            <Typography
                id="modal-modal-title"
                variant="h5"
                component="h2"
                className={"text-center mb-4"}
            >
              {"*".repeat(pin.length)}
            </Typography>
            <Box className={"flex align-middle justify-center p-4 gap-4"}>
              <Button
                  variant="contained"
                  onClick={() => setPin((pin)=>pin.concat("1"))}
              >
                1
              </Button>
              <Button
                  variant="contained"
                  onClick={() => setPin((pin)=>pin.concat("2"))}
              >
                2
              </Button>
              <Button
                  variant="contained"
                  onClick={() => setPin((pin)=>pin.concat("3"))}
              >
                3
              </Button>
            </Box>
            <Box className={"flex align-middle justify-center p-4 gap-4"}>
              <Button
                  variant="contained"
                  onClick={() => setPin((pin)=>pin.concat("4"))}
              >
                4
              </Button>
              <Button
                  variant="contained"
                  onClick={() => setPin((pin)=>pin.concat("5"))}
              >
                5
              </Button>
              <Button
                  variant="contained"
                  onClick={() => setPin((pin)=>pin.concat("6"))}
              >
                6
              </Button>
            </Box>
            <Box className={"flex align-middle justify-center p-4 gap-4"}>
              <Button
                  variant="contained"
                  onClick={() => setPin((pin)=>pin.concat("7"))}
              >
                7
              </Button>
              <Button
                  variant="contained"
                  onClick={() => setPin((pin)=>pin.concat("8"))}
              >
                8
              </Button>
              <Button
                  variant="contained"
                  onClick={() => setPin((pin)=>pin.concat("9"))}
              >
                9
              </Button>
            </Box>
            <Box className={"flex align-middle justify-center p-4 gap-4"}>
              <Button
                  variant="contained"
                  onClick={() => setPin((pin)=>pin.concat("0"))}
              >
                0
              </Button>
            </Box>
            <Box className={"flex align-middle justify-center p-4 gap-4"}>
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
            : connexion.type === typeConnexion.PENDING && !wsState.cardReader? (
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
