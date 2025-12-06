import { Routes, Route, Navigate } from "react-router-dom";
import ClientLayout from "@/layouts/ClientLayout";
import AdminLayout from "@/layouts/AdminLayout";
import HomePage from "@/pages/client/Home";
import AboutPage from "@/pages/client/About";
import Login from "@/pages/common/Login";
import Register from "@/pages/common/Register";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Product from "./pages/admin/Product";
import EditProduct from "./pages/admin/EditProduct";
import CreateProduct from "./pages/admin/CreateProduct";
import Dashboard from "./pages/admin/Dashboard";
import Employee from "./pages/admin/Employee";
import CreateEmployee from "./pages/admin/CreateEmployee";
import EditEmployee from "./pages/admin/EditEmployee";
import Supplier from "./pages/admin/Supplier";
import CreateSupplier from "./pages/admin/CreateSupplier";
import EditSupplier from "./pages/admin/EditSupplier";
import Inventory from "./pages/admin/Inventory";
import Salary from "./pages/admin/Salary";
import CalculateSalary from "./pages/admin/CalculateSalary";

import CartPage from "@/pages/client/Cart";
import InvoicePage from "@/pages/client/Invoice";
import ProfilePage from "@/pages/client/Profile";

import { PermissionProvider } from "@/contexts/PermissionContext";
import { ToastContainer } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { createContext, useContext, useEffect } from "react";
import type { ToastType } from "@/components/Toast";

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useAppToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAppToast must be used within ToastProvider");
  }
  return context;
};

function App() {
  const user = useSelector((state: RootState) => state.user.user);
  const toast = useToast();

  useEffect(() => {
    const handleToastEvent = (e: any) => {
      const { message, type } = e.detail;
      toast.addToast(message, type);
    };
    window.addEventListener('showToast', handleToastEvent);
    return () => window.removeEventListener('showToast', handleToastEvent);
  }, [toast]);

  return (
    <ToastContext.Provider value={toast}>
      <PermissionProvider>
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
        <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="/invoice" element={<InvoicePage />} />

        {user?.role === "admin" && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Product />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="products/new" element={<CreateProduct />} />
            <Route path="employees" element={<Employee />} />
            <Route path="employees/new" element={<CreateEmployee />} />
            <Route path="employees/edit/:id" element={<EditEmployee />} />
            <Route path="suppliers" element={<Supplier />} />
            <Route path="suppliers/new" element={<CreateSupplier />} />
            <Route path="suppliers/edit/:id" element={<EditSupplier />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="salaries" element={<Salary />} />
            <Route path="salaries/calculate" element={<CalculateSalary />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </PermissionProvider>
    </ToastContext.Provider>
  );
}

export default App;
