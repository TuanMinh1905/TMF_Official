import { Router } from 'express';
import { getDashboardStats, getOutboxStatus } from '../controllers/statsController.js';

const router = Router();
router.get('/dashboard', getDashboardStats);
router.get('/outbox', getOutboxStatus);

export default router;
