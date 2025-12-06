import type { Product } from "./Product";

export interface Cart {
   _id: string;
   product: Product;
   quantity: number;
}

export type TCartAction = | { type: "ADD_TO_CART", payload: Product }
   | { type: "UPDATE_QUANTITY", payload: { productId: string, quantity: number } }
   | { type: "REMOVE_FROM_CART", payload: { productId: string } }
   | { type: "CLEAR_CART" }