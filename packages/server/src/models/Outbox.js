import mongoose from 'mongoose';

const outboxSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  payload: mongoose.Schema.Types.Mixed,
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
  },
  processedAt: Date,
}, { timestamps: true });

export default mongoose.model('Outbox', outboxSchema);

