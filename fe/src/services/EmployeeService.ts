import axios from "axios";
import type { Employee } from "@/types/Employee";
import type { ApiResponse } from "@/types/Response";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getAllEmployees = async (): Promise<ApiResponse<Employee[]>> => {
  const response = await axiosClient.get("/admin/employees");
  return response.data;
};

export const getEmployeeById = async (id: string): Promise<ApiResponse<Employee>> => {
  const response = await axiosClient.get(`/admin/employees/${id}`);
  return response.data;
};

export const createEmployee = async (data: Partial<Employee>): Promise<ApiResponse<Employee>> => {
  const response = await axiosClient.post(`/admin/employees/new`, data);
  return response.data;
};

export const updateEmployee = async (
  id: string,
  data: Partial<Employee>
): Promise<ApiResponse<Employee>> => {
  const response = await axiosClient.patch(`/admin/employees/edit/${id}`, data);
  return response.data;
};

export const deleteEmployee = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosClient.delete(`/admin/employees/delete/${id}`);
  return response.data;
};
