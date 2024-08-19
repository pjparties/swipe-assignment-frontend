
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";
import { selectProductsList } from "../redux/productSlice";
import { useCurrencyExchangeRates } from "../redux/hooks";
import { newCurrencySymbol } from "../utils/newCurrencySymbol";
import { convertPrice } from "../utils/currencyCoverter";

const GenerateInvoice = () => {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792],
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice-001.pdf");
  });
};

const InvoiceModal = (props) => {
  const [taxAmount, setTaxAmount] = useState("0.00");
  const [discountAmount, setDiscountAmount] = useState("0.00");
  const [total, setTotal] = useState("0.00");
  const { rates, current } = useCurrencyExchangeRates();

  const selectedProducts = useSelector(selectProductsList);

  const handleCalculateTotal = () => {
    // Calculate subtotal
    let subTotal = 0;
    selectedProducts.forEach((item) => {
      // Convert itemPrice and itemQuantity to numbers, handle empty fields by defaulting to 0
      const price = parseFloat(item?.itemPrice || 0);
      const quantity = parseInt(item?.itemQuantity || 0);
      subTotal += price * quantity;
    });

    // Convert taxRate and discountRate to numbers, handle empty fields by defaulting to 0
    const taxRate = parseFloat(props?.info?.taxRate || 0);
    const discountRate = parseFloat(props?.info?.discountRate || 0);

    const calculatedTaxAmount = parseFloat(
      subTotal * (taxRate / 100)
    ).toFixed(2);

    const calculatedDiscountAmount = parseFloat(
      subTotal * (discountRate / 100)
    ).toFixed(2);

    const calculatedTotal = (
      subTotal -
      parseFloat(calculatedDiscountAmount) +
      parseFloat(calculatedTaxAmount)
    ).toFixed(2);

    setTaxAmount(calculatedTaxAmount);
    setDiscountAmount(calculatedDiscountAmount);
    setTotal(calculatedTotal);
  };

  useEffect(() => {
    handleCalculateTotal();
  },[selectedProducts]);

  return (
    <div>
      <Modal
        show={props.showModal}
        onHide={props.closeModal}
        size="lg"
        centered
      >
        <div id="invoiceCapture">
          <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
            <div className="w-100">
              <h6 className="fw-bold text-secondary mb-1">
                Invoice ID: {props.info.id || ""}
              </h6>
              <h4 className="fw-bold my-2">
                {props.info.billFrom || "John Uberbacher"}
              </h4>
              <h7 className="fw-bold text-secondary mb-1">
                Invoice No.: {props.info.invoiceNumber || ""}
              </h7>
            </div>
            <div className="text-end ms-4">
              <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
              <h5 className="fw-bold text-secondary">
                {current === "INR" ? (
                  <div>
                    {newCurrencySymbol(current)}
                    {props.total || 0}
                  </div>
                ) : (
                  <div>
                    {newCurrencySymbol(current)}
                    {convertPrice(props.total || 0, current, rates)}
                  </div>
                )}
              </h5>
            </div>
          </div>
          <div className="p-4">
            <Row className="mb-4">
              <Col md={4}>
                <div className="fw-bold">Billed to:</div>
                <div>{props.info.billTo || ""}</div>
                <div>{props.info.billToAddress || ""}</div>
                <div>{props.info.billToEmail || ""}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold">Billed From:</div>
                <div>{props.info.billFrom || ""}</div>
                <div>{props.info.billFromAddress || ""}</div>
                <div>{props.info.billFromEmail || ""}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold mt-2">Date Of Issue:</div>
                <div>{props.info.dateOfIssue || ""}</div>
              </Col>
            </Row>
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>DESC</th>
                  <th>QTY</th>
                  <th className="text-end">PRICE</th>
                  <th className="text-end">AMOUNT</th>
                </tr>
                {/* display added items */}
                {selectedProducts.map((item) => {
                  return (
                    <tr key={item.itemId}>
                      <td>{item.itemName}</td>
                      <td>{item.itemDescription}</td>
                      <td>{item.itemQuantity}</td>
                      {/* price */}
                      <td className="text-end">
                        {current === "INR" ? (
                          <div>
                            {newCurrencySymbol(current)}
                            {item.itemPrice}

                          </div>
                        ) : (
                          <div>
                            {newCurrencySymbol(current)}
                            {convertPrice(item.itemPrice, current, rates)}
                          </div>
                        )}
                      </td>
                      {/* amount */}
                      <td className="text-end">
                        {current === "INR" ? (
                          <div>
                            {newCurrencySymbol(current)}
                            {item.itemPrice * item.itemQuantity}
                          </div>
                        ) : (
                          <div>
                            {newCurrencySymbol(current)}
                            {convertPrice(
                              item.itemPrice * item.itemQuantity,
                              current,
                              rates
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </thead>
              <tbody>
              </tbody>
            </Table>
            <Table>
              <tbody>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>
                    TAX
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {current === "INR" ? (
                      <div>
                        {newCurrencySymbol(current)}
                        {props.taxAmount || 0}
                      </div>
                    ) : (
                      <div>
                        {newCurrencySymbol(current)}
                        {convertPrice(props.taxAmount || 0, current, rates)}
                      </div>
                    )}
                  </td>
                </tr>
                {props.discountAmount !== 0.0 && (
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "100px" }}>
                      DISCOUNT
                    </td>
                    <td className="text-end" style={{ width: "100px" }}>
                      {current === "INR" ? (
                        <div>
                          {newCurrencySymbol(current)}
                          {props.discountAmount || 0}
                        </div>
                      ) : (
                        <div>
                          {newCurrencySymbol(current)}
                          {convertPrice(
                            props.discountAmount || 0,
                            current,
                            rates
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>
                    TOTAL
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                  {current === "INR" ? (
                      <div>
                        {newCurrencySymbol(current)}
                        {props.total || 0}
                      </div>
                    ) : (
                      <div>
                        {newCurrencySymbol(current)}
                        {convertPrice(props.total || 0, current, rates)}
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
            {props.info.notes && (
              <div className="bg-light py-3 px-4 rounded">
                {props.info.notes}
              </div>
            )}
          </div>
        </div>
        <div className="pb-4 px-4">
          <Row>
            <Col md={6}>
              <Button
                variant="primary"
                className="d-block w-100"
                onClick={GenerateInvoice}
              >
                <BiPaperPlane
                  style={{ width: "15px", height: "15px", marginTop: "-3px" }}
                  className="me-2"
                />
                Send Invoice
              </Button>
            </Col>
            <Col md={6}>
              <Button
                variant="outline-primary"
                className="d-block w-100 mt-3 mt-md-0"
                onClick={GenerateInvoice}
              >
                <BiCloudDownload
                  style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                  className="me-2"
                />
                Download Copy
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
      <hr className="mt-4 mb-3" />
    </div>
  );
};

export default InvoiceModal;
