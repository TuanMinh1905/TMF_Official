import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('tmf-cart') || '[]'),
  isOpen: false,

  addItem: (product, size, qty = 1) => {
    set((state) => {
      const existing = state.items.find(
        (i) => i.productId === (product._id || product.id) && i.size === size
      );
      let newItems;
      if (existing) {
        newItems = state.items.map((i) =>
          i.productId === existing.productId && i.size === existing.size
            ? { ...i, qty: i.qty + qty }
            : i
        );
      } else {
        newItems = [
          ...state.items,
          {
            productId: product._id || product.id,
            name: product.name,
            size,
            qty,
            price: product.price,
            shape: product.shape,
            color: product.color,
          },
        ];
      }
      localStorage.setItem('tmf-cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  removeItem: (productId, size) => {
    set((state) => {
      const newItems = state.items.filter(
        (i) => !(i.productId === productId && i.size === size)
      );
      localStorage.setItem('tmf-cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  updateQty: (productId, size, qty) => {
    set((state) => {
      const newItems =
        qty <= 0
          ? state.items.filter(
              (i) => !(i.productId === productId && i.size === size)
            )
          : state.items.map((i) =>
              i.productId === productId && i.size === size
                ? { ...i, qty }
                : i
            );
      localStorage.setItem('tmf-cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
  clearCart: () => {
    localStorage.removeItem('tmf-cart');
    set({ items: [], isOpen: false });
  },

  get totalItems() {
    return get().items.reduce((s, i) => s + i.qty, 0);
  },
  get totalAmount() {
    return get().items.reduce((s, i) => s + i.price * i.qty, 0);
  },
}));

export default useCartStore;

