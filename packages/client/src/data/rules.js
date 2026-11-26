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
};

