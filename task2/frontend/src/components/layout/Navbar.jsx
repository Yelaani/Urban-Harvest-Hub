import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Leaf, LogOut, User as UserIcon, Settings, Package } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../context/AuthContext';
import DarkModeToggle from '../ui/DarkModeToggle';
import LanguageSwitcher from '../LanguageSwitcher';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t } = useTranslation();
    const { cartItems } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const navLinks = [
        { name: t('welcome') === 'Welcome to Urban Harvest Hub' ? 'Home' : t('welcome').includes('සාදරයෙන්') ? 'මුල් පිටුව' : 'முகப்பு', path: '/' }, // Fallback logic or better: use t('nav.home') if available, else stick to 'Home' manually mapped
        // Better approach:
        { name: t('explore'), path: '/explore' },
        { name: t('book_now'), path: '/booking' },
    ];

    const isAdmin = user?.role === 'admin';
    const visibleNavLinks = isAdmin ? [] : navLinks;

    return (
        <nav className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Leaf className="h-8 w-8 text-urban-green" />
                            <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Urban Harvest Hub</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {visibleNavLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-urban-green' : 'text-slate-600 dark:text-slate-300 hover:text-urban-green'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        {/* Dark Mode Toggle */}
                        <DarkModeToggle />

                        {/* Language Switcher */}
                        <LanguageSwitcher />

                        <button
                            onClick={() => import('../../services/NotificationService').then(m => m.NotificationService.requestPermission())}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:text-urban-green transition-colors"
                            aria-label="Enable Notifications"
                            title="Enable Notifications"
                        >
                            <span className="sr-only">Enable Notifications</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                        </button>

                        {/* Auth Controls */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="text-sm font-medium text-slate-600 hover:text-urban-green transition-colors flex items-center"
                                    >
                                        <Settings className="w-4 h-4 mr-1" />
                                        Admin
                                    </Link>
                                )}
                                {!isAdmin && (
                                    <Link
                                        to="/my-bookings"
                                        className="text-sm font-medium text-slate-600 hover:text-urban-green transition-colors flex items-center"
                                    >
                                        <Package className="w-4 h-4 mr-1" />
                                        {t('bookings.my_bookings') || 'My Bookings'}
                                    </Link>
                                )}
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                                    <UserIcon className="w-4 h-4 mr-1" />
                                    {user?.username || 'User'}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors flex items-center"
                                >
                                    <LogOut className="w-4 h-4 mr-1" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-white bg-urban-green rounded-md hover:bg-green-700 transition-colors shadow-sm"
                            >
                                Login
                            </Link>
                        )}

                        {/* Cart Icon */}
                        {!isAdmin && (
                            <Link to="/checkout" className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-urban-green transition-colors" aria-label="View Cart">
                                <ShoppingBag className="h-6 w-6" />
                                {cartItems.length > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-earth-brown rounded-full">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <LanguageSwitcher />
                        <DarkModeToggle />
                        {!isAdmin && (
                            <Link to="/checkout" className="relative p-2 text-slate-600 dark:text-slate-300" aria-label="View Cart">
                                <ShoppingBag className="h-6 w-6" />
                                {cartItems.length > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-earth-brown rounded-full">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                        )}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-600 dark:text-slate-300 hover:text-urban-green focus:outline-none focus:ring-2 focus:ring-urban-green rounded p-1"
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {visibleNavLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-urban-green bg-green-50 dark:bg-green-900/20' : 'text-slate-600 dark:text-slate-300 hover:text-urban-green hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        <div className="border-t border-slate-100 dark:border-slate-700 my-2 pt-2">
                            <div className="px-3 py-2 flex items-center gap-2">
                                <DarkModeToggle />
                                <LanguageSwitcher />
                            </div>
                            {isAuthenticated ? (
                                <>
                                    <div className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                                        <UserIcon className="w-4 h-4 mr-2" />
                                        {user?.username || 'User'}
                                    </div>
                                    {!isAdmin && (
                                        <Link
                                            to="/my-bookings"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-urban-green hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center"
                                        >
                                            <Package className="w-4 h-4 mr-2" />
                                            {t('bookings.my_bookings') || 'My Bookings'}
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md flex items-center"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-urban-green hover:bg-green-50 dark:hover:bg-green-900/20"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
