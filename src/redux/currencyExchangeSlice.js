import { createSlice } from "@reduxjs/toolkit";

const currencyExchangeSlice = createSlice({
  name: "currencyExchange",
  initialState: {
    current: "INR",
    rates: {},
  },
  reducers: {
    updateExchangeRates: (state, action) => {
      state.rates = { ...state.rates, ...action.payload };
    },
    setCurrentCurrency: (state, action) => {
      state.current = action.payload;
    },
  },
});

export const { updateExchangeRates, setCurrentCurrency } =
  currencyExchangeSlice.actions;
export const selectCurrentCurrency = (state) => state.currencyExchange.current;
export const selectExchangeRates = (state) => state.currencyExchange.rates;
export default currencyExchangeSlice.reducer;
