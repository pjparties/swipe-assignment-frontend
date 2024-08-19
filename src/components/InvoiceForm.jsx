import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceModal from "./InvoiceModal";
import { BiArrowBack } from "react-icons/bi";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch, useSelector } from "react-redux";
import { addInvoice, updateInvoice } from "../redux/invoicesSlice";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import generateRandomId from "../utils/generateRandomId";
import { useInvoiceListData, useCurrencyExchangeRates } from "../redux/hooks";
import { setCurrentCurrency } from "../redux/currencyExchangeSlice";
import { convertPrice } from "../utils/currencyCoverter.js";
import { newCurrencySymbol } from "../utils/newCurrencySymbol.js";
import {
  addProduct,
  deleteProduct,
  updateProduct,
  selectProductsList,
} from "../redux/productSlice";
import { Table } from "react-bootstrap";
import { BiTrash } from "react-icons/bi";

const InvoiceForm = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isCopy = location.pathname.includes("create");
  const isEdit = location.pathname.includes("edit");
  const { current, rates } = useCurrencyExchangeRates();

  const [isOpen, setIsOpen] = useState(false);
  const [copyId, setCopyId] = useState("");
  const { getOneInvoice, listSize } = useInvoiceListData();
  const [formData, setFormData] = useState(
    isEdit
      ? getOneInvoice(params.id)
      : isCopy && params.id
        ? {
          ...getOneInvoice(params.id),
          invoiceNumber: listSize + 1,
        }
        : {
          id: generateRandomId(),
          currentDate: new Date().toLocaleDateString(),
          invoiceNumber: listSize + 1,
          dateOfIssue: "",
          billTo: "",
          billToEmail: "",
          billToAddress: "",
          billFrom: "",
          billFromEmail: "",
          billFromAddress: "",
          notes: "",
          total: "0.00",
          subTotal: "0.00",
          taxRate: "",
          taxAmount: "0.00",
          discountRate: "",
          discountAmount: "0.00",
          currency: "₹",
          items: [],
        }
  );
  
  const allItems = useSelector(selectProductsList) || [];

  useEffect(() => {
    if (formData.items && formData.items.length > 0) {
      const updatedProducts = formData.items.filter(itemId =>
        allItems.some(item => item.itemId === itemId)
      );
      setFormData(prevFormData => ({
        ...prevFormData,
        items: updatedProducts
      }));
      handleCalculateTotal();
    }
  }, [allItems]);

  const handleRowDel = (itemIdToDelete) => {
    const updatedProducts = formData.items.filter(
      (item) => item.id !== itemIdToDelete
    );
    dispatch(deleteProduct(itemIdToDelete));
    setFormData({ ...formData, items: updatedProducts });
    handleCalculateTotal();
  };

  const handleAddEvent = () => {
    const id = generateRandomId();
    const newItem = {
      itemId: id,
      itemName: "",
      itemDescription: "",
      itemPrice: "1.00",
      itemQuantity: 1,
    };
    dispatch(addProduct(newItem));
    setFormData({
      ...formData,
      items: [...formData.items, newItem.itemId],
    });
    handleCalculateTotal();
  };

  const handleCalculateTotal = () => {
    setFormData((prevFormData) => {
      let subTotal = 0;

      const updatedProducts = formData.items.filter(itemId =>
        allItems.some(item => item.itemId === itemId)
      );
      allItems
        .filter((item) => updatedProducts.includes(item.itemId))
        .forEach((item) => {
          subTotal +=
            parseFloat(item?.itemPrice).toFixed(2) *
            parseInt(item?.itemQuantity);
        });

      const taxAmount = parseFloat(
        subTotal * (prevFormData.taxRate / 100)
      ).toFixed(2);
      const discountAmount = parseFloat(
        subTotal * (prevFormData.discountRate / 100)
      ).toFixed(2);
      const total = (
        subTotal -
        parseFloat(discountAmount) +
        parseFloat(taxAmount)
      ).toFixed(2);

      return {
        ...prevFormData,
        subTotal: parseFloat(subTotal).toFixed(2),
        taxAmount,
        discountAmount,
        total,
      };
    });
  };

  const onItemizedItemEdit = (evt, id) => {
    const updatedProducts = allItems.map((oldItem) => {
      if (oldItem.itemId === id) {
        return { ...oldItem, [evt.target.name]: evt.target.value };
      }
      return oldItem;
    });

    dispatch(
      updateProduct({
        id,
        updatedProduct: updatedProducts.find((item) => item.itemId === id),
      })
    );
    handleCalculateTotal();
  };

  const editField = (name, value) => {
    setFormData({ ...formData, [name]: value });
    handleCalculateTotal();
  };

  const onCurrencyChange = (selectedOption) => {
    const symbol = newCurrencySymbol(selectedOption.currency);
    setFormData({ ...formData, currency: symbol });
    dispatch(setCurrentCurrency(selectedOption.currency));
    handleCalculateTotal();
  };

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddInvoice = () => {
    if (isEdit) {
      dispatch(updateInvoice({ id: params.id, updatedInvoice: formData }));
      alert("Invoice updated successfuly 🥳");
    } else if (isCopy) {
      dispatch(addInvoice({ id: generateRandomId(), ...formData }));
      alert("Invoice added successfuly 🥳");
    } else {
      dispatch(addInvoice(formData));
      alert("Invoice added successfuly 🥳");
    }
    navigate("/");
  };

  const handleCopyInvoice = () => {
    const recievedInvoice = getOneInvoice(copyId);
    if (recievedInvoice) {
      setFormData({
        ...recievedInvoice,
        id: formData.id,
        invoiceNumber: formData.invoiceNumber,
      });
    } else {
      alert("Invoice does not exists!!!!!");
    }
  };

  const handleCombineCall = (evt, item) => {
    onItemizedItemEdit(evt, item.itemId);
  };

  return (
    <Form onSubmit={openModal}>
      <Link to="/">
        <div className="d-flex align-items-center">
          <BiArrowBack size={18} />
          <div className="fw-bold mt-1 mx-2 cursor-pointer">
            <h5>Go Back</h5>
          </div>
        </div>
      </Link>

      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{formData.currentDate}</span>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                  <Form.Control
                    type="date"
                    value={formData.dateOfIssue}
                    name="dateOfIssue"
                    onChange={(e) => editField(e.target.name, e.target.value)}
                    style={{ maxWidth: "150px" }}
                    required
                  />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                <Form.Control
                  type="number"
                  value={formData.invoiceNumber}
                  name="invoiceNumber"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  min="1"
                  style={{ maxWidth: "70px" }}
                  required
                />
              </div>
            </div>
            <hr className="my-4" />
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Bill to:</Form.Label>
                <Form.Control
                  placeholder="Who is this invoice to?"
                  rows={3}
                  value={formData.billTo}
                  type="text"
                  name="billTo"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="name"
                  required
                />
                <Form.Control
                  placeholder="Email address"
                  value={formData.billToEmail}
                  type="email"
                  name="billToEmail"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="email"
                  required
                />
                <Form.Control
                  placeholder="Billing address"
                  value={formData.billToAddress}
                  type="text"
                  name="billToAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  required
                />
              </Col>
              <Col>
                <Form.Label className="fw-bold">Bill from:</Form.Label>
                <Form.Control
                  placeholder="Who is this invoice from?"
                  rows={3}
                  value={formData.billFrom}
                  type="text"
                  name="billFrom"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="name"
                  required
                />
                <Form.Control
                  placeholder="Email address"
                  value={formData.billFromEmail}
                  type="email"
                  name="billFromEmail"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="email"
                  required
                />
                <Form.Control
                  placeholder="Billing address"
                  value={formData.billFromAddress}
                  type="text"
                  name="billFromAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  required
                />
              </Col>
            </Row>
            <Row>
              <div className="products-table">
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }} >Item</th>
                      <th style={{ width: "20%" }} >Qty</th>
                      <th style={{ width: "20%" }} >Price</th>
                      <th className="text-center" style={{ width: "10%" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items &&
                      formData.items.length > 0 &&
                      allItems.filter((item) =>
                        formData.items.includes(item.itemId)
                      )
                        .map((item) => (
                          <tr key={item.itemId}>
                            <td style={{ width: "100%" }}>
                              <div className="autocomplete-">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="itemName"
                                  placeholder="Item Name"
                                  value={item.itemName}
                                  onChange={(e) =>
                                    handleCombineCall(e, item)
                                  }
                                />
                              </div>
                              <input
                                type="text"
                                className="form-control"
                                name="itemDescription"
                                placeholder="Item Description"
                                value={item.itemDescription}
                                onChange={(e) =>
                                  onItemizedItemEdit(e, item.itemId)
                                }
                              />
                            </td>
                            <td className="text-center" style={{ minWidth: "70px" }}>
                              <input
                                type="number"
                                className="form-control text-center"
                                name="itemQuantity"
                                min="1"
                                value={item.itemQuantity || 1}
                                onChange={(e) =>
                                  onItemizedItemEdit(e, item.itemId)
                                }
                              />
                            </td>
                            <td className="text-center" style={{ minWidth: "130px" }}>
                              <input
                                type="number"
                                className="form-control text-center"
                                name="itemPrice"
                                min="1.00"
                                step="0.01"
                                value={item.itemPrice || 1.0}
                                onChange={(e) =>
                                  onItemizedItemEdit(e, item.itemId)
                                }
                              />
                            </td>
                            <td className="text-center" style={{ minWidth: "50px" }}>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRowDel(item.itemId)}
                              >
                                <BiTrash />
                              </button>
                            </td>
                          </tr>
                        )
                        )}
                  </tbody>
                </Table>
                <Button className="fw-bold" onClick={handleAddEvent}>
                  Add Item
                </Button>
              </div>
            </Row>
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>
                    {current === "INR" ? (
                      <div>
                        {formData.currency}
                        {formData.subTotal}
                      </div>
                    ) : (
                      <div>
                        {formData.currency}
                        {convertPrice(formData.subTotal, current, rates)}
                      </div>
                    )}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small">
                      ({formData.discountRate || 0}%)
                    </span>
                    {current === "INR" ? (
                      <div>
                        {formData.currency}
                        {formData.discountAmount || 0}
                      </div>
                    ) : (
                      <div>
                        {formData.currency}
                        {convertPrice(
                          formData.discountAmount || 0,
                          current,
                          rates
                        )}
                      </div>
                    )}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    <span className="small">({formData.taxRate || 0}%)</span>
                    {current === "INR" ? (
                      <div>
                        {formData.currency}
                        {formData.taxAmount || 0}
                      </div>
                    ) : (
                      <div>
                        {formData.currency}
                        {convertPrice(formData.taxAmount || 0, current, rates)}
                      </div>
                    )}
                  </span>
                </div>
                <hr />
                <div
                  className="d-flex flex-row align-items-start justify-content-between"
                  style={{ fontSize: "1.125rem" }}
                >
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">
                    {current === "INR" ? (
                      <div>
                        {formData.currency}
                        {formData.total || 0}
                      </div>
                    ) : (
                      <div>
                        {formData.currency}
                        {convertPrice(formData.total || 0, current, rates)}
                      </div>
                    )}
                  </span>
                </div>
              </Col>
            </Row>
            <hr className="my-4" />
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control
              placeholder="Thanks for your business!"
              name="notes"
              value={formData.notes}
              onChange={(e) => editField(e.target.name, e.target.value)}
              as="textarea"
              className="my-2"
              rows={1}
            />
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button
              variant="dark"
              onClick={handleAddInvoice}
              className="d-block w-100 mb-2"
            >
              {isEdit ? "Update Invoice" : "Add Invoice"}
            </Button>
            <Button variant="primary" type="submit" className="d-block w-100">
              Review Invoice
            </Button>
            <InvoiceModal
              showModal={isOpen}
              closeModal={closeModal}
              info={{
                isOpen,
                id: formData.id,
                currency: formData.currency,
                currentDate: formData.currentDate,
                invoiceNumber: formData.invoiceNumber,
                dateOfIssue: formData.dateOfIssue,
                billTo: formData.billTo,
                billToEmail: formData.billToEmail,
                billToAddress: formData.billToAddress,
                billFrom: formData.billFrom,
                billFromEmail: formData.billFromEmail,
                billFromAddress: formData.billFromAddress,
                notes: formData.notes,
                total: formData.total,
                subTotal: formData.subTotal,
                taxRate: formData.taxRate,
                taxAmount: formData.taxAmount,
                discountRate: formData.discountRate,
                discountAmount: formData.discountAmount,
              }}
              items={formData.items}
              currency={formData.currency}
              subTotal={formData.subTotal}
              taxAmount={formData.taxAmount}
              discountAmount={formData.discountAmount}
              total={formData.total}
            />
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select
                onChange={(event) =>
                  onCurrencyChange({ currency: event.target.value })
                }
                className="btn btn-light my-1"
                aria-label="Change Currency"
              >

                <option value="INR">INR (Indian Rupee)</option>
                <option value="USD">USD (United States Dollar)</option>
                <option value="GBP">GBP (British Pound Sterling)</option>
                <option value="JPY">JPY (Japanese Yen)</option>
                <option value="CAD">CAD (Canadian Dollar)</option>
                <option value="AUD">AUD (Australian Dollar)</option>
                <option value="CNY">CNY (Chinese Yen)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="taxRate"
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="discountRate"
                  type="number"
                  value={formData.discountRate}
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Control
              placeholder="Enter Invoice ID"
              name="copyId"
              value={copyId}
              onChange={(e) => setCopyId(e.target.value)}
              type="text"
              className="my-2 bg-white border"
            />
            <Button
              variant="primary"
              onClick={handleCopyInvoice}
              className="d-block"
            >
              Copy Old Invoice
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default InvoiceForm;
