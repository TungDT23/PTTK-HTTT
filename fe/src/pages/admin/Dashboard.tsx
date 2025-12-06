import { useEffect, useState } from "react";
import { ShoppingCart, DollarSign, Package, Users, TrendingUp, Clock } from "lucide-react";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
  monthlyRevenue: { month: string; revenue: number }[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    monthlyRevenue: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel from admin endpoints
      const [invoicesRes, productsRes, usersRes] = await Promise.all([
        axiosClient.get("/admin/invoices"),
        axiosClient.get("/admin/products"),
        axiosClient.get("/admin/users"),
      ]);

      const invoices = invoicesRes.data.data || [];
      const products = productsRes.data.data || [];
      const users = usersRes.data.data || [];

      // Calculate statistics
      const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + inv.total, 0);
      const totalOrders = invoices.length;
      const totalProducts = products.length;
      const totalUsers = users.filter((u: any) => u.role === "user").length;

      // Get recent orders (last 5)
      const recentOrders = invoices
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      // Calculate monthly revenue (last 6 months)
      const monthlyRevenue = calculateMonthlyRevenue(invoices);

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        recentOrders,
        monthlyRevenue,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyRevenue = (invoices: any[]) => {
    const months = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const currentMonth = new Date().getMonth();
    const monthlyData: { [key: number]: number } = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      monthlyData[monthIndex] = 0;
    }

    // Calculate revenue for each month
    invoices.forEach((invoice: any) => {
      const invoiceMonth = new Date(invoice.createdAt).getMonth();
      if (monthlyData.hasOwnProperty(invoiceMonth)) {
        monthlyData[invoiceMonth] += invoice.total;
      }
    });

    // Convert to array format
    return Object.keys(monthlyData).map((monthIndex) => ({
      month: months[parseInt(monthIndex)],
      revenue: monthlyData[parseInt(monthIndex)],
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      shipping: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      pending: "Chờ xử lý",
      shipping: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const maxRevenue = Math.max(...stats.monthlyRevenue.map((m) => m.revenue), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hoạt động của cửa hàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <DollarSign size={24} />
            </div>
            <TrendingUp size={20} className="opacity-80" />
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Tổng Doanh Thu</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <ShoppingCart size={24} />
            </div>
            <TrendingUp size={20} className="opacity-80" />
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Tổng Đơn Hàng</p>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Package size={24} />
            </div>
            <TrendingUp size={20} className="opacity-80" />
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Tổng Sản Phẩm</p>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Users size={24} />
            </div>
            <TrendingUp size={20} className="opacity-80" />
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Tổng Khách Hàng</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Doanh Thu 6 Tháng Gần Đây</h2>
          <div className="space-y-4">
            {stats.monthlyRevenue.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">{data.month}</span>
                  <span className="text-gray-800 font-semibold">{formatCurrency(data.revenue)}</span>
                </div>
                <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock size={24} className="text-amber-600" />
            Đơn Hàng Gần Đây
          </h2>
          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Chưa có đơn hàng nào</p>
            ) : (
              stats.recentOrders.map((order: any) => (
                <div
                  key={order._id}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{order.invoiceNumber}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{order.customerName}</span>
                    <span className="text-amber-600 font-semibold">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{formatDate(order.createdAt)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
