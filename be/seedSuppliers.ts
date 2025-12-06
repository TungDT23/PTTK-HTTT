import mongoose from "mongoose";
import { Supplier } from "./src/models/supplier.model";
import dotenv from "dotenv";

dotenv.config();

const seedSuppliers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB");

    // Check if new suppliers already exist
    const newSuppliers = await Supplier.find({
      name: { 
        $in: [
          "Công ty Cổ phần Sách Phương Nam",
          "Công ty Văn hóa Đông A"
        ] 
      },
    });

    if (newSuppliers.length > 0) {
      console.log("New book suppliers already exist!");
      process.exit(0);
    }

    // Create only new suppliers
    const suppliers = [
      {
        name: "Công ty Cổ phần Sách Phương Nam",
        contactPerson: "Lê Văn Nam",
        phone: "02839316211",
        email: "info@phuongnambook.com.vn",
        address: "324A Lũy Bán Bích, Phường Hòa Thạnh, Quận Tân Phú, TP.HCM",
        taxCode: "0301007703",
        isActive: true,
      },
      {
        name: "Công ty Văn hóa Đông A",
        contactPerson: "Phạm Thị Đông",
        phone: "02838434300",
        email: "dongapub@hcm.vnn.vn",
        address: "18 Đường D2, Phường 25, Quận Bình Thạnh, TP.HCM",
        taxCode: "0300574539",
        isActive: true,
      },
    ];

    await Supplier.insertMany(suppliers);
    console.log("✅ Successfully created 2 new book suppliers: Phương Nam and Đông A");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding suppliers:", error);
    process.exit(1);
  }
};

seedSuppliers();
