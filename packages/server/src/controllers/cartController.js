import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export async function getCart(req, res, next) {
  try {
    let cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (!cart) cart = { sessionId: req.params.sessionId, items: [] };
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

export async function addToCart(req, res, next) {
  try {
    const { sessionId, productId, size, qty = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'San pham khong ton tai' });
    }

    let cart = await Cart.findOne({ sessionId });
    if (!cart) cart = new Cart({ sessionId, items: [] });

    const existing = cart.items.find(
      (i) => i.productId.toString() === productId && i.size === size
    );
    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        size,
        qty,
        price: product.price,
      });
    }

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { sessionId, itemId } = req.params;
    const { qty } = req.body;
    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Gio hang khong ton tai' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'San pham khong co trong gio' });
    }

    if (qty <= 0) {
      cart.items.pull(itemId);
    } else {
      item.qty = qty;
    }

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const { sessionId, itemId } = req.params;
    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Gio hang khong ton tai' });
    }
    cart.items.pull(itemId);
    await cart.save();
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

export async function clearCart(req, res, next) {
  try {
    await Cart.findOneAndDelete({ sessionId: req.params.sessionId });
    res.json({ success: true, message: 'Da xoa gio hang' });
  } catch (err) {
    next(err);
  }
}

