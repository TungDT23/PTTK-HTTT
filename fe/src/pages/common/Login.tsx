import { loginUser } from "@/services/UserService";
import type { AppDispatch, RootState } from "@/store/store";
import { setUser } from "@/store/UserReducer";
import type { ApiResponse } from "@/types/Response";
import type { User } from "@/types/User";
import { ArrowLeft, Lock, User as UserIcon } from "lucide-react";
import { useAppToast } from "@/App";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useAppToast();

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!user) return;
    if (user.role === "user") navigate("/home");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      const response: ApiResponse<User> = await loginUser(username, password);
      if (response.success && response.data) {
        dispatch(setUser(response.data));
        toast.success("Đăng nhập thành công!");
        setTimeout(() => {
          if (response.data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 500);
      } else {
        toast.error("Đăng nhập thất bại: Phản hồi không hợp lệ");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.response?.status === 401) {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng");
      } else if (error.response?.status === 404) {
        toast.error("Tài khoản không tồn tại");
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-amber-200/50 w-full max-w-md relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 text-amber-600 hover:text-amber-800 transition-all flex items-center gap-2 font-semibold group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Trang chủ</span>
        </button>
        
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl shadow-lg mb-4">
            <span className="text-4xl">📚</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
            Đăng nhập
          </h1>
          <p className="text-amber-600 mt-2">Chào mừng bạn trở lại</p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Tên đăng nhập
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-amber-600 font-semibold hover:text-amber-700 transition-colors"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
