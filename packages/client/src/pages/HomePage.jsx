import Hero from '../components/home/Hero';
import PaletteStrip from '../components/home/PaletteStrip';
import Categories from '../components/home/Categories';
import Lookbook from '../components/home/Lookbook';
import ProductGrid from '../components/shop/ProductGrid';
import Manifesto from '../components/home/Manifesto';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PaletteStrip />
      <Categories />
      <Lookbook />
      <ProductGrid />
      <Manifesto />
    </>
  );
}

