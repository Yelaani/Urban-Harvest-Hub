import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import Details from './pages/Details';
import Booking from './pages/Booking';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Admin from './pages/Admin';
import UserManagement from './pages/UserManagement';
import MyBookings from './pages/MyBookings';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import OfflineToast from './components/ui/OfflineToast';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Layout>
              <OfflineToast />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/explore" element={<Category />} />
                <Route path="/explore/:category" element={<Category />} />
                <Route path="/item/:id" element={<Details />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
