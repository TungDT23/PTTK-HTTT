import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "@/services/EmployeeService";
import { UserPlus, ArrowLeft, Save } from "lucide-react";
import { useEmployeePermission } from "@/hooks/useEmployeePermission";
import Forbidden from "@/pages/common/Forbidden";
import { useAppToast } from "@/App";

const CreateEmployeePage = () => {
  const navigate = useNavigate();
  const toast = useAppToast();
  const [loading, setLoading] = useState(false);
  const { loading: permissionLoading, hasPermission } = useEmployeePermission(["manager"]);
  const [formData, setFormData] = useState({
    fullName: "",
    position: "sales" as "manager" | "sales" | "warehouse" | "accountant",
    department: "",
    phone: "",
    email: "",
    address: "",
    dateOfBirth: "",
    startDate: new Date().toISOString().split("T")[0],
    salary: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await createEmployee(formData);
      toast.success("Thêm nhân viên mới thành công!");
      setTimeout(() => {
        navigate("/admin/employees");
      }, 500);
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Có lỗi xảy ra khi thêm nhân viên!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value,
    }));
  };

  if (permissionLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-amber-600">Đang kiểm tra quyền...</div>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <Forbidden 
        requiredRoles={["manager"]} 
        message="Chức năng thêm nhân viên chỉ dành cho Quản lý (Manager)."
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/employees")}
          className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-amber-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
            <UserPlus size={32} />
            Thêm Nhân Viên Mới
          </h1>
          <p className="text-gray-600 mt-2">Điền thông tin nhân viên mới</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border-2 border-amber-200 rounded-xl p-6 shadow-lg space-y-6">
          {/* Thông tin cơ bản */}
          <div>
            <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chức vụ <span className="text-red-500">*</span>
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                >
                  <option value="sales">Bán hàng</option>
                  <option value="warehouse">Kho</option>
                  <option value="accountant">Kế toán</option>
                  <option value="manager">Quản lý</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phòng ban <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Phòng Kinh Doanh"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="0123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="employee@bookstore.vn"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
              placeholder="Số nhà, đường, phường, quận, thành phố..."
            />
          </div>

          {/* Thông tin công việc */}
          <div>
            <h2 className="text-xl font-bold text-amber-900 mb-4">Thông tin công việc</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày bắt đầu làm <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lương cơ bản (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  min="0"
                  step="100000"
                  className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="10000000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/employees")}
            className="px-6 py-3 bg-white border-2 border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-all font-semibold"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? "Đang lưu..." : "Lưu nhân viên"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployeePage;
