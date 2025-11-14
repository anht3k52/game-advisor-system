# Hệ thống tư vấn game

Giải pháp mẫu cho website "Hệ thống tư vấn game" với kiến trúc **React + Node.js**. Dự án bao gồm hai phần:

- **Backend (server/)**: API RESTful bằng Express quản lý người dùng, game, gợi ý thông minh, tìm kiếm nâng cao, so sánh, bình luận/đánh giá và bảng điều khiển quản trị.
- **Frontend (client/)**: Ứng dụng React tiêu thụ các API, cung cấp giao diện quản lý và tư vấn game thời gian thực.

## Cấu trúc thư mục

```
.
├── client/               # Ứng dụng React (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── styles.css
│   │   └── components/
│   │       ├── AdminPanel.jsx
│   │       ├── AdvancedSearch.jsx
│   │       ├── CommentModeration.jsx
│   │       ├── GameComparison.jsx
│   │       ├── GameManagement.jsx
│   │       ├── RecommendationCenter.jsx
│   │       └── UserManagement.jsx
│   ├── index.html
│   └── vite.config.js
└── server/               # API Node.js + Express
    ├── src/
    │   ├── app.js
    │   ├── index.js
    │   ├── data/
    │   │   ├── comments.js
    │   │   ├── games.js
    │   │   └── users.js
    │   ├── routes/
    │   │   ├── adminRoutes.js
    │   │   ├── commentRoutes.js
    │   │   ├── comparisonRoutes.js
    │   │   ├── gameRoutes.js
    │   │   ├── recommendationRoutes.js
    │   │   ├── searchRoutes.js
    │   │   └── userRoutes.js
    │   └── services/
    │       └── recommendationService.js
    └── package.json
```

## Bắt đầu

### 1. Chạy backend

```bash
cd server
npm install
npm run dev
```

API mặc định chạy tại `http://localhost:4000` với các endpoint `/api/*`.

### 2. Chạy frontend

```bash
cd client
npm install
npm run dev
```

Ứng dụng React chạy ở `http://localhost:3000` và sử dụng proxy tới API.

#### Mô phỏng giao diện mà không cần backend

Nếu bạn chỉ muốn khám phá giao diện mà chưa khởi chạy API, hãy bật biến môi trường `VITE_USE_MOCK` khi chạy Vite:

```bash
cd client
VITE_USE_MOCK=true npm run dev
```

Chế độ này tự động sử dụng dữ liệu demo (user, game, bình luận...) và hiển thị banner "Chế độ mô phỏng" ngay trên giao diện.

## Các module chính

- **Quản lý người dùng**: thêm/sửa/xóa người dùng và cấu hình sở thích.
- **Quản lý game**: cập nhật kho game với thông tin chi tiết.
- **Tư vấn game thông minh**: thuật toán chấm điểm dựa trên sở thích, nền tảng, ngân sách.
- **Tìm kiếm nâng cao**: lọc game theo từ khóa, thể loại, giá, rating, tag.
- **So sánh game**: so sánh nhanh nhiều tựa game.
- **Bình luận – đánh giá**: quản lý phản hồi người chơi, hỗ trợ CRUD.
- **Quản trị hệ thống**: thống kê tổng quan và gửi thông báo hệ thống.

> Dự án sử dụng dữ liệu mẫu trong bộ nhớ để minh hoạ luồng chức năng. Khi triển khai thực tế có thể thay thế bằng database, cơ chế xác thực, AI model chuyên sâu…
