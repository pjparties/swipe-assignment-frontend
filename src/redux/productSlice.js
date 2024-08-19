import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: [],
  reducers: {
    addProduct: (state, action) => {
      state.push(action.payload);
    },
    deleteProduct: (state, action) => {
      return state.filter((item) => item.itemId !== action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.findIndex(
        (item) => item.itemId === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload.updatedProduct;
      }
      
    },
  },
});

export const {addProduct,deleteProduct,updateProduct} = productSlice.actions;

export const selectProductsList = (state) => state.products;

export default productSlice.reducer;
