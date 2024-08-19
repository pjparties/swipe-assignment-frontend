import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import Invoice from "./pages/Invoice";
import InvoiceList from "./pages/InvoiceList";
import { useDispatch } from "react-redux";
import { updateExchangeRates } from "./redux/currencyExchangeSlice";
import { convertCurrency } from "./utils/currencyCoverter.js";

const App = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    const getExchangeRates = async () => {
      try {
        const exchangeRates = await convertCurrency();
        dispatch(updateExchangeRates(exchangeRates.data));
      } catch (error) {
        console.error("Error fetching exchange rates: ", error);
      };
    }
    getExchangeRates();
  }, [dispatch]);

      return (
        <div className="App d-flex flex-column align-items-center justify-content-center w-100">
          <Container>
            <Routes>
              <Route path="/" element={<InvoiceList />} />
              <Route path="/create" element={<Invoice />} />
              <Route path="/create/:id" element={<Invoice />} />
              <Route path="/edit/:id" element={<Invoice />} />
            </Routes>
          </Container>
        </div>
      );
    };

    export default App;
