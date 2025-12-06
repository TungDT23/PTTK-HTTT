import { useEffect, useState } from "react";
import { getAllEmployees } from "@/services/EmployeeService";
import { createSalary } from "@/services/SalaryService";
import type { Employee } from "@/types/Employee";
import type { ApiResponse } from "@/types/Response";
import { Calculator, ArrowLeft, Save, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmployeePermission } from "@/hooks/useEmployeePermission";
import Forbidden from "@/pages/common/Forbidden";
import { useAppToast } from "@/App";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface SalaryForm {
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  deduction: number;
  overtime: number;
  note: string;
}

const CalculateSalaryPage = () => {
  const toast = useAppToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [salaryForms, setSalaryForms] = useState<Record<string, SalaryForm>>({});
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const { loading: permissionLoading, hasPermission } = useEmployeePermission(["manager", "accountant"]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setFetchLoading(true);
      const response: ApiResponse<Employee[]> = await getAllEmployees();
      if (response.success && response.data) {
        const activeEmployees = response.data.filter((e) => e.isActive);
        setEmployees(activeEmployees);
        
        // Initialize salary forms với lương cơ bản từ employee
        const forms: Record<string, SalaryForm> = {};
        activeEmployees.forEach((emp) => {
          forms[emp._id] = {
            employeeId: emp._id,
            month,
            year,
            baseSalary: emp.salary || 0,
            bonus: 0,
            deduction: 0,
            overtime: 0,
            note: "",
          };
        });
        setSalaryForms(forms);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Có lỗi khi tải danh sách nhân viên!");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((e) => e._id));
    }
  };

  const handleSelectEmployee = (id: string) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((eid) => eid !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const updateSalaryForm = (employeeId: string, field: keyof SalaryForm, value: any) => {
    setSalaryForms({
      ...salaryForms,
      [employeeId]: {
        ...salaryForms[employeeId],
        [field]: value,
      },
    });
  };

  const calculateTotal = (employeeId: string) => {
    const form = salaryForms[employeeId];
    if (!form) return 0;
    return form.baseSalary + form.bonus - form.deduction + form.overtime;
  };

  const handleSubmit = async () => {
    if (selectedEmployees.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một nhân viên!");
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    try {
      setLoading(true);
      
      for (const employeeId of selectedEmployees) {
        const form = salaryForms[employeeId];
        const totalSalary = calculateTotal(employeeId);
        
        await createSalary({
          employeeId: form.employeeId,
          month,
          year,
          baseSalary: form.baseSalary,
          bonus: form.bonus,
          deduction: form.deduction,
          overtime: form.overtime,
          totalSalary,
          note: form.note,
        } as any);
      }

      toast.success("Tính lương thành công!");
      navigate("/admin/salaries");
    } catch (error: any) {
      console.error("Error calculating salary:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tính lương!");
    } finally {
      setLoading(false);
    }
  };

  if (permissionLoading || fetchLoading) {
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
        message="Bạn cần là Quản lý hoặc Kế toán để tính lương"
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/salaries")}
          className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-amber-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
            <Calculator size={32} />
            Tính lương nhân viên
          </h1>
          <p className="text-gray-600 mt-1">
            Tháng {month}/{year}
          </p>
        </div>
      </div>

      {/* Month/Year selector */}
      <div className="bg-white p-4 rounded-lg border border-amber-200 shadow">
        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Tháng:</label>
          <select
            value={month}
            onChange={(e) => {
              const newMonth = parseInt(e.target.value);
              setMonth(newMonth);
              // Update all forms
              const newForms = { ...salaryForms };
              Object.keys(newForms).forEach((id) => {
                newForms[id].month = newMonth;
              });
              setSalaryForms(newForms);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>
          <label className="text-sm font-medium text-gray-700">Năm:</label>
          <select
            value={year}
            onChange={(e) => {
              const newYear = parseInt(e.target.value);
              setYear(newYear);
              // Update all forms
              const newForms = { ...salaryForms };
              Object.keys(newForms).forEach((id) => {
                newForms[id].year = newYear;
              });
              setSalaryForms(newForms);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Hướng dẫn:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Chọn nhân viên cần tính lương bằng checkbox</li>
            <li>Lương cơ bản được lấy từ thông tin nhân viên</li>
            <li>Nhập thưởng, phạt, tăng ca (nếu có)</li>
            <li>Tổng lương = Lương cơ bản + Thưởng - Phạt + Tăng ca</li>
          </ul>
        </div>
      </div>

      {/* Select All */}
      <div className="bg-white p-4 rounded-lg border border-amber-200 shadow">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedEmployees.length === employees.length}
            onChange={handleSelectAll}
            className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
          />
          <span className="font-semibold text-gray-900">
            Chọn tất cả ({selectedEmployees.length}/{employees.length})
          </span>
        </label>
      </div>

      {/* Employee List */}
      <div className="space-y-4">
        {employees.map((employee) => {
          const isSelected = selectedEmployees.includes(employee._id);
          const form = salaryForms[employee._id] || {};

          return (
            <div
              key={employee._id}
              className={`bg-white p-4 rounded-lg border-2 transition-all ${
                isSelected ? "border-amber-500 shadow-lg" : "border-gray-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectEmployee(employee._id)}
                  className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 mt-1"
                />
                
                <div className="flex-1 space-y-4">
                  {/* Employee Info */}
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{employee.fullName}</div>
                    <div className="text-sm text-gray-600">
                      {employee.employeeCode} - {employee.position === "manager" ? "Quản lý" : employee.position === "sales" ? "Bán hàng" : employee.position === "warehouse" ? "Kho" : "Kế toán"}
                    </div>
                  </div>

                  {/* Salary Fields */}
                  {isSelected && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lương cơ bản
                        </label>
                        <input
                          type="number"
                          value={form.baseSalary || 0}
                          onChange={(e) =>
                            updateSalaryForm(employee._id, "baseSalary", parseInt(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-1">
                          Thưởng
                        </label>
                        <input
                          type="number"
                          value={form.bonus || 0}
                          onChange={(e) =>
                            updateSalaryForm(employee._id, "bonus", parseInt(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-1">
                          Phạt
                        </label>
                        <input
                          type="number"
                          value={form.deduction || 0}
                          onChange={(e) =>
                            updateSalaryForm(employee._id, "deduction", parseInt(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-1">
                          Tăng ca
                        </label>
                        <input
                          type="number"
                          value={form.overtime || 0}
                          onChange={(e) =>
                            updateSalaryForm(employee._id, "overtime", parseInt(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-amber-700 mb-1">
                          Tổng lương
                        </label>
                        <div className="px-3 py-2 bg-amber-50 border-2 border-amber-500 rounded-lg font-bold text-amber-700">
                          {calculateTotal(employee._id).toLocaleString("vi-VN")} đ
                        </div>
                      </div>
                    </div>
                  )}

                  {isSelected && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ghi chú
                      </label>
                      <input
                        type="text"
                        value={form.note || ""}
                        onChange={(e) => updateSalaryForm(employee._id, "note", e.target.value)}
                        placeholder="Ghi chú (tùy chọn)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4 sticky bottom-4">
        <button
          onClick={() => navigate("/admin/salaries")}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || selectedEmployees.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          {loading ? "Đang xử lý..." : `Tính lương (${selectedEmployees.length})`}
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          setShowConfirmDialog(false);
          confirmSubmit();
        }}
        title="Xác nhận tính lương"
        message={`Xác nhận tính lương cho ${selectedEmployees.length} nhân viên?`}
        confirmText="Xác nhận"
        cancelText="Hủy"
      />
    </div>
  );
};

export default CalculateSalaryPage;
