import { create } from 'zustand';

const useAdminStore = create((set, get) => ({
  stats: null,
  orders: [],
  products: [],
  outbox: [],
  loading: false,
  activeTab: 'overview',

  setActiveTab: (tab) => set({ activeTab: tab }),

  fetchStats: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/stats/dashboard');
      const json = await res.json();
      if (json.success) set({ stats: json.data });
    } catch (err) {
      console.error('Stats fetch error:', err);
    } finally {
      set({ loading: false });
    }
  },

  fetchOrders: async () => {
    try {
      const res = await fetch('/api/orders');
      const json = await res.json();
      if (json.success) set({ orders: json.data });
    } catch (err) {
      console.error('Orders fetch error:', err);
    }
  },

  fetchProducts: async () => {
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success) set({ products: json.data });
    } catch (err) {
      console.error('Products fetch error:', err);
    }
  },

  fetchOutbox: async () => {
    try {
      const res = await fetch('/api/stats/outbox');
      const json = await res.json();
      if (json.success) set({ outbox: json.data });
    } catch (err) {
      console.error('Outbox fetch error:', err);
    }
  },
}));

export default useAdminStore;
