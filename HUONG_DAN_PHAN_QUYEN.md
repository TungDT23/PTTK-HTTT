# HƯỚNG DẪN SỬ DỤNG PHÂN QUYỀN

## ✅ Đã hoàn thành:

### 1. **Backend API**
- Tất cả routes `/admin/*` đã được bảo vệ bằng middleware
- API `/admin/me` để lấy thông tin nhân viên hiện tại
- Cookie authentication đã được cấu hình

### 2. **Frontend Components**
- **Forbidden Page** (`/src/pages/common/Forbidden.tsx`): Trang thông báo lỗi phân quyền đẹp
- **useEmployeePermission Hook** (`/src/hooks/useEmployeePermission.ts`): Hook kiểm tra quyền

### 3. **Trang đã áp dụng phân quyền**
✅ Employee (List/Create/Edit) - Chỉ Manager

## 🔄 Cách áp dụng cho trang khác:

### Bước 1: Import hook và Forbidden page
\`\`\`tsx
import { useEmployeePermission } from "@/hooks/useEmployeePermission";
import Forbidden from "@/pages/common/Forbidden";
\`\`\`

### Bước 2: Sử dụng hook trong component
\`\`\`tsx
const YourPage = () => {
  // Truyền mảng các position được phép truy cập
  const { loading: permissionLoading, hasPermission } = useEmployeePermission(
    ["manager", "warehouse"] // Ví dụ: cho phép manager và warehouse
  );

  // ... rest of your code
\`\`\`

### Bước 3: Thêm logic hiển thị
\`\`\`tsx
if (permissionLoading) {
  return (
    <div className="p-6">
      <div className="flex justify-center items-center h-64">
        <div className="text-amber-600">Đang kiểm tra quyền...</div>
      </div>
    </div>
  );
}

if (!hasPermission) {
  return (
    <Forbidden 
      requiredRoles={["manager", "warehouse"]} 
      message="Chức năng này chỉ dành cho Quản lý và Nhân viên kho."
    />
  );
}

// Nội dung trang chính ở đây
return (
  <div>...</div>
);
\`\`\`

## 📋 Danh sách cần áp dụng phân quyền:

### Supplier Pages (Manager + Warehouse)
- [x] Supplier List - ĐÃ XEM (/admin/suppliers)
- [ ] Create Supplier (/admin/suppliers/new)
- [ ] Edit Supplier (/admin/suppliers/edit/:id)

### Product Pages (Manager + Warehouse cho tạo/sửa, Manager cho xóa)
- [ ] Product List (/admin/products)
- [ ] Create Product (/admin/products/new)
- [ ] Edit Product (/admin/products/edit/:id)

### Inventory Pages (Manager + Warehouse)
- [ ] Inventory (/admin/inventory)

## 🎯 Position Mapping:

| Position | Vietnamese | Quyền hạn |
|----------|-----------|-----------|
| manager | Quản lý | Toàn quyền |
| sales | Nhân viên bán hàng | Sản phẩm (xem), Đơn hàng, Khách hàng |
| warehouse | Nhân viên kho | Sản phẩm, Kho, Nhập hàng, Nhà cung cấp |
| accountant | Kế toán | Tài chính, Lương, Báo cáo |

## 🚀 Test:

Đăng nhập với các tài khoản sau để test phân quyền:

\`\`\`
Manager: manager@bookstore.com / 123456 (nếu đã tạo)
Sales: tuanlevan748@gmail.com / 123456
Warehouse: anhtrantuan267@gmail.com / 123456
Accountant: tramytranthi584@gmail.com / 123456
\`\`\`

Thử truy cập các trang:
- Sales truy cập /admin/employees → Thấy trang Forbidden
- Warehouse truy cập /admin/suppliers → OK
- Accountant truy cập /admin/products/new → Thấy trang Forbidden
