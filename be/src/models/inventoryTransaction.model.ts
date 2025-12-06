import mongoose, { Document, Schema } from "mongoose";

export interface IInventoryTransaction extends Document {
  transactionNumber: string;
  productId: mongoose.Types.ObjectId;
  type: "import" | "export" | "adjustment";
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceType?: "purchase_order" | "invoice" | "manual";
  referenceId?: string;
  employeeId?: mongoose.Types.ObjectId;
  note?: string;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inventoryTransactionSchema: Schema = new Schema(
  {
    transactionNumber: { type: String, required: true, unique: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    type: { type: String, enum: ["import", "export", "adjustment"], required: true },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    referenceType: { type: String, enum: ["purchase_order", "invoice", "manual"] },
    referenceId: { type: String },
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee" },
    note: { type: String },
    transactionDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const InventoryTransaction = mongoose.model<IInventoryTransaction>(
  "InventoryTransaction",
  inventoryTransactionSchema,
  "inventory_transactions"
);
