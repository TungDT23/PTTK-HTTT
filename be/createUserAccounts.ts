import mongoose from "mongoose";
import { User } from "./src/models/user.model";
import { Employee } from "./src/models/employee.model";
import dotenv from "dotenv";

dotenv.config();

const createUserAccounts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB\n");

    // Get all employees
    const employees = await Employee.find();
    
    if (employees.length === 0) {
      console.log("❌ Không có nhân viên nào!");
      process.exit(0);
    }

    console.log(`📋 Tìm thấy ${employees.length} nhân viên\n`);

    // Create user accounts for employees
    for (const emp of employees) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: emp.email });
      
      if (existingUser) {
        console.log(`⚠️  ${emp.fullName} đã có tài khoản: ${emp.email}`);
        
        // Update employee to link with user
        if (!emp.userId) {
          emp.userId = existingUser._id;
          await emp.save();
          console.log(`   ✅ Đã liên kết employee với user`);
        }
      } else {
        // Create new user - Generate username from email
        const username = emp.email.split('@')[0];
        const newUser = await User.create({
          username: username,
          fullName: emp.fullName,
          email: emp.email,
          password: "123456", // Default password
          role: "admin",
        });

        // Update employee with userId
        emp.userId = newUser._id;
        await emp.save();

        console.log(`✅ ${emp.fullName} - ${emp.email}`);
        console.log(`   Chức vụ: ${emp.position}`);
        console.log(`   Password: 123456\n`);
      }
    }

    console.log("\n🎉 HOÀN TẤT! Danh sách đăng nhập:");
    console.log("================================");
    
    const allEmployees = await Employee.find().populate("userId");
    allEmployees.forEach((emp) => {
      console.log(`${emp.fullName} (${emp.position})`);
      console.log(`Email: ${emp.email}`);
      console.log(`Password: 123456\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createUserAccounts();
