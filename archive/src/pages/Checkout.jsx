import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2 } from 'lucide-react';

const Checkout = () => {
    const { cartItems, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="max-w-md mx-auto py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                <Link to="/explore" className="btn-primary inline-block">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">Checkout Summary</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="md:col-span-2 space-y-4">
                    {cartItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                            <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-md" />
                            <div className="flex-grow">
                                <h3 className="font-semibold text-slate-800">{item.title}</h3>
                                <p className="text-sm text-slate-500 capitalize">{item.category}</p>
                                <p className="font-bold text-urban-green mt-1">${item.price.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                aria-label={`Remove ${item.title} from cart`}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-4 text-slate-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (Estimated)</span>
                                <span>$0.00</span>
                            </div>
                        </div>
                        <div className="border-t pt-4 mb-6">
                            <div className="flex justify-between font-bold text-xl text-slate-800">
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
                        <Link to="/explore" className="block text-center mt-4 text-sm text-slate-500 hover:text-urban-green">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
