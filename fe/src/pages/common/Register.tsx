import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/services/UserService";
import type { RegisterForm } from "@/types/User";
import { Mail, Phone, User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      setError("Tên đăng nhập phải có ít nhất 3 ký tự");
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      setError("Vui lòng nhập họ tên đầy đủ");
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      setError("Số điện thoại phải có 10-11 chữ số");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(formData);
      
      if (response.success) {
        setSuccess("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-amber-200/50 relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-8 text-center relative">
            <button
              onClick={() => navigate("/")}
              className="absolute top-6 left-6 text-white/90 hover:text-white transition-all flex items-center gap-2 font-semibold group backdrop-blur-sm bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>
            
            <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-5xl">📝</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Đăng Ký Tài Khoản</h1>
            <p className="text-amber-50">Tham gia cộng đồng yêu tri thức</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-700 font-medium">⚠️ {error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                <p className="text-green-700 font-medium">✅ {success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={20} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Nhập tên đăng nhập"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all bg-gradient-to-r from-amber-50/50 to-orange-50/50"
                    required
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên đầy đủ"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all bg-gradient-to-r from-amber-50/50 to-orange-50/50"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all bg-gradient-to-r from-amber-50/50 to-orange-50/50"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0123456789"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all bg-gradient-to-r from-amber-50/50 to-orange-50/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all bg-gradient-to-r from-amber-50/50 to-orange-50/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all bg-gradient-to-r from-amber-50/50 to-orange-50/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-amber-700">
                Đã có tài khoản?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-amber-600 font-bold hover:text-orange-600 transition-colors underline"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-amber-700 text-sm">
            Bằng việc đăng ký, bạn đồng ý với{" "}
            <span className="font-semibold">Điều khoản sử dụng</span> và{" "}
            <span className="font-semibold">Chính sách bảo mật</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
