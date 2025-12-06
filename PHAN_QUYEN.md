# PHÂN QUYỀN HỆ THỐNG QUẢN LÝ NHÀ SÁCH

## 📋 Tài khoản nhân viên mẫu

Đã tạo sẵn 4 tài khoản nhân viên với các chức vụ khác nhau:

### 👔 Manager (Quản lý)
- **Email**: manager@bookstore.com
- **Password**: 123456
- **Quyền hạn**: Toàn quyền quản lý hệ thống

### 💼 Sales (Nhân viên bán hàng)
- **Email**: sales@bookstore.com
- **Password**: 123456
- **Quyền hạn**: Quản lý đơn hàng, khách hàng

### 📦 Warehouse (Nhân viên kho)
- **Email**: warehouse@bookstore.com
- **Password**: 123456
- **Quyền hạn**: Quản lý kho, nhập hàng

### 💰 Accountant (Kế toán)
- **Email**: accountant@bookstore.com
- **Password**: 123456
- **Quyền hạn**: Quản lý tài chính, báo cáo

---

## 🔐 Phân quyền chi tiết

### 1. Quản lý Sản phẩm (/admin/products)
| Chức năng | Manager | Sales | Warehouse | Accountant |
|-----------|---------|-------|-----------|------------|
| Xem danh sách | ✅ | ✅ | ✅ | ✅ |
| Thêm sản phẩm | ✅ | ❌ | ✅ | ❌ |
| Sửa sản phẩm | ✅ | ❌ | ✅ | ❌ |
| Xóa sản phẩm | ✅ | ❌ | ❌ | ❌ |

### 2. Quản lý Nhà cung cấp (/admin/suppliers)
| Chức năng | Manager | Sales | Warehouse | Accountant |
|-----------|---------|-------|-----------|------------|
| Xem danh sách | ✅ | ✅ | ✅ | ✅ |
| Thêm NCC | ✅ | ❌ | ✅ | ❌ |
| Sửa NCC | ✅ | ❌ | ✅ | ❌ |
| Xóa NCC | ✅ | ❌ | ❌ | ❌ |

### 3. Quản lý Nhân viên (/admin/employees)
| Chức năng | Manager | Sales | Warehouse | Accountant |
|-----------|---------|-------|-----------|------------|
| Xem danh sách | ✅ | ❌ | ❌ | ❌ |
| Thêm nhân viên | ✅ | ❌ | ❌ | ❌ |
| Sửa nhân viên | ✅ | ❌ | ❌ | ❌ |
| Xóa nhân viên | ✅ | ❌ | ❌ | ❌ |

### 4. Quản lý Kho & Nhập hàng (/admin/inventory)
| Chức năng | Manager | Sales | Warehouse | Accountant |
|-----------|---------|-------|-----------|------------|
| Xem tồn kho | ✅ | ❌ | ✅ | ✅ |
| Tạo đơn nhập | ✅ | ❌ | ✅ | ❌ |
| Nhận hàng | ✅ | ❌ | ✅ | ❌ |
| Điều chỉnh kho | ✅ | ❌ | ✅ | ❌ |
| Xem giao dịch | ✅ | ❌ | ✅ | ✅ |

### 5. Quản lý Lương (/admin/salaries)
| Chức năng | Manager | Sales | Warehouse | Accountant |
|-----------|---------|-------|-----------|------------|
| Xem lương | ✅ | ❌ | ❌ | ✅ |
| Tạo bảng lương | ✅ | ❌ | ❌ | ✅ |
| Sửa lương | ✅ | ❌ | ❌ | ✅ |
| Thanh toán | ✅ | ❌ | ❌ | ✅ |

### 6. Báo cáo (/admin/reports)
| Báo cáo | Manager | Sales | Warehouse | Accountant |
|---------|---------|-------|-----------|------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Doanh thu | ✅ | ❌ | ❌ | ✅ |
| Sản phẩm bán chạy | ✅ | ✅ | ✅ | ❌ |
| Tồn kho | ✅ | ❌ | ✅ | ❌ |
| Khách hàng | ✅ | ✅ | ❌ | ❌ |
| Báo cáo lương | ✅ | ❌ | ❌ | ✅ |
| Báo cáo nhập hàng | ✅ | ❌ | ✅ | ✅ |

### 7. Dashboard & Đơn hàng
| Chức năng | Manager | Sales | Warehouse | Accountant |
|-----------|---------|-------|-----------|------------|
| Xem đơn hàng | ✅ | ✅ | ✅ | ✅ |
| Xem khách hàng | ✅ | ✅ | ✅ | ✅ |

---

## 🚀 Cách sử dụng

### Bước 1: Đăng nhập
1. Truy cập: http://localhost:5174/login
2. Nhập email và password của nhân viên
3. Hệ thống sẽ tự động nhận diện chức vụ

### Bước 2: Truy cập chức năng
- Sau khi đăng nhập, menu sidebar sẽ hiển thị các chức năng
- Nếu truy cập trang không có quyền → API trả về lỗi 403 Forbidden

### Bước 3: Thử nghiệm
Đăng nhập lần lượt với các tài khoản để test phân quyền:
- **Manager**: Truy cập được tất cả
- **Sales**: Chỉ xem được sản phẩm, đơn hàng, khách hàng
- **Warehouse**: Quản lý kho, nhập hàng, sản phẩm
- **Accountant**: Quản lý tài chính, lương, báo cáo

---

## 📝 Lưu ý kỹ thuật

### Backend
- Middleware `requireEmployee`: Yêu cầu nhân viên (role = admin + có employee record)
- Middleware `requirePosition(...positions)`: Yêu cầu chức vụ cụ thể
- Tất cả routes trong `/admin/*` đã được bảo vệ

### Frontend
- Hiện tại chưa có logic ẩn/hiện menu theo quyền
- Nên thêm check quyền ở frontend để ẩn các nút/trang không có quyền
- Có thể tạo API `/admin/me` để lấy thông tin nhân viên hiện tại

---

## ⚠️ Bảo mật

1. **Tất cả routes /admin đã được bảo vệ** bằng middleware
2. Nếu không có quyền → API trả về 403 Forbidden
3. Nếu chưa đăng nhập → API trả về 401 Unauthorized
4. Cookie `userId` được sử dụng để xác thực

---

## 🔧 Mở rộng

Để thêm quyền mới:
1. Thêm position vào model Employee
2. Cập nhật middleware trong routes
3. Tạo tài khoản mẫu với position mới
