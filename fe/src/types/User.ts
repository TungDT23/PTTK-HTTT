export interface User {
  id: string;
  username: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role: "admin" | "user";
}

export interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  email?: string;
  phone?: string;
}