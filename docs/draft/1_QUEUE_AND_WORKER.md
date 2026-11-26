# Queue & Worker — Giải thích chi tiết

## Ví dụ thực tế: Quán trà sữa

Hãy tưởng tượng bạn mở **quán trà sữa**:

### Cách 1: Không có Queue (trước Giai đoạn 2)

```
Khách gọi món → Thu ngân nhận đơn → Thu ngân TỰ PHA trà → Thu ngân đưa trà → Thu ngân quay lại phục vụ khách tiếp
```

**Vấn đề:** Thu ngân vừa nhận đơn, vừa pha trà, vừa đưa trà. Nếu có 10 khách cùng lúc, khách thứ 10 phải **chờ 9 người trước pha xong** mới được nhận đơn.

Đây chính là code **trước đây** của bạn:

```javascript
// orderController.js — TRƯỚC
export async function createOrder(req, res, next) {
  // Thu ngân nhận đơn
  const order = await Order.create({ ... });
  
  // Thu ngân tự pha trà (nhưng thực tế chưa có bước này)
  // ...không có ai xử lý order tiếp...
  
  // Thu ngân trả lời khách
  res.status(201).json({ success: true, data: order });
  // Order tạo xong, status "pending" mãi mãi, không ai chuyển thành "completed"
}
```

> [!WARNING]
> Trước Giai đoạn 2: Order được tạo với `status: pending` rồi **để đó**. Không có code nào chuyển nó thành `completed`. Không có email nào được gửi.

---

### Cách 2: Có Queue (sau Giai đoạn 2)

```
Khách gọi món → Thu ngân nhận đơn → Thu ngân DÁN PHIẾU lên bảng → Thu ngân phục vụ khách tiếp NGAY
                                                    ↓
                              Nhân viên pha chế TỰ LẤY PHIẾU từ bảng → Pha trà → Đưa trà
```

**Lợi ích:** Thu ngân chỉ việc nhận đơn + dán phiếu. Khách thứ 10 được nhận đơn gần như ngay lập tức. Việc pha trà diễn ra **song song** ở phía sau.

Bây giờ ánh xạ sang code:

| Quán trà sữa | Hệ thống TMF | Cụ thể là gì |
|---|---|---|
| Thu ngân | **API Server** | `orderController.js` |
| Phiếu order | **Job** | `{ orderId: "6b079c..." }` — 1 object JSON nhỏ |
| Bảng dán phiếu | **Redis Queue** | Redis lưu danh sách các job đang chờ |
| Nhân viên pha chế | **Order Worker** | `orderWorker.js` — tự động lấy job ra xử lý |
| Nhân viên giao trà | **Email Worker** | `emailWorker.js` — gửi email xác nhận |

---

## Đi qua code thật — từng dòng

### Bước 1: Khách đặt hàng → API nhận và dán phiếu

File: `orderController.js`

```javascript
// 1. Thu ngân nhận đơn → Tạo order trong MongoDB
const order = await Order.create({
  orderNumber: 'TMF-5DGTIE',
  status: 'pending',        // ← Mới tạo = đang chờ xử lý
  items: [...],
  customerEmail: 'minh@test.com',
  totalAmount: 658000,
});

// 2. Ghi vào sổ (Outbox) để đề phòng mất
await Outbox.create({
  eventType: 'ORDER_CREATED',
  payload: { orderId: order._id },
  status: 'pending',
});

// 3. ⭐ DÁN PHIẾU LÊN BẢNG — đây là dòng quan trọng nhất
await orderQueue.add('process-order', { orderId: order._id.toString() });
//    ^^^^^^^^^^      ^^^^^^^^^^^^^    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//    Cái bảng        Tên phiếu       Nội dung phiếu (chỉ cần ID)

// 4. Trả lời khách NGAY — không chờ pha trà
res.status(201).json({ success: true, data: order });
// Lúc này order vẫn là "pending" — chưa xử lý xong
// Nhưng khách đã nhận được response rồi!
```

**Chuyện gì xảy ra ở dòng `orderQueue.add()`?**

BullMQ lấy cái object `{ orderId: "6b079c..." }` → chuyển thành JSON → lưu vào Redis. Chỉ vậy thôi. Nhanh vài millisecond.

Redis lúc này giữ 1 "phiếu" trong hàng đợi:

```
Redis Queue "order-processing":
  [0] → { orderId: "6b079c..." }    ← đang chờ worker lấy
```

---

### Bước 2: Order Worker tự động lấy phiếu và xử lý

File: `orderWorker.js`

Worker **không cần ai gọi**. Nó tự chạy và **liên tục nghe** Redis queue. Khi có job mới → tự lấy ra → xử lý.

```javascript
// Worker tự động chạy khi server start
const orderWorker = new Worker(
  'order-processing',      // ← Nghe queue nào? Queue "order-processing"
  async (job) => {         // ← Hàm xử lý mỗi khi có job
    const { orderId } = job.data;
    // job.data = { orderId: "6b079c..." } — đúng cái mà API đẩy vào

    // 1. Tìm order trong MongoDB
    const order = await Order.findById(orderId);

    // 2. Bắt đầu xử lý: pending → processing
    order.status = 'processing';
    await order.save();
    // Giống nhân viên pha chế bắt đầu pha trà

    // 3. Giả lập xử lý (kiểm tra tồn kho, validate, ...)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Chờ 1 giây giả lập

    // 4. Xử lý xong: processing → completed
    order.status = 'completed';
    await order.save();
    // Trà đã pha xong!

    // 5. Dán 1 phiếu MỚI cho Email Worker
    await emailQueue.add('send-confirmation', {
      orderId: order._id.toString(),
      customerEmail: order.customerEmail,    // "minh@test.com"
      orderNumber: order.orderNumber,        // "TMF-5DGTIE"
      totalAmount: order.totalAmount,        // 658000
      items: order.items,
    });
    // Giống pha chế xong → ghi phiếu "giao cho bàn số 3"
  },
);
```

**Dòng thời gian:**

```
0ms     API tạo order (pending) + đẩy job vào Redis
1ms     API trả response cho client ← KHÁCH NHẬN NGAY
        
~50ms   Order Worker lấy job từ Redis
~50ms   Order: pending → processing
~1050ms Order: processing → completed
~1050ms Order Worker đẩy email job vào Email Queue
```

---

### Bước 3: Email Worker nhận phiếu và "gửi" email

File: `emailWorker.js`

```javascript
const emailWorker = new Worker(
  'email-notification',     // ← Nghe queue "email-notification"
  async (job) => {
    const { customerEmail, orderNumber, totalAmount, items } = job.data;

    // Hiện tại: in ra terminal (giả lập gửi email)
    console.log(`Den: ${customerEmail}`);
    console.log(`Don hang: ${orderNumber}`);
    console.log(`Tong tien: ${totalAmount}`);
    
    // Sau này có thể thay bằng:
    // await sendgrid.send({ to: customerEmail, subject: ... });
    // await nodemailer.sendMail({ to: customerEmail, ... });
  },
);
```

---

## "Job không bao giờ mất" — nghĩa là gì?

### Tình huống: Server crash giữa chừng

```
1. Khách đặt hàng → API đẩy job vào Redis       ✅ Job nằm trong Redis
2. Order Worker bắt đầu xử lý                    ✅ Job chuyển sang "active"
3. 💥 Server crash (mất điện, lỗi code, ...)
4. Job vẫn nằm trong Redis — KHÔNG MẤT           ✅ Redis lưu trên ổ cứng
5. Restart server → Worker chạy lại
6. Worker thấy job "active" chưa xong → xử lý lại ✅ Tự động, không cần can thiệp
```

**So sánh nếu không có Queue:**

```
1. Khách đặt hàng → API bắt đầu xử lý trực tiếp
2. 💥 Server crash giữa chừng
3. Order pending mãi mãi — KHÔNG AI BIẾT phải xử lý lại
4. Email không bao giờ được gửi
5. ❌ MẤT ĐƠN HÀNG
```

Quay lại ví dụ trà sữa:
- **Không có bảng phiếu**: Nhân viên pha chế nhớ trong đầu → nghỉ việc → quên hết → mất đơn
- **Có bảng phiếu (Redis)**: Phiếu dán trên bảng → nhân viên mới vào → nhìn bảng → pha tiếp

---

## Tóm tắt bằng 1 hình

```
╔═══════════════════════════════════════════════════════════════╗
║                     TRƯỚC (không có Queue)                    ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Client ──→ API Server ──→ Tạo Order (pending) ──→ Response  ║
║                                    ↓                          ║
║                              Order pending                    ║
║                              MÃI MÃI ❌                       ║
║                              Không email                      ║
║                              Không xử lý                      ║
╚═══════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════╗
║                     SAU (có Queue & Worker)                   ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Client ──→ API Server ──→ Tạo Order ──→ Đẩy Job ──→ Response║
║                                              ↓                ║
║                                         Redis Queue           ║
║                                         (giữ job an toàn)     ║
║                                              ↓                ║
║                                       Order Worker            ║
║                                    pending → completed ✅      ║
║                                              ↓                ║
║                                       Email Worker            ║
║                                    gửi email xác nhận ✅       ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 3 câu hỏi kiểm tra hiểu

1. **Nếu tôi tắt server ngay sau khi đặt hàng, rồi bật lại — order có được xử lý không?**
   → ✅ Có. Job nằm trong Redis. Worker restart sẽ tự lấy job ra xử lý tiếp.

2. **Client có phải chờ Order Worker xử lý xong mới nhận response không?**
   → ❌ Không. Client nhận response ngay sau khi API đẩy job. Worker chạy ở background.

3. **Nếu Email Worker lỗi (ví dụ SMTP chết), order có bị ảnh hưởng không?**
   → ❌ Không. 2 queue độc lập. Order đã completed. Email job sẽ retry 3 lần. Nếu vẫn fail → nằm trong "failed" queue để xử lý sau.

