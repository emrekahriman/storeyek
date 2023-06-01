import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";
import Router from "next/router";
const initialState = {
  items: [
    // {
    //   product: {
    //     _id: "1",
    //     name: "Apple iPhone 12 Pro Max",
    //     slug: "apple-iphone-12-pro-max",
    //     category: "642f60f8e3058e03296e3c86",
    //     price: 1099,
    //     images: [
    //       "https://images.unsplash.com/photo-1606788158174-4b0b5b6b6b0f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwaG91c2UlMjBwcm8lMjBtYXh8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    //     ],
    //   },
    //   quantity: 1,
    // },
  ], // array of items in the basket
  loading: false,
  error: null,
};

export const fetchUserIfLoggedIn = async () => {
  const session = await getSession();
  if (session) return session.user;
  return null;
};

const updateBasketOnApi = async (basketItems, user) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/update`,
      {
        cart: basketItems,
      },
      {
        headers: {
          Authorization: `Bearer ${user.tokenYek}`,
        },
      }
    );
    const data = await res.data;
    if (data.status !== "success") {
      throw new Error("Error while updating basket");
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

export const fetchBasket = createAsyncThunk(
  "basket/fetchBasket",
  async (_, thunkAPI) => {
    const user = await fetchUserIfLoggedIn();
    if (!user) {
      return [];
    }

    let res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${user.tokenYek}`,
      },
    });
    res = await res.data;
    if (res.status === "success") {
      const cart = res.cart.items.map((item) => {
        const { _id, ...rest } = item;
        return rest;
      });
      return cart;
    }
    throw new Error("Error while fetching basket");
  }
);

export const addToBasket = createAsyncThunk(
  "basket/addToBasket",
  async ({ product, quantity = 1 }, thunkAPI) => {
    const user = await fetchUserIfLoggedIn();
    if (!user) {
      toast.error("Please login to add to basket");
      Router.push("/login");
      return null;
    }

    let stateItems = [...thunkAPI.getState().basket.items];
    // if item already exists in basket, then increase quantity
    const index = stateItems.findIndex(
      (basketItem) => basketItem.product._id === product._id
    );

    if (index >= 0) {
      // clone stateItems array then increase quantity
      let newObj = { ...stateItems[index] };
      newObj.quantity += quantity;
      stateItems[index] = newObj;
    } else {
      // if item does not exist in basket, then add item to basket
      stateItems.push({ product: product, quantity: quantity });
    }

    toast.promise(updateBasketOnApi(stateItems, user), {
      loading: "Updating basket...",
      success: () => `${product.name} added to basket`,
      error: (err) => err.message,
    });

    return stateItems;
  }
);

export const removeFromBasket = createAsyncThunk(
  "basket/removeFromBasket",
  async (product, thunkAPI) => {
    const user = await fetchUserIfLoggedIn();
    if (!user) {
      toast.error("Please login to remove from basket");
      Router.push("/login");
      return null;
    }

    let stateItems = [...thunkAPI.getState().basket.items];
    // if item already exists in basket, then increase quantity
    const index = stateItems.findIndex(
      (basketItem) => basketItem.product._id === product._id
    );

    if (index >= 0) {
      stateItems.splice(index, 1);
    }

    toast.promise(updateBasketOnApi(stateItems, user), {
      loading: "Updating basket...",
      success: () => `${product.name} removed from basket`,
      error: (err) => err.message,
    });

    return stateItems;
  }
);

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.items = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchBasket.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(fetchBasket.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });

    builder.addCase(fetchBasket.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });


    builder.addCase(addToBasket.fulfilled, (state, action) => {
      state.items = action.payload || state.items; // if action.payload is null, then use state.items
    });

    builder.addCase(removeFromBasket.fulfilled, (state, action) => {
      state.items = action.payload || state.items;
    });
  },
});

export const { setBasket } = basketSlice.actions;

// export const selectBasketItems = (state) =>
//   state.basket.items.map((item) => item.product);

export const selectBasketItems = (state) => state.basket.items;

export const selectBasketItemsWithId = (state, id) =>
  state.basket.items.find((item) => item.product._id === id);

export const selectBasketTotal = (state) =>
  state.basket.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

export default basketSlice.reducer;
