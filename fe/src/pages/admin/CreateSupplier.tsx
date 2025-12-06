import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSupplier } from "@/services/SupplierService";
import { Building2, ArrowLeft, Save } from "lucide-react";
import { useEmployeePermission } from "@/hooks/useEmployeePermission";
import Forbidden from "@/pages/common/Forbidden";
import { useAppToast } from "@/App";

const CreateSupplierPage = () => {
  const navigate = useNavigate();
  const toast = useAppToast();
  const [loading, setLoading] = useState(false);
  const { loading: permissionLoading, hasPermission } = useEmployeePermission(["manager", "warehouse"]);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    taxCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await createSupplier(formData);
      toast.success("Thêm nhà cung cấp mới thành công!");
      setTimeout(() => {
        navigate("/admin/suppliers");
      }, 500);
    } catch (error) {
      console.error("Error creating supplier:", error);
      toast.error("Có lỗi xảy ra khi thêm nhà cung cấp!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        requiredRoles={["manager", "warehouse"]} 
        message="Chức năng thêm nhà cung cấp chỉ dành cho Quản lý và Nhân viên kho."
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/suppliers")}
          className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-amber-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
            <Building2 size={32} />
            Thêm Nhà Cung Cấp Mới
          </h1>
          <p className="text-gray-600 mt-2">Điền thông tin nhà cung cấp mới</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border-2 border-amber-200 rounded-xl p-6 shadow-lg space-y-6">
          {/* Thông tin cơ bản */}
          <div>
            <h2 className="text-xl font-bold text-amber-900 mb-4">
              Thông tin công ty
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên công ty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Công ty TNHH ABC"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Người liên hệ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Nguyễn Văn A"
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
                  placeholder="contact@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  name="taxCode"
                  value={formData.taxCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="0123456789"
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
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/suppliers")}
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
            {loading ? "Đang lưu..." : "Lưu nhà cung cấp"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSupplierPage;
