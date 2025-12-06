import mongoose from "mongoose";
import { Employee } from "./src/models/employee.model";
import { User } from "./src/models/user.model";
import dotenv from "dotenv";

dotenv.config();

const seedEmployees = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB");

    // Check if employees already exist
    const existingEmployees = await Employee.find();
    if (existingEmployees.length > 0) {
      console.log("Employees already exist!");
      process.exit(0);
    }

    // Create admin users for employees
    const users = [
      {
        fullName: "Nguyễn Văn Quản",
        email: "manager@bookstore.com",
        password: "123456",
        role: "admin",
      },
      {
        fullName: "Trần Thị Bán",
        email: "sales@bookstore.com",
        password: "123456",
        role: "admin",
      },
      {
        fullName: "Lê Văn Kho",
        email: "warehouse@bookstore.com",
        password: "123456",
        role: "admin",
      },
      {
        fullName: "Phạm Thị Toán",
        email: "accountant@bookstore.com",
        password: "123456",
        role: "admin",
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log("✅ Created 4 admin users");

    // Create employee records
    const employees = [
      {
        fullName: "Nguyễn Văn Quản",
        position: "manager",
        department: "Quản lý",
        phone: "0901234567",
        email: "manager@bookstore.com",
        address: "123 Nguyễn Huệ, Q.1, TP.HCM",
        dateOfBirth: new Date("1985-01-15"),
        startDate: new Date("2020-01-01"),
        salary: 20000000,
        userId: createdUsers[0]._id,
        isActive: true,
      },
      {
        fullName: "Trần Thị Bán",
        position: "sales",
        department: "Bán hàng",
        phone: "0901234568",
        email: "sales@bookstore.com",
        address: "456 Lê Lợi, Q.1, TP.HCM",
        dateOfBirth: new Date("1990-05-20"),
        startDate: new Date("2021-03-15"),
        salary: 12000000,
        userId: createdUsers[1]._id,
        isActive: true,
      },
      {
        fullName: "Lê Văn Kho",
        position: "warehouse",
        department: "Kho",
        phone: "0901234569",
        email: "warehouse@bookstore.com",
        address: "789 Võ Văn Tần, Q.3, TP.HCM",
        dateOfBirth: new Date("1988-08-10"),
        startDate: new Date("2020-06-01"),
        salary: 10000000,
        userId: createdUsers[2]._id,
        isActive: true,
      },
      {
        fullName: "Phạm Thị Toán",
        position: "accountant",
        department: "Kế toán",
        phone: "0901234570",
        email: "accountant@bookstore.com",
        address: "321 Pasteur, Q.1, TP.HCM",
        dateOfBirth: new Date("1992-12-25"),
        startDate: new Date("2021-09-01"),
        salary: 15000000,
        userId: createdUsers[3]._id,
        isActive: true,
      },
    ];

    await Employee.insertMany(employees);
    console.log("✅ Successfully created 4 employees:");
    console.log("   - Manager: manager@bookstore.com / 123456");
    console.log("   - Sales: sales@bookstore.com / 123456");
    console.log("   - Warehouse: warehouse@bookstore.com / 123456");
    console.log("   - Accountant: accountant@bookstore.com / 123456");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding employees:", error);
    process.exit(1);
  }
};

seedEmployees();
