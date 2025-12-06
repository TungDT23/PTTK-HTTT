import mongoose, { Document, Schema } from "mongoose";

export interface IEmployee extends Document {
  employeeCode: string;
  fullName: string;
  position: "manager" | "sales" | "warehouse" | "accountant";
  department: string;
  phone: string;
  email?: string;
  address: string;
  dateOfBirth?: Date;
  startDate: Date;
  salary: number;
  userId?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema: Schema = new Schema(
  {
    employeeCode: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    position: {
      type: String,
      enum: ["manager", "sales", "warehouse", "accountant"],
      required: true,
    },
    department: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    dateOfBirth: { type: Date },
    startDate: { type: Date, required: true },
    salary: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Employee = mongoose.model<IEmployee>("Employee", employeeSchema, "employees");
