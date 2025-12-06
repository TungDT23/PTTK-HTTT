import mongoose, { Document, Schema } from "mongoose";

export interface ISupplier extends Document {
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  taxCode?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const supplierSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    taxCode: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Supplier = mongoose.model<ISupplier>("Supplier", supplierSchema, "suppliers");
