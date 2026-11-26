import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis.js';

// Email Worker — xu ly email tu queue "email-notification"
// Hien tai: console.log gia lap (chua gui SMTP that)
const emailWorker = new Worker(
  'email-notification',
  async (job) => {
    const { customerEmail, customerName, orderNumber, totalAmount, items } = job.data;

    // Format so tien
    const formattedAmount = new Intl.NumberFormat('vi-VN').format(totalAmount);

    // Format danh sach san pham
    const itemList = items
      .map((item) => `  - ${item.name} (Size ${item.size}) x${item.qty} — ${new Intl.NumberFormat('vi-VN').format(item.price * item.qty)}đ`)
      .join('\n');

    // Gia lap gui email (console.log)
    console.log('\n========================================');
    console.log('[Email Worker] GUI EMAIL XAC NHAN DON HANG');
    console.log('========================================');
    console.log(`Den:       ${customerEmail}`);
    console.log(`Khach:     ${customerName}`);
    console.log(`Don hang:  ${orderNumber}`);
    console.log(`San pham:\n${itemList}`);
    console.log(`Tong tien: ${formattedAmount}d`);
    console.log('========================================\n');

    return { email: customerEmail, orderNumber, sent: true };
  },
  {
    connection: redisConnection,
    concurrency: 3, // Email co the gui song song (khong can thu tu)
  },
);

emailWorker.on('completed', (job, result) => {
  console.log(`[Email Worker] Da gui email cho ${result.email} — Don ${result.orderNumber}`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`[Email Worker] That bai (lan ${job.attemptsMade}): ${err.message}`);
});

export default emailWorker;

