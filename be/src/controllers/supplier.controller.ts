import { Request, Response } from "express";
import { Supplier } from "../models/supplier.model";

// Lấy tất cả nhà cung cấp
export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách nhà cung cấp",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Lấy thông tin nhà cung cấp theo ID
export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhà cung cấp",
      });
    }

    res.json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin nhà cung cấp",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Tạo nhà cung cấp mới
export const createSupplier = async (req: Request, res: Response) => {
  try {
    const supplierData = req.body;
    const supplier = new Supplier(supplierData);
    await supplier.save();

    res.status(201).json({
      success: true,
      message: "Thêm nhà cung cấp thành công",
      data: supplier,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm nhà cung cấp",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Cập nhật nhà cung cấp
export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const supplier = await Supplier.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhà cung cấp",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật nhà cung cấp thành công",
      data: supplier,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật nhà cung cấp",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Xóa nhà cung cấp (soft delete)
export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhà cung cấp",
      });
    }

    res.json({
      success: true,
      message: "Xóa nhà cung cấp thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa nhà cung cấp",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
