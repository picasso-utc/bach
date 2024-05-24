import React, {useState} from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Grid from "@mui/material/Grid";
import { Box, Button, Modal, Typography } from "@mui/material";
import {
  emptyHistory,
  history,
  setHistory,
} from "../features/history/historySlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { weezRequest } from "../api/apiClients";
import { logOut } from "../features/connexion/connexionSlice";
import { changeCategoriesSelected } from "../features/category/categorySlice";
import { changeSelectedLocation } from "../features/salelocation/salelocationSlice";
import { emptyBasket } from "../features/basket/basketSlice";
import { emptyPayment } from "../features/payment/paymentSlice";

export default function History() {
  const history = useAppSelector((state) => state.history);
  let [cancelHappening, setCancelHappening] = useState(false)
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

  function removePurchase(pur_id: number) {
    weezRequest("Post", "POSS3/cancel", { pur_id: pur_id }, ["AUTH", "FUND_ID"])
      .then((res) => {
        let removedIndex = history.lastPurchases!.findIndex(
          (x) => x!.id === pur_id,
        );
        let resultPurchases: [
          {
            id: number;
            quantity: number;
            price: number;
            removed: boolean;
            name: string;
          }?,
        ] = [];
        history.lastPurchases!.forEach((article, index) => {
          if (index !== removedIndex) {
            resultPurchases.push(article);
          }
        });
        let newHistory = { ...history };
        newHistory.lastPurchases = resultPurchases;
        newHistory.solde! += history.lastPurchases![removedIndex]!.price;
        dispatch(setHistory(newHistory));
      })
      .catch((err) => {
        if (err.response.status === 403) {
          handleLogOut();
        } else {
          let errorHistory: history = {};
          errorHistory.messageErreur = err.response.data;
          dispatch(setHistory(errorHistory));
        }
      });
    setTimeout(()=>{},)
    setCancelHappening(false);
  }

  return (
    <Modal
      open={history.messageErreur !== undefined}
      aria-labelledby="modal-modal-title"
      onClose={() => {
        dispatch(emptyHistory());
      }}
    >
      <Box
        className={
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-light p-16 rounded-lg flex flex-col align-middle justify-center space-y-6"
        }
      >
        <Typography
          id="modal-modal-title"
          variant="header"
          component="h2"
          className={"text-center border-b-2"}
        >
          Historique de commande
        </Typography>
        <Box className={"flex-grow"}>
          {history.messageErreur === "" ? (
            <Grid container spacing={2} justifyContent="center">
              {history.lastPurchases!.length !== 0 ? (
                <Grid container justifyContent="center">
                  {history.lastPurchases!.map((purchase) => {
                    return (
                        <Grid container spacing={2} justifyContent="center" key={purchase!.id}>
                          <Grid
                            item
                            sm={2}
                            className={
                              "border-b-full border-b-border-inter-categories border-b"
                            }
                          >
                            <Typography
                              variant="sub-header"
                              component="h2"
                              className={"text-center"}
                            >
                              {purchase!.quantity}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sm={7}
                            className={
                              "border-b-full border-b-border-inter-categories border-b"
                            }
                          >
                            <Typography
                              variant="sub-header"
                              component="h2"
                              className={"text-center"}
                            >
                              {purchase!.name}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sm={2}
                            className={
                              "border-b-full border-b-border-inter-categories border-b"
                            }
                          >
                            <Typography
                              variant="sub-header"
                              component="h2"
                              className={"text-center"}
                            >
                              {(purchase!.price / 100).toFixed(2)}€
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sm={1}
                            className={
                              "border-b-full border-b-border-inter-categories border-b cursor-pointer"
                            }
                            onClick={() => {
                                if(!cancelHappening) {
                                    setCancelHappening(true);
                                    removePurchase(purchase!.id);
                                }
                            }}
                          >
                            <DeleteIcon color={"error"} />
                          </Grid>
                        </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Grid item sm={12}>
                  <Typography
                    variant="categories"
                    component="h2"
                    className={"text-center"}
                  >
                    Vous n'avez pas d'article dans l'historique
                  </Typography>
                </Grid>
              )}
              <Grid item sm={12}>
                <Typography
                  variant="categories"
                  component="h2"
                  className={"text-center"}
                >
                  {history.firstname} {history.lastname} votre solde est{" "}
                  {(history.solde! / 100).toFixed(2)}€
                </Typography>
              </Grid>
              <Grid item sm={12}>
                <Button
                  className={"w-full"}
                  onClick={() => {
                    dispatch(emptyHistory());
                  }}
                  variant="contained"
                  color={"error"}
                >
                  Fermer Historique
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Box
              className={
                "flex flex-col align-middle justify-center w-full h-full"
              }
            >
              <Typography
                variant={"h3"}
                component={"h2"}
                className={"text-center"}
              >
                Erreur:
              </Typography>
              <Typography
                variant={"h5"}
                component={"h2"}
                color={"red"}
                className={"text-center"}
              >
                {history.messageErreur}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
