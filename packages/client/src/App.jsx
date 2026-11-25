import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PromoBar from './components/layout/PromoBar';
import Navbar from './components/layout/Navbar';
import RouteBar from './components/layout/RouteBar';
import Footer from './components/layout/Footer';
import Perks from './components/home/Perks';
import Toast from './components/ui/Toast';
import ProductDetail from './components/product/ProductDetail';
import CartDrawer from './components/cart/CartDrawer';
import SearchModal from './components/search/SearchModal';
import ScrollToTop from './components/layout/ScrollToTop';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import LookbookPage from './pages/LookbookPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import OrdersPage from './pages/OrdersPage';
import SuccessPage from './pages/SuccessPage';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PromoBar />
      <Navbar />
      <RouteBar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/lookbook" element={<LookbookPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </main>
      <Perks />
      <Footer />
      <ProductDetail />
      <CartDrawer />
      <SearchModal />
      <Toast />
    </BrowserRouter>
  );
}
