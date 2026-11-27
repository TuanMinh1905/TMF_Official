export const SECTION_RULES = {
  hero: {
    title: 'Banner chính — Hero Section',
    purpose: 'Hiển thị thông điệp thương hiệu TMF và hình minh họa phong cách Seoul Earth.',
    steps: [
      'Xem thông điệp "Dress easy. Feel like you." — triết lý thương hiệu.',
      'Click "Mua sắm ngay" để cuộn xuống khu vực sản phẩm.',
      'Click "Xem lookbook" để xem các bộ phối đồ gợi ý.',
    ],
  },
  categories: {
    title: 'Danh mục sản phẩm — Everyday Staples',
    purpose: '4 danh mục chính: Áo thun, Áo sơ mi, Quần, Áo khoác. Click để lọc sản phẩm.',
    steps: [
      'Chọn 1 trong 4 danh mục.',
      'Hệ thống tự động cuộn xuống và lọc sản phẩm theo danh mục đó.',
      'Click "Tất cả danh mục" để xem toàn bộ.',
    ],
  },
  lookbook: {
    title: 'Lookbook — Ways to Wear',
    purpose: '3 bộ outfit gợi ý phối đồ: Soft Layers (olive), City in Denim, Slow Sunday (rosewood).',
    steps: [
      'Xem 3 set đồ gợi ý phong cách.',
      'Click "Mua theo set" để xem các sản phẩm trong set đó.',
      'Mỗi set là 1 cách phối đồ hoàn chỉnh từ TMF.',
    ],
  },
  shop: {
    title: 'Sản phẩm — Mới lên kệ',
    purpose: 'Lưới sản phẩm với bộ lọc và sắp xếp. Hiển thị 8 sản phẩm chính.',
    steps: [
      'Dùng các nút filter (Tất cả, Áo thun, Sale...) để lọc.',
      'Dùng dropdown sắp xếp theo giá hoặc mới nhất.',
      'Click vào sản phẩm để xem chi tiết.',
      'Chọn size → Click "Thêm vào giỏ hàng".',
      'Click icon ♡ để thêm vào yêu thích.',
    ],
  },
  cart: {
    title: 'Giỏ hàng',
    purpose: 'Quản lý sản phẩm đã chọn mua. Dữ liệu lưu trên trình duyệt (localStorage).',
    steps: [
      'Click icon giỏ hàng trên thanh nav để mở.',
      'Thay đổi số lượng bằng nút +/−.',
      'Click "Thanh toán" để tiến hành đặt hàng (giả lập).',
      'Giỏ hàng được lưu khi đóng trình duyệt.',
    ],
  },
  orderQueue: {
    title: 'Hệ thống Queue & Worker',
    purpose: 'Xử lý đơn hàng bất đồng bộ qua BullMQ + Redis. Khi đặt hàng, API trả response ngay — Order Worker và Email Worker xử lý ở background.',
    steps: [
      'Khách đặt hàng → API tạo order (pending) và đẩy job vào Redis queue.',
      'Order Worker nhận job → chuyển trạng thái pending → processing → completed.',
      'Order Worker đẩy tiếp email job vào Email Queue.',
      'Email Worker nhận job → gửi email xác nhận (hiện tại console.log giả lập).',
      'Nếu worker crash, job vẫn nằm trong Redis — restart sẽ tự xử lý tiếp.',
      'Nếu job fail, BullMQ tự retry tối đa 3 lần với exponential backoff.',
    ],
  },
  sandbox: {
    title: 'Sandbox & Hạ tầng (Infra)',
    purpose: 'Bảo vệ API và hỗ trợ phát triển: chế độ Sandbox chỉ đọc, giới hạn tốc độ truy cập (Rate Limiter), ghi log request dev, đóng kết nối an toàn (Graceful Shutdown) và Docker dev UI.',
    steps: [
      'Bật SANDBOX_MODE=true trong .env để chặn các thao tác ghi (POST/PUT/DELETE), chỉ cho phép GET.',
      'Rate Limiter giới hạn tối đa 100 request/phút theo IP, trả về 429 khi vượt ngưỡng.',
      'Request Logger tự động ghi log [API] METHOD /path STATUS TIMEms trong môi trường development.',
      'Chạy npm run docker:dev để khởi động kèm Mongo Express (8081) và Redis Commander (8082).',
      'Khi nhận SIGINT/SIGTERM, Graceful Shutdown dừng cron, đóng HTTP server, Redis và MongoDB an toàn.',
    ],
  },
  cronOutbox: {
    title: 'Hệ thống Cron Job & Outbox Pattern',
    purpose: 'Đảm bảo không mất sự kiện khi Redis lỗi (Outbox Recovery), nhắc giỏ hàng bỏ quên và tổng hợp báo cáo ngày tự động.',
    steps: [
      'Outbox Processor quét các bản ghi pending mỗi 30 giây để đẩy lại vào queue hoặc xử lý sự kiện.',
      'Abandoned Cart Cron quét giỏ hàng không hoạt động quá 30 phút (demo 60s/lần) và ghi sự kiện CART_ABANDONED vào Outbox.',
      'Daily Report Cron tổng hợp số đơn, doanh thu, top sản phẩm (demo 2 phút/lần) qua Report Queue & Report Worker.',
      'API /api/stats/dashboard và /api/stats/outbox cung cấp dữ liệu thống kê tổng quan và trạng thái Outbox.',
    ],
  },
  admin: {
    title: 'Trang quản trị — Admin Dashboard',
    purpose: 'Bảng điều khiển dành cho quản trị viên. Xem tổng quan hệ thống, quản lý đơn hàng, sản phẩm, và theo dõi các tiến trình nền (Queue, Cron, Outbox).',
    steps: [
      'Tab Tổng quan: Xem thống kê nhanh — tổng sản phẩm, đơn hàng, doanh thu.',
      'Tab Đơn hàng: Danh sách đơn hàng, click để xem chi tiết từng đơn.',
      'Tab Sản phẩm: Quản lý kho hàng, trạng thái tồn kho.',
      'Tab Hệ thống: Theo dõi Outbox, Queue, Cron Job đang chạy.',
    ],
  },
  cronJobs: {
    title: 'Hệ thống Cron Job',
    purpose: 'Các tác vụ chạy định kỳ: Outbox Processor (30s), Nhắc giỏ hàng bỏ quên (60s), Báo cáo ngày (2 phút). Trong production, thời gian sẽ dài hơn.',
    steps: [
      'Outbox Processor: Quét bảng Outbox mỗi 30 giây, đẩy lại job thất bại vào queue.',
      'Abandoned Cart: Tìm giỏ hàng bỏ quên (>30 phút không cập nhật), gửi nhắc nhở.',
      'Daily Report: Tổng hợp doanh thu, đơn hàng, sản phẩm bán chạy.',
    ],
  },
};

