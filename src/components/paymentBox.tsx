import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Grid from "@mui/material/Grid";
import { emptyBasket, selectTotalPrice } from "../features/basket/basketSlice";
import PaymentItem from "../atom/paymentItem";
import { weezRequest } from "../api/apiClients";
import {
  emptyHistory,
  history,
  setHistory,
} from "../features/history/historySlice";
import { logOut } from "../features/connexion/connexionSlice";
import { emptyPayment, setPayment } from "../features/payment/paymentSlice";
import { changeCategoriesSelected } from "../features/category/categorySlice";
import { changeSelectedLocation } from "../features/salelocation/salelocationSlice";

export default function PaymentBox() {
  const basket = useAppSelector((state) => state.basket);
  const articles = useAppSelector((state) => state.listArticle);
  const payment = useAppSelector((state) => state.payment);
  const blockedUsers = useAppSelector((state)=>state.blocages)
  const totalPrice = useAppSelector(selectTotalPrice);
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

  function pay(badge_id:string) {
    let items: [[number, number]?] = [];
    basket.forEach((article) => {
      items.push([article!.item.id, article!.quantity]);
    });
    if(blockedUsers.includes(badge_id)){
      dispatch(setPayment({
        success: false,
        messageError: "Ah batard t bloqué",
      }))
      setTimeout(() => {
        dispatch(emptyPayment());
      }, 1500);
    }else {
      weezRequest(
          "POST",
          "POSS3/transaction",
          {badge_id: badge_id, obj_ids: items},
          ["FUND_ID", "AUTH"],
      )
          .then((res) => {
            dispatch(emptyBasket());
            dispatch(
                setPayment({
                  success: true,
                  solde: res!.data.solde,
                }),
            );
            setTimeout(() => {
              dispatch(emptyPayment());
            }, 1500);
          })
          .catch((err) => {
            if (err.response.status === 403) {
              handleLogOut();
            } else {
              dispatch(emptyBasket());
              dispatch(
                  setPayment({
                    success: false,
                    messageError: err.response.data.error.message,
                  }),
              );
              setTimeout(() => {
                dispatch(emptyPayment());
              }, 1500);
            }
          });
    }
  }
  function getLastPurchases(badge_id:string) {
    weezRequest("POST", "POSS3/getBuyerInfo", { badge_id: badge_id }, [
      "FUND_ID",
      "AUTH",
    ])
      .then((res) => {
        let result: history = {};
        result.firstname = res!.data.firstname;
        result.lastname = res!.data.lastname;
        result.solde = res!.data.solde;
        result.badgeId = badge_id;
        result.messageErreur = "";
        let lastPurchases: [
          {
            id: number;
            quantity: number;
            price: number;
            removed: boolean;
            name: string;
          }?,
        ] = [];
        res!.data.last_purchases.forEach(
          (purchase: {
            obj_id: number;
            pur_id: number;
            pur_price: number;
            pur_qte: number;
            pur_removed: boolean;
          }) => {
            if (!purchase.pur_removed && purchase.pur_qte > 0) {
              let article = articles.find((x) => x?.id === purchase.obj_id);
              lastPurchases.push({
                id: purchase.pur_id,
                quantity: purchase.pur_qte,
                price: purchase.pur_price,
                removed: purchase.pur_removed,
                name: article ? article.name : "Pas de nom trouvé",
              });
            }
          },
        );
        result.lastPurchases = lastPurchases;
        dispatch(setHistory(result));
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
  }
  return (
    <Box
      className={
        "bg-background-component border-full border-border-component border-2 w-2/6 box-border rounded-lg overflow-hidden shadow-component p-3"
      }
    >
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
          sm={7}
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
          sm={2}
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
        <AnimatePresence>
          {basket.map(function (article, index) {
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={"w-full"}
                key={article!.item.id}
              >
                <PaymentItem article={article} index={index} />
              </motion.div>
            );
          })}
        </AnimatePresence>
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
          <AnimatePresence>
            {payment.success === undefined ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
              </motion.div>
            ) : payment.success ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                    Payement Réussi
                  </Typography>
                  <Typography
                    variant={"sub-header"}
                    component="h2"
                    className={"text-white"}
                  >
                    Solde Actuel: {(payment.solde! / 100).toFixed(2)}€
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
        <Grid
          item
          sm={12}
          className={"flex items-center justify-center"}
        ></Grid>
        <Grid item sm={12} className={"flex items-center justify-center"}>
          <Button
            className={"w-full"}
            onClick={() => {
              pay("040F275A517180");
            }}
            variant="contained"
            color={"error"}
          >
            Test Payment
          </Button>
        </Grid>
        <Grid item sm={12} className={"flex items-center justify-center"}>
          <Button
            className={"w-full"}
            onClick={() => {
              getLastPurchases("040F275A517180");
            }}
            variant="contained"
            color={"error"}
          >
            Get Last Orders
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
