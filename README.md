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
    │   │   ├── externalGameRoutes.js
    │   │   ├── gameRoutes.js
    │   │   ├── recommendationRoutes.js
    │   │   ├── searchRoutes.js
    │   │   └── userRoutes.js
    │   └── services/
    │       ├── externalGameApi.js
    │       └── recommendationService.js
    └── package.json
```

## Bắt đầu

### 0. Cấu hình API RAWG (khuyến nghị)

Backend sử dụng API RAWG.io để đồng bộ dữ liệu game thực tế. Bạn có thể tạo nhanh file cấu hình từ mẫu:

```bash
cd server
cp .env.example .env
# Mở file .env và thay thế bằng RAWG_API_KEY bạn nhận được từ RAWG.io
```

Nếu chưa có API key, xem hướng dẫn chi tiết ở phần [Tích hợp API game bên thứ ba](#tích-hợp-api-game-bên-thứ-ba-rawgio).

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

## Tích hợp API game bên thứ ba (RAWG.io)

Từ phiên bản này, hệ thống có thể lấy dữ liệu game thật từ [RAWG Video Games Database](https://rawg.io/apidocs). Các bước cấu hình và sử dụng:

### 1. Đăng ký và lấy API key RAWG

1. Truy cập [https://rawg.io/apidocs](https://rawg.io/apidocs) và đăng nhập bằng tài khoản RAWG (hoặc tạo mới miễn phí).
2. Sau khi đăng nhập, mở menu người dùng (góc phải trên) → **API**.
3. Nhấn **Create new key**, đặt tên (ví dụ `game-advisor-dev`) và bấm **Generate**.
4. Sao chép giá trị API key được cung cấp. Giữ bí mật key này, không commit lên repo công khai.

### 2. Cấu hình backend

1. Tại thư mục `server/`, tạo file `.env` từ mẫu:

   ```bash
   cd server
   cp .env.example .env
   ```

2. Mở `.env` và cập nhật:

   ```env
   RAWG_API_KEY=ban_sao_chep_tu_RAWG
   ```

3. Khởi chạy lại backend (`npm run dev`). Server sẽ tự động nạp biến môi trường và proxy yêu cầu tới RAWG.

### 3. Endpoint mới của hệ thống

- `GET /api/external-games/search?query=zelda&page=1`
  - Proxy tới `RAWG /games`. Trả về danh sách game với tên, ngày phát hành, rating, nền tảng, Metacritic...
- `GET /api/external-games/:id`
  - Proxy tới `RAWG /games/{id}`. Trả về mô tả chi tiết, nhà phát triển/phát hành, tag, cửa hàng phân phối...

Ví dụ nhanh bằng `curl`:

```bash
curl "http://localhost:4000/api/external-games/search?query=elden%20ring"

curl "http://localhost:4000/api/external-games/326243" # Elden Ring id trên RAWG
```

### 4. Khai thác từ frontend

Trong giao diện **Tìm kiếm nâng cao**, phần "🌐 Kết nối dữ liệu game từ RAWG" cho phép nhập từ khóa tiếng Anh để gọi API. Khi có kết quả, người dùng có thể xem chi tiết, mô tả, tag và đường dẫn mua game trực tiếp.

> Lưu ý: RAWG giới hạn ~20 yêu cầu/phút cho key miễn phí. Hãy cache kết quả hoặc tối ưu tần suất gọi nếu triển khai thực tế.
