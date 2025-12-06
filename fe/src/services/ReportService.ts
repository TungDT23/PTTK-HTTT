import axios from "axios";
import type { ApiResponse } from "@/types/Response";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getDashboardStats = async (): Promise<ApiResponse<any>> => {
  const response = await axios.get(`${API_URL}/admin/reports/dashboard`);
  return response.data;
};

export const getRevenueReport = async (
  startDate?: string,
  endDate?: string,
  groupBy?: string
): Promise<ApiResponse<any>> => {
  const params: any = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (groupBy) params.groupBy = groupBy;

  const response = await axios.get(`${API_URL}/admin/reports/revenue`, { params });
  return response.data;
};

export const getTopSellingProducts = async (
  limit?: number,
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<any>> => {
  const params: any = {};
  if (limit) params.limit = limit;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await axios.get(`${API_URL}/admin/reports/top-products`, { params });
  return response.data;
};

export const getInventoryReport = async (
  category?: string,
  lowStock?: boolean
): Promise<ApiResponse<any>> => {
  const params: any = {};
  if (category) params.category = category;
  if (lowStock) params.lowStock = "true";

  const response = await axios.get(`${API_URL}/admin/reports/inventory`, { params });
  return response.data;
};

export const getCustomerReport = async (limit?: number): Promise<ApiResponse<any>> => {
  const params: any = {};
  if (limit) params.limit = limit;

  const response = await axios.get(`${API_URL}/admin/reports/customers`, { params });
  return response.data;
};

export const getSalaryReport = async (month?: number, year?: number): Promise<ApiResponse<any>> => {
  const params: any = {};
  if (month) params.month = month;
  if (year) params.year = year;

  const response = await axios.get(`${API_URL}/admin/reports/salary`, { params });
  return response.data;
};

export const getPurchaseReport = async (
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<any>> => {
  const params: any = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await axios.get(`${API_URL}/admin/reports/purchase`, { params });
  return response.data;
};
