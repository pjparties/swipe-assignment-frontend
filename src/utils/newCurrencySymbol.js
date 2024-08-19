export const newCurrencySymbol = (currency) => {
  let newCurrencySymbol = "₹";
  switch (currency) {
    case "INR":
      newCurrencySymbol = "₹";
      break;
    case "USD":
      newCurrencySymbol = "$";
      break;
    case "GBP":
      newCurrencySymbol = "£";
      break;
      case "JPY":
        newCurrencySymbol = "¥";
        break;
    case "AUD":
      newCurrencySymbol = "$";
      break;
    case "CNY":
      newCurrencySymbol = "¥";
      break;
  }
  return newCurrencySymbol;
};
