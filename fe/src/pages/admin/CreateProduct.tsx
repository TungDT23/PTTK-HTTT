import { createProduct } from "@/services/ProductService";
import type { ProductForm } from "@/types/Product";
import { useState } from "react";
import { MdArrowBack, MdSave, MdImage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEmployeePermission } from "@/hooks/useEmployeePermission";
import Forbidden from "@/pages/common/Forbidden";
import { useAppToast } from "@/App";
import { Button } from "@/components/Button";
import { Loader2 } from "lucide-react";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { loading: permissionLoading, hasPermission } = useEmployeePermission(["manager", "warehouse"]);
  const [loading, setLoading] = useState(false);
  const toast = useAppToast();
  const [formData, setFormData] = useState<ProductForm>({
    title: "",
    description: "",
    category: "book",
    price: "",
    discountPercentage: 0,
    rating: 5,
    stock: "",
    thumbnail: "",
    isActive: true,
    slug: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.stock) {
      toast.warning("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        discountPercentage: Number(formData.discountPercentage),
        rating: Number(formData.rating),
        stock: Number(formData.stock),
      };

      const response = await createProduct(productData);
      console.log("Product created:", response);

      if (response.success && response.data) {
        toast.success("Tạo sản phẩm thành công!");
        setTimeout(() => navigate("/admin/products"), 500);
      } else {
        toast.error("Tạo sản phẩm thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (permissionLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <Forbidden
        requiredRoles={["Quản lý", "Nhân viên kho"]}
        message="Bạn cần là Quản lý hoặc Nhân viên kho để tạo sản phẩm mới"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/products")}
          className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Tạo sản phẩm mới
          </h2>
          <p className="text-gray-600 mt-1">Điền thông tin sản phẩm</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-amber-200 rounded-lg p-6 space-y-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-amber-200 pb-3">
                Thông tin cơ bản
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="VD: Đắc Nhân Tâm"
                  required
                  className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đường dẫn (Slug)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="dac-nhan-tam"
                  className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tự động tạo từ tên sản phẩm
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'book' | 'stationery' }))}
                  required
                  className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="book">📚 Sách</option>
                  <option value="stationery">✏️ Văn phòng phẩm</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="bg-white border border-amber-200 rounded-lg p-6 space-y-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-amber-200 pb-3">
                Giá & Khuyến mãi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá bán (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="180000"
                    min="0"
                    required
                    className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giảm giá (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    placeholder="12"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {formData.price && Number(formData.price) > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Giá sau giảm:</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-amber-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          Number(formData.price) -
                            (Number(formData.price) *
                              Number(formData.discountPercentage)) /
                              100
                        )}
                      </div>
                      {Number(formData.discountPercentage) > 0 && (
                        <div className="text-sm text-gray-500 line-through">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(Number(formData.price))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white border border-amber-200 rounded-lg p-6 space-y-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-amber-200 pb-3">
                Tồn kho & Đánh giá
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng tồn kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="40"
                    min="0"
                    required
                    className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá (1-5 sao)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="4.8"
                    min="1"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-amber-200 rounded-lg p-6 space-y-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-amber-200 pb-3">
                Trạng thái
              </h3>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-2 focus:ring-amber-500"
                />
                <div>
                  <div className="text-gray-800 font-medium">
                    Hiển thị sản phẩm
                  </div>
                  <div className="text-sm text-gray-600">
                    Sản phẩm sẽ xuất hiện trên trang chủ
                  </div>
                </div>
              </label>
            </div>

            <div className="bg-white border border-amber-200 rounded-lg p-6 space-y-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-amber-200 pb-3">
                Hình ảnh
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL hình ảnh
                </label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {formData.thumbnail ? (
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-amber-200">
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-amber-50 border-2 border-dashed border-amber-300 flex items-center justify-center">
                  <div className="text-center">
                    <MdImage className="mx-auto text-amber-400" size={48} />
                    <p className="mt-2 text-sm text-gray-500">
                      Chưa có hình ảnh
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={loading}
                leftIcon={loading ? <Loader2 className="animate-spin" /> : <MdSave size={20} />}
                className="w-full"
              >
                {loading ? "Đang tạo..." : "Tạo sản phẩm"}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate("/admin/products")}
                className="w-full"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
