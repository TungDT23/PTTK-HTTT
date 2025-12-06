import { createProduct, deleteProduct, updateProduct, getAllProducts } from "../../controllers/product.controller";
import { getAllInvoices } from "../../controllers/invoice.controller";
import { getAllUsers, getCurrentUser, updateUser } from "../../controllers/user.controller";
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../controllers/supplier.controller";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment,
} from "../../controllers/employee.controller";
import {
  getAllPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
  getInventoryTransactions,
  inventoryAdjustment,
} from "../../controllers/inventory.controller";
import {
  getAllSalaries,
  createSalary,
  createBulkSalaries,
  updateSalary,
  paySalary,
  getEmployeeSalaries,
} from "../../controllers/salary.controller";
import {
  getRevenueReport,
  getTopSellingProducts,
  getInventoryReport,
  getCustomerReport,
  getSalaryReport,
  getPurchaseReport,
  getDashboardStats,
} from "../../controllers/report.controller";
import { requireAdmin, requireEmployee, requirePosition } from "../../middlewares/auth.middleware";
import express from "express";
const router = express.Router();

// Product routes - Manager và Warehouse có thể quản lý sản phẩm
router.post("/products/new", requirePosition("manager", "warehouse"), createProduct);
router.patch("/products/edit", requirePosition("manager", "warehouse"), updateProduct);
router.delete("/products/delete/:id", requirePosition("manager"), deleteProduct);
router.get("/products", requireEmployee, getAllProducts);

// Dashboard routes - Tất cả nhân viên có thể xem
router.get("/me", requireEmployee, getCurrentUser);
router.get("/invoices", requireEmployee, getAllInvoices);
router.get("/users", requireEmployee, getAllUsers);
router.patch("/users/edit/:id", requireEmployee, updateUser);

// Supplier routes - Manager và Warehouse có thể quản lý nhà cung cấp
router.get("/suppliers", requireEmployee, getAllSuppliers);
router.get("/suppliers/:id", requireEmployee, getSupplierById);
router.post("/suppliers/new", requirePosition("manager", "warehouse"), createSupplier);
router.patch("/suppliers/edit/:id", requirePosition("manager", "warehouse"), updateSupplier);
router.delete("/suppliers/delete/:id", requirePosition("manager"), deleteSupplier);

// Employee routes - Chỉ Manager có thể quản lý nhân viên
router.get("/employees", requirePosition("manager"), getAllEmployees);
router.get("/employees/:id", requirePosition("manager"), getEmployeeById);
router.get("/employees/department/:department", requirePosition("manager"), getEmployeesByDepartment);
router.post("/employees/new", requirePosition("manager"), createEmployee);
router.patch("/employees/edit/:id", requirePosition("manager"), updateEmployee);
router.delete("/employees/delete/:id", requirePosition("manager"), deleteEmployee);

// Purchase Order & Inventory routes - Manager và Warehouse có quyền
router.get("/purchase-orders", requirePosition("manager", "warehouse"), getAllPurchaseOrders);
router.post("/purchase-orders/new", requirePosition("manager", "warehouse"), createPurchaseOrder);
router.patch("/purchase-orders/:id/status", requirePosition("manager", "warehouse"), updatePurchaseOrderStatus);
router.get("/inventory/transactions", requirePosition("manager", "warehouse", "accountant"), getInventoryTransactions);
router.post("/inventory/adjustment", requirePosition("manager", "warehouse"), inventoryAdjustment);

// Salary routes - Manager và Accountant có quyền
router.get("/salaries", requirePosition("manager", "accountant"), getAllSalaries);
router.get("/salaries/employee/:employeeId", requirePosition("manager", "accountant"), getEmployeeSalaries);
router.post("/salaries/new", requirePosition("manager", "accountant"), createSalary);
router.post("/salaries/bulk", requirePosition("manager", "accountant"), createBulkSalaries);
router.patch("/salaries/edit/:id", requirePosition("manager", "accountant"), updateSalary);
router.patch("/salaries/pay/:id", requirePosition("manager", "accountant"), paySalary);

// Report routes - Báo cáo & thống kê theo quyền
router.get("/reports/dashboard", requireEmployee, getDashboardStats);
router.get("/reports/revenue", requirePosition("manager", "accountant"), getRevenueReport);
router.get("/reports/top-products", requirePosition("manager", "sales", "warehouse"), getTopSellingProducts);
router.get("/reports/inventory", requirePosition("manager", "warehouse"), getInventoryReport);
router.get("/reports/customers", requirePosition("manager", "sales"), getCustomerReport);
router.get("/reports/salary", requirePosition("manager", "accountant"), getSalaryReport);
router.get("/reports/purchase", requirePosition("manager", "warehouse", "accountant"), getPurchaseReport);

export default router;
