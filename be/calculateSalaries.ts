import mongoose from "mongoose";
import { Employee } from "./src/models/employee.model";
import { Salary } from "./src/models/salary.model";
import dotenv from "dotenv";

dotenv.config();

const calculateSalaries = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB\n");

    // Lấy tất cả nhân viên active
    const employees = await Employee.find({ isActive: true });
    console.log(`📊 Tìm thấy ${employees.length} nhân viên đang làm việc\n`);

    if (employees.length === 0) {
      console.log("❌ Không có nhân viên nào!");
      process.exit(0);
    }

    // Tính lương từ tháng nhân viên bắt đầu làm việc đến tháng hiện tại
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    let totalSalariesCreated = 0;

    for (const employee of employees) {
      const startDate = new Date(employee.startDate);
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;

      console.log(`\n👤 Nhân viên: ${employee.fullName} (${employee.employeeCode})`);
      console.log(`   Chức vụ: ${employee.position}`);
      console.log(`   Lương cơ bản: ${employee.salary.toLocaleString("vi-VN")} đ/tháng`);
      console.log(`   Ngày vào làm: ${startDate.toLocaleDateString("vi-VN")}`);

      // Tính từ tháng bắt đầu làm việc
      let year = startYear;
      let month = startMonth;
      let monthCount = 0;

      while (
        year < currentYear ||
        (year === currentYear && month <= currentMonth)
      ) {
        // Kiểm tra xem đã có bảng lương cho tháng này chưa
        const existingSalary = await Salary.findOne({
          employeeId: employee._id,
          month,
          year,
        });

        if (existingSalary) {
          console.log(`   ⏭️  Tháng ${month}/${year}: Đã có`);
        } else {
          // Tính thưởng và phụ cấp dựa trên chức vụ và hiệu suất
          let bonus = 0;
          let overtime = 0;
          let deduction = 0;

          // Logic thưởng theo chức vụ
          if (employee.position === "manager") {
            bonus = Math.floor(employee.salary * 0.2); // Manager: +20% thưởng
            overtime = Math.floor(Math.random() * 3000000); // Tăng ca ngẫu nhiên
          } else if (employee.position === "sales") {
            bonus = Math.floor(employee.salary * 0.15); // Sales: +15% thưởng doanh số
            overtime = Math.floor(Math.random() * 2000000);
          } else if (employee.position === "warehouse") {
            bonus = Math.floor(employee.salary * 0.1); // Warehouse: +10% thưởng
            overtime = Math.floor(Math.random() * 2500000);
          } else if (employee.position === "accountant") {
            bonus = Math.floor(employee.salary * 0.12); // Accountant: +12% thưởng
            overtime = Math.floor(Math.random() * 1500000);
          }

          // Phạt ngẫu nhiên (10% khả năng bị phạt)
          if (Math.random() < 0.1) {
            deduction = Math.floor(Math.random() * 500000);
          }

          const totalSalary =
            employee.salary + bonus + overtime - deduction;

          // Tạo bảng lương
          const newSalary = new Salary({
            employeeId: employee._id,
            month,
            year,
            baseSalary: employee.salary,
            bonus,
            deduction,
            overtime,
            totalSalary,
            status: month === currentMonth && year === currentYear ? "pending" : "paid",
            paidDate:
              month === currentMonth && year === currentYear
                ? undefined
                : new Date(year, month, 5), // Ngày 5 hàng tháng
            note:
              month === currentMonth && year === currentYear
                ? "Lương tháng hiện tại"
                : "Đã thanh toán",
          });

          await newSalary.save();
          totalSalariesCreated++;

          const statusIcon = newSalary.status === "paid" ? "✅" : "⏳";
          console.log(
            `   ${statusIcon} Tháng ${month}/${year}: ${totalSalary.toLocaleString("vi-VN")} đ (Thưởng: ${bonus.toLocaleString("vi-VN")}, Tăng ca: ${overtime.toLocaleString("vi-VN")}, Phạt: ${deduction.toLocaleString("vi-VN")})`
          );

          monthCount++;
        }

        // Chuyển sang tháng tiếp theo
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
      }

      console.log(`   📝 Đã tạo ${monthCount} bảng lương mới`);
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✅ HOÀN TẤT: Đã tạo tổng cộng ${totalSalariesCreated} bảng lương`);
    console.log("=".repeat(60));

    // Thống kê tổng
    const totalPending = await Salary.countDocuments({ status: "pending" });
    const totalPaid = await Salary.countDocuments({ status: "paid" });
    const totalSalaries = await Salary.countDocuments();

    console.log(`\n📊 THỐNG KÊ:`);
    console.log(`   - Tổng số bảng lương: ${totalSalaries}`);
    console.log(`   - Đã thanh toán: ${totalPaid}`);
    console.log(`   - Chờ thanh toán: ${totalPending}`);

    const totalAmount = await Salary.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalSalary" },
        },
      },
    ]);

    if (totalAmount.length > 0) {
      console.log(
        `   - Tổng tiền lương: ${totalAmount[0].total.toLocaleString("vi-VN")} đ`
      );
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

calculateSalaries();
