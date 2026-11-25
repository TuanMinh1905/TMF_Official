import { NavLink, Link } from 'react-router-dom';

export default function AccountMenu({ isLoggedIn, onLogout }) {
  return (
    <aside className="bg-muted p-5 flex flex-col gap-4">
      <NavLink to="/account" end className="underline underline-offset-4">Thông tin cá nhân</NavLink>
      <NavLink to="/orders" className="underline underline-offset-4">Đơn hàng của tôi</NavLink>
      <NavLink to="/wishlist" className="underline underline-offset-4">Sản phẩm yêu thích</NavLink>

      {isLoggedIn ? (
        <button
          onClick={onLogout}
          className="border border-[#bfb2a7] px-4 py-3 text-sm mt-2"
        >
          Đăng xuất
        </button>
      ) : (
        <Link to="/login" className="bg-ink text-white px-4 py-3 font-bold text-[13px] text-center mt-2">
          Đăng nhập
        </Link>
      )}
    </aside>
  );
}

