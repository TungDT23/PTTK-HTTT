# PHÂN QUYỀN HỆ THỐNG - CẤU TRÚC 2 CẤP

## 🏆 Cấu trúc phân quyền

### Cấp 1: SUPER ADMIN (username = "admin")
- **Quyền hạn**: TOÀN QUYỀN tuyệt đối
- **Không bị giới hạn** bởi phân quyền nhân viên
- **Bypass** tất cả middleware `requirePosition`

### Cấp 2: NHÂN VIÊN (Employees)
Phân quyền theo chức vụ (position):
- **Manager**: Quản lý toàn diện
- **Sales**: Bán hàng, khách hàng
- **Warehouse**: Kho, nhập hàng
- **Accountant**: Tài chính, lương

---

## 📋 DANH SÁCH TÀI KHOẢN

### 🔑 Super Admin
```
Username: admin
Password: admin
Quyền hạn: TOÀN QUYỀN KHÔNG GIỚI HẠN
```

### 👔 Manager (Quản lý)  
```
Username: manager
Email: manager@bookstore.com
Password: 123456
Mã NV: NV0005
Quyền hạn: Quản lý toàn bộ hệ thống (trừ một số quyền đặc biệt)
```

### 💼 Sales (Nhân viên bán hàng)
```
1. tuanlevan748@gmail.com / 123456 (NV0001)
2. anhnguyenthingoc483@gmail.com / 123456 (NV0002)
```

### 📦 Warehouse (Nhân viên kho)
```
anhtrantuan267@gmail.com / 123456 (NV0003)
```

### 💰 Accountant (Kế toán)
```
tramytranthi584@gmail.com / 123456 (NV0004)
```

---

## 🔧 LOGIC PHÂN QUYỀN

### Backend Middleware

```typescript
// 1. requireEmployee - Yêu cầu là nhân viên (admin role)
- Nếu username === "admin" → PASS (toàn quyền)
- Nếu không → Kiểm tra employee record

// 2. requirePosition(...positions) - Yêu cầu chức vụ cụ thể
- Nếu username === "admin" → PASS (toàn quyền)
- Nếu không → Kiểm tra employee.position in positions
```

### Frontend Hook

```typescript
useEmployeePermission(["manager", "warehouse"])
- Nếu username === "admin" → hasPermission = true
- Nếu không → hasPermission = (position in required positions)
```

---

## 📊 MA TRẬN PHÂN QUYỀN

| Chức năng | Super Admin | Manager | Sales | Warehouse | Accountant |
|-----------|-------------|---------|-------|-----------|------------|
| Quản lý Nhân viên | ✅ | ✅ | ❌ | ❌ | ❌ |
| Quản lý Nhà cung cấp | ✅ | ✅ | ❌ | ✅ | ❌ |
| Quản lý Sản phẩm | ✅ | ✅ | ❌ | ✅ | ❌ |
| Xóa Sản phẩm | ✅ | ✅ | ❌ | ❌ | ❌ |
| Quản lý Kho | ✅ | ✅ | ❌ | ✅ | ❌ |
| Đơn nhập hàng | ✅ | ✅ | ❌ | ✅ | ❌ |
| Xem giao dịch kho | ✅ | ✅ | ❌ | ✅ | ✅ |
| Quản lý Lương | ✅ | ✅ | ❌ | ❌ | ✅ |
| Báo cáo Doanh thu | ✅ | ✅ | ❌ | ❌ | ✅ |
| Báo cáo Tồn kho | ✅ | ✅ | ❌ | ✅ | ❌ |
| Báo cáo Khách hàng | ✅ | ✅ | ✅ | ❌ | ❌ |
| Báo cáo Nhập hàng | ✅ | ✅ | ❌ | ✅ | ✅ |
| Xem Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 WORKFLOW

### 1. Đăng nhập
```
User → Login → Cookie (userId) → API check user
```

### 2. Phân quyền
```
API → Check username === "admin"?
  ├─ YES → Super Admin (toàn quyền)
  └─ NO → Find Employee → Check position
```

### 3. Hiển thị giao diện
```
Frontend → useEmployeePermission(required positions)
  ├─ Loading: "Đang kiểm tra quyền..."
  ├─ No Permission: Forbidden Page
  └─ Has Permission: Show Content
```

---

## 🧪 TEST PHÂN QUYỀN

### Test 1: Super Admin
```bash
1. Đăng nhập: admin / admin
2. Truy cập: /admin/employees
3. Kết quả: ✅ Thành công (toàn quyền)
```

### Test 2: Manager
```bash
1. Đăng nhập: manager / 123456
2. Truy cập: /admin/employees
3. Kết quả: ✅ Thành công (manager có quyền)
```

### Test 3: Sales (không có quyền)
```bash
1. Đăng nhập: tuanlevan748@gmail.com / 123456
2. Truy cập: /admin/employees
3. Kết quả: ❌ Forbidden Page (chỉ Manager)
```

### Test 4: Warehouse
```bash
1. Đăng nhập: anhtrantuan267@gmail.com / 123456
2. Truy cập: /admin/suppliers
3. Kết quả: ✅ Thành công (warehouse có quyền xem)
4. Thử thêm supplier
5. Kết quả: ✅ Thành công (warehouse có quyền tạo)
```

---

## 📝 GHI CHÚ

### Điểm khác biệt giữa Super Admin và Manager:
- **Super Admin (admin)**: 
  - Không cần employee record
  - Bypass mọi phân quyền
  - Dùng cho quản trị hệ thống

- **Manager**: 
  - Là nhân viên với position = "manager"
  - Có employee record đầy đủ
  - Có mã NV, phòng ban, lương
  - Dùng cho quản lý vận hành

### Khuyến nghị:
1. **Super Admin** chỉ dùng để cấu hình hệ thống, không dùng hàng ngày
2. **Manager** dùng cho công việc quản lý thường xuyên
3. Nhân viên khác dùng theo chức vụ được phân

---

## 🔄 CẬP NHẬT SAU NÀY

Nếu cần thêm chức vụ mới:
1. Thêm vào enum `position` trong Employee model
2. Cập nhật logic trong routes với `requirePosition`
3. Tạo tài khoản mẫu và test

Nếu cần sửa quyền:
1. Mở `be/src/routes/admin/index.route.ts`
2. Sửa các middleware `requirePosition(...)`
3. Restart server để áp dụng
