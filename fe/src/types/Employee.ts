export interface Employee {
  _id: string;
  employeeCode: string;
  fullName: string;
  position: "manager" | "sales" | "warehouse" | "accountant";
  department: string;
  phone: string;
  email?: string;
  address: string;
  dateOfBirth?: string;
  startDate: string;
  salary: number;
  userId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
