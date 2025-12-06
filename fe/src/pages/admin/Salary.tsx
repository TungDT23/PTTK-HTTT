import { useEffect, useState } from "react";
import { getAllSalaries, paySalary } from "@/services/SalaryService";
import { getAllEmployees } from "@/services/EmployeeService";
import type { Salary } from "@/types/Salary";
import type { Employee } from "@/types/Employee";
import type { ApiResponse } from "@/types/Response";
import { DollarSign, Plus, CheckCircle, Clock, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmployeePermission } from "@/hooks/useEmployeePermission";
import Forbidden from "@/pages/common/Forbidden";
import { useAppToast } from "@/App";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const SalaryPage = () => {
  const toast = useAppToast();
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [confirmPaySalary, setConfirmPaySalary] = useState<string | null>(null);
  const navigate = useNavigate();

  const { loading: permissionLoading, hasPermission } = useEmployeePermission(["manager", "accountant"]);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salaryResponse, employeeResponse]: [
        ApiResponse<Salary[]>,
        ApiResponse<Employee[]>
      ] = await Promise.all([
        getAllSalaries(selectedMonth, selectedYear),
        getAllEmployees(),
      ]);

      if (salaryResponse.success && salaryResponse.data) {
        setSalaries(salaryResponse.data);
      }
      if (employeeResponse.success && employeeResponse.data) {
        setEmployees(employeeResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Có lỗi khi tải dữ liệu lương!");
    } finally {
      setLoading(false);
    }
  };

  const handlePaySalary = async (id: string) => {
    try {
      await paySalary(id);
      toast.success("Thanh toán lương thành công!");
      await fetchData();
    } catch (error) {
      console.error("Error paying salary:", error);
      toast.error("Có lỗi xảy ra khi thanh toán lương!");
    }
  };

  const getEmployeeName = (employeeId: any) => {
    if (employeeId?.fullName) return employeeId.fullName;
    const emp = employees.find((e) => e._id === employeeId);
    return emp?.fullName || "N/A";
  };

  const getEmployeeCode = (employeeId: any) => {
    if (employeeId?.employeeCode) return employeeId.employeeCode;
    const emp = employees.find((e) => e._id === employeeId);
    return emp?.employeeCode || "N/A";
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  if (permissionLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <Forbidden
        requiredRoles={["Quản lý", "Kế toán"]}
        message="Bạn cần là Quản lý hoặc Kế toán để quản lý lương"
      />
    );
  }

  const totalPending = salaries
    .filter((s) => s.status === "pending")
    .reduce((sum, s) => sum + s.totalSalary, 0);

  const totalPaid = salaries
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + s.totalSalary, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
            <DollarSign size={32} />
            Quản lý Lương
          </h1>
          <p className="text-gray-600 mt-2">
            Tháng {selectedMonth}/{selectedYear} - {salaries.length} bảng lương
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/salaries/calculate")}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
        >
          <Plus size={20} />
          Tính lương tháng mới
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg border border-amber-200 shadow">
        <div className="flex gap-4 items-center">
          <Calendar size={20} className="text-amber-600" />
          <label className="text-sm font-medium text-gray-700">Tháng:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>
          <label className="text-sm font-medium text-gray-700">Năm:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tổng lương</p>
              <p className="text-2xl font-bold mt-1">
                {(totalPending + totalPaid).toLocaleString("vi-VN")} đ
              </p>
            </div>
            <DollarSign size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Chưa thanh toán</p>
              <p className="text-2xl font-bold mt-1">
                {totalPending.toLocaleString("vi-VN")} đ
              </p>
            </div>
            <Clock size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Đã thanh toán</p>
              <p className="text-2xl font-bold mt-1">
                {totalPaid.toLocaleString("vi-VN")} đ
              </p>
            </div>
            <CheckCircle size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-amber-200 rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-500 to-orange-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  Nhân viên
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  Lương cơ bản
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  Thưởng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  Phạt
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  Tăng ca
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  Tổng lương
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {salaries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Chưa có bảng lương nào cho tháng này
                  </td>
                </tr>
              ) : (
                salaries.map((salary) => (
                  <tr key={salary._id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <User size={16} className="text-amber-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {getEmployeeName(salary.employeeId)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getEmployeeCode(salary.employeeId)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                      {salary.baseSalary.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600 font-semibold">
                      +{salary.bonus.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600 font-semibold">
                      -{salary.deduction.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600 font-semibold">
                      +{salary.overtime.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-amber-700">
                      {salary.totalSalary.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-6 py-4">
                      {salary.status === "paid" ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                          <CheckCircle size={14} />
                          Đã thanh toán
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                          <Clock size={14} />
                          Chờ thanh toán
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {salary.status === "pending" && (
                          <button
                            onClick={() => setConfirmPaySalary(salary._id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Thanh toán
                          </button>
                        )}
                        {salary.status === "paid" && salary.paidDate && (
                          <span className="text-xs text-gray-500">
                            {new Date(salary.paidDate).toLocaleDateString("vi-VN")}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmPaySalary}
        onClose={() => setConfirmPaySalary(null)}
        onConfirm={() => {
          if (confirmPaySalary) {
            handlePaySalary(confirmPaySalary);
            setConfirmPaySalary(null);
          }
        }}
        title="Xác nhận thanh toán"
        message="Xác nhận đã thanh toán lương cho nhân viên này?"
        confirmText="Xác nhận"
        cancelText="Hủy"
      />
    </div>
  );
};

export default SalaryPage;
