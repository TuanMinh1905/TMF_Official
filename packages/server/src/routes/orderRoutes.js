import { Router } from 'express';
import { createOrder, getOrders, getOrder } from '../controllers/orderController.js';

const router = Router();
router.get('/', getOrders);
router.post('/', createOrder);
router.get('/:id', getOrder);

export default router;

