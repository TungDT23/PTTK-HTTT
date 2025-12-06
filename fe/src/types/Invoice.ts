import type { Product } from "./Product";

export interface InvoiceItem {
  product: Product;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'cod' | 'bank_transfer' | 'momo' | 'vnpay';
  status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CheckoutForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  paymentMethod: 'cod' | 'bank_transfer' | 'momo' | 'vnpay';
  note: string;
}