import { combineReducers } from "@reduxjs/toolkit";
import invoicesReducer from "./invoicesSlice";
import productsReducer from "./productSlice";
import currencyExchangeReducer from "./currencyExchangeSlice";

const rootReducer = combineReducers({
  invoices: invoicesReducer,
  products: productsReducer,
  currencyExchange: currencyExchangeReducer,
});

export default rootReducer;
