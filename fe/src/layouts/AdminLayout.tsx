import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdInventory,
  MdLogout,
  MdMenu,
  MdClose,
  MdPerson,
  MdKeyboardArrowDown,
  MdHome,
  MdAttachMoney,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import { logout } from "@/store/UserReducer";
import { usePermission } from "@/contexts/PermissionContext";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, hasPermission } = usePermission();

  const canManageEmployees = hasPermission(["manager"]);
  const canManageWarehouse = hasPermission(["manager", "warehouse"]);
  const canManageSalary = hasPermission(["manager", "accountant"]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-amber-200 transition-all duration-300 flex flex-col fixed h-full z-20 shadow-xl`}
      >
        <div className="p-4 border-b border-amber-200">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-lg shadow-lg">
                  <MdInventory className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Admin Panel</span>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-lg mx-auto shadow-lg">
                <MdInventory className="text-white" size={24} />
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-amber-100"
              }`
            }
          >
            <MdHome size={20} />
            {sidebarOpen && <span className="font-medium">Trang chủ</span>}
          </NavLink>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-amber-100"
              }`
            }
          >
            <MdDashboard size={20} />
            {sidebarOpen && <span className="font-medium">Dashboard</span>}
          </NavLink>

          {canManageWarehouse && (
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-amber-100"
                }`
              }
            >
              <MdInventory size={20} />
              {sidebarOpen && <span className="font-medium">Sản phẩm</span>}
            </NavLink>
          )}

          {canManageEmployees && (
            <NavLink
              to="/admin/employees"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-amber-100"
                }`
              }
            >
              <MdPerson size={20} />
              {sidebarOpen && <span className="font-medium">Nhân viên</span>}
            </NavLink>
          )}

          {canManageWarehouse && (
            <NavLink
              to="/admin/suppliers"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-amber-100"
                }`
              }
            >
              <MdInventory size={20} />
              {sidebarOpen && <span className="font-medium">Nhà cung cấp</span>}
            </NavLink>
          )}

          {canManageWarehouse && (
            <NavLink
              to="/admin/inventory"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-amber-100"
                }`
              }
            >
              <MdInventory size={20} />
              {sidebarOpen && <span className="font-medium">Quản lý kho</span>}
            </NavLink>
          )}

          {canManageSalary && (
            <NavLink
              to="/admin/salaries"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-amber-100"
                }`
              }
            >
              <MdAttachMoney size={20} />
              {sidebarOpen && <span className="font-medium">Quản lý lương</span>}
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-amber-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all w-full font-medium"
          >
            <MdLogout size={20} />
            {sidebarOpen && <span className="font-medium">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <header className="bg-white border-b border-amber-200 sticky top-0 z-10 shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-amber-600 hover:text-amber-700 transition-colors"
              >
                {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
              </button>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Quản lý cửa hàng
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-colors"
                >
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-lg shadow-md">
                    <MdPerson size={20} className="text-white" />
                  </div>
                  <span className="font-medium hidden md:block">
                    {user?.username || "Admin"}
                  </span>
                  <MdKeyboardArrowDown
                    size={20}
                    className={`transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-amber-200 rounded-lg shadow-xl overflow-hidden">
                    <a
                      href="#"
                      className="block px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MdPerson size={18} />
                        <span>Tài khoản</span>
                      </div>
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MdLogout size={18} />
                        <span>Đăng xuất</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        <footer className="bg-white border-t border-amber-200 py-4 px-6">
          <div className="text-center text-gray-600 text-sm">
            &copy; 2025 Bookstore Admin. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
