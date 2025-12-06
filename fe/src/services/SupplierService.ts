import axios from "axios";
import type { Supplier } from "@/types/Supplier";
import type { ApiResponse } from "@/types/Response";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getAllSuppliers = async (): Promise<ApiResponse<Supplier[]>> => {
  const response = await axiosClient.get("/admin/suppliers");
  return response.data;
};

export const getSupplierById = async (id: string): Promise<ApiResponse<Supplier>> => {
  const response = await axiosClient.get(`/admin/suppliers/${id}`);
  return response.data;
};

export const createSupplier = async (data: Partial<Supplier>): Promise<ApiResponse<Supplier>> => {
  const response = await axiosClient.post("/admin/suppliers/new", data);
  return response.data;
};

export const updateSupplier = async (
  id: string,
  data: Partial<Supplier>
): Promise<ApiResponse<Supplier>> => {
  const response = await axiosClient.patch(`/admin/suppliers/edit/${id}`, data);
  return response.data;
};

export const deleteSupplier = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosClient.delete(`/admin/suppliers/delete/${id}`);
  return response.data;
};
