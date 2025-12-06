import { deleteProduct, getAllProducts } from "@/services/ProductService";
import type { Product } from "@/types/Product";
import type { ApiResponse } from "@/types/Response";
import { useEffect, useState } from "react";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { BookOpen, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useEmployeePermission } from "@/hooks/useEmployeePermission";
import Forbidden from "@/pages/common/Forbidden";
import { useAppToast } from "@/App";

const ProductPage = () => {
  const { loading: permissionLoading, hasPermission, currentEmployee } = useEmployeePermission(["manager", "warehouse"]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'book' | 'stationery'>('all');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const toast = useAppToast();

  const navigate = useNavigate();
  const canManage = hasPermission;
  const canDelete = currentEmployee?.position === "manager";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Product[]> = await getAllProducts();
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await deleteProduct(productToDelete);
      if (!response.success) {
        toast.error("Xóa sản phẩm thất bại, vui lòng thử lại!");
        return;
      }
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productToDelete)
      );
      toast.success("Xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Xóa sản phẩm thất bại, vui lòng thử lại!");
    } finally {
      setProductToDelete(null);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((product) => product.category === selectedCategory);

  if (permissionLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Quản lý sản phẩm
          </h2>
          <p className="text-gray-600 mt-1">
            Tổng số: {filteredProducts.length} sản phẩm
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => navigate("/admin/products/new")}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <MdAdd size={20} />
            Thêm sản phẩm
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-3">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-amber-200 hover:border-amber-400'
          }`}
        >
          Tất cả ({products.length})
        </button>
        <button
          onClick={() => setSelectedCategory('book')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            selectedCategory === 'book'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-amber-200 hover:border-amber-400'
          }`}
        >
          <BookOpen size={18} /> Sách ({products.filter(p => p.category === 'book').length})
        </button>
        <button
          onClick={() => setSelectedCategory('stationery')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            selectedCategory === 'stationery'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-amber-200 hover:border-amber-400'
          }`}
        >
          <Pencil size={18} /> Văn phòng phẩm ({products.filter(p => p.category === 'stationery').length})
        </button>
      </div>

      <div className="bg-white border border-amber-200 rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-500 to-orange-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-amber-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">
                      {product.title}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-amber-600">
                      {formatPrice(product.price)}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-800 font-medium">
                        {product.rating}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 20
                          ? "bg-green-100 text-green-700"
                          : product.stock > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock} sp
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {canManage && (
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <MdEdit size={18} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <MdDelete size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                Không tìm thấy sản phẩm nào
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
};

export default ProductPage;
