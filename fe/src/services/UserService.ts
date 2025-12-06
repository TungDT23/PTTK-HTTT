import axios from "axios";
import type { RegisterForm } from "@/types/User";

const axiosClient = axios.create({
   baseURL: "http://localhost:3000",
   withCredentials: true, // Enable cookies
});

export const registerUser = async (formData: RegisterForm) => {
   try {
      const response = await axiosClient.post("/register", {
         username: formData.username,
         password: formData.password,
         fullName: formData.fullName,
         email: formData.email,
         phone: formData.phone
      });
      return response.data;
   } catch (error: any) {
      console.error("Registration failed:", error);
      if (error.response) {
         throw new Error(error.response.data.message || 'Đăng ký thất bại');
      } else {
         throw new Error('Không thể kết nối đến server');
      }
   }
};

export const loginUser = async (username: string, password: string) => {
   console.log("Logging in with", { username, password });

   try {
      const response = await axiosClient.post("/login", { username, password });
      console.log("Login response:", response.data);
      return response.data;
   } catch (error: any) {
      console.error("Login failed:", error);
      if (error.response) {
         console.error("Error response:", error.response.data);
         alert(`Đăng nhập thất bại: ${error.response.data.message || 'Lỗi không xác định'}`);
      } else {
         alert('Không thể kết nối đến server. Vui lòng kiểm tra lại!');
      }
      throw error;
   }
};

export const getCurrentUser = async () => {
   try {
      const response = await axiosClient.get("/admin/me");
      return response.data;
   } catch (error: any) {
      // Silent fail for 401/403 (user not logged in)
      if (error.response?.status !== 401 && error.response?.status !== 403) {
         console.error("Get current user failed:", error);
      }
      throw error;
   }
};

export const updateUserProfile = async (userId: string, data: { fullName?: string; email?: string; phone?: string }) => {
   try {
      const response = await axiosClient.patch(`/profile/${userId}`, data);
      return response.data;
   } catch (error: any) {
      console.error("Update profile failed:", error);
      throw error;
   }
};