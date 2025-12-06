import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { User, ShoppingBag, Heart, Settings, LogOut, Package, Clock, CheckCircle, XCircle, Edit2, Save, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, setUser } from "@/store/UserReducer";
import { setWishlist, removeFromWishlistStore } from "@/store/WishlistReducer";
import { getInvoicesByUserId, cancelInvoice as cancelInvoiceAPI } from "@/services/InvoiceService";
import { updateUserProfile } from "@/services/UserService";
import { getWishlist, removeFromWishlist } from "@/services/WishlistService";
import { addToCart } from "@/store/CartReducer";
import { useAppToast } from "@/App";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type TabType = "info" | "orders" | "wishlist" | "settings";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useAppToast();
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [productToRemove, setProductToRemove] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [editedUser, setEditedUser] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [orders, setOrders] = useState<any[]>([]);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  // Update editedUser when user data is loaded
  useEffect(() => {
    if (user) {
      setEditedUser({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Fetch orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      const userId = user?.id || (user as any)?._id;
      if (!userId) return;
      
      console.log("Fetching orders for userId:", userId);
      const response = await getInvoicesByUserId(userId);
      console.log("Orders response:", response);
      
      if (response.success && response.data) {
        // Transform data to match UI format
        const transformedOrders = response.data.map((invoice: any) => ({
          id: invoice.invoiceNumber,
          date: new Date(invoice.createdAt).toISOString().split('T')[0],
          total: invoice.total,
          status: invoice.status,
          items: invoice.items.length,
          customerName: invoice.customerName,
          customerPhone: invoice.customerPhone,
          customerAddress: invoice.customerAddress,
          paymentMethod: invoice.paymentMethod,
          subtotal: invoice.subtotal,
          shippingFee: invoice.shippingFee,
          orderItems: invoice.items.map((item: any) => ({
            name: item.product.title,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
          })),
        }));
        setOrders(transformedOrders);
      }
    };

    fetchOrders();
  }, [user]);

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlistData = async () => {
      if (user) {
        try {
          const response = await getWishlist();
          if (response.success) {
            dispatch(setWishlist(response.data));
          }
        } catch (error) {
          console.error("Failed to fetch wishlist:", error);
        }
      }
    };
    fetchWishlistData();
  }, [user, dispatch]);

  const handleRemoveFromWishlist = async (productId: string) => {
    setProductToRemove(productId);
  };

  const confirmRemoveWishlist = async () => {
    if (!productToRemove) return;
    try {
      await removeFromWishlist(productToRemove);
      toast.success("Đã xóa khỏi danh sách yêu thích");
      dispatch(removeFromWishlistStore(productToRemove));
      setProductToRemove(null);
    } catch (error) {
      console.error("Remove from wishlist failed:", error);
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const handleAddToCartFromWishlist = (product: any) => {
    dispatch(addToCart({ product }));
    toast.success("Đã thêm vào giỏ hàng");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: Clock },
      shipping: { label: "Đang giao", color: "bg-blue-100 text-blue-800 border-blue-300", icon: Package },
      delivered: { label: "Đã giao", color: "bg-green-100 text-green-800 border-green-300", icon: CheckCircle },
      cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800 border-red-300", icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    toast.success("Đã đăng xuất");
    setTimeout(() => navigate("/"), 500);
  };

  const handleSaveProfile = async () => {
    if (!editedUser.fullName || !editedUser.email || !editedUser.phone) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (editedUser.phone.length < 10) {
      toast.warning("Số điện thoại không hợp lệ");
      return;
    }

    setIsSaving(true);
    try {
      const userId = user?.id || (user as any)?._id;
      if (!userId) return;

      const response = await updateUserProfile(userId, editedUser);
      
      if (response.success) {
        if (user) {
          dispatch(setUser({ ...user, ...editedUser } as any));
        }
        setIsEditing(false);
        toast.success("Cập nhật thông tin thành công!");
      }
    } catch (error: any) {
      console.error("Update profile error:", error);
      if (error.response?.status === 400) {
        toast.error("Email đã được sử dụng");
      } else {
        toast.error("Không thể cập nhật thông tin. Vui lòng thử lại");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    setOrderToCancel(orderId);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      const response = await cancelInvoiceAPI(orderToCancel);
      
      if (!response.success) {
        toast.error("Không thể hủy đơn hàng. Vui lòng thử lại!");
        return;
      }

      // Update order status to cancelled in local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderToCancel
          ? { ...order, status: 'cancelled' }
          : order
        )
      );
      
      toast.success(`Hủy đơn hàng #${orderToCancel} thành công!`);
      setOrderToCancel(null);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const tabs = [
    { id: "info" as TabType, label: "Thông tin cá nhân", icon: User },
    { id: "orders" as TabType, label: "Đơn hàng của tôi", icon: ShoppingBag },
    { id: "wishlist" as TabType, label: "Yêu thích", icon: Heart },
    { id: "settings" as TabType, label: "Cài đặt", icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-8 shadow-2xl text-white mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
            <User size={48} />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Xin chào, {user.fullName || user.username}!</h1>
            <p className="text-amber-50 text-lg">Quản lý thông tin cá nhân và đơn hàng của bạn</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
            <div className="p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                        : "text-amber-800 hover:bg-amber-50"
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-all mt-4 border-t border-amber-200"
              >
                <LogOut size={20} />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8">
            {/* Personal Info Tab */}
            {activeTab === "info" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
                    <User size={28} />
                    Thông tin cá nhân
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-all"
                    >
                      <Edit2 size={18} />
                      Chỉnh sửa
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all"
                      >
                        <Save size={18} />
                        Lưu
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-amber-800 mb-2">Tên đăng nhập</label>
                      <input
                        type="text"
                        value={user.username}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-amber-800 mb-2">Vai trò</label>
                      <input
                        type="text"
                        value={user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-amber-800 mb-2">Họ và tên</label>
                    <input
                      type="text"
                      value={isEditing ? editedUser.fullName : user.fullName}
                      onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                        isEditing
                          ? "border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                          : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-amber-800 mb-2">Email</label>
                    <input
                      type="email"
                      value={isEditing ? editedUser.email : user.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                        isEditing
                          ? "border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                          : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-amber-800 mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      value={isEditing ? editedUser.phone : user.phone}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                        isEditing
                          ? "border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                          : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                  <ShoppingBag size={28} />
                  Đơn hàng của tôi
                </h2>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border-2 border-amber-200 rounded-2xl p-6 hover:border-amber-400 hover:shadow-lg transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-amber-900">Đơn hàng #{order.id}</h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-amber-700">
                            <span>📅 {order.date}</span>
                            <span>📦 {order.items} sản phẩm</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-amber-600">Tổng tiền</p>
                            <p className="text-2xl font-bold text-amber-900">{formatPrice(order.total)}</p>
                          </div>
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-all whitespace-nowrap"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {orders.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-2xl font-bold text-amber-800 mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-amber-600 mb-6">Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên!</p>
                    <button
                      onClick={() => navigate("/")}
                      className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Khám phá sản phẩm
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                  <Heart size={28} />
                  Sản phẩm yêu thích ({wishlist.length})
                </h2>
                {wishlist.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">❤️</div>
                    <h3 className="text-2xl font-bold text-amber-800 mb-2">Chưa có sản phẩm yêu thích</h3>
                    <p className="text-amber-600 mb-6">Thêm sản phẩm vào danh sách yêu thích để theo dõi!</p>
                    <button
                      onClick={() => navigate("/")}
                      className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Khám phá sản phẩm
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((product: any) => (
                      <div key={product._id} className="bg-white border-2 border-amber-200 rounded-2xl overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all">
                        <div className="relative bg-amber-50 h-48 overflow-hidden">
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                          {product.discountPercentage > 0 && (
                            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                              -{product.discountPercentage}%
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-3">
                          <h3 className="font-bold text-amber-900 line-clamp-2">{product.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-amber-700">
                              {formatPrice(product.price * (1 - product.discountPercentage / 100))}
                            </span>
                            {product.discountPercentage > 0 && (
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddToCartFromWishlist(product)}
                              className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-xl font-semibold transition-all"
                            >
                              <ShoppingCart size={18} />
                              Thêm vào giỏ
                            </button>
                            <button
                              onClick={() => handleRemoveFromWishlist(product._id)}
                              className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div>
                <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                  <Settings size={28} />
                  Cài đặt tài khoản
                </h2>

                <div className="space-y-6">
                  <div className="border-2 border-amber-200 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-amber-900 mb-4">Đổi mật khẩu</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-amber-800 mb-2">Mật khẩu hiện tại</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-amber-800 mb-2">Mật khẩu mới</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-amber-800 mb-2">Xác nhận mật khẩu mới</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        />
                      </div>
                      <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold transition-all">
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </div>

                  <div className="border-2 border-red-200 rounded-2xl p-6 bg-red-50">
                    <h3 className="text-lg font-bold text-red-900 mb-2">Xóa tài khoản</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                    </p>
                    <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all">
                      Xóa tài khoản
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white relative overflow-hidden z-10">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                    <Package size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Chi tiết đơn hàng</h3>
                    <p className="text-amber-50 text-sm mt-1">#{selectedOrder.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-xl transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status and Date */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-amber-200">
                <div>
                  <p className="text-sm text-amber-600 mb-1">Trạng thái</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber-600 mb-1">Ngày đặt</p>
                  <p className="font-bold text-amber-900">{selectedOrder.date}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-200">
                <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <User size={20} />
                  Thông tin nhận hàng
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-amber-600 font-medium min-w-[120px]">Người nhận:</span>
                    <span className="text-amber-900 font-semibold">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-amber-600 font-medium min-w-[120px]">Số điện thoại:</span>
                    <span className="text-amber-900 font-semibold">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-amber-600 font-medium min-w-[120px]">Địa chỉ:</span>
                    <span className="text-amber-900 font-semibold">{selectedOrder.customerAddress}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-amber-600 font-medium min-w-[120px]">Thanh toán:</span>
                    <span className="text-amber-900 font-semibold">
                      {selectedOrder.paymentMethod === "cod" && "Thanh toán khi nhận hàng"}
                      {selectedOrder.paymentMethod === "momo" && "Ví MoMo"}
                      {selectedOrder.paymentMethod === "bank_transfer" && "Chuyển khoản ngân hàng"}
                      {selectedOrder.paymentMethod === "vnpay" && "VNPay"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <ShoppingBag size={20} />
                  Sản phẩm ({selectedOrder.orderItems.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item: any, index: number) => {
                    const discountedPrice = item.price - (item.price * item.discount) / 100;
                    const itemTotal = discountedPrice * item.quantity;
                    
                    return (
                      <div key={index} className="border-2 border-amber-200 rounded-xl p-4 hover:border-amber-400 transition-colors">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h5 className="font-bold text-amber-900 mb-1">{item.name}</h5>
                            <div className="flex items-center gap-3 text-sm text-amber-700">
                              <span>Số lượng: {item.quantity}</span>
                              {item.discount > 0 && (
                                <>
                                  <span className="text-gray-500 line-through">{formatPrice(item.price)}</span>
                                  <span className="text-red-600 font-bold">-{item.discount}%</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-amber-900">{formatPrice(itemTotal)}</p>
                            {item.discount > 0 && (
                              <p className="text-xs text-amber-600">{formatPrice(discountedPrice)}/sp</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-5 border-2 border-amber-300">
                <h4 className="font-bold text-amber-900 mb-3">Tổng cộng</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-amber-800">
                    <span>Tạm tính:</span>
                    <span className="font-semibold">{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-amber-800">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold">
                      {selectedOrder.shippingFee === 0 ? "Miễn phí" : formatPrice(selectedOrder.shippingFee)}
                    </span>
                  </div>
                  <div className="h-px bg-amber-400 my-2"></div>
                  <div className="flex justify-between text-xl">
                    <span className="font-bold text-amber-900">Tổng tiền:</span>
                    <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {formatPrice(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Đóng
              </button>
              {(selectedOrder.status === "pending" || selectedOrder.status === "shipping") && (
                <button 
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  Hủy đơn hàng
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={orderToCancel !== null}
        onClose={() => setOrderToCancel(null)}
        onConfirm={confirmCancelOrder}
        title="Xác nhận hủy đơn hàng"
        message={`Bạn có chắc chắn muốn hủy đơn hàng #${orderToCancel}?`}
        type="warning"
        confirmText="Hủy đơn hàng"
        cancelText="Giữ đơn hàng"
      />

      <ConfirmDialog
        isOpen={productToRemove !== null}
        onClose={() => setProductToRemove(null)}
        onConfirm={confirmRemoveWishlist}
        title="Xóa khỏi yêu thích"
        message="Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?"
        type="warning"
        confirmText="Xóa"
        cancelText="Hủy"
      />

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Đăng xuất"
        message="Bạn có chắc muốn đăng xuất khỏi tài khoản?"
        type="info"
        confirmText="Đăng xuất"
        cancelText="Hủy"
      />

    </div>
  );
};

export default ProfilePage;
