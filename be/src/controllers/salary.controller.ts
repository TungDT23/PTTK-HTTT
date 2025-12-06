import { Request, Response } from "express";
import { Salary } from "../models/salary.model";
import { Employee } from "../models/employee.model";

// Lấy tất cả bảng lương
export const getAllSalaries = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;
    const query: any = {};

    if (month) query.month = parseInt(month as string);
    if (year) query.year = parseInt(year as string);

    const salaries = await Salary.find(query)
      .populate("employeeId", "fullName employeeCode position department")
      .sort({ year: -1, month: -1, createdAt: -1 });

    res.json({
      success: true,
      data: salaries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách lương",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Tạo bảng lương cho nhân viên
export const createSalary = async (req: Request, res: Response) => {
  try {
    const salaryData = req.body;

    // Kiểm tra xem đã có bảng lương cho tháng này chưa
    const existingSalary = await Salary.findOne({
      employeeId: salaryData.employeeId,
      month: salaryData.month,
      year: salaryData.year,
    });

    if (existingSalary) {
      return res.status(400).json({
        success: false,
        message: "Bảng lương cho tháng này đã tồn tại",
      });
    }

    // Tính tổng lương
    const totalSalary =
      salaryData.baseSalary +
      salaryData.bonus +
      salaryData.overtime -
      salaryData.deduction;

    const salary = new Salary({
      ...salaryData,
      totalSalary,
    });
    await salary.save();

    res.status(201).json({
      success: true,
      message: "Tạo bảng lương thành công",
      data: salary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo bảng lương",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Tạo bảng lương hàng loạt cho tất cả nhân viên
export const createBulkSalaries = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.body;

    const employees = await Employee.find({ isActive: true });

    const salaries = [];
    for (const employee of employees) {
      // Kiểm tra xem đã có bảng lương chưa
      const existingSalary = await Salary.findOne({
        employeeId: employee._id,
        month,
        year,
      });

      if (!existingSalary) {
        const salary = new Salary({
          employeeId: employee._id,
          month,
          year,
          baseSalary: employee.salary,
          bonus: 0,
          deduction: 0,
          overtime: 0,
          totalSalary: employee.salary,
          status: "pending",
        });
        await salary.save();
        salaries.push(salary);
      }
    }

    res.status(201).json({
      success: true,
      message: `Tạo ${salaries.length} bảng lương thành công`,
      data: salaries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo bảng lương hàng loạt",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Cập nhật bảng lương
export const updateSalary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Tính lại tổng lương nếu có thay đổi
    if (
      updateData.baseSalary !== undefined ||
      updateData.bonus !== undefined ||
      updateData.overtime !== undefined ||
      updateData.deduction !== undefined
    ) {
      const salary = await Salary.findById(id);
      if (salary) {
        updateData.totalSalary =
          (updateData.baseSalary ?? salary.baseSalary) +
          (updateData.bonus ?? salary.bonus) +
          (updateData.overtime ?? salary.overtime) -
          (updateData.deduction ?? salary.deduction);
      }
    }

    const salary = await Salary.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bảng lương",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật bảng lương thành công",
      data: salary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật bảng lương",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Thanh toán lương
export const paySalary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const salary = await Salary.findByIdAndUpdate(
      id,
      {
        status: "paid",
        paidDate: new Date(),
      },
      { new: true }
    );

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bảng lương",
      });
    }

    res.json({
      success: true,
      message: "Thanh toán lương thành công",
      data: salary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi thanh toán lương",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Lấy bảng lương của nhân viên
export const getEmployeeSalaries = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;

    const salaries = await Salary.find({ employeeId }).sort({
      year: -1,
      month: -1,
    });

    res.json({
      success: true,
      data: salaries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy lịch sử lương",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
