import { getAllProducts } from "@/services/ProductService";
import { addToCart, updateQuantity } from "@/store/CartReducer";
import { addToWishlistStore, removeFromWishlistStore, setWishlist } from "@/store/WishlistReducer";
import { addToWishlist, removeFromWishlist, getWishlist } from "@/services/WishlistService";
import type { AppDispatch, RootState } from "@/store/store";
import type { Cart } from "@/types/Cart";
import type { Product } from "@/types/Product";
import type { ApiResponse } from "@/types/Response";
import { ShoppingCart, Star, Search, X, Store, BookOpen, Pencil, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { AiOutlineDollarCircle, AiOutlineThunderbolt } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'book' | 'stationery'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const cart: Cart[] = useSelector((state: RootState) => state.cart);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Product[]> = await getAllProducts();
        console.log(response);
        if (response.success && response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      // Kiểm tra cookie userId trước khi gọi API
      const hasUserId = document.cookie.split(';').some(c => c.trim().startsWith('userId='));
      
      if (user && (user._id || user.id) && hasUserId) {
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
    fetchWishlist();
  }, [user, dispatch]);

  const handleToggleWishlist = async (product: Product) => {
    // Kiểm tra cookie userId
    const hasUserId = document.cookie.split(';').some(c => c.trim().startsWith('userId='));
    
    if (!user || !hasUserId) {
      // Show toast instead of alert
      const event = new CustomEvent('showToast', { 
        detail: { message: 'Vui lòng đăng nhập để thêm vào danh sách yêu thích', type: 'warning' } 
      });
      window.dispatchEvent(event);
      setTimeout(() => navigate('/login'), 500);
      return;
    }

    const isInWishlist = wishlist.some((item) => item._id === product._id);

    try {
      if (isInWishlist) {
        await removeFromWishlist(product._id);
        dispatch(removeFromWishlistStore(product._id));
        const event = new CustomEvent('showToast', { 
          detail: { message: 'Đã xóa khỏi danh sách yêu thích', type: 'success' } 
        });
        window.dispatchEvent(event);
      } else {
        await addToWishlist(product._id);
        dispatch(addToWishlistStore(product));
        const event = new CustomEvent('showToast', { 
          detail: { message: 'Đã thêm vào danh sách yêu thích', type: 'success' } 
        });
        window.dispatchEvent(event);
      }
    } catch (error: any) {
      console.error("Wishlist toggle failed:", error);
      if (error.response?.status === 401) {
        const event = new CustomEvent('showToast', { 
          detail: { message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại', type: 'error' } 
        });
        window.dispatchEvent(event);
        setTimeout(() => navigate('/login'), 1000);
      }
    }
  };

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => 
      searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleAddToCart = (product: Product) => {
    if (cart.some((item) => item._id === product._id)) {
      dispatch(updateQuantity({ productId: product._id, quantity: 1 }));
    } else {
      dispatch(addToCart({ product }));
    }
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in-right';
    notification.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <div>
        <div class="font-bold">Thêm vào giỏ hàng thành công!</div>
        <div class="text-sm text-green-100">${product.name}</div>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slide-out-right 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-amber-600 font-medium">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Only show if not logged in */}
      {!user && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                🎉 Chào mừng đến với Nhà Sách & VPP!
              </h2>
              <p className="text-amber-50 text-lg mb-2">
                Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt
              </p>
              <ul className="text-amber-100 text-sm space-y-1 mt-3">
                <li>✨ Giảm giá 10% cho đơn hàng đầu tiên</li>
                <li>🎁 Tích điểm đổi quà hấp dẫn</li>
                <li>🚚 Miễn phí ship cho thành viên</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-amber-600 hover:bg-amber-50 px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg whitespace-nowrap"
              >
                📝 Đăng ký ngay
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-amber-800/50 backdrop-blur-sm text-white hover:bg-amber-800/70 px-8 py-3 rounded-xl font-semibold transition-all border-2 border-white/30 hover:border-white/50"
              >
                Đã có tài khoản? Đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent mb-2">
            📖 Sản Phẩm Nổi Bật
          </h2>
          <p className="text-amber-600">Khám phá bộ sưu tập sách & văn phòng phẩm chất lượng</p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          {/* Category Filter - Left */}
          <div className="flex gap-3 flex-wrap justify-center md:justify-start">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-3 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white border-2 border-amber-200 text-amber-800 hover:border-amber-400'
              }`}
            >
              <Store size={20} /> Tất cả ({products.length})
            </button>
            <button
              onClick={() => setSelectedCategory('book')}
              className={`px-5 py-3 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === 'book'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white border-2 border-amber-200 text-amber-800 hover:border-amber-400'
              }`}
            >
              <BookOpen size={20} /> Sách ({products.filter(p => p.category === 'book').length})
            </button>
            <button
              onClick={() => setSelectedCategory('stationery')}
              className={`px-5 py-3 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === 'stationery'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white border-2 border-amber-200 text-amber-800 hover:border-amber-400'
              }`}
            >
              <Pencil size={20} /> VPP ({products.filter(p => p.category === 'stationery').length})
            </button>
          </div>

          {/* Search Bar - Right */}
          <div className="w-full md:w-auto md:max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-amber-500" size={20} />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all text-amber-900 placeholder:text-amber-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-amber-500 hover:text-amber-700 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <p className="mb-6 text-sm text-amber-600 text-center">
            Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm cho "{searchQuery}"
          </p>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-amber-800 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-amber-600 mb-6">
              {searchQuery 
                ? `Không có sản phẩm nào phù hợp với từ khóa "${searchQuery}"`
                : 'Không có sản phẩm nào trong danh mục này'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
            const discountedPrice = calculateDiscountedPrice(
              product.price,
              product.discountPercentage
            );

            return (
              <div
                key={product._id}
                className="bg-white border border-amber-200/50 rounded-2xl overflow-hidden hover:border-amber-400 hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1"
              >
                <div 
                  className="relative overflow-hidden bg-amber-50 w-full h-64 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />

                  {product.discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      -{product.discountPercentage}%
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWishlist(product);
                    }}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 z-10"
                  >
                    <Heart
                      size={20}
                      className={wishlist.some(item => item._id === product._id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                    />
                  </button>

                  <div className="absolute top-14 right-3 bg-amber-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Còn {product.stock} sp
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star
                        className="text-amber-500 fill-amber-500"
                        size={16}
                      />
                      <span className="text-amber-900 font-semibold">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-amber-600 text-sm">
                      ({product.stock} đánh giá)
                    </span>
                  </div>

                  <h3 
                    className="text-lg font-bold text-amber-900 line-clamp-2 min-h-14 cursor-pointer hover:text-orange-600 transition-colors"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.title}
                  </h3>

                  <p 
                    className="text-amber-700 text-sm line-clamp-2 min-h-10 cursor-pointer hover:text-amber-900 transition-colors"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.description}
                  </p>

                  <div className="pt-2 border-t border-amber-200">
                    {product.discountPercentage > 0 ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-red-600">
                            {formatPrice(discountedPrice)}
                          </span>
                        </div>
                        <span className="text-amber-500 line-through text-sm">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-amber-900">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart size={20} />
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
        <div className="bg-white border border-amber-200/50 rounded-2xl p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2 group">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-110">
            <TiTick size={36} className="text-white" />
          </div>
          <h3 className="text-amber-900 font-bold text-lg mb-2">
            Chính hãng 100%
          </h3>
          <p className="text-amber-700 text-sm">
            Cam kết sản phẩm chính hãng, bảo hành đầy đủ
          </p>
        </div>

        <div className="bg-white border border-amber-200/50 rounded-2xl p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2 group">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-110">
            <AiOutlineDollarCircle size={36} className="text-white" />
          </div>
          <h3 className="text-amber-900 font-bold text-lg mb-2">
            Giá tốt nhất
          </h3>
          <p className="text-amber-700 text-sm">
            Cam kết giá rẻ nhất thị trường
          </p>
        </div>

        <div className="bg-white border border-amber-200/50 rounded-2xl p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2 group">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-110">
            <AiOutlineThunderbolt size={36} className="text-white" />
          </div>
          <h3 className="text-amber-900 font-bold text-lg mb-2">
            Giao hàng nhanh
          </h3>
          <p className="text-amber-700 text-sm">Miễn phí ship đơn từ 500k</p>
        </div>
      </div>

      {/* Modal hiển thị mô tả sản phẩm */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-t-3xl">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold pr-12">{selectedProduct.title}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-300 fill-yellow-300" size={18} />
                    <span className="font-semibold">{selectedProduct.rating}</span>
                  </div>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1.5">
                    {selectedProduct.category === 'book' ? (
                      <><BookOpen size={14} /> Sách</>
                    ) : (
                      <><Pencil size={14} /> Văn phòng phẩm</>
                    )}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Image */}
                <div className="flex justify-center bg-amber-50 rounded-2xl p-4">
                  <img
                    src={selectedProduct.thumbnail}
                    alt={selectedProduct.title}
                    className="max-h-96 w-auto object-contain rounded-xl"
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                    📝 Mô tả sản phẩm
                  </h3>
                  <p className="text-amber-800 leading-relaxed text-justify">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Product Info */}
                <div className="grid grid-cols-2 gap-4 bg-amber-50 rounded-2xl p-6">
                  <div className="space-y-2">
                    <p className="text-amber-700 font-semibold">💰 Giá gốc:</p>
                    <p className="text-2xl font-bold text-amber-900">
                      {formatPrice(selectedProduct.price)}
                    </p>
                  </div>
                  {selectedProduct.discountPercentage > 0 && (
                    <div className="space-y-2">
                      <p className="text-amber-700 font-semibold">🏷️ Giá khuyến mãi:</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatPrice(calculateDiscountedPrice(selectedProduct.price, selectedProduct.discountPercentage))}
                        <span className="text-sm ml-2 bg-red-600 text-white px-2 py-1 rounded-full">
                          -{selectedProduct.discountPercentage}%
                        </span>
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-amber-700 font-semibold">📦 Tình trạng kho:</p>
                    <p className="text-lg font-bold text-green-600">
                      Còn {selectedProduct.stock} sản phẩm
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-amber-700 font-semibold">⭐ Đánh giá:</p>
                    <p className="text-lg font-bold text-amber-600">
                      {selectedProduct.rating}/5 ({selectedProduct.stock} đánh giá)
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-lg"
                >
                  <ShoppingCart size={24} />
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
