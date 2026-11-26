import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import EditorialSVG from '../components/svg/EditorialSVG';

export default function RegisterPage() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    register(name, email);
    navigate('/account');
  };

  return (
    <div className="px-[5.2%] pt-9 pb-20 min-h-[65vh]">
      <div className="text-xs text-[#81736b] mb-6">
        <Link to="/" className="hover:underline">Trang chủ</Link> / Đăng ký
      </div>

      <div className="mb-8">
        <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">FORM. MEMBERS</div>
        <h1 className="text-[clamp(32px,4.4vw,62px)] tracking-tight leading-tight font-bold mt-3">Tạo tài khoản</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 max-w-[960px] mx-auto border border-[#d8cfc6]">
        <div className="bg-[#d9dfd2] min-h-[470px] overflow-hidden hidden md:block">
          <EditorialSVG scene="olive" className="w-full h-full" />
        </div>

        <form onSubmit={handleSubmit} className="p-9">
          <div className="text-[10px] tracking-[2px] uppercase text-accent font-bold">WELCOME TO FORM.</div>
          <h2 className="text-[25px] tracking-tight font-bold mt-3 mb-2">Bắt đầu cùng FORM.</h2>
          <p className="text-[#756b65] leading-relaxed mb-6">
            Lưu sản phẩm yêu thích và theo dõi đơn hàng.
          </p>

          <label className="flex flex-col gap-1.5 mb-4 text-[13px] font-semibold">
            Họ và tên
            <input
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="border border-[#d8cfc6] bg-white p-3 text-ink w-full font-normal"
            />
          </label>
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
            Tạo tài khoản demo
          </button>

          <p className="mt-4">
            <Link to="/login" className="text-xs underline text-[#756b65]">
              Đã có tài khoản? Đăng nhập
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

