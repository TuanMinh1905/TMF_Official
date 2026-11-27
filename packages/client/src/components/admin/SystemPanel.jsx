import RuleButton from '../ui/RuleButton';

const CRON_JOBS = [
  {
    name: 'Outbox Processor',
    file: 'outboxProcessor.js',
    interval: 'Mỗi 30 giây',
    description: 'Quét bảng Outbox tìm bản ghi pending/failed và đẩy lại vào queue xử lý.',
    status: 'Đang chạy',
  },
  {
    name: 'Abandoned Cart Reminder',
    file: 'abandonedCartCron.js',
    interval: 'Mỗi 60 giây',
    description: 'Tìm giỏ hàng chưa cập nhật >30 phút và kích hoạt email nhắc nhở.',
    status: 'Đang chạy',
  },
  {
    name: 'Daily Report Generator',
    file: 'dailyReportCron.js',
    interval: 'Mỗi 2 phút (demo)',
    description: 'Tổng hợp doanh thu, số lượng đơn hàng và sản phẩm nổi bật trong ngày.',
    status: 'Đang chạy',
  },
];

const QUEUES = [
  {
    name: 'order-processing',
    worker: 'orderWorker.js',
    concurrency: 1,
    retries: '3 lần (exponential backoff)',
    description: 'Chuyển trạng thái đơn hàng pending → processing → completed và tạo email job.',
  },
  {
    name: 'email-notification',
    worker: 'emailWorker.js',
    concurrency: 3,
    retries: '3 lần (exponential backoff)',
    description: 'Gửi email xác nhận đơn hàng & nhắc giỏ hàng bỏ quên (console.log simulation).',
  },
  {
    name: 'daily-report',
    worker: 'reportWorker.js',
    concurrency: 1,
    retries: '3 lần (exponential backoff)',
    description: 'Xử lý job tạo báo cáo thống kê định kỳ.',
  },
];

const OUTBOX_STATUS_BADGES = {
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  sent: 'bg-green-100 text-green-800 border border-green-300',
  failed: 'bg-red-100 text-red-800 border border-red-300',
};

function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function normalizeOutbox(outbox) {
  if (Array.isArray(outbox)) {
    const summary = {
      pending: outbox.filter((r) => r.status === 'pending').length,
      sent: outbox.filter((r) => r.status === 'sent').length,
      failed: outbox.filter((r) => r.status === 'failed').length,
      total: outbox.length,
    };
    return { summary, records: outbox };
  }

  if (outbox && typeof outbox === 'object') {
    const summary = outbox.summary || { pending: 0, sent: 0, failed: 0, total: 0 };
    const byStatus = outbox.byStatus || {};
    const records = [
      ...(byStatus.pending || []),
      ...(byStatus.failed || []),
      ...(byStatus.sent || []),
    ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return { summary, records };
  }

  return { summary: { pending: 0, sent: 0, failed: 0, total: 0 }, records: [] };
}

export default function SystemPanel({ outbox }) {
  const { summary, records } = normalizeOutbox(outbox);

  return (
    <div className="space-y-8">
      {/* Outbox Monitor */}
      <section className="relative bg-paper border border-[#d8cfc6] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">
              OUTBOX PATTERN
            </div>
            <h2 className="text-lg font-bold text-ink mt-1">Outbox Event Monitor</h2>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="px-3 py-1 bg-muted text-ink border border-[#d8cfc6]">
              Tổng: {summary.total}
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 border border-yellow-300">
              Pending: {summary.pending}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 border border-green-300">
              Sent: {summary.sent}
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 border border-red-300">
              Failed: {summary.failed}
            </span>
          </div>
        </div>

        {records.length === 0 ? (
          <div className="bg-muted/50 border border-[#e6ddd4] p-6 text-center text-sm text-ink/70">
            Chưa có bản ghi Outbox nào. Hãy tạo đơn hàng để xem Outbox event được ghi nhận.
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#e6ddd4]">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr className="bg-muted text-[11px] uppercase tracking-[1.2px] text-ink/80 border-b border-[#d8cfc6]">
                  <th className="py-2.5 px-4 font-bold">Event Type</th>
                  <th className="py-2.5 px-4 font-bold">Status</th>
                  <th className="py-2.5 px-4 font-bold">Created</th>
                  <th className="py-2.5 px-4 font-bold">Processed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6ddd4] text-sm">
                {records.map((rec, idx) => {
                  const badge = OUTBOX_STATUS_BADGES[rec.status] || 'bg-muted text-ink border border-[#d8cfc6]';
                  return (
                    <tr key={rec._id || idx} className="hover:bg-muted/30">
                      <td className="py-3 px-4 font-mono text-xs font-bold text-ink">
                        {rec.eventType || 'UNKNOWN'}
                        {rec.payload?.orderNumber && (
                          <span className="ml-2 font-sans font-normal text-ink/60">
                            (#{rec.payload.orderNumber})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${badge}`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-ink/75">
                        {formatDateTime(rec.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-xs text-ink/75">
                        {formatDateTime(rec.processedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Cron Jobs + Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="relative bg-paper border border-[#d8cfc6] p-5 sm:p-6">
          <RuleButton section="cronJobs" />
          <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">
            BACKGROUND SCHEDULER
          </div>
          <h2 className="text-lg font-bold text-ink mt-1 mb-4 pr-8">Cron Jobs định kỳ</h2>

          <div className="space-y-3">
            {CRON_JOBS.map((cron) => (
              <div key={cron.file} className="bg-muted/50 border border-[#e6ddd4] p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-sm text-ink">{cron.name}</div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green-700 bg-green-100 border border-green-300 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    {cron.status}
                  </span>
                </div>
                <div className="text-xs text-accent font-semibold mt-1">
                  Chu kỳ: {cron.interval} · <span className="font-mono text-ink/70">{cron.file}</span>
                </div>
                <p className="text-xs text-ink/75 mt-1.5 leading-relaxed">{cron.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative bg-paper border border-[#d8cfc6] p-5 sm:p-6">
          <RuleButton section="orderQueue" />
          <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">
            BULLMQ + REDIS
          </div>
          <h2 className="text-lg font-bold text-ink mt-1 mb-4 pr-8">Queue & Workers</h2>

          <div className="space-y-3">
            {QUEUES.map((q) => (
              <div key={q.name} className="bg-muted/50 border border-[#e6ddd4] p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-ink">{q.name}</span>
                  <span className="text-[11px] font-bold bg-hero/70 text-ink px-2 py-0.5">
                    Concurrency: {q.concurrency}
                  </span>
                </div>
                <div className="text-xs text-accent font-semibold mt-1">
                  Worker: <span className="font-mono text-ink/75">{q.worker}</span> · Retry: {q.retries}
                </div>
                <p className="text-xs text-ink/75 mt-1.5 leading-relaxed">{q.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
