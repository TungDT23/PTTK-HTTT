import { useEffect, useState } from "react";
import { getAllSuppliers, deleteSupplier } from "@/services/SupplierService";
import type { Supplier } from "@/types/Supplier";
import type { ApiResponse } from "@/types/Response";
import { Building2, Plus, Edit, Trash2, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useEmployeePermission } from "@/hooks/useEmployeePermission";
import Forbidden from "@/pages/common/Forbidden";
import { useAppToast } from "@/App";

const SupplierPage = () => {
  const { loading: permissionLoading, hasPermission, currentEmployee } = useEmployeePermission(["manager", "warehouse"]);
  const toast = useAppToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const canManage = hasPermission;
  const canDelete = currentEmployee?.position === "manager";
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    taxCode: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response: ApiResponse<Supplier[]> = await getAllSuppliers();
      if (response.success && response.data) {
        setSuppliers(response.data);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;

    try {
      await deleteSupplier(supplierToDelete);
      await fetchSuppliers();
      setShowDeleteModal(false);
      setSupplierToDelete(null);
      toast.success("Xóa nhà cung cấp thành công");
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Có lỗi xảy ra khi xóa nhà cung cấp");
    }
  };

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
        requiredRoles={["Quản lý", "Nhân viên kho"]}
        message="Bạn cần là Quản lý hoặc Nhân viên kho để quản lý nhà cung cấp"
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
            <Building2 size={32} />
            Quản lý Nhà cung cấp
          </h1>
          <p className="text-gray-600 mt-2">
            Tổng số: <span className="font-semibold text-amber-600">{suppliers.length}</span> nhà cung cấp
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => navigate("/admin/suppliers/new")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            <Plus size={20} />
            Thêm nhà cung cấp
          </button>
        )}
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div
            key={supplier._id}
            className="bg-white border-2 border-amber-200 rounded-xl p-6 hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-lg">
                <Building2 size={24} className="text-white" />
              </div>
              <div className="flex gap-2">
                {canManage && (
                  <button
                    onClick={() => navigate(`/admin/suppliers/edit/${supplier._id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Sửa"
                  >
                    <Edit size={18} />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => {
                      setSupplierToDelete(supplier._id);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{supplier.name}</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={14} className="text-amber-500" />
                <span>{supplier.phone}</span>
              </div>
              {supplier.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} className="text-amber-500" />
                  <span>{supplier.email}</span>
                </div>
              )}
              <div className="text-gray-600">
                <span className="font-semibold">Liên hệ:</span> {supplier.contactPerson}
              </div>
              <div className="text-gray-600">
                <span className="font-semibold">Địa chỉ:</span> {supplier.address}
              </div>
              {supplier.taxCode && (
                <div className="text-gray-600">
                  <span className="font-semibold">Mã số thuế:</span> {supplier.taxCode}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-amber-100">
              {supplier.isActive ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Hoạt động
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  Ngừng hoạt động
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {suppliers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Building2 size={48} className="mx-auto mb-4 text-amber-300" />
          <p className="text-lg">Chưa có nhà cung cấp nào</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSupplierToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Xóa nhà cung cấp"
        message="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
};

export default SupplierPage;
