import mongoose from "mongoose";
import { User } from "./src/models/user.model";
import dotenv from "dotenv";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB\n");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("⚠️  Tài khoản admin đã tồn tại!");
      console.log(`   Email: ${existingAdmin.email || "Chưa có"}`);
      console.log(`   Họ tên: ${existingAdmin.fullName || "Admin"}`);
      console.log("\n🔐 Đăng nhập:");
      console.log("   Username: admin");
      console.log("   Password: admin (hoặc password hiện tại)");
      process.exit(0);
    }

    // Create super admin
    const admin = await User.create({
      username: "admin",
      password: "admin",
      fullName: "Super Admin",
      email: "admin@bookstore.com",
      role: "admin",
      isActive: true,
    });

    console.log("✅ Đã tạo tài khoản Super Admin thành công!\n");
    console.log("📋 THÔNG TIN ĐĂNG NHẬP:");
    console.log("================================");
    console.log("Username: admin");
    console.log("Password: admin");
    console.log("Email: admin@bookstore.com");
    console.log("Quyền hạn: TOÀN QUYỀN (Super Admin)");
    console.log("\n⚠️  LƯU Ý:");
    console.log("- Tài khoản này có quyền truy cập TẤT CẢ chức năng");
    console.log("- Không bị giới hạn bởi phân quyền nhân viên");
    console.log("- Vui lòng ĐỔI MẬT KHẨU sau lần đăng nhập đầu tiên");
    console.log("\n🌐 Đăng nhập tại: http://localhost:5174/login");

    process.exit(0);
  } catch (error) {
    console.error("Error creating super admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();
