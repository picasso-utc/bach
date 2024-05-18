import { configureStore } from "@reduxjs/toolkit";
import connexionReducer from "../features/connexion/connexionSlice";
import saleLocationReducer from "../features/salelocation/salelocationSlice";
import categoryReducer from "../features/category/categorySlice";
import articleReducer from "../features/articles/articleSlice";
import basketReducer from "../features/basket/basketSlice";
import historyReducer from "../features/history/historySlice";
import listArticleReducer from "../features/listarticle/listarticleSlice";
import paymentReducer from "../features/payment/paymentSlice";
import blocageReducer from "../features/blocages/blocageSlice"

export const store = configureStore({
  reducer: {
    connexion: connexionReducer,
    salesLocations: saleLocationReducer,
    category: categoryReducer,
    article: articleReducer,
    basket: basketReducer,
    history: historyReducer,
    listArticle: listArticleReducer,
    payment: paymentReducer,
    blocages: blocageReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
