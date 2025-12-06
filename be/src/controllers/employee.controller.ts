import { Request, Response } from "express";
import { Employee } from "../models/employee.model";

// Lấy tất cả nhân viên
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách nhân viên",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Lấy thông tin nhân viên theo ID
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id).populate("userId", "username email");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên",
      });
    }

    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin nhân viên",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Tạo nhân viên mới
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employeeData = req.body;

    // Generate employee code tự động
    const lastEmployee = await Employee.findOne().sort({ employeeCode: -1 });
    let newCode = "NV0001";
    if (lastEmployee) {
      const lastCode = parseInt(lastEmployee.employeeCode.substring(2));
      newCode = `NV${String(lastCode + 1).padStart(4, "0")}`;
    }

    const employee = new Employee({
      ...employeeData,
      employeeCode: newCode,
    });
    await employee.save();

    res.status(201).json({
      success: true,
      message: "Thêm nhân viên thành công",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm nhân viên",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Cập nhật nhân viên
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const employee = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật nhân viên thành công",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật nhân viên",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Xóa nhân viên (soft delete)
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên",
      });
    }

    res.json({
      success: true,
      message: "Xóa nhân viên thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa nhân viên",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Lấy nhân viên theo phòng ban
export const getEmployeesByDepartment = async (req: Request, res: Response) => {
  try {
    const { department } = req.params;
    const employees = await Employee.find({ department, isActive: true });

    res.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách nhân viên",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
