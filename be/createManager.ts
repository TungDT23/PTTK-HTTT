import mongoose from "mongoose";
import { User } from "./src/models/user.model";
import { Employee } from "./src/models/employee.model";
import dotenv from "dotenv";

dotenv.config();

const createManagerAccount = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB\n");

    // Check if manager user already exists
    let managerUser = await User.findOne({ username: "manager" });
    
    if (managerUser) {
      // Check if employee record exists
      const existingManager = await Employee.findOne({ userId: managerUser._id });
      
      if (existingManager) {
        console.log("⚠️  Tài khoản Manager đã tồn tại:");
        console.log(`   Họ tên: ${existingManager.fullName}`);
        console.log(`   Mã NV: ${existingManager.employeeCode}`);
        console.log(`   Email: ${existingManager.email}`);
        console.log(`   Username: manager`);
        console.log(`   Password: 123456`);
        process.exit(0);
      }
      // User exists but no employee record, will create employee below
    } else {
      // Create user for manager
      managerUser = await User.create({
        username: "manager",
        password: "123456",
        fullName: "Nguyễn Văn Quản Lý",
        email: "manager@bookstore.com",
        phone: "0901234567",
        role: "admin",
        isActive: true,
      });
    }

    // Generate employee code
    const lastEmployee = await Employee.findOne().sort({ employeeCode: -1 });
    let newCode = "NV0001";
    if (lastEmployee) {
      const lastCode = parseInt(lastEmployee.employeeCode.substring(2));
      newCode = `NV${String(lastCode + 1).padStart(4, "0")}`;
    }

    // Create employee record
    const manager = await Employee.create({
      employeeCode: newCode,
      fullName: "Nguyễn Văn Quản Lý",
      position: "manager",
      department: "Quản lý",
      phone: "0901234567",
      email: "manager@bookstore.com",
      address: "123 Nguyễn Huệ, Q.1, TP.HCM",
      dateOfBirth: new Date("1985-01-15"),
      startDate: new Date("2020-01-01"),
      salary: 25000000,
      userId: managerUser._id,
      isActive: true,
    });

    console.log("✅ Đã tạo tài khoản Manager thành công!\n");
    console.log("📋 THÔNG TIN ĐĂNG NHẬP:");
    console.log("================================");
    console.log("Username: manager");
    console.log("Email: manager@bookstore.com");
    console.log("Password: 123456");
    console.log(`Mã NV: ${manager.employeeCode}`);
    console.log("Chức vụ: Manager (Quản lý)");
    console.log("Phòng ban: Quản lý");
    console.log("Lương: 25.000.000 VNĐ");
    console.log("\n⚠️  QUYỀN HẠN:");
    console.log("- Toàn quyền quản lý nhân viên, nhà cung cấp, sản phẩm");
    console.log("- Truy cập tất cả báo cáo và thống kê");
    console.log("- Quản lý kho và đơn nhập hàng");
    console.log("\n🌐 Đăng nhập tại: http://localhost:5174/login");

    process.exit(0);
  } catch (error) {
    console.error("Error creating manager:", error);
    process.exit(1);
  }
};

createManagerAccount();
