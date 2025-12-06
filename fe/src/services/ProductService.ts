import axios from "axios";

const axiosClient = axios.create({
   baseURL: "http://localhost:3000",
   withCredentials: true,
});

export const getAllProducts = async () => {
   try {
      const response = await axiosClient.get("/products");
      return response.data;
   } catch (error: any) {
      console.error("Failed to fetch products:", error.message);
   }
};

export const getProductById = async (id: string) => {
   try {
      const response = await axiosClient.get(`/products/${id}`);
      return response.data;
   } catch (error: any) {
      console.error(`Failed to fetch product with id ${id}:`, error.message);
   }
};

export const updateProduct = async (productData: any) => {
   try {
      const response = await axiosClient.patch(
         `/admin/products/edit`,
         productData
      );
      return response.data;
   } catch (error: any) {
      console.error("Failed to update product:", error.message);
   }
}

export const createProduct = async (productData: any) => {
   try {
      const response = await axiosClient.post("/admin/products/new", productData);
      return response.data;
   } catch (error: any) {
      console.error("Failed to create product:", error.message);
   }
};

export const deleteProduct = async (id: string) => {
   try {
      const response = await axiosClient.delete(`/admin/products/delete/${id}`);
      return response.data;
   } catch (error: any) {
      console.error("Failed to delete product:", error.message);
   }
}