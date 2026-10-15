# 🌸 TRƯỜNG MẦM NON QUỲNH SƠN 1 - QUẢN LÝ HỌC SINH & SỔ LIÊN LẠC

Hệ thống quản lý giáo dục mầm non thông minh, điểm danh trẻ, theo dõi dinh dưỡng, biểu đồ thể trạng BMI, giáo án tuần và sổ liên lạc điện tử đa kênh tích hợp Google Sheets & Google Drive.

---

## 👥 3 Tài Khoản Mẫu Trải Nghiệm Phân Quyền (RBAC)

Trước khi vào hệ thống, ứng dụng yêu cầu đăng nhập. Bạn có thể bấm **Đăng nhập nhanh 1-Click** hoặc nhập tài khoản:

| Vai trò | Tài khoản | Mật khẩu | Họ và tên | Chức năng chính |
| :--- | :--- | :--- | :--- | :--- |
| 👑 **Ban Giám Hiệu** | `bgh` | `bgh123` | **Cô Nguyễn Thị Mai** | Quản trị toàn trường, xem tất cả các lớp, thống kê báo cáo Bộ GD&ĐT, kiểm toán hệ thống, kết nối Google Sheets |
| 👩‍🏫 **Giáo Viên** | `giaovien` | `gv123` | **Cô Lê Thị Hạnh** | Chủ nhiệm **Lớp 2 Tuổi I**, điểm danh, theo dõi nhiệt độ đón trả trẻ, thực đơn, giáo án tuần, ảnh lớp, nhắn tin phụ huynh |
| 👨‍👩‍👧 **Phụ Huynh** | `phuhuynh` | `ph123` | **Anh Hoàng Văn Nam** | Cổng thông tin riêng cho **Bé Hoàng An Nhiên (Lớp 2 Tuổi I)**: Điểm danh, thực đơn ăn hôm nay, thể trạng BMI, nhắn tin cô giáo |

---

## 🏫 Lớp Học Sẵn Sàng

- **Tên lớp**: `Lớp 2 Tuổi I - Trường Mầm non Quỳnh Sơn 1` (Mã lớp: `CLS-2TUOI-I`)
- **Độ tuổi**: Nhóm trẻ 24 - 36 Tháng
- **Giáo viên chủ nhiệm**: Cô Lê Thị Hạnh & Cô Nguyễn Thị Thu
- **Phòng học**: Phòng 101 - Khu nhà A (Tầng 1)
- **Học sinh mẫu**: Đã có sẵn 6 bé 2 tuổi với đầy đủ hồ sơ, người giám hộ, dị ứng, thân nhiệt và huy hiệu chữ viết tắt tự động.

---

## 🚀 Hướng Dẫn Deploy Lên Vercel

Dự án đã được cấu hình sẵn file `vercel.json` và API Serverless `api/index.ts`.

### Cách 1: Deploy qua Vercel Dashboard (Khuyên dùng)
1. Đăng nhập [Vercel](https://vercel.com).
2. Bấm **Add New...** ➔ **Project**.
3. Chọn Repository GitHub vừa tạo của bạn.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. (Tùy chọn) Thêm các biến môi trường trong **Environment Variables**:
   - `APPS_SCRIPT_URL`
   - `SPREADSHEET_ID`
   - `DRIVE_ROOT_FOLDER_ID`
   - `APPS_SCRIPT_SHARED_SECRET`
8. Bấm **Deploy**. Ứng dụng sẽ hoạt động ngay lập tức!

---

## 💻 Chạy Ứng Dụng Trên Máy Cục Bộ

1. Cài đặt thư viện:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Khởi chạy máy chủ phát triển:
   ```bash
   npm run dev
   ```
3. Mở trình duyệt tại: `http://localhost:3000`

---

## 📊 Hướng Dẫn Kết Nối Google Sheets & Drive qua Apps Script

Xem chi tiết trong mục **Google Sheets** tại góc trên giao diện ứng dụng khi đăng nhập bằng tài khoản **Ban Giám Hiệu** hoặc làm theo các bước:
1. Tạo 1 Google Sheet và 1 thư mục Google Drive.
2. Mở **Tiện ích mở rộng** ➔ **Apps Script** trên Google Sheet.
3. Sao chép bộ mã Google Apps Script có sẵn trong Modal của ứng dụng vào Apps Script.
4. Triển khai dưới dạng **Ứng dụng web (Web App)** với quyền truy cập **Bất kỳ ai (Anyone)**.
5. Dán URL Web App vào file `.env` hoặc phần cấu hình trên Vercel.
