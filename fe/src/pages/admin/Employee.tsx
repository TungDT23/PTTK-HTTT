import { useEffect, useState } from "react";
import { getAllEmployees, deleteEmployee } from "@/services/EmployeeService";
import type { Employee } from "@/types/Employee";
import type { ApiResponse } from "@/types/Response";
import { Users, UserPlus, Edit, Trash2, Briefcase, Shield, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useEmployeePermission } from "@/hooks/useEmployeePermission";
import Forbidden from "@/pages/common/Forbidden";
import { useAppToast } from "@/App";

const EmployeePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const navigate = useNavigate();
  const toast = useAppToast();
  
  const { loading: permissionLoading, hasPermission } = useEmployeePermission(["manager"]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response: ApiResponse<Employee[]> = await getAllEmployees();
      if (response.success && response.data) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;

    try {
      const response = await deleteEmployee(employeeToDelete);
      if (!response.success) {
        toast.error("Xóa nhân viên thất bại, vui lòng thử lại!");
        return;
      }
      await fetchEmployees();
      toast.success("Xóa nhân viên thành công!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Xóa nhân viên thất bại, vui lòng thử lại!");
    } finally {
      setEmployeeToDelete(null);
    }
  };

  const getPositionLabel = (position: string) => {
    const positions: Record<string, string> = {
      manager: "Quản lý",
      sales: "Bán hàng",
      warehouse: "Kho",
      accountant: "Kế toán",
    };
    return positions[position] || position;
  };

  const allPermissions = [
    { id: "manage_all", label: "Toàn quyền hệ thống", category: "Quản lý chung" },
    { id: "manage_employees", label: "Quản lý nhân viên", category: "Nhân sự" },
    { id: "view_employees", label: "Xem danh sách nhân viên", category: "Nhân sự" },
    { id: "manage_products", label: "Quản lý sản phẩm", category: "Sản phẩm" },
    { id: "view_products", label: "Xem sản phẩm", category: "Sản phẩm" },
    { id: "delete_products", label: "Xóa sản phẩm", category: "Sản phẩm" },
    { id: "manage_suppliers", label: "Quản lý nhà cung cấp", category: "Nhà cung cấp" },
    { id: "view_suppliers", label: "Xem nhà cung cấp", category: "Nhà cung cấp" },
    { id: "delete_suppliers", label: "Xóa nhà cung cấp", category: "Nhà cung cấp" },
    { id: "manage_inventory", label: "Quản lý kho", category: "Kho hàng" },
    { id: "view_inventory", label: "Xem tồn kho", category: "Kho hàng" },
    { id: "manage_salary", label: "Quản lý lương", category: "Tài chính" },
    { id: "view_financial_reports", label: "Xem báo cáo tài chính", category: "Báo cáo" },
    { id: "view_sales_reports", label: "Xem báo cáo bán hàng", category: "Báo cáo" },
    { id: "view_inventory_reports", label: "Xem báo cáo kho", category: "Báo cáo" },
  ];

  const getPermissions = (position: string) => {
    const permissionMap: Record<string, string[]> = {
      manager: ["manage_all", "manage_employees", "view_employees", "manage_products", "view_products", "delete_products", "manage_suppliers", "view_suppliers", "delete_suppliers", "manage_inventory", "view_inventory", "manage_salary", "view_financial_reports", "view_sales_reports", "view_inventory_reports"],
      sales: ["view_products", "view_suppliers", "view_sales_reports"],
      warehouse: ["manage_products", "view_products", "manage_suppliers", "view_suppliers", "manage_inventory", "view_inventory", "view_inventory_reports"],
      accountant: ["manage_salary", "view_financial_reports", "view_inventory"],
    };
    return permissionMap[position] || [];
  };

  const getPermissionLabels = (position: string) => {
    const permissionIds = getPermissions(position);
    return allPermissions
      .filter(p => permissionIds.includes(p.id))
      .map(p => p.label);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <>
      {permissionLoading ? (
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-amber-600">Đang kiểm tra quyền...</div>
          </div>
        </div>
      ) : !hasPermission ? (
        <Forbidden 
          requiredRoles={["manager"]} 
          message="Chức năng quản lý nhân viên chỉ dành cho Quản lý (Manager)."
        />
      ) : (
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
                <Users size={32} />
                Quản lý Nhân viên
              </h1>
              <p className="text-gray-600 mt-2">
                Tổng số: <span className="font-semibold text-amber-600">{employees.length}</span> nhân viên
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/employees/new")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              <UserPlus size={20} />
              Thêm nhân viên
            </button>
          </div>

      {/* Table */}
      <div className="bg-white border border-amber-200 rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-500 to-orange-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  Mã NV
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  Họ tên
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  Chức vụ
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  Quyền hạn
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  Phòng ban
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  SĐT
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                  Lương
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
              {employees.map((employee) => (
                <tr
                  key={employee._id}
                  className="hover:bg-amber-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono text-amber-700">
                    {employee.employeeCode}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Briefcase size={16} className="text-amber-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {employee.fullName}
                        </div>
                        <div className="text-xs text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      {getPositionLabel(employee.position)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs items-center">
                      {getPermissionLabels(employee.position).slice(0, 2).map((perm, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs"
                        >
                          <CheckCircle size={12} />
                          {perm}
                        </span>
                      ))}
                      {getPermissionLabels(employee.position).length > 2 && (
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowPermissionModal(true);
                          }}
                          className="px-2 py-1 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded text-xs font-medium transition-colors"
                        >
                          +{getPermissionLabels(employee.position).length - 2} quyền khác
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowPermissionModal(true);
                        }}
                        className="p-1 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                        title="Xem chi tiết quyền"
                      >
                        <Shield size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{employee.phone}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    {employee.salary.toLocaleString("vi-VN")} đ
                  </td>
                  <td className="px-6 py-4">
                    {employee.isActive ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        Ngừng
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/employees/edit/${employee._id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setEmployeeToDelete(employee._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!employeeToDelete}
        onClose={() => setEmployeeToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa nhân viên"
        message="Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />

      {/* Permission Details Modal */}
      {showPermissionModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield size={32} />
                  <div>
                    <h3 className="text-2xl font-bold">Chi tiết phân quyền</h3>
                    <p className="text-amber-50 mt-1">{selectedEmployee.fullName} - {getPositionLabel(selectedEmployee.position)}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPermissionModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Employee Info */}
              <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Mã nhân viên:</span>
                    <span className="ml-2 font-semibold text-amber-700">{selectedEmployee.employeeCode}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-semibold">{selectedEmployee.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phòng ban:</span>
                    <span className="ml-2 font-semibold">{selectedEmployee.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Chức vụ:</span>
                    <span className="ml-2 font-semibold text-amber-700">{getPositionLabel(selectedEmployee.position)}</span>
                  </div>
                </div>
              </div>

              {/* Permissions by Category */}
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  Quyền hạn được cấp ({getPermissions(selectedEmployee.position).length} quyền)
                </h4>

                {Object.entries(
                  allPermissions.reduce((acc, perm) => {
                    if (!acc[perm.category]) acc[perm.category] = [];
                    acc[perm.category].push(perm);
                    return acc;
                  }, {} as Record<string, typeof allPermissions>)
                ).map(([category, perms]) => {
                  const employeePerms = getPermissions(selectedEmployee.position);
                  const categoryPerms = perms.filter(p => employeePerms.includes(p.id));
                  const deniedPerms = perms.filter(p => !employeePerms.includes(p.id));

                  return (
                    <div key={category} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-amber-500 rounded"></div>
                        {category}
                      </h5>
                      <div className="space-y-2">
                        {categoryPerms.map(perm => (
                          <div
                            key={perm.id}
                            className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-200"
                          >
                            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-900">{perm.label}</span>
                          </div>
                        ))}
                        {deniedPerms.map(perm => (
                          <div
                            key={perm.id}
                            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200 opacity-60"
                          >
                            <XCircle size={18} className="text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-500 line-through">{perm.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Note */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Lưu ý:</strong> Để thay đổi quyền hạn của nhân viên, vui lòng thay đổi chức vụ của họ 
                  thông qua chức năng "Chỉnh sửa nhân viên". Mỗi chức vụ có bộ quyền hạn riêng được định nghĩa sẵn.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
              <button
                onClick={() => navigate(`/admin/employees/edit/${selectedEmployee._id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Edit size={18} />
                Chỉnh sửa nhân viên
              </button>
              <button
                onClick={() => {
                  setShowPermissionModal(false);
                  setSelectedEmployee(null);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      )}
    </>
  );
};

export default EmployeePage;
