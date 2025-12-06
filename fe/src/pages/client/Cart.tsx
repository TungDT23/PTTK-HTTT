import { clearCart, removeFromCart, updateQuantity } from "@/store/CartReducer";
import type { AppDispatch, RootState } from "@/store/store";
import type { Cart } from "@/types/Cart";
import type { CheckoutForm } from "@/types/Invoice";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag, Trash2, Minus, Plus, ShoppingCart, ArrowRight, X, CreditCard, Wallet, Building2, Smartphone, BookOpen, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createInvoice } from "@/services/InvoiceService";
import { useAppToast } from "@/App";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Modal } from "@/components/Modal";

const CartPage = () => {
  const cartList: Cart[] = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const toast = useAppToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    customerName: user?.fullName || "",
    customerPhone: user?.phone || "",
    customerEmail: user?.email || "",
    customerAddress: "",
    paymentMethod: "cod",
    note: "",
  });

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  const subtotal: number = cartList.reduce((total, item) => {
    const itemPrice = calculateDiscountedPrice(item.product.price, item.product.discountPercentage);
    return total + itemPrice * item.quantity;
  }, 0);

  // Tính phí ship theo phần trăm
  const calculateShipping = (subtotal: number) => {
    if (subtotal >= 200000) {
      return 0; // Miễn phí ship từ 200k trở lên
    } else if (subtotal >= 100000) {
      return subtotal * 0.1; // 10% từ 100k đến dưới 200k
    } else {
      return subtotal * 0.15; // 15% dưới 100k
    }
  };

  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  const dispatch = useDispatch<AppDispatch>();

  const handleRemove = (_id: string) => {
    setItemToRemove(_id);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      dispatch(removeFromCart({ productId: itemToRemove }));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      setItemToRemove(null);
    }
  };

  const handleClear = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    dispatch(clearCart());
    toast.success("Đã xóa tất cả sản phẩm");
    setShowClearConfirm(false);
  };

  const handleIncrease = (_id: string) => {
    dispatch(updateQuantity({ productId: _id, quantity: 1 }));
  };

  const handleDecrease = (_id: string) => {
    const item = cartList.find((item) => item._id === _id);
    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ productId: _id, quantity: -1 }));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleCheckoutClick = () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để thanh toán!");
      setTimeout(() => navigate("/login"), 500);
      return;
    }
    setShowCheckout(true);
  };

  const handleCheckoutFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCheckoutForm({
      ...checkoutForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkoutForm.customerName || !checkoutForm.customerPhone || !checkoutForm.customerAddress) {
      toast.warning("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    if (checkoutForm.customerPhone.length < 10) {
      toast.warning("Số điện thoại không hợp lệ!");
      return;
    }

    // Hiển thị modal xác nhận
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    const userId = user?.id || user?._id;
    
    if (!userId) {
      toast.error("Vui lòng đăng nhập để đặt hàng!");
      setTimeout(() => navigate("/login"), 500);
      return;
    }

    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const invoiceNumber = `INV${Date.now()}`;
      
      const invoiceData = {
        invoiceNumber,
        userId: userId,
        ...checkoutForm,
        items: cartList.map(item => ({
          product: {
            _id: item.product._id,
            title: item.product.title,
            thumbnail: item.product.thumbnail,
            category: item.product.category,
          },
          quantity: item.quantity,
          price: item.product.price,
          discount: item.product.discountPercentage,
          total: calculateDiscountedPrice(item.product.price, item.product.discountPercentage) * item.quantity
        })),
        subtotal,
        shippingFee: shipping,
        total,
      };
      
      const response = await createInvoice(invoiceData);
      
      if (!response.success) {
        toast.error("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!");
        return;
      }
      
      // Xóa giỏ hàng
      dispatch(clearCart());
      toast.success("Đặt hàng thành công!");
      
      // Chuyển đến trang hóa đơn với dữ liệu
      setTimeout(() => {
        navigate("/invoice", { state: { invoice: { ...invoiceData, status: 'pending', createdAt: new Date() } } });
      }, 1000);
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    { value: "cod", label: "Thanh toán khi nhận hàng (COD)", icon: Wallet },
    { value: "bank_transfer", label: "Chuyển khoản ngân hàng", icon: Building2 },
    { value: "momo", label: "Ví MoMo", icon: Smartphone },
    { value: "vnpay", label: "VNPay", icon: CreditCard },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl">
            <ShoppingCart className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
            Giỏ Hàng Của Bạn
          </h1>
        </div>
        <p className="text-amber-600 ml-16">
          {cartList.length > 0 ? `Bạn có ${cartList.length} sản phẩm trong giỏ hàng` : "Giỏ hàng trống"}
        </p>
      </div>

      {cartList.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-900">Danh sách sản phẩm</h2>
              <button
                onClick={handleClear}
                className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-2 transition-colors"
              >
                <Trash2 size={16} />
                Xóa tất cả
              </button>
            </div>

            {cartList.map((item) => {
              const discountedPrice = calculateDiscountedPrice(
                item.product.price,
                item.product.discountPercentage
              );

              return (
                <div
                  key={item._id}
                  className="bg-white border border-amber-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-xl overflow-hidden bg-amber-50 border border-amber-200">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-amber-900 mb-1">
                            {item.product.title}
                          </h3>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                            {item.product.category === 'book' ? (
                              <><BookOpen size={12} /> Sách</>
                            ) : (
                              <><Pencil size={12} /> Văn phòng phẩm</>
                            )}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="mt-auto flex justify-between items-end">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDecrease(item._id)}
                            disabled={item.quantity <= 1}
                            className="bg-amber-100 hover:bg-amber-200 disabled:bg-gray-100 disabled:text-gray-400 text-amber-800 rounded-lg p-2 transition-all disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-lg font-bold text-amber-900 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrease(item._id)}
                            disabled={item.quantity >= item.product.stock}
                            className="bg-amber-100 hover:bg-amber-200 disabled:bg-gray-100 disabled:text-gray-400 text-amber-800 rounded-lg p-2 transition-all disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>
                          <span className="text-sm text-amber-600 ml-2">
                            (Còn {item.product.stock} sp)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          {item.product.discountPercentage > 0 ? (
                            <>
                              <p className="text-sm text-gray-500 line-through">
                                {formatPrice(item.product.price)}
                              </p>
                              <p className="text-xl font-bold text-red-600">
                                {formatPrice(discountedPrice)}
                              </p>
                            </>
                          ) : (
                            <p className="text-xl font-bold text-amber-900">
                              {formatPrice(item.product.price)}
                            </p>
                          )}
                          <p className="text-sm text-amber-600 mt-1">
                            Tổng: {formatPrice(discountedPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-amber-200/50 rounded-2xl p-6 shadow-lg sticky top-24">
              <h2 className="text-xl font-bold text-amber-900 mb-6">Tóm tắt đơn hàng</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-amber-800">
                  <span>Tạm tính:</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-amber-800">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      <>
                        {formatPrice(shipping)}
                        <span className="text-xs ml-1">
                          ({subtotal >= 100000 ? '10%' : '15%'})
                        </span>
                      </>
                    )}
                  </span>
                </div>

                {subtotal < 200000 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    {subtotal < 100000 ? (
                      <p className="text-xs text-amber-700">
                        💡 Phí ship 15%. Mua thêm {formatPrice(100000 - subtotal)} để giảm phí ship xuống 10%!
                      </p>
                    ) : (
                      <p className="text-xs text-amber-700">
                        💡 Phí ship 10%. Mua thêm {formatPrice(200000 - subtotal)} để được miễn phí ship!
                      </p>
                    )}
                  </div>
                )}

                <div className="border-t border-amber-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-amber-900">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCheckoutClick}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg mb-3">
                Thanh toán
                <ArrowRight size={20} />
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full bg-white border-2 border-amber-300 hover:border-amber-400 text-amber-800 hover:text-amber-900 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} />
                Tiếp tục mua hàng
              </button>

              {/* Benefits */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-amber-700">
                  <div className="bg-green-100 rounded-full p-1.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Miễn phí đổi trả trong 7 ngày</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-amber-700">
                  <div className="bg-green-100 rounded-full p-1.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Giao hàng nhanh 2-3 ngày</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-amber-700">
                  <div className="bg-green-100 rounded-full p-1.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Thanh toán an toàn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-amber-200/50 rounded-3xl p-12 text-center shadow-lg">
          <div className="bg-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="text-amber-600" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-amber-900 mb-3">
            Giỏ hàng trống
          </h3>
          <p className="text-amber-600 mb-6">
            Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <ShoppingBag size={20} />
            Khám phá sản phẩm
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-t-3xl flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">🧾 Xác Nhận Đơn Hàng</h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="p-6">
              {/* Order Summary */}
              <div className="mb-6 bg-amber-50 rounded-2xl p-6 border border-amber-200">
                <h3 className="text-xl font-bold text-amber-900 mb-4">📦 Thông tin đơn hàng</h3>
                <div className="space-y-3">
                  {cartList.map((item) => {
                    const itemPrice = calculateDiscountedPrice(item.product.price, item.product.discountPercentage);
                    return (
                      <div key={item._id} className="flex justify-between items-center bg-white p-3 rounded-xl">
                        <div className="flex items-center gap-3">
                          <img src={item.product.thumbnail} alt={item.product.title} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-semibold text-amber-900 text-sm">{item.product.title}</p>
                            <p className="text-xs text-amber-600">SL: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-amber-900">{formatPrice(itemPrice * item.quantity)}</p>
                      </div>
                    );
                  })}
                  
                  <div className="border-t border-amber-300 pt-3 space-y-2">
                    <div className="flex justify-between text-amber-800">
                      <span>Tạm tính:</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-amber-800">
                      <span>Phí vận chuyển:</span>
                      <span className="font-semibold">{shipping === 0 ? <span className="text-green-600">Miễn phí</span> : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t border-amber-300">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-amber-900 mb-4">📋 Thông tin giao hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-amber-900 font-semibold mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={checkoutForm.customerName}
                      onChange={handleCheckoutFormChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-amber-900 font-semibold mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={checkoutForm.customerPhone}
                      onChange={handleCheckoutFormChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
                      placeholder="0123456789"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-amber-900 font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={checkoutForm.customerEmail}
                      onChange={handleCheckoutFormChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-amber-900 font-semibold mb-2">
                      Địa chỉ giao hàng <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="customerAddress"
                      value={checkoutForm.customerAddress}
                      onChange={handleCheckoutFormChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all resize-none"
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-amber-900 font-semibold mb-2">
                      Ghi chú
                    </label>
                    <textarea
                      name="note"
                      value={checkoutForm.note}
                      onChange={handleCheckoutFormChange}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all resize-none"
                      placeholder="Ghi chú thêm về đơn hàng (tùy chọn)"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-amber-900 mb-4">💳 Phương thức thanh toán</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.value}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          checkoutForm.paymentMethod === method.value
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-amber-200 bg-white hover:border-amber-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={checkoutForm.paymentMethod === method.value}
                          onChange={handleCheckoutFormChange}
                          className="w-5 h-5 text-amber-600"
                        />
                        <Icon className="text-amber-600" size={24} />
                        <span className="font-semibold text-amber-900">{method.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 bg-white border-2 border-amber-300 hover:border-amber-400 text-amber-800 hover:text-amber-900 py-4 rounded-xl font-semibold transition-all"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Xác nhận đặt hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                  <ShoppingCart size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Xác nhận đặt hàng</h3>
                  <p className="text-amber-50 text-sm mt-1">Vui lòng kiểm tra thông tin trước khi xác nhận</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Order Summary */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-700 font-medium flex items-center gap-2">
                      <ShoppingBag size={18} />
                      Số lượng sản phẩm
                    </span>
                    <span className="font-bold text-amber-900">{cartList.length} sản phẩm</span>
                  </div>
                  <div className="h-px bg-amber-200"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-700 font-medium flex items-center gap-2">
                      <CreditCard size={18} />
                      Phương thức thanh toán
                    </span>
                    <span className="font-bold text-amber-900 text-sm">
                      {paymentMethods.find(m => m.value === checkoutForm.paymentMethod)?.label}
                    </span>
                  </div>
                  <div className="h-px bg-amber-200"></div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-amber-800 font-bold text-lg">Tổng tiền</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  Thông tin nhận hàng
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-600 font-medium min-w-[100px]">Người nhận:</span>
                    <span className="text-gray-900 font-semibold">{checkoutForm.customerName}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-600 font-medium min-w-[100px]">Số điện thoại:</span>
                    <span className="text-gray-900 font-semibold">{checkoutForm.customerPhone}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-600 font-medium min-w-[100px]">Địa chỉ:</span>
                    <span className="text-gray-900 font-semibold">{checkoutForm.customerAddress}</span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex gap-3">
                <div className="text-amber-600 mt-0.5">⚠️</div>
                <p className="text-sm text-amber-800">
                  Vui lòng kiểm tra kỹ thông tin đơn hàng. Sau khi xác nhận, đơn hàng sẽ được xử lý ngay lập tức.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1"
              >
                Hủy bỏ
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleConfirmOrder}
                loading={isSubmitting}
                className="flex-1"
              >
                Xác nhận đặt hàng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={itemToRemove !== null}
        onClose={() => setItemToRemove(null)}
        onConfirm={confirmRemove}
        title="Xóa sản phẩm"
        message="Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"
        type="warning"
        confirmText="Xóa"
        cancelText="Hủy"
      />

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClear}
        title="Xóa tất cả sản phẩm"
        message="Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?"
        type="danger"
        confirmText="Xóa tất cả"
        cancelText="Hủy"
      />
    </div>
  );
};

export default CartPage;
