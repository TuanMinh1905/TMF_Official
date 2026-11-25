import { create } from 'zustand';

const useUiStore = create((set) => ({
  productDetailId: null,
  searchOpen: false,
  activeRule: null,
  toastMessage: '',

  openProductDetail: (id) => set({ productDetailId: id }),
  closeProductDetail: () => set({ productDetailId: null }),
  toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),
  showRule: (name) => set({ activeRule: name }),
  hideRule: () => set({ activeRule: null }),
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => set({ toastMessage: '' }), 2000);
  },
}));

export default useUiStore;

