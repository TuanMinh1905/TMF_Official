import { Link, useNavigate } from 'react-router-dom';
import useUiStore from '../../store/uiStore';
import useCartStore from '../../store/cartStore';
import useProductStore from '../../store/productStore';
import RuleButton from '../ui/RuleButton';

export default function Navbar() {
  const toggleSearch = useUiStore((s) => s.toggleSearch);
  const cartCount = useCartStore((s) => s.getCount());
  const setFilter = useProductStore((s) => s.setFilter);
  const navigate = useNavigate();

  const handleFilter = (filter) => {
    setFilter(filter);
    navigate('/catalog');
  };

  return (
    <header className="relative h-[83px] flex items-center justify-between px-[5.2%] gap-5 border-b border-black/10 bg-paper">
      <RuleButton section="navbar" />
      <Link to="/" className="font-black text-[39px] tracking-[-3px] leading-none whitespace-nowrap">
        FORM<span className="text-accent">.</span>
      </Link>

      <nav className="hidden md:flex gap-[27px] items-center text-[13px] font-semibold">
        <button onClick={() => handleFilter('new')} className="hover:text-accent">Hàng mới</button>
        <button onClick={() => handleFilter('Nam')} className="hover:text-accent">Nam</button>
        <button onClick={() => handleFilter('Nữ')} className="hover:text-accent">Nữ</button>
        <Link to="/lookbook" className="hover:text-accent">Lookbook</Link>
        <button onClick={() => handleFilter('Phụ kiện')} className="hover:text-accent">Phụ kiện</button>
        <button onClick={() => handleFilter('sale')} className="hover:text-accent">Sale</button>
      </nav>

      <div className="flex gap-3 items-center">
        <Link to="/account" className="text-[25px]" aria-label="Tài khoản">♙</Link>
        <button onClick={toggleSearch} className="flex items-center gap-1.5 p-1" aria-label="Tìm kiếm">
          <svg viewBox="0 0 24 24" className="w-[21px] h-[21px] fill-none stroke-current" strokeWidth="1.6">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
          </svg>
        </button>
        <Link to="/wishlist" className="flex items-center gap-1.5 p-1" aria-label="Yêu thích">
          <svg viewBox="0 0 24 24" className="w-[21px] h-[21px] fill-none stroke-current" strokeWidth="1.6">
            <path d="M12 20 4 12C-2 5 7 1 12 8c5-7 14-3 8 4Z" />
          </svg>
        </Link>
        <Link to="/cart" className="flex items-center gap-1.5 p-1" aria-label="Giỏ hàng">
          <svg viewBox="0 0 24 24" className="w-[21px] h-[21px] fill-none stroke-current" strokeWidth="1.6">
            <path d="M4 7h16l1 14H3zM8 8V6a4 4 0 0 1 8 0v2" />
          </svg>
          <span className="text-xs">{cartCount}</span>
        </Link>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold border border-black/15 hover:border-accent hover:text-accent transition-colors"
          aria-label="Trang quản trị"
          title="Admin Dashboard"
        >
          <span aria-hidden="true">⚙</span>
          <span className="hidden sm:inline">Admin</span>
        </Link>
      </div>
    </header>
  );
}
