import axios from "axios";
import type { Salary } from "@/types/Salary";
import type { ApiResponse } from "@/types/Response";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const axiosClient = axios.create({
  withCredentials: true,
});

export const getAllSalaries = async (
  month?: number,
  year?: number
): Promise<ApiResponse<Salary[]>> => {
  const params: any = {};
  if (month) params.month = month;
  if (year) params.year = year;

  const response = await axiosClient.get(`${API_URL}/admin/salaries`, { params });
  return response.data;
};

export const createSalary = async (data: Partial<Salary>): Promise<ApiResponse<Salary>> => {
  const response = await axiosClient.post(`${API_URL}/admin/salaries/new`, data);
  return response.data;
};

export const createBulkSalaries = async (
  month: number,
  year: number
): Promise<ApiResponse<Salary[]>> => {
  const response = await axiosClient.post(`${API_URL}/admin/salaries/bulk`, { month, year });
  return response.data;
};

export const updateSalary = async (
  id: string,
  data: Partial<Salary>
): Promise<ApiResponse<Salary>> => {
  const response = await axiosClient.patch(`${API_URL}/admin/salaries/edit/${id}`, data);
  return response.data;
};

export const paySalary = async (id: string): Promise<ApiResponse<Salary>> => {
  const response = await axiosClient.patch(`${API_URL}/admin/salaries/pay/${id}`);
  return response.data;
};
