import mongoose, { Document, Schema } from "mongoose";

export interface IPurchaseOrderItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IPurchaseOrder extends Document {
  orderNumber: string;
  supplierId: mongoose.Types.ObjectId;
  employeeId?: mongoose.Types.ObjectId;
  items: IPurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "approved" | "received" | "cancelled";
  orderDate: Date;
  expectedDate?: Date;
  receivedDate?: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const purchaseOrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const purchaseOrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee" },
    items: [purchaseOrderItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "received", "cancelled"],
      default: "pending",
    },
    orderDate: { type: Date, default: Date.now },
    expectedDate: { type: Date },
    receivedDate: { type: Date },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

export const PurchaseOrder = mongoose.model<IPurchaseOrder>(
  "PurchaseOrder",
  purchaseOrderSchema,
  "purchase_orders"
);
