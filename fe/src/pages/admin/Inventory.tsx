import { useEffect, useState } from "react";
import { getInventoryTransactions } from "@/services/InventoryService";
import { getAllProducts } from "@/services/ProductService";
import type { InventoryTransaction } from "@/types/InventoryTransaction";
import type { Product } from "@/types/Product";
import type { ApiResponse } from "@/types/Response";
import { Package, TrendingUp, TrendingDown, AlertTriangle, History } from "lucide-react";
import { useEmployeePermission } from "@/hooks/useEmployeePermission";
import Forbidden from "@/pages/common/Forbidden";
import { useAppToast } from "@/App";

const InventoryPage = () => {
  const toast = useAppToast();
  const { loading: permissionLoading, hasPermission } = useEmployeePermission(["manager", "warehouse"]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"stock" | "transactions">("stock");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transResponse, productResponse]: [
        ApiResponse<InventoryTransaction[]>,
        ApiResponse<Product[]>
      ] = await Promise.all([getInventoryTransactions(), getAllProducts()]);

      if (transResponse.success && transResponse.data) {
        setTransactions(transResponse.data);
      }
      if (productResponse.success && productResponse.data) {
        setProducts(productResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Có lỗi khi tải dữ liệu kho hàng!");
    } finally {
      setLoading(false);
    }
  };

  const lowStockProducts = products.filter((p) => p.stock <= 10);
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "import":
        return <TrendingUp className="text-green-600" size={18} />;
      case "export":
        return <TrendingDown className="text-red-600" size={18} />;
      case "adjustment":
        return <AlertTriangle className="text-yellow-600" size={18} />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      import: "Nhập kho",
      export: "Xuất kho",
      adjustment: "Điều chỉnh",
    };
    return types[type] || type;
  };

  if (permissionLoading || loading) {
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
        message="Bạn cần là Quản lý hoặc Nhân viên kho để quản lý kho hàng"
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
          <Package size={32} />
          Quản lý Kho hàng
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm">Tổng sản phẩm</p>
              <h3 className="text-3xl font-bold mt-2">{products.length}</h3>
            </div>
            <Package className="text-blue-200" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-green-100 text-sm">Tổng tồn kho</p>
              <h3 className="text-3xl font-bold mt-2">
                {products.reduce((sum, p) => sum + p.stock, 0)}
              </h3>
            </div>
            <TrendingUp className="text-green-200" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-orange-100 text-sm">Giá trị tồn kho</p>
              <h3 className="text-2xl font-bold mt-2">
                {totalValue.toLocaleString("vi-VN")} đ
              </h3>
            </div>
            <Package className="text-orange-200" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-red-100 text-sm">Sắp hết hàng</p>
              <h3 className="text-3xl font-bold mt-2">{lowStockProducts.length}</h3>
            </div>
            <AlertTriangle className="text-red-200" size={32} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-amber-200">
        <button
          onClick={() => setActiveTab("stock")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "stock"
              ? "text-amber-600 border-b-2 border-amber-600"
              : "text-gray-600 hover:text-amber-600"
          }`}
        >
          <Package size={20} className="inline mr-2" />
          Tồn kho
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "transactions"
              ? "text-amber-600 border-b-2 border-amber-600"
              : "text-gray-600 hover:text-amber-600"
          }`}
        >
          <History size={20} className="inline mr-2" />
          Lịch sử giao dịch
        </button>
      </div>

      {/* Content */}
      {activeTab === "stock" ? (
        <div className="bg-white border border-amber-200 rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-500 to-orange-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                    Danh mục
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                    Tồn kho
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                    Giá trị
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg border border-amber-200"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{product.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                        {product.category === "book" ? "Sách" : "Văn phòng phẩm"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold text-lg ${
                          product.stock <= 10 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {product.price.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      {(product.stock * product.price).toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-6 py-4">
                      {product.stock <= 10 ? (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                          <AlertTriangle size={12} />
                          Sắp hết
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Đủ hàng
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-amber-200 rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-500 to-orange-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                    Mã GD
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                    Loại
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                    Số lượng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                    Tồn trước
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                    Tồn sau
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">
                    Ngày GD
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {transactions.map((trans) => (
                  <tr key={trans._id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-amber-700">
                      {trans.transactionNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={trans.productId.thumbnail}
                          alt={trans.productId.title}
                          className="w-10 h-10 object-cover rounded-lg border border-amber-200"
                        />
                        <span className="font-medium text-gray-900">
                          {trans.productId.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(trans.type)}
                        <span className="text-sm font-medium">{getTypeLabel(trans.type)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold ${
                          trans.type === "import" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {trans.type === "import" ? "+" : "-"}
                        {trans.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{trans.previousStock}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {trans.newStock}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(trans.transactionDate).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
