import mongoose, { Document, Schema } from "mongoose";

export interface IInvoiceItem {
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
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  userId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  paymentMethod: "cod" | "bank_transfer" | "momo" | "vnpay";
  items: IInvoiceItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "pending" | "shipping" | "delivered" | "cancelled";
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceItemSchema = new Schema({
  product: {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String, required: true },
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
});

const invoiceSchema: Schema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    customerAddress: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "bank_transfer", "momo", "vnpay"],
      required: true,
    },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "shipping", "delivered", "cancelled"],
      default: "pending",
    },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Invoice = mongoose.model<IInvoice>("Invoice", invoiceSchema, "invoices");

export default Invoice;
