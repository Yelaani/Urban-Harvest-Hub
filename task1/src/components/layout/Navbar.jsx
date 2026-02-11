import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Leaf, LogOut, User as UserIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import DarkModeToggle from '../ui/DarkModeToggle';

const Navbar = () => {
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
        { name: 'Home', path: '/' },
        { name: 'Explore', path: '/explore' },
        { name: 'Book Now', path: '/booking' },
    ];

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
                        {navLinks.map((link) => (
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

                        {/* Auth Controls */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-semibold text-slate-700 flex items-center">
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
                        <Link to="/checkout" className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-urban-green transition-colors" aria-label="View Cart">
                            <ShoppingBag className="h-6 w-6" />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-earth-brown rounded-full">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {/* Dark Mode Toggle */}
                        <DarkModeToggle />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <DarkModeToggle />
                        <Link to="/checkout" className="relative p-2 mr-2 text-slate-600" aria-label="View Cart">
                            <ShoppingBag className="h-6 w-6" />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-earth-brown rounded-full">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-600 hover:text-urban-green focus:outline-none focus:ring-2 focus:ring-urban-green rounded p-1"
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
                        {navLinks.map((link) => (
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

                        <div className="border-t border-slate-100 my-2 pt-2">
                            {isAuthenticated ? (
                                <>
                                    <div className="px-3 py-2 text-sm font-semibold text-slate-700 flex items-center">
                                        <UserIcon className="w-4 h-4 mr-2" />
                                        {user?.username || 'User'}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-base font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md flex items-center"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-urban-green hover:bg-green-50"
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
