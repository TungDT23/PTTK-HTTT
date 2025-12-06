import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ForbiddenProps {
  requiredRoles?: string[];
  message?: string;
}

const Forbidden = ({ requiredRoles, message }: ForbiddenProps) => {
  const navigate = useNavigate();

  const roleNames: { [key: string]: string } = {
    manager: "Quản lý",
    sales: "Nhân viên bán hàng",
    warehouse: "Nhân viên kho",
    accountant: "Kế toán",
  };

  const defaultMessage =
    "Bạn không có quyền truy cập chức năng này. Vui lòng liên hệ quản lý để được cấp quyền.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border border-amber-200">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-full">
            <ShieldAlert className="w-16 h-16 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Truy cập bị từ chối
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6 text-lg">
          {message || defaultMessage}
        </p>

        {/* Required Roles */}
        {requiredRoles && requiredRoles.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8">
            <p className="text-sm font-semibold text-amber-800 mb-3">
              🔐 Chức năng này chỉ dành cho:
            </p>
            <div className="flex flex-wrap gap-2">
              {requiredRoles.map((role) => (
                <span
                  key={role}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium shadow-md"
                >
                  {roleNames[role] || role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error Code */}
        <div className="text-center mb-8">
          <span className="inline-block px-6 py-2 bg-red-100 text-red-600 rounded-full font-mono font-bold text-sm">
            ERROR 403 - FORBIDDEN
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-6 py-3 border-2 border-amber-500 text-amber-600 rounded-xl font-semibold hover:bg-amber-50 transition-all"
          >
            Về Dashboard
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ:</p>
          <p className="font-semibold text-amber-600 mt-1">
            Quản lý hệ thống - manager@bookstore.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
