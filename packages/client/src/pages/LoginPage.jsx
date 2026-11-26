import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import EditorialSVG from '../components/svg/EditorialSVG';

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email.split('@')[0], email);
    navigate('/account');
  };

  return (
    <div className="px-[5.2%] pt-9 pb-20 min-h-[65vh]">
      <div className="text-xs text-[#81736b] mb-6">
        <Link to="/" className="hover:underline">Trang chủ</Link> / Đăng nhập
      </div>

      <div className="mb-8">
        <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">FORM. MEMBERS</div>
        <h1 className="text-[clamp(32px,4.4vw,62px)] tracking-tight leading-tight font-bold mt-3">Đăng nhập</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 max-w-[960px] mx-auto border border-[#d8cfc6]">
        <div className="bg-[#d9dfd2] min-h-[470px] overflow-hidden hidden md:block">
          <EditorialSVG scene="olive" className="w-full h-full" />
        </div>

        <form onSubmit={handleSubmit} className="p-9">
          <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">WELCOME TO FORM.</div>
          <h2 className="text-[25px] tracking-tight font-bold mt-3 mb-2">Chào mừng trở lại.</h2>
          <p className="text-[#756b65] leading-relaxed mb-6">
            Lưu sản phẩm yêu thích và theo dõi đơn hàng.
          </p>

          <label className="flex flex-col gap-1.5 mb-4 text-[13px] font-semibold">
            Email
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="border border-[#d8cfc6] bg-white p-3 text-ink w-full font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 mb-4 text-[13px] font-semibold">
            Mật khẩu demo
            <input
              type="password" required minLength={6} autoComplete="off"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="border border-[#d8cfc6] bg-white p-3 text-ink w-full font-normal"
            />
          </label>

          <button type="submit" className="w-full bg-ink text-white py-4 font-bold text-[13px] mt-2 hover:bg-accent transition-colors">
            Đăng nhập demo
          </button>

          <p className="mt-4">
            <Link to="/register" className="text-xs underline text-[#756b65]">
              Chưa có tài khoản? Đăng ký
            </Link>
          </p>
          <p className="text-xs text-[#756b65] leading-relaxed mt-3">
            Không nhập mật khẩu thật. Bản mẫu không xác thực tài khoản hoặc lưu mật khẩu.
          </p>
        </form>
      </div>
    </div>
  );
}

