import PromoBar from './components/layout/PromoBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import PaletteStrip from './components/home/PaletteStrip';
import Categories from './components/home/Categories';
import Lookbook from './components/home/Lookbook';
import Manifesto from './components/home/Manifesto';
import Perks from './components/home/Perks';
import ProductGrid from './components/shop/ProductGrid';
import ProductDetail from './components/product/ProductDetail';
import CartDrawer from './components/cart/CartDrawer';
import SearchModal from './components/search/SearchModal';
import Toast from './components/ui/Toast';

export default function App() {
  return (
    <>
      <PromoBar />
      <Navbar />
      <main>
        <Hero />
        <PaletteStrip />
        <Categories />
        <Lookbook />
        <ProductGrid />
        <Manifesto />
      </main>
      <Perks />
      <Footer />

      <ProductDetail />
      <CartDrawer />
      <SearchModal />
      <Toast />
    </>
  );
}

