import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/catalog', label: 'Tất cả sản phẩm' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/wishlist', label: 'Yêu thích' },
  { to: '/cart', label: 'Giỏ hàng' },
  { to: '/account', label: 'Tài khoản' },
  { to: '/orders', label: 'Đơn hàng' },
];

export default function RouteBar() {
  return (
    <nav className="flex gap-5 overflow-x-auto px-[5.2%] py-3 border-b border-[#e3dbd3] whitespace-nowrap text-xs bg-paper" aria-label="Điều hướng cửa hàng">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) =>
            isActive
              ? 'text-accent underline underline-offset-[5px]'
              : 'hover:text-accent'
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

