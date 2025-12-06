import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LuFacebook,
  LuInstagram,
  LuLayoutDashboard,
  LuShoppingBag,
  LuTwitter,
  LuUser,
} from "react-icons/lu";
import { BookOpen, Mail, Phone, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { logout } from "@/store/UserReducer";

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <header className="bg-white/95 backdrop-blur-md border-b border-amber-200/50 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl group-hover:shadow-lg transition-all transform group-hover:scale-105">
                <LuShoppingBag className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">Nhà Sách & VPP</h1>
                <p className="text-xs text-amber-600 font-medium">Tri thức - Sáng tạo - Thành công</p>
              </div>
            </NavLink>

            {/* <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-3 px-5 pr-12 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700 text-slate-100 p-2 rounded-lg hover:bg-slate-600 transition-colors">
                  <LuSearch size={20} />
                </button>
              </div>
            </div> */}

            <div className="flex items-center gap-3">
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-white transition-all flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <LuLayoutDashboard size={18} /> Quản trị
                </button>
              )}

              {!user ? (
                <>
                  <button
                    onClick={() => navigate("/register")}
                    className="text-white transition-all flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <LuUser size={18} /> Đăng ký
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-amber-800 hover:text-amber-900 transition-all flex items-center gap-2 bg-white border-2 border-amber-300 hover:border-amber-400 px-4 py-2 rounded-xl font-semibold shadow-sm hover:shadow-md"
                  >
                    <LuUser size={18} /> Đăng nhập
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/profile")}
                    className="text-white transition-all flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <LuUser size={18} /> Tài khoản
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-amber-800 hover:text-amber-900 transition-all flex items-center gap-2 bg-white border-2 border-amber-300 hover:border-amber-400 px-4 py-2 rounded-xl font-semibold shadow-sm hover:shadow-md"
                  >
                    <LuUser size={18} /> Đăng xuất
                  </button>
                </>
              )}
            </div>
          </div>

          <nav className="hidden md:block mt-4 border-t border-amber-200 pt-4">
            <ul className="flex gap-8 justify-center text-amber-800 font-medium">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `relative py-2 hover:text-amber-900 transition-colors ${
                      isActive ? "text-amber-900 font-bold" : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Trang chủ
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `relative py-2 hover:text-amber-900 transition-colors ${
                      isActive ? "text-amber-900 font-bold" : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Giỏ hàng
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `relative py-2 hover:text-amber-900 transition-colors ${
                      isActive ? "text-amber-900 font-bold" : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Giới thiệu
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-gradient-to-br from-amber-900 via-orange-900 to-amber-950 text-amber-100 border-t-4 border-amber-500">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <BookOpen className="text-amber-400" size={24} />
                Bookstore
              </h3>
              <p className="text-amber-200 text-sm leading-relaxed">
                Điểm đến tin cậy cho mọi nhu cầu sách và văn phòng phẩm của bạn. 
                Chất lượng cao, giá cả hợp lý.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Liên kết nhanh
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/about"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={16} className="text-amber-400" />
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={16} className="text-amber-400" />
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={16} className="text-amber-400" />
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={16} className="text-amber-400" />
                    Thông tin vận chuyển
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Dịch vụ khách hàng
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={16} className="text-amber-400" />
                    Chính sách đổi trả
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={16} className="text-amber-400" />
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={16} className="text-amber-400" />
                    Điều khoản sử dụng
                  </a>
                </li>
                <li>
                  <a
                    href="/profile"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={16} className="text-amber-400" />
                    Theo dõi đơn hàng
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Kết nối với chúng tôi
              </h3>
              <div className="flex gap-3 mb-4">
                <a
                  href="#"
                  className="bg-amber-800 p-3 text-center rounded-lg hover:bg-amber-700 transition-all hover:scale-110 border border-amber-600"
                >
                  <LuFacebook size={20} />
                </a>
                <a
                  href="#"
                  className="bg-amber-800 p-3 rounded-lg hover:bg-amber-700 transition-all hover:scale-110 border border-amber-600"
                >
                  <LuTwitter size={20} />
                </a>
                <a
                  href="#"
                  className="bg-amber-800 p-3 rounded-lg hover:bg-amber-700 transition-all hover:scale-110 border border-amber-600"
                >
                  <LuInstagram size={20} />
                </a>
              </div>
              <div className="text-sm space-y-2">
                <p className="text-amber-200 flex items-center gap-2">
                  <Mail size={16} className="text-amber-400" />
                  contact@bookstore.vn
                </p>
                <p className="text-amber-200 flex items-center gap-2">
                  <Phone size={16} className="text-amber-400" />
                  0862 874 800
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-amber-700 mt-8 pt-8 text-center">
            <p className="text-amber-200 text-sm">
              &copy; 2025 Bookstore. Bảo lưu mọi quyền. Made with ❤️ in Vietnam
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
