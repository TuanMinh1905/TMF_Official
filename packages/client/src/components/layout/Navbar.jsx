import useCartStore from '../../store/cartStore';
import useProductStore from '../../store/productStore';
import useUiStore from '../../store/uiStore';

const NAV_LINKS = [
  { label: 'Hàng mới', filter: 'all' },
  { label: 'Nam', filter: 'Nam' },
  { label: 'Nữ', filter: 'Nữ' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'Phụ kiện', filter: 'Phụ kiện' },
  { label: 'Sale', filter: 'sale' },
];

export default function Navbar() {
  const items = useCartStore((s) => s.items);
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);
  const setFilter = useProductStore((s) => s.setFilter);
  const toggleSearch = useUiStore((s) => s.toggleSearch);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  const handleNav = (link) => {
    if (link.href) {
      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setFilter(link.filter);
      document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="h-[83px] flex items-center justify-between px-[5.2%] border-b border-black/10 bg-paper sticky top-0 z-50">
      <a href="#top" className="font-black text-[39px] tracking-[-3px] whitespace-nowrap">
        TMF<span className="text-accent">.</span>
      </a>

      <nav className="hidden md:flex gap-[27px] items-center text-[13px] font-semibold">
        {NAV_LINKS.map((link) => (
          <button
            key={link.label}
            onClick={() => handleNav(link)}
            className="hover:text-accent transition-colors"
          >
            {link.label}
          </button>
        ))}
      </nav>

      <div className="flex gap-3 items-center">
        <button onClick={toggleSearch} aria-label="Tìm kiếm" className="p-1.5">
          <svg viewBox="0 0 24 24" className="w-[21px] h-[21px] fill-none stroke-current" strokeWidth="1.6">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
          </svg>
        </button>
        <button
          onClick={() => { useProductStore.getState().setFilter('fav'); document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' }); }}
          aria-label="Yêu thích"
          className="p-1.5"
        >
          <svg viewBox="0 0 24 24" className="w-[21px] h-[21px] fill-none stroke-current" strokeWidth="1.6">
            <path d="M12 20 4 12C-2 5 7 1 12 8c5-7 14-3 8 4Z" />
          </svg>
        </button>
        <button onClick={toggleDrawer} aria-label="Giỏ hàng" className="p-1.5 flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="w-[21px] h-[21px] fill-none stroke-current" strokeWidth="1.6">
            <path d="M4 7h16l1 14H3zM8 8V6a4 4 0 0 1 8 0v2" />
          </svg>
          <span className="text-xs">{totalItems}</span>
        </button>
      </div>
    </header>
  );
}

