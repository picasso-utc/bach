import React, {useCallback, useEffect} from "react";
import "./App.css";
import Header from "./components/header";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import Connexion from "./components/connexion";
import {Box} from "@mui/material";
import Categories from "./components/categories";
import {apiRequest, weezRequest} from "./api/apiClients";
import {
  changeSalesLocations,
  changeSelectedLocation,
  saleLocationState,
} from "./features/salelocation/salelocationSlice";
import SalesLocation from "./components/salesLocation";
import {categoryState, changeCategories, changeCategoriesSelected,} from "./features/category/categorySlice";
import {logInPending, logInSuccess, logOut, typeConnexion,} from "./features/connexion/connexionSlice";
import {articleImport, articleState, changeArticles,} from "./features/articles/articleSlice";
import Articles from "./components/articles";
import PaymentBox from "./components/paymentBox";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import History from "./components/history";
import {setArticles} from "./features/listarticle/listarticleSlice";
import {emptyBasket} from "./features/basket/basketSlice";
import {emptyPayment} from "./features/payment/paymentSlice";
import {emptyHistory} from "./features/history/historySlice";
import {changeBlocage} from "./features/blocages/blocageSlice";
import useWebSocket, {ReadyState} from 'react-use-websocket';
import {changeConnectedState} from "./features/websocket/websocketSlice";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    categories: React.CSSProperties;
    header: React.CSSProperties;
    "sub-header": React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    categories?: React.CSSProperties;
    header?: React.CSSProperties;
    "sub-header"?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    categories: true;
    header: true;
    "sub-header": true;
  }
}

const theme = createTheme({
  typography: {
    categories: {
      fontWeight: 900, // or 'bold'
      fontSize: "1.3rem",
    },
    header: {
      fontWeight: 900, // or 'bold'
      fontSize: "1.5rem",
      fontFamily: "TAN-NIMBUS",
    },
    "sub-header": {
      fontWeight: 700, // or 'bold'
      fontSize: "1.2rem",
      textAlign: "center",
    },
  },
});

function App() {
  const connexion = useAppSelector((state) => state.connexion);
  const wsState = useAppSelector((state) => state.webSocket);
  const dispatch = useAppDispatch();

  const {lastMessage, readyState } = useWebSocket('ws://127.0.0.1:8080/cards/listen',
      {
        shouldReconnect: (closeEvent) => true,
        reconnectAttempts: 10,
        reconnectInterval: 5000
        //attemptNumber will be 0 the first time it attempts to reconnect, so this equation results in a reconnect pattern of 1 second, 2 seconds, 4 seconds, 8 seconds, and then caps at 10 seconds until the maximum number of attempts is reached
      });

  useEffect(() => {
    if (lastMessage !== null) {
      let data = JSON.parse(lastMessage.data)
      if(data.type==="card"){
        if(connexion.type === typeConnexion.LOGOUT){
          dispatch(logInPending(data.payload))
        }
      }
    }
  }, [connexion.type, dispatch, lastMessage]);

  const handleWebSocketChange = useCallback((connected:boolean) => {
    dispatch(changeConnectedState(connected))
  }, [dispatch]);

  useEffect(() => {
    if(readyState === ReadyState.OPEN){
      handleWebSocketChange(true)
    }
  }, [readyState, handleWebSocketChange]);

  useEffect(() => {
    console.log(wsState)
  }, [wsState]);

  const handleLogOut = useCallback(() => {
    dispatch(changeCategoriesSelected(-1));
    dispatch(changeSelectedLocation(-1));
    dispatch(emptyBasket());
    dispatch(emptyPayment());
    dispatch(emptyHistory());
    dispatch(logOut());
    localStorage.removeItem("@auth_info");
  }, [dispatch]);

  useEffect(() => {
    function getBlocages(){
      apiRequest('GET',"blocages",{}).then(function(res){
        dispatch(changeBlocage(res!.data))
      }).catch(()=>{})
    }

    function getSalesLocation() {
      weezRequest("POST", "/POSS3/getSalesLocations", {}, [
        "FUND_ID",
        "EVENT_ID",
      ]).then(function (res) {
        let salesLocationsList: [saleLocationState?] = [];
        res!.data.forEach((salesLocation: saleLocationState) => {
          salesLocationsList.push({
            id: salesLocation.id,
            name: salesLocation.name,
            categories: salesLocation.categories,
          });
        });
        dispatch(changeSalesLocations(salesLocationsList));
      });
    }

    function getCategories() {
      weezRequest("POST", "/POSS3/getCategories", {}, ["FUND_ID", "AUTH"])
        .then(function (res) {
          let categoryList: [categoryState?] = [];
          res!.data.forEach((category: categoryState) => {
            categoryList.push({
              id: category.id,
              name: category.name,
              fundation_id: category.fundation_id,
            });
          });
          categoryList.sort((a, b) =>
            a!.name > b!.name ? 1 : b!.name > a!.name ? -1 : 0,
          );
          dispatch(changeCategories(categoryList));
        })
        .catch((err) => {
          if (err.response.status === 403) {
            handleLogOut();
          }
        });
    }

    function getArticles() {
      weezRequest("POST", "/POSS3/getArticles", {}, ["FUND_ID", "AUTH"])
        .then(function (res) {
          let articlesDictionary: { [key: number]: [articleState?] } = {};
          let articlesList: [articleState?] = [];
          res!.data.forEach((article: articleImport) => {
            if (article.removed_in_event === null) {
              if (articlesDictionary[article.categorie_id] === undefined) {
                articlesDictionary[article.categorie_id] = [];
              }
              articlesDictionary[article.categorie_id].push({
                id: article.id,
                name: article.name,
                categorie_id: article.categorie_id,
                fundation_id: article.fundation_id,
                image_url: article.image_url,
                price: article.price,
              });
              articlesList.push({
                id: article.id,
                name: article.name,
                categorie_id: article.categorie_id,
                fundation_id: article.fundation_id,
                image_url: article.image_url,
                price: article.price,
              });
            }
          });
          dispatch(changeArticles(articlesDictionary));
          dispatch(setArticles(articlesList));
        })
        .catch((err) => {
          if (err.response.status === 403) {
            handleLogOut();
          }
        });
    }

    const connexionInfo = localStorage.getItem("@auth_info");
    if (connexionInfo != null) {
      const connexionInfoParsed = JSON.parse(connexionInfo);
      if (connexionInfoParsed.sessionId !== connexion.connect.user.sessionId) {
        dispatch(
          logInSuccess({
            sessionId: connexionInfoParsed.sessionId,
            username: connexionInfoParsed.username,
          }),
        );
      }
    }
    getBlocages();
    if (connexion.type === typeConnexion.SUCCESSFULL) {
      getSalesLocation();
      getCategories();
      getArticles();

    }
  }, [connexion, dispatch, handleLogOut]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App bg-logo_bg w-screen bg-no-repeat bg-center bg-fixed bg-background-page h-screen overflow-y-scroll">
        <History />
        <Connexion />
        <SalesLocation />
        <Header />
        <Box className={"p-4 box-border flex items-start justify-start"}>
          <Categories />
          <Articles />
          <PaymentBox />
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
