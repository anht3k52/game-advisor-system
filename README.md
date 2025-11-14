# Hệ thống tư vấn game

Dự án mẫu mô phỏng nền tảng "Hệ thống tư vấn game" với kiến trúc React + Node.js. Ứng dụng bao gồm đầy đủ các module chính:

- Quản lý người dùng
- Quản lý game
- Tư vấn game thông minh (AI Recommendation)
- Tìm kiếm nâng cao
- So sánh game
- Quản lý bình luận – đánh giá
- Quản trị hệ thống (Admin Panel)

## Cấu trúc thư mục

```
.
├── client/   # Ứng dụng React hiển thị giao diện
└── server/   # API Node.js/Express cung cấp dữ liệu
```

## Cài đặt và chạy dự án

```bash
# Cài đặt phụ thuộc
cd server && npm install
cd ../client && npm install

# Chạy server API ở cổng 4000
npm --prefix server run start

# Chạy client ở cổng 5173 (proxy tới API)
npm --prefix client run dev
```

Client sử dụng proxy `/api` tới `http://localhost:4000`. Có thể cấu hình lại URL API thông qua biến môi trường `VITE_API_URL`.

## Lưu ý

- Dữ liệu được lưu trong bộ nhớ (in-memory) để đơn giản hoá demo. Có thể thay thế bằng cơ sở dữ liệu thực tế.
- Module tư vấn sử dụng thuật toán chấm điểm dựa trên sở thích và điểm đánh giá game.
