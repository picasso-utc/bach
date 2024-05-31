import React, {useEffect, useState} from "react";
import "./App.css";
import Header from "./components/header";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import Connexion from "./components/connexion";
import {Box} from "@mui/material";
import Categories from "./components/categories";
import {apiRequest, jcapRequest, weezRequest} from "./api/apiClients";
import {
    changeSalesLocations,
    changeSelectedLocation,
    saleLocationState,
} from "./features/salelocation/salelocationSlice";
import SalesLocation from "./components/salesLocation";
import {categoryState, changeCategories, changeCategoriesSelected,} from "./features/category/categorySlice";
import {logInSuccess, logInTmpBadge, logOut, typeConnexion,} from "./features/connexion/connexionSlice";
import {articleImport, articleState, changeArticles,} from "./features/articles/articleSlice";
import Articles from "./components/articles";
import PaymentBox from "./components/paymentBox";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import History from "./components/history";
import {setArticles} from "./features/listarticle/listarticleSlice";
import {emptyBasket} from "./features/basket/basketSlice";
import {emptyPayment, setPayment} from "./features/payment/paymentSlice";
import {emptyHistory, history, setHistory} from "./features/history/historySlice";
import {changeBlocage} from "./features/blocages/blocageSlice";
import useWebSocket, {ReadyState} from 'react-use-websocket';
import {changeCardReaderState, changeConnectedState} from "./features/websocket/websocketSlice";
import CardReaderNotConnected from "./components/CardReaderNotConnected";

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
            fontSize: "1rem",
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
    const basket = useAppSelector((state) => state.basket);
    const blockedUsers = useAppSelector((state) => state.blocages);
    const articles = useAppSelector((state) => state.listArticle);
    const [actionHappening, setActionHappenening] = useState(false);
    const [reconnectAttempt, setReconnectAttempt] = useState(false)

    const dispatch = useAppDispatch();

    const {
        lastMessage,
        readyState
    } = useWebSocket(reconnectAttempt ? 'ws://127.0.0.1:8080/tmpReconnectUrl' : 'ws://127.0.0.1:8080/cards/listen',
        {
            shouldReconnect: (closeEvent) => true,
            reconnectAttempts: wsState.reconnectAttempts,
            reconnectInterval: 5000
        });

    function handleLogOut() {
        dispatch(changeCategoriesSelected(-1));
        dispatch(changeSelectedLocation(-1));
        dispatch(emptyBasket());
        dispatch(emptyPayment());
        dispatch(emptyHistory());
        dispatch(logOut());
        localStorage.removeItem("@auth_info");
    }

    //------------------------ Fonctions de récupération de payement et d'historique -------------//
    function pay(badge_id: string) {
        dispatch(setPayment({
            pending: true
        }))
        let items: [[number, number]?] = [];
        basket.forEach((article) => {
            items.push([article!.item.id, article!.quantity]);
        });
        if (blockedUsers.includes(badge_id)) {
            dispatch(emptyBasket());
            dispatch(setPayment({
                success: false,
                messageError: "Utilisateur Bloqué!",
            }))
            setTimeout(() => {
                dispatch(emptyPayment());
            }, 1500);
            setActionHappenening(false);
        } else {
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
                    setActionHappenening(false);
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
                    setActionHappenening(false);
                });
        }
    }


    function getLastPurchases(badge_id: string) {
        weezRequest("POST", "POSS3/getBuyerInfo", {badge_id: badge_id}, [
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
                setActionHappenening(false);
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    handleLogOut();
                } else {
                    let errorHistory: history = {};
                    errorHistory.messageErreur = err.response.data;
                    dispatch(setHistory(errorHistory));
                }
                setActionHappenening(false);
            });
    }

    //------------------------ Fonctions de récupération de blocage, catégroies et articles -------------//

    function getBlocages() {
        apiRequest('GET', "blocages", {}).then(function (res) {
            dispatch(changeBlocage(res!.data))
        }).catch(() => {
        })
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

    //--------------------------------------------- Use Effects ----------------------------------------------//
    useEffect(() => {
        if (lastMessage !== null && !actionHappening) {
            let data = JSON.parse(lastMessage.data)
            if (data.type === "card") {
                if (connexion.type === typeConnexion.LOGOUT) {
                    dispatch(logInTmpBadge(data.payload))
                } else if (connexion.type === typeConnexion.SUCCESSFULL) {
                    if (basket.length === 0) {
                        setActionHappenening(true);
                        getLastPurchases(data.payload);
                    } else {
                        setActionHappenening(true);
                        pay(data.payload);
                    }
                }
            } else if (data.type === "state") {
                if (data.payload.state === "CONNECTED") {
                    dispatch(changeCardReaderState(true))
                } else if (data.payload.state === "NOT_CONNECTED") {
                    dispatch(changeCardReaderState(false))
                }
            }
        }
        // eslint-disable-next-line
    }, [lastMessage]);

    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            jcapRequest('GET', 'cards/controller').then(function (res) {
                if (res!.data.state === "CONNECTED") {
                    dispatch(changeCardReaderState(true))
                } else if (res!.data.state === "NOT_CONNECTED") {
                    dispatch(changeCardReaderState(false))
                }
            }).catch((e) => {
                console.log(e)
            })
            dispatch(changeConnectedState(true))
        } else {
            dispatch(changeConnectedState(false))
        }
        // eslint-disable-next-line
    }, [readyState]);

    useEffect(() => {
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
        // eslint-disable-next-line
    }, [connexion]);


    // Change l'url du websocket pour 1 seconde pour forcer la reconnection
    useEffect(() => {
        if (wsState.reconnectAttempts !== 20) {
            setReconnectAttempt(true)
            setTimeout(() => {
                setReconnectAttempt(false)
            }, 1000)
        }
    }, [wsState.reconnectAttempts]);

    //--------------------------------------------------------------------------//

    return (
        <ThemeProvider theme={theme}>
            <div
                className="App bg-logo_bg w-screen bg-no-repeat bg-center bg-fixed bg-background-page h-screen overflow-y-scroll">
                <History/>
                <Connexion/>
                <CardReaderNotConnected/>
                <SalesLocation/>
                <Header/>
                <Box className={"p-4 box-border flex items-start justify-start"}>
                    <Categories/>
                    <Articles/>
                    <PaymentBox/>
                </Box>
            </div>
        </ThemeProvider>
    );
}

export default App;
