import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Cart } from "@/types/Cart";
import type { Product } from "@/types/Product";

interface UpdateQuantityPayload {
   productId: string;
   quantity: number;
}

const initialState: Cart[] = JSON.parse(localStorage.getItem("cart") || "[]");

const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
      addToCart: (state, action: PayloadAction<{ product: Product }>) => {
         const product = action.payload.product;
         const existingItem = state.find((item) => item._id === product._id);
         if (existingItem) {
            existingItem.quantity += 1;
         } else {
            state.push({
               _id: product._id,
               product,
               quantity: 1,
            });
         }
         localStorage.setItem("cart", JSON.stringify(state));
      },
      updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
         const item = state.find(i => i._id === action.payload.productId);
         if (item) {
            item.quantity = Math.max(1, item.quantity + action.payload.quantity);
         }
         localStorage.setItem("cart", JSON.stringify(state));
      },
      removeFromCart: (state, action: PayloadAction<{ productId: string }>) => {
         const newState = state.filter(item => item._id !== action.payload.productId);
         localStorage.setItem("cart", JSON.stringify(newState));
         return newState;
      },
      clearCart: () => {
         localStorage.removeItem("cart");
         return [];
      },
   },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
   cartSlice.actions;
export default cartSlice.reducer;
