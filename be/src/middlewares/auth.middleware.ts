import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { Employee } from "../models/employee.model";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      employee?: any;
    }
  }
}

// Middleware to check if user is authenticated
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.cookies.userId;
    console.log("requireAuth - userId from cookie:", userId);
    console.log("requireAuth - all cookies:", req.cookies);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please login",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// Middleware to check if user is admin
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please login",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Admin access required",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// Middleware to check if user is employee
export const requireEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please login",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Employee access required",
      });
    }

    // Nếu username là "admin" thì có toàn quyền
    if (user.username === "admin") {
      req.user = user;
      req.employee = { position: "admin", isAdmin: true };
      return next();
    }

    // Find employee record
    const employee = await Employee.findOne({ userId: user._id });

    if (!employee) {
      return res.status(403).json({
        success: false,
        message: "Employee record not found",
      });
    }

    req.user = user;
    req.employee = employee;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// Middleware to check employee position
export const requirePosition = (...positions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.cookies.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - Please login",
        });
      }

      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Forbidden - Employee access required",
        });
      }

      // Nếu username là "admin" thì có toàn quyền, bỏ qua kiểm tra position
      if (user.username === "admin") {
        req.user = user;
        req.employee = { position: "admin", isAdmin: true };
        return next();
      }

      // Find employee record
      const employee = await Employee.findOne({ userId: user._id });

      if (!employee) {
        return res.status(403).json({
          success: false,
          message: "Employee record not found",
        });
      }

      // Check if employee position is allowed
      if (!positions.includes(employee.position)) {
        return res.status(403).json({
          success: false,
          message: `Forbidden - Requires one of: ${positions.join(", ")}`,
        });
      }

      req.user = user;
      req.employee = employee;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Authentication error",
      });
    }
  };
};
