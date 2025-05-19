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
- **Khác**:
  - GitHub để quản lý mã nguồn.

## Yêu cầu hệ thống

- Node.js (phiên bản 14.x hoặc cao hơn).
- PostgreSQL (phiên bản 12.x hoặc cao hơn).
- Trình duyệt web (Chrome, Firefox, Safari, v.v.).

## Hướng dẫn cài đặt

### 1. Clone repository
Clone dự án từ GitHub về máy của bạn:

```bash
git clone https://github.com/<your-username>/travel-explorer.git
cd travel-explorer
```

### 2. Cài đặt các phụ thuộc
Cài đặt các thư viện Node.js cần thiết:

```bash
npm install
```

### 3. Thiết lập cơ sở dữ liệu PostgreSQL
- Cài đặt PostgreSQL nếu chưa có.
- Tạo một cơ sở dữ liệu mới:

```sql
CREATE DATABASE travel_explorer;
```

- Cập nhật thông tin kết nối database trong file `.env`:

```env
DB_HOST=localhost
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=travel_explorer
DB_PORT=5432
```

- Chạy lệnh để tạo các bảng cần thiết (dựa trên `models/user.js` và `models/destination.js`):

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  image_url VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  timezone VARCHAR(50),
  activities TEXT[],
  latitude FLOAT NOT NULL DEFAULT 0.0,
  longitude FLOAT NOT NULL DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Thiết lập biến môi trường
Tạo file `.env` trong thư mục gốc của dự án và thêm các biến môi trường cần thiết:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

- `JWT_SECRET`: Một chuỗi bí mật để ký JWT.
- `EMAIL_USER` và `EMAIL_PASS`: Thông tin email để gửi OTP (hỗ trợ Gmail hoặc các dịch vụ email khác).

### 5. Khởi động server
Chạy ứng dụng:

```bash
node server.js
```

Truy cập ứng dụng tại: `http://localhost:3000`.

## Cách sử dụng

### 1. Đăng ký tài khoản
- Truy cập trang chủ (`http://localhost:3000`).
- Nhấn nút "Login" → "Register".
- Nhập email và mật khẩu, sau đó nhấn "Send OTP".
- Nhập mã OTP được gửi qua email để hoàn tất đăng ký.

### 2. Đăng nhập
- Nhấn nút "Login", nhập email và mật khẩu, sau đó nhấn "Login".
- Sau khi đăng nhập, thanh tìm kiếm sẽ xuất hiện ở giữa navbar.

### 3. Tìm kiếm địa điểm
- Nhập từ khóa (ví dụ: "Hà Nội") vào thanh tìm kiếm và nhấn "Search".
- Các địa điểm phù hợp sẽ hiển thị trong phần "Recommended Places".
- Nhấn nút "Visit" để xem chi tiết địa điểm, bao gồm mô tả, thời gian địa phương, và liên kết Google Maps.

### 4. Quản lý (dành cho Admin)
- Đăng nhập bằng tài khoản admin (vai trò `admin` hoặc `superadmin`).
- Truy cập Admin Dashboard để:
  - Quản lý vai trò người dùng (user, admin, superadmin).
  - Thêm địa điểm mới với thông tin như tên, mô tả, hình ảnh, tọa độ, và múi giờ.

## Cấu trúc thư mục

```
travel-explorer/
│
├── public/
│   ├── css/
│   │   └── style.css        # File CSS tùy chỉnh
│   └── uploads/             # Thư mục lưu hình ảnh upload
│
├── views/
│   ├── home.ejs             # Trang chủ
│   ├── about.ejs            # Trang About Us
│   └── contact.ejs          # Trang Contact Us
│
├── models/
│   ├── user.js              # Model cho bảng users
│   └── destination.js       # Model cho bảng destinations
│
├── controllers/
│   └── destinationController.js  # Controller xử lý API địa điểm
│
├── js/
│   └── client.js            # JavaScript phía client
│
├── server.js                # File server chính
├── .env                     # File chứa biến môi trường
└── README.md                # File hướng dẫn
```

## Góp ý và đóng góp

Nếu bạn có ý tưởng hoặc muốn đóng góp cho dự án, vui lòng:
1. Fork repository.
2. Tạo một nhánh mới (`git checkout -b feature/your-feature`).
3. Commit các thay đổi (`git commit -m "Add your feature"`).
4. Push lên nhánh của bạn (`git push origin feature/your-feature`).
5. Tạo Pull Request.

## Liên hệ

Nếu bạn có câu hỏi hoặc cần hỗ trợ, hãy liên hệ qua email: [your-email@example.com](mailto:your-email@example.com).

---

**Travel Explorer** - Khám phá thế giới dễ dàng hơn bao giờ hết! 🌍