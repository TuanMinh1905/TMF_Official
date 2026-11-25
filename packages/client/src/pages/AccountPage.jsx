import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import AccountMenu from '../components/account/AccountMenu';

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);
  const showToast = useUiStore((s) => s.showToast);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const isLoggedIn = user !== null;

  let orderCount = 0;
  try { orderCount = JSON.parse(localStorage.getItem('tmf-orders') || '[]').length; } catch {}

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(name, email);
    showToast('Đã lưu thông tin demo');
  };

  return (
    <div className="px-[5.2%] pt-9 pb-20 min-h-[65vh]">
      <div className="text-xs text-[#81736b] mb-6">
        <Link to="/" className="hover:underline">Trang chủ</Link> / Tài khoản
      </div>

      <div className="mb-8">
        <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">MY FORM.</div>
        <h1 className="text-[clamp(32px,4.4vw,62px)] tracking-tight leading-tight font-bold mt-3">
          Tài khoản của tôi
        </h1>
        <p className="text-[#756b65]">
          {isLoggedIn ? `Xin chào, ${user.name}.` : 'Quản lý trải nghiệm mua sắm của bạn.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-7">
        <AccountMenu isLoggedIn={isLoggedIn} onLogout={logout} />

        <div>
          {isLoggedIn ? (
            <>
              <form onSubmit={handleSave} className="border border-[#ded5cc] p-6 mb-5">
                <h2 className="text-[25px] tracking-tight font-bold mt-0 mb-4">Thông tin cá nhân</h2>
                <label className="flex flex-col gap-1.5 mb-4 text-[13px] font-semibold">
                  Họ và tên
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="border border-[#d8cfc6] bg-white p-3 text-ink w-full font-normal"
                  />
                </label>
                <label className="flex flex-col gap-1.5 mb-4 text-[13px] font-semibold">
                  Email
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="border border-[#d8cfc6] bg-white p-3 text-ink w-full font-normal"
                  />
                </label>
                <button type="submit" className="bg-ink text-white px-5 py-3 font-bold text-[13px] hover:bg-accent transition-colors">
                  Lưu thay đổi
                </button>
              </form>

              <div className="border border-[#ded5cc] p-6">
                <h2 className="text-[25px] tracking-tight font-bold mt-0 mb-2">Đơn hàng gần đây</h2>
                <p className="text-[#756b65] text-sm">{orderCount ? `${orderCount} đơn hàng demo` : 'Bạn chưa có đơn hàng.'}</p>
                <Link to="/orders" className="text-xs underline text-[#756b65] mt-2 inline-block">
                  Xem đơn hàng ↗
                </Link>
              </div>
            </>
          ) : (
            <div className="border border-[#ded5cc] p-6">
              <h2 className="text-[25px] tracking-tight font-bold mt-0 mb-2">Chào bạn!</h2>
              <p className="text-[#756b65] leading-relaxed mb-4">
                Đăng nhập để thử quản lý tài khoản và đơn hàng.
              </p>
              <Link to="/login" className="inline-block bg-ink text-white px-5 py-3 font-bold text-[13px] mr-3">
                Đăng nhập
              </Link>
              <Link to="/register" className="inline-block border border-[#bfb2a7] px-5 py-3 text-sm">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
