# Các keyword cần học — Áp dụng cụ thể vào TMF

> Mục tiêu: Học 6 concept backend nâng cao thông qua project TMF (TuanMinh Fashion).
> Mỗi keyword được áp dụng vào use case thực tế của website thời trang.

---

## 🏗️ Infrastructure (Infra)
> **Thực hành**: Docker Compose orchestrate MongoDB + Redis + Backend + Frontend

- `docker-compose.yml` define toàn bộ hệ thống
- Một lệnh `docker-compose up` chạy mọi thứ
- Hiểu cách các service giao tiếp qua Docker network
- Biến môi trường quản lý qua `.env`

---

## ⏰ Cron Job
> **Thực hành**: Tự động nhắc giỏ hàng bỏ quên + báo cáo ngày

```
Cron "Giỏ hàng bỏ quên" (mỗi 30 phút):
  → Quét DB tìm cart > 30 phút không hoạt động
  → Ghi vào Outbox table
  → Outbox relay đẩy vào Email Queue
  → Worker gửi email nhắc nhở

Cron "Báo cáo ngày" (8:00 sáng):
  → Thống kê đơn hàng, doanh thu
  → Gửi email báo cáo cho admin
```

---

## 👷 Worker
> **Thực hành**: Worker process tách biệt xử lý tác vụ nặng

- **Email Worker**: Lắng nghe queue, gửi email (không block API)
- **Order Worker**: Xử lý đơn hàng (validate stock, tính phí ship, cập nhật trạng thái)
- Worker chạy trong process riêng, crash không ảnh hưởng API chính

---

## 📬 Queue (BullMQ + Redis)
> **Thực hành**: Message queue cho các tác vụ async

```
Luồng đặt hàng:
  User đặt hàng → API ghi DB + đẩy vào Order Queue
                                    ↓
                          Order Worker xử lý
                                    ↓
                     Thành công → đẩy vào Email Queue
                                    ↓
                          Email Worker gửi xác nhận
```

- Retry tự động khi thất bại
- Priority queue (đơn hàng > email marketing)
- Dashboard monitor queue (Bull Board)

---

## 📦 Outbox Pattern
> **Thực hành**: Đảm bảo consistency giữa DB write và message gửi đi

```
Vấn đề: Ghi DB thành công nhưng gửi message thất bại → mất dữ liệu

Giải pháp Outbox:
  1. Transaction: Ghi order + ghi outbox_events trong 1 transaction
  2. Cron relay: Quét outbox_events chưa gửi → đẩy vào queue
  3. Mark as sent: Đánh dấu đã xử lý

  Order + Outbox Event  →  [MongoDB Transaction]
                                    ↓
                          Outbox Relay (Cron)
                                    ↓
                          Queue → Worker xử lý
```

---

## 🧪 Sandbox
> **Thực hành**: Môi trường test riêng biệt

- **Docker profiles**: `docker-compose --profile sandbox up` tạo env riêng
- **Seed data riêng**: DB sandbox có data test, không ảnh hưởng production
- **API sandbox mode**: Header `X-Sandbox: true` → route vào DB riêng
- Sau này mở rộng: Preview deployments cho mỗi PR
