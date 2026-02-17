import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Checkout = () => {
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="max-w-md mx-auto py-20 text-center bg-slate-50 dark:bg-slate-900 min-h-screen">
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Your Cart is Empty</h2>
                <Link to="/explore" className="btn-primary inline-block">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white">Checkout Summary</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="md:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="group animate-in slide-in-from-left bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition-all flex flex-col sm:flex-row items-center gap-6">
                            {/* Product Image */}
                            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>

                            {/* Info */}
                            <div className="flex-grow text-center sm:text-left">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-urban-green dark:group-hover:text-green-400 transition-colors">{item.title}</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold mt-1">{item.category}</p>
                                <p className="font-bold text-slate-500 dark:text-slate-400 mt-2">${item.price.toFixed(2)} <span className="text-xs font-normal">per unit</span></p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center bg-slate-50 dark:bg-slate-900/50 rounded-xl p-1 border border-slate-100 dark:border-slate-700">
                                <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-all active:scale-90"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-bold text-slate-800 dark:text-white text-sm">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-urban-green dark:text-green-400 transition-all active:scale-90"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Total for Item */}
                            <div className="text-right min-w-[80px]">
                                <p className="text-sm text-slate-400 dark:text-slate-500 mb-1">Total</p>
                                <p className="font-bold text-lg text-urban-green dark:text-green-400">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>

                            {/* Remove */}
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-3 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                title="Remove item"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 sticky top-24">
                        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Order Summary</h2>
                        <div className="space-y-2 mb-4 text-slate-600 dark:text-slate-300">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (Estimated)</span>
                                <span>$0.00</span>
                            </div>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-6">
                            <div className="flex justify-between font-bold text-xl text-slate-800 dark:text-white">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/payment')}
                            className="w-full btn-primary block text-center"
                        >
                            Proceed to Payment
                        </button>
                        <Link to="/explore" className="block text-center mt-4 text-sm text-slate-500 dark:text-slate-400 hover:text-urban-green dark:hover:text-green-400">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
