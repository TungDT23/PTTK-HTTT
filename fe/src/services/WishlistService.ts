import axios from "axios";

const axiosClient = axios.create({
   baseURL: "http://localhost:3000",
   withCredentials: true,
});

export const getWishlist = async () => {
   try {
      const response = await axiosClient.get("/wishlist");
      return response.data;
   } catch (error: any) {
      console.error("Get wishlist failed:", error);
      throw error;
   }
};

export const addToWishlist = async (productId: string) => {
   try {
      const response = await axiosClient.post("/wishlist", { productId });
      return response.data;
   } catch (error: any) {
      console.error("Add to wishlist failed:", error);
      throw error;
   }
};

export const removeFromWishlist = async (productId: string) => {
   try {
      const response = await axiosClient.delete(`/wishlist/${productId}`);
      return response.data;
   } catch (error: any) {
      console.error("Remove from wishlist failed:", error);
      throw error;
   }
};
