export interface Salary {
  _id: string;
  employeeId: {
    _id: string;
    fullName: string;
    employeeCode: string;
    position: string;
    department: string;
  };
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  deduction: number;
  overtime: number;
  totalSalary: number;
  status: "pending" | "paid";
  paidDate?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
