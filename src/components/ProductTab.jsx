import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  selectProductsList,
} from "../redux/productSlice";
import { Table, Button } from 'react-bootstrap';
import { BiTrash } from 'react-icons/bi';
import generateRandomId from "../utils/generateRandomId";

const ProductTab = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const allProducts = useSelector(selectProductsList);

  useEffect(() => {
    setProducts(allProducts);
  }, [allProducts]);

  const handleProductChange = (event, productId) => {
    const updatedProducts = products.map((item) => {
      if (item.itemId === productId) {
        return { ...item, [event.target.name]: event.target.value };
      }
      return item;
    });
    setProducts(updatedProducts);

    dispatch(
      updateProduct({
        id: productId,
        updatedProduct: updatedProducts.find((item) => item.itemId === productId),
      })
    );
  };

  const handleAddProduct = () => {
    const newItemId = generateRandomId();
    const newItem = {
      itemId: newItemId,
      itemName: "",
      itemDescription: "",
      itemPrice: 1.0,
      itemQuantity: 1,
    };
    setProducts([...products, newItem]);
    dispatch(addProduct(newItem));
  };

  const handleDeleteProduct = async (itemId) => {
    dispatch(deleteProduct(itemId));
  };


  return (
    <div className="products-table">
      <Table bordered hover responsive className="rounded">
        <thead>
          <tr>
            <th style={{ width: "30%" }} className="text-center">ITEM</th>
            <th style={{ width: "30%" }} className="text-center">DESCRIPTION</th>
            <th style={{ width: "20%" }} className="text-center">PRICE</th>
            <th style={{ width: "20%" }} className="text-center">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.itemId}>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="itemName"
                  value={item.itemName}
                  onChange={(e) => handleProductChange(e, item.itemId)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="itemDescription"
                  value={item.itemDescription}
                  onChange={(e) => handleProductChange(e, item.itemId)}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  name="itemPrice"
                  value={item.itemPrice}
                  onChange={(e) => handleProductChange(e, item.itemId)}
                />
              </td>
              <td className="text-center">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteProduct(item.itemId)}
                >
                  <BiTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary" className="fw-bold" onClick={handleAddProduct}>Add Item</Button>
    </div>

  );

};

export default ProductTab;

