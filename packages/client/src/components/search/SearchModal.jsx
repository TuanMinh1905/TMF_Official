import { useState } from 'react';
import useProductStore from '../../store/productStore';
import useUiStore from '../../store/uiStore';
import Modal from '../ui/Modal';

export default function SearchModal() {
  const searchOpen = useUiStore((s) => s.searchOpen);
  const toggleSearch = useUiStore((s) => s.toggleSearch);
  const setSearch = useProductStore((s) => s.setSearch);
  const setFilter = useProductStore((s) => s.setFilter);
  const [term, setTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilter('all');
    setSearch(term.trim());
    toggleSearch();
    setTerm('');
    document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Modal isOpen={searchOpen} onClose={toggleSearch}>
      <h2 className="text-2xl font-bold mb-4">Tìm sản phẩm</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Ví dụ: áo thun"
          className="w-full border border-[#bbb] px-4 py-3.5 mb-4"
          autoFocus
          aria-label="Từ khóa"
        />
        <button className="w-full bg-ink text-white py-4 font-bold text-[13px] hover:bg-accent transition-colors">
          Tìm kiếm →
        </button>
      </form>
    </Modal>
  );
}

