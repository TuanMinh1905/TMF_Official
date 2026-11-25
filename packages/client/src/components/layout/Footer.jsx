export default function Footer() {
  return (
    <footer className="px-[5%] py-9 bg-ink text-white flex justify-between gap-6 flex-wrap text-[13px]">
      <div>
        <div className="font-black text-[28px] tracking-[-2px]">TMF.</div>
        <p className="text-[#c3c3bb] leading-relaxed mt-2">
          Everyday essentials, thoughtfully made.
          <br />
          Korean-inspired unisex · Việt Nam
        </p>
      </div>
      <div>
        <strong>KHÁM PHÁ</strong>
        <p className="text-[#c3c3bb] leading-relaxed mt-2">
          <a href="#lookbook" className="hover:underline">Lookbook</a>
          <br />
          <a href="#shop" className="hover:underline">Sản phẩm</a>
        </p>
      </div>
      <div>
        <strong>ABOUT</strong>
        <p className="text-[#c3c3bb] leading-relaxed mt-2">
          Hình minh họa, sản phẩm và chính sách mẫu.
          <br />
          Chưa kết nối backend hoặc thanh toán.
        </p>
      </div>
    </footer>
  );
}

