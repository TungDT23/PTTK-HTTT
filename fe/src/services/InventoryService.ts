import axios from "axios";
import type { PurchaseOrder } from "@/types/PurchaseOrder";
import type { InventoryTransaction } from "@/types/InventoryTransaction";
import type { ApiResponse } from "@/types/Response";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getAllPurchaseOrders = async (): Promise<ApiResponse<PurchaseOrder[]>> => {
  const response = await axiosClient.get("/admin/purchase-orders");
  return response.data;
};

export const createPurchaseOrder = async (
  data: Partial<PurchaseOrder>
): Promise<ApiResponse<PurchaseOrder>> => {
  const response = await axiosClient.post("/admin/purchase-orders/new", data);
  return response.data;
};

export const updatePurchaseOrderStatus = async (
  id: string,
  status: string,
  receivedDate?: string
): Promise<ApiResponse<PurchaseOrder>> => {
  const response = await axiosClient.patch(`/admin/purchase-orders/${id}/status`, {
    status,
    receivedDate,
  });
  return response.data;
};

export const getInventoryTransactions = async (
  productId?: string
): Promise<ApiResponse<InventoryTransaction[]>> => {
  const params = productId ? { productId } : {};
  const response = await axiosClient.get("/admin/inventory/transactions", { params });
  return response.data;
};

export const inventoryAdjustment = async (data: {
  productId: string;
  actualStock: number;
  employeeId?: string;
  note?: string;
}): Promise<ApiResponse<any>> => {
  const response = await axiosClient.post("/admin/inventory/adjustment", data);
  return response.data;
};
