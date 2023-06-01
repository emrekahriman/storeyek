import { configureStore } from "@reduxjs/toolkit";
import categories, { fetchCategories } from "./categories";
import products, { fetchProducts } from "./products";
import basket, { fetchBasket } from "./basket";

const store = configureStore({
  reducer: {
    categories,
    products,
    basket,
  },
});

store.dispatch(fetchCategories());
store.dispatch(fetchProducts());
store.dispatch(fetchBasket());


export default store;
