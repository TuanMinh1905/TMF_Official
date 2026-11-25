import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js';

const router = Router();
router.get('/:sessionId', getCart);
router.post('/', addToCart);
router.put('/:sessionId/items/:itemId', updateCartItem);
router.delete('/:sessionId/items/:itemId', removeCartItem);
router.delete('/:sessionId', clearCart);

export default router;

