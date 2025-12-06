import { useLocation, useNavigate } from "react-router-dom";
import type { Invoice } from "@/types/Invoice";
import { ArrowLeft, Printer, Download, CheckCircle } from "lucide-react";
import { useEffect } from "react";

const InvoicePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoice: Invoice | undefined = location.state?.invoice;

  useEffect(() => {
    if (!invoice) {
      navigate("/cart");
    }
  }, [invoice, navigate]);

  if (!invoice) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return new Date().toLocaleString("vi-VN");
    return new Date(date).toLocaleString("vi-VN");
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng (COD)";
      case "bank_transfer":
        return "Chuyển khoản ngân hàng";
      case "momo":
        return "Ví MoMo";
      case "vnpay":
        return "VNPay";
      default:
        return method;
    }
  };

  const convertNumberToWords = (num: number): string => {
    const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const tens = ['', '', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
    
    if (num === 0) return 'không';
    if (num < 10) return ones[num];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
    }
    
    // Đơn giản hóa cho số lớn
    const billion = Math.floor(num / 1000000000);
    const million = Math.floor((num % 1000000000) / 1000000);
    const thousand = Math.floor((num % 1000000) / 1000);
    const hundred = num % 1000;
    
    let result = '';
    if (billion > 0) result += ones[billion] + ' tỷ ';
    if (million > 0) result += (million < 10 ? ones[million] : million) + ' triệu ';
    if (thousand > 0) result += (thousand < 10 ? ones[thousand] : thousand) + ' nghìn ';
    if (hundred > 0) result += (hundred < 10 ? ones[hundred] : hundred) + ' ';
    
    return result.trim().charAt(0).toUpperCase() + result.trim().slice(1);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 print:bg-white print:py-0">
      <div className="max-w-5xl mx-auto px-4">
        {/* Action Buttons - Hidden when printing */}
        <div className="mb-6 flex flex-wrap gap-3 print:hidden">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-amber-300 hover:border-amber-400 text-amber-800 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={20} />
            Về trang chủ
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Printer size={20} />
            In hóa đơn
          </button>
        </div>

        {/* Success Message - Hidden when printing */}
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl p-6 flex items-center gap-4 shadow-lg print:hidden animate-fadeIn">
          <div className="bg-green-500 rounded-full p-3 shadow-lg">
            <CheckCircle className="text-white flex-shrink-0" size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-green-800 mb-1 flex items-center gap-2">
              Đặt hàng thành công! <span className="text-3xl">🎉</span>
            </h2>
            <p className="text-green-700 text-sm">
              Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
            </p>
          </div>
        </div>

        {/* Invoice */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden print:rounded-none print:shadow-none border-4 border-amber-100 print:border-2 print:border-gray-300">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-10 print:bg-white print:text-black print:border-b-4 print:border-double print:border-gray-800">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 print:hidden"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-24 -translate-x-24 print:hidden"></div>
            
            <div className="relative flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl print:hidden">
                    <span className="text-4xl">📚</span>
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold print:text-black mb-1">Nhà Sách & VPP</h1>
                    <p className="text-amber-100 print:text-gray-600 font-medium">Tri thức - Sáng tạo - Thành công</p>
                  </div>
                </div>
                <div className="mt-6 space-y-1.5 text-sm text-amber-100 print:text-gray-700 bg-white/10 backdrop-blur-sm p-4 rounded-xl print:bg-transparent print:p-0">
                  <p className="flex items-center gap-2">
                    <span className="font-bold">📍</span>
                    <span><strong>Địa chỉ:</strong> 123 Đường Nguyễn Huệ, Quận 1, TP.HCM</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-bold">📞</span>
                    <span><strong>Hotline:</strong> 1900 xxxx</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-bold">✉️</span>
                    <span><strong>Email:</strong> contact@nhasach.vn</span>
                  </p>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="bg-white/95 backdrop-blur-sm px-8 py-4 rounded-2xl print:bg-gray-50 print:border-2 print:border-gray-300 shadow-xl print:shadow-none">
                  <p className="text-xs text-amber-600 print:text-gray-500 font-semibold uppercase tracking-wider mb-1">Mã đơn hàng</p>
                  <p className="text-3xl font-bold text-amber-900 print:text-black mb-2">{invoice.invoiceNumber}</p>
                  <div className="h-px bg-amber-300 print:bg-gray-300 my-2"></div>
                  <p className="text-xs text-amber-600 print:text-gray-500">
                    <strong>Ngày:</strong> {formatDate(invoice.createdAt)}
                  </p>
                </div>
                <div className="mt-3 text-center md:text-right">
                  <span className="inline-block px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold uppercase print:bg-yellow-100 print:border print:border-yellow-500">
                    Chờ xác nhận
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 print:p-8">
            {/* Customer Info */}
            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6 print:mb-8">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200 print:bg-white print:border-2 print:border-gray-400 shadow-md print:shadow-none">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-amber-300 print:border-gray-400">
                  <div className="bg-amber-600 text-white p-2 rounded-lg print:bg-gray-700">
                    <span className="text-xl">👤</span>
                  </div>
                  <h3 className="text-lg font-bold text-amber-900 print:text-black">
                    Thông tin khách hàng
                  </h3>
                </div>
                <div className="space-y-3 text-amber-900 print:text-black">
                  <div className="flex items-start gap-2">
                    <span className="font-bold min-w-[100px]">Họ tên:</span>
                    <span className="flex-1">{invoice.customerName}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold min-w-[100px]">Điện thoại:</span>
                    <span className="flex-1">{invoice.customerPhone}</span>
                  </div>
                  {invoice.customerEmail && (
                    <div className="flex items-start gap-2">
                      <span className="font-bold min-w-[100px]">Email:</span>
                      <span className="flex-1 break-all">{invoice.customerEmail}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <span className="font-bold min-w-[100px]">Địa chỉ:</span>
                    <span className="flex-1">{invoice.customerAddress}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200 print:bg-white print:border-2 print:border-gray-400 shadow-md print:shadow-none">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-blue-300 print:border-gray-400">
                  <div className="bg-blue-600 text-white p-2 rounded-lg print:bg-gray-700">
                    <span className="text-xl">💳</span>
                  </div>
                  <h3 className="text-lg font-bold text-blue-900 print:text-black">
                    Thông tin thanh toán
                  </h3>
                </div>
                <div className="space-y-3 text-blue-900 print:text-black">
                  <div className="flex items-start gap-2">
                    <span className="font-bold min-w-[100px]">Phương thức:</span>
                    <span className="flex-1">{getPaymentMethodText(invoice.paymentMethod)}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold min-w-[100px]">Trạng thái:</span>
                    <span className="inline-flex px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase print:border print:border-yellow-800">
                      ⏳ Chờ xác nhận
                    </span>
                  </div>
                  {invoice.note && (
                    <div className="flex items-start gap-2 pt-2 border-t border-blue-200 print:border-gray-300">
                      <span className="font-bold min-w-[100px]">Ghi chú:</span>
                      <span className="flex-1 italic text-gray-700">{invoice.note}</span>
                    </div>
                  )}
                  
                  {/* Payment QR Code for non-COD methods */}
                  {invoice.paymentMethod !== 'cod' && (
                    <div className="pt-4 border-t-2 border-blue-200 print:hidden">
                      <div className="bg-white rounded-xl p-4 shadow-inner border border-blue-300">
                        <p className="text-sm font-bold text-blue-900 mb-3 text-center">
                          Quét mã QR để thanh toán
                        </p>
                        <div className="flex flex-col items-center gap-3">
                          <div className="bg-white p-3 rounded-lg border-2 border-blue-400">
                            <img 
                              src={`https://img.vietqr.io/image/${
                                invoice.paymentMethod === 'bank_transfer' ? 'VCB' : 
                                invoice.paymentMethod === 'momo' ? 'MOMO' : 
                                'VNPAY'
                              }-9704229221234567890-compact2.jpg?amount=${invoice.total}&addInfo=DH%20${invoice.invoiceNumber}&accountName=NHASACH`}
                              alt="QR Payment"
                              className="w-48 h-48 object-contain"
                            />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-xs font-bold text-blue-900">Số tiền: {formatPrice(invoice.total)}</p>
                            <p className="text-xs text-blue-700">Nội dung: DH {invoice.invoiceNumber}</p>
                            {invoice.paymentMethod === 'bank_transfer' && (
                              <div className="mt-2 pt-2 border-t border-blue-200">
                                <p className="text-xs text-blue-800">
                                  <strong>Ngân hàng:</strong> Vietcombank<br/>
                                  <strong>STK:</strong> 9704229221234567890<br/>
                                  <strong>Chủ TK:</strong> NHASACH
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-10 print:mb-8">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-amber-300 print:border-gray-400">
                <div className="bg-amber-600 text-white p-2 rounded-lg print:bg-gray-700">
                  <span className="text-xl">📦</span>
                </div>
                <h3 className="text-2xl font-bold text-amber-900 print:text-black">
                  Chi tiết đơn hàng
                </h3>
              </div>
              <div className="overflow-x-auto rounded-xl border-2 border-amber-200 print:border-2 print:border-gray-400 shadow-lg print:shadow-none">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-100 to-orange-100 print:bg-gray-100">
                      <th className="text-left p-4 font-bold text-amber-900 border-b-2 border-amber-300 print:text-black print:border-gray-500 text-sm uppercase tracking-wide">STT</th>
                      <th className="text-left p-4 font-bold text-amber-900 border-b-2 border-amber-300 print:text-black print:border-gray-500 text-sm uppercase tracking-wide">Sản phẩm</th>
                      <th className="text-center p-4 font-bold text-amber-900 border-b-2 border-amber-300 print:text-black print:border-gray-500 text-sm uppercase tracking-wide">SL</th>
                      <th className="text-right p-4 font-bold text-amber-900 border-b-2 border-amber-300 print:text-black print:border-gray-500 text-sm uppercase tracking-wide">Đơn giá</th>
                      <th className="text-right p-4 font-bold text-amber-900 border-b-2 border-amber-300 print:text-black print:border-gray-500 text-sm uppercase tracking-wide">Giảm</th>
                      <th className="text-right p-4 font-bold text-amber-900 border-b-2 border-amber-300 print:text-black print:border-gray-500 text-sm uppercase tracking-wide">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-amber-100 hover:bg-amber-50/50 print:hover:bg-white print:border-gray-300 transition-colors">
                        <td className="p-4 text-amber-800 print:text-black font-semibold">{index + 1}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-200 print:border-gray-300 flex-shrink-0 shadow-sm">
                              <img 
                                src={item.product.thumbnail} 
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-amber-900 print:text-black mb-1 truncate">{item.product.title}</p>
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full print:bg-gray-200 print:text-black">
                                {item.product.category === 'book' ? '📚 Sách' : '✏️ VPP'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 text-amber-900 font-bold print:bg-gray-200 print:text-black">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="p-4 text-right text-amber-800 print:text-black font-medium">{formatPrice(item.price)}</td>
                        <td className="p-4 text-right">
                          {item.discount > 0 ? (
                            <span className="inline-flex px-2 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-bold print:bg-white print:border print:border-red-700">
                              -{item.discount}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right font-bold text-lg text-amber-900 print:text-black">
                          {formatPrice(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Summary */}
            <div className="flex justify-end">
              <div className="w-full md:w-2/5">
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200 print:bg-white print:border-3 print:border-double print:border-gray-500 shadow-xl print:shadow-none">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-amber-800 print:text-black py-2">
                      <span className="font-semibold text-base">Tạm tính:</span>
                      <span className="font-bold text-lg">{formatPrice(invoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-amber-800 print:text-black py-2">
                      <span className="font-semibold text-base">Phí vận chuyển:</span>
                      <span className="font-bold text-lg">
                        {invoice.shippingFee === 0 ? (
                          <span className="text-green-600 print:text-black bg-green-100 print:bg-transparent px-3 py-1 rounded-full text-sm">✓ Miễn phí</span>
                        ) : (
                          formatPrice(invoice.shippingFee)
                        )}
                      </span>
                    </div>
                    <div className="border-t-4 border-double border-amber-400 print:border-gray-600 pt-4 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-amber-600 print:text-gray-600 uppercase font-semibold mb-1">Tổng thanh toán</p>
                        <p className="text-2xl font-bold text-amber-900 print:text-black">Tổng cộng:</p>
                      </div>
                      <div className="text-right">
                        <span className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent print:text-black">
                          {formatPrice(invoice.total)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-amber-200/50 print:bg-gray-100 rounded-lg p-3 mt-2">
                      <p className="text-xs text-amber-800 print:text-gray-700 text-center">
                        (Bằng chữ: <span className="font-bold italic">{convertNumberToWords(invoice.total)} đồng</span>)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t-2 border-amber-200 text-center print:border-gray-400 print:mt-6">
              <p className="text-amber-700 mb-2 print:text-black">
                Cảm ơn quý khách đã mua hàng tại <strong>Nhà Sách & VPP</strong>
              </p>
              <p className="text-sm text-amber-600 print:text-gray-600">
                Mọi thắc mắc xin vui lòng liên hệ hotline: <strong>1900 xxxx</strong>
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 print:hidden">
                <div className="h-1 w-12 bg-amber-300 rounded"></div>
                <span className="text-amber-600 text-sm">✨ Hẹn gặp lại quý khách ✨</span>
                <div className="h-1 w-12 bg-amber-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions - Hidden when printing */}
        <div className="mt-6 text-center print:hidden">
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
