import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "@/types/Product";

interface WishlistState {
  items: Product[];
  loading: boolean;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
    addToWishlistStore: (state, action) => {
      const exists = state.items.find((item) => item._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlistStore: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    setWishlistLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setWishlist,
  addToWishlistStore,
  removeFromWishlistStore,
  clearWishlist,
  setWishlistLoading,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
