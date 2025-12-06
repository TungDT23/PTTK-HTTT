import axios from "axios";
import type { ApiResponse } from "@/types/Response";

const API_URL = "http://localhost:3000/invoices";

export interface CreateInvoiceData {
  invoiceNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  paymentMethod: "cod" | "bank_transfer" | "momo" | "vnpay";
  items: {
    product: {
      _id: string;
      title: string;
      thumbnail: string;
      category: string;
    };
    quantity: number;
    price: number;
    discount: number;
    total: number;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  note?: string;
}

export const createInvoice = async (data: CreateInvoiceData): Promise<ApiResponse<any>> => {
  try {
    console.log("Creating invoice with URL:", API_URL);
    console.log("Invoice data:", data);
    const response = await axios.post(API_URL, data);
    console.log("Invoice response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Invoice creation error:", error);
    console.error("Error response:", error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create invoice",
    };
  }
};

export const getInvoicesByUserId = async (userId: string): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch invoices",
    };
  }
};

export const getInvoiceByNumber = async (invoiceNumber: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API_URL}/${invoiceNumber}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch invoice",
    };
  }
};

export const cancelInvoice = async (invoiceNumber: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.patch(`${API_URL}/${invoiceNumber}/cancel`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to cancel invoice",
    };
  }
};
