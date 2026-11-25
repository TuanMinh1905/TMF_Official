import { create } from 'zustand';

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('tmf-cart')) || []; }
  catch { return []; }
};
const saveCart = (items) => {
  try { localStorage.setItem('tmf-cart', JSON.stringify(items)); } catch {}
};

const useCartStore = create((set, get) => ({
  items: loadCart(),

  addItem: (product, size, qty = 1) => {
    set((state) => {
      const existing = state.items.find(
        (item) => item.productId === product._id && item.size === size && item.color === product.color
      );
      let newItems;
      if (existing) {
        newItems = state.items.map((item) =>
          item === existing ? { ...item, qty: item.qty + qty } : item
        );
      } else {
        newItems = [...state.items, {
          productId: product._id,
          name: product.name,
          shape: product.shape,
          color: product.color,
          colorName: product.colorName || product.color,
          size,
          qty,
          price: product.price,
        }];
      }
      saveCart(newItems);
      return { items: newItems };
    });
  },

  removeItem: (index) => {
    set((state) => {
      const newItems = state.items.filter((_, i) => i !== index);
      saveCart(newItems);
      return { items: newItems };
    });
  },

  updateQty: (index, delta) => {
    set((state) => {
      const newItems = state.items.map((item, i) =>
        i === index ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      );
      saveCart(newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  getCount: () => get().items.reduce((sum, item) => sum + item.qty, 0),
  getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
}));

export default useCartStore;
