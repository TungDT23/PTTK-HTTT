import { Request, Response } from "express";
import { Invoice } from "../models/invoice.model";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";
import { Salary } from "../models/salary.model";
import { PurchaseOrder } from "../models/purchaseOrder.model";
import { InventoryTransaction } from "../models/inventoryTransaction.model";

// Báo cáo doanh thu theo thời gian
export const getRevenueReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.query;

    const matchStage: any = {
      status: { $in: ["shipping", "delivered"] },
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate as string);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate as string);
    }

    let groupId: any;
    if (groupBy === "month") {
      groupId = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    } else if (groupBy === "year") {
      groupId = { year: { $year: "$createdAt" } };
    } else {
      groupId = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    }

    const revenue = await Invoice.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupId,
          totalRevenue: { $sum: "$total" },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: "$total" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
    ]);

    res.json({
      success: true,
      data: revenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy báo cáo doanh thu",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Báo cáo sản phẩm bán chạy
export const getTopSellingProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;

    const matchStage: any = {
      status: { $in: ["shipping", "delivered"] },
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate as string);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate as string);
    }

    const topProducts = await Invoice.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product._id",
          productName: { $first: "$items.product.title" },
          thumbnail: { $first: "$items.product.thumbnail" },
          category: { $first: "$items.product.category" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.total" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit as string) },
    ]);

    res.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy báo cáo sản phẩm bán chạy",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Báo cáo tồn kho
export const getInventoryReport = async (req: Request, res: Response) => {
  try {
    const { category, lowStock } = req.query;
    const query: any = { isActive: true };

    if (category) query.category = category;
    if (lowStock === "true") query.stock = { $lte: 10 };

    const products = await Product.find(query)
      .select("title category stock price thumbnail")
      .sort({ stock: 1 });

    const summary = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          totalValue: { $sum: { $multiply: ["$stock", "$price"] } },
          lowStockCount: {
            $sum: { $cond: [{ $lte: ["$stock", 10] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        products,
        summary,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy báo cáo tồn kho",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Báo cáo khách hàng
export const getCustomerReport = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const topCustomers = await Invoice.aggregate([
      { $match: { status: { $in: ["shipping", "delivered"] } } },
      {
        $group: {
          _id: "$userId",
          customerName: { $first: "$customerName" },
          customerEmail: { $first: "$customerEmail" },
          customerPhone: { $first: "$customerPhone" },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$total" },
          avgOrderValue: { $avg: "$total" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: parseInt(limit as string) },
    ]);

    const totalCustomers = await User.countDocuments({ role: "user" });

    res.json({
      success: true,
      data: {
        topCustomers,
        totalCustomers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy báo cáo khách hàng",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Báo cáo lương nhân viên
export const getSalaryReport = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;

    const query: any = {};
    if (month) query.month = parseInt(month as string);
    if (year) query.year = parseInt(year as string);

    const salaries = await Salary.find(query)
      .populate("employeeId", "fullName employeeCode position department")
      .sort({ totalSalary: -1 });

    const summary = await Salary.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalBaseSalary: { $sum: "$baseSalary" },
          totalBonus: { $sum: "$bonus" },
          totalDeduction: { $sum: "$deduction" },
          totalOvertime: { $sum: "$overtime" },
          totalSalary: { $sum: "$totalSalary" },
          paidCount: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] } },
          pendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        salaries,
        summary: summary[0] || {},
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy báo cáo lương",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Báo cáo nhập hàng
export const getPurchaseReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage: any = { status: "received" };

    if (startDate || endDate) {
      matchStage.receivedDate = {};
      if (startDate)
        matchStage.receivedDate.$gte = new Date(startDate as string);
      if (endDate) matchStage.receivedDate.$lte = new Date(endDate as string);
    }

    const purchases = await PurchaseOrder.find(matchStage)
      .populate("supplierId", "name")
      .populate("employeeId", "fullName")
      .sort({ receivedDate: -1 });

    const summary = await PurchaseOrder.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$total" },
          totalTax: { $sum: "$tax" },
          avgOrderValue: { $avg: "$total" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        purchases,
        summary: summary[0] || {},
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy báo cáo nhập hàng",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Dashboard tổng quan
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Doanh thu tháng này
    const currentMonthRevenue = await Invoice.aggregate([
      {
        $match: {
          status: { $in: ["shipping", "delivered"] },
          createdAt: { $gte: startOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
    ]);

    // Doanh thu tháng trước
    const lastMonthRevenue = await Invoice.aggregate([
      {
        $match: {
          status: { $in: ["shipping", "delivered"] },
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    // Tổng số sản phẩm và giá trị tồn kho
    const inventoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          totalValue: { $sum: { $multiply: ["$stock", "$price"] } },
          lowStockCount: {
            $sum: { $cond: [{ $lte: ["$stock", 10] }, 1, 0] },
          },
        },
      },
    ]);

    // Tổng khách hàng
    const totalCustomers = await User.countDocuments({ role: "user" });

    // Đơn hàng đang xử lý
    const pendingOrders = await Invoice.countDocuments({ status: "pending" });

    res.json({
      success: true,
      data: {
        revenue: {
          current: currentMonthRevenue[0]?.total || 0,
          last: lastMonthRevenue[0]?.total || 0,
          orderCount: currentMonthRevenue[0]?.count || 0,
        },
        inventory: inventoryStats[0] || {},
        totalCustomers,
        pendingOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thống kê dashboard",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
