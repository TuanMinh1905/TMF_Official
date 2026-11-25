import { create } from 'zustand';
import { FALLBACK_PRODUCTS } from '../data/products';

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  filter: 'all',
  sort: 'newest',
  searchQuery: '',
  favorites: new Set(JSON.parse(localStorage.getItem('tmf-favs') || '[]')),

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      set({ products: json.data, loading: false });
    } catch {
      set({ products: FALLBACK_PRODUCTS, loading: false });
    }
  },

  setFilter: (filter) => set({ filter }),
  setSort: (sort) => set({ sort }),
  setSearch: (searchQuery) => set({ searchQuery }),

  toggleFavorite: (id) => {
    set((state) => {
      const favs = new Set(state.favorites);
      if (favs.has(id)) favs.delete(id);
      else favs.add(id);
      localStorage.setItem('tmf-favs', JSON.stringify([...favs]));
      return { favorites: favs };
    });
  },

  getFiltered: () => {
    const { products, filter, sort, searchQuery } = get();
    let list = [...products];

    if (searchQuery) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filter === 'sale') {
      list = list.filter((p) => p.oldPrice);
    } else if (filter === 'fav') {
      const favs = get().favorites;
      list = list.filter((p) => favs.has(p._id));
    } else if (filter !== 'all') {
      list = list.filter(
        (p) => p.type === filter || p.gender === filter
      );
    }

    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);

    return list;
  },
}));

export default useProductStore;

