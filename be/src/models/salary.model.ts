import mongoose, { Document, Schema } from "mongoose";

export interface ISalary extends Document {
  employeeId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  deduction: number;
  overtime: number;
  totalSalary: number;
  status: "pending" | "paid";
  paidDate?: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const salarySchema: Schema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    baseSalary: { type: Number, required: true },
    bonus: { type: Number, default: 0 },
    deduction: { type: Number, default: 0 },
    overtime: { type: Number, default: 0 },
    totalSalary: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    paidDate: { type: Date },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

// Đảm bảo không trùng lương cho cùng nhân viên trong cùng tháng/năm
salarySchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

export const Salary = mongoose.model<ISalary>("Salary", salarySchema, "salaries");
