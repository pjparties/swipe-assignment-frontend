import axios from "axios";

export const convertCurrency = () => {
  const base_currency = "INR";
  const currencies = "INR,USD,GBP,JPY,AUD,CNY";
  const API_KEY = process.env.REACT_APP_API_KEY;
  const currencyConversionRates = axios
    .get("https://api.freecurrencyapi.com/v1/latest", {
      params: {
        apikey: API_KEY,
        base_currency: base_currency,
        currencies: currencies,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));

  return currencyConversionRates;
};

export const convertPrice = (priceBase, current, rates) => {
  return (priceBase * rates[current]).toFixed(2);
};

export const convertToBase = (price, current, rates) => {
  return (price / rates[current]).toFixed(2);
};
