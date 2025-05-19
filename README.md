# Travel Explorer

Travel Explorer là một ứng dụng web giúp người dùng khám phá các địa điểm du lịch trên toàn thế giới, từ những thành phố sôi động đến các bãi biển yên bình và đền chùa cổ kính. Người dùng có thể tìm kiếm địa điểm, xem chi tiết (bao gồm thời gian địa phương, bản đồ, và các hoạt động gợi ý), đăng nhập/đăng ký, và quản lý địa điểm (nếu là admin).

## Tính năng chính

- **Tìm kiếm địa điểm**: Người dùng có thể tìm kiếm các địa điểm du lịch theo từ khóa.
- **Xem chi tiết địa điểm**: Hiển thị thông tin chi tiết về địa điểm, bao gồm mô tả, hình ảnh, thời gian địa phương (dựa trên múi giờ), các hoạt động gợi ý, và liên kết đến Google Maps.
- **Đăng nhập/Đăng ký**: Hỗ trợ đăng nhập và đăng ký tài khoản với xác thực OTP qua email.
- **Quản lý người dùng (Admin)**: Admin có thể quản lý vai trò người dùng (user, admin, superadmin).
- **Thêm địa điểm (Admin)**: Admin có thể thêm địa điểm mới với thông tin như tên, mô tả, hình ảnh, tọa độ (latitude/longitude), múi giờ, và các hoạt động.

## Công nghệ sử dụng

- **Frontend**:
  - EJS (Embedded JavaScript) để render giao diện động.
  - Font Awesome cho các biểu tượng.
  - CSS tùy chỉnh (`/public/css/style.css`).
- **Backend**:
  - Node.js và Express.js để xây dựng server.
  - PostgreSQL làm cơ sở dữ liệu để lưu trữ thông tin người dùng và địa điểm.
  - JWT (JSON Web Token) để xác thực người dùng.
  - Multer để xử lý upload hình ảnh.
