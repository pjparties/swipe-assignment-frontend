import { useSelector } from "react-redux";
import { selectInvoiceList } from "./invoicesSlice";
import { selectCurrentCurrency, selectExchangeRates } from "./currencyExchangeSlice";
import { selectProductsList } from "./productSlice";

export const useInvoiceListData = () => {
  const invoiceList = useSelector(selectInvoiceList);

  const getOneInvoice = (receivedId) => {
    return (
      invoiceList.find(
        (invoice) => invoice.id.toString() === receivedId.toString()
      ) || null
    );
  };

  const listSize = invoiceList.length;

  return {
    invoiceList,
    getOneInvoice,
    listSize,
  };
};

export const useCurrencyExchangeRates = () => {
  const current = useSelector(selectCurrentCurrency);
  const rates = useSelector(selectExchangeRates);

  return {
    current,
    rates,
  };
};

export const useProductsList = () => {
  const products = useSelector(selectProductsList);

  return {
    products
  };
};