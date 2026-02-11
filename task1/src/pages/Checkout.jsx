import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Trash2, Check, AlertCircle, X } from 'lucide-react';

const Checkout = () => {
    const { cartItems, removeFromCart, cartTotal, isBooked } = useCart();
    const navigate = useNavigate();
    const [showSelectionModal, setShowSelectionModal] = useState(false);

    if (cartItems.length === 0) {
        return (
            <div className="max-w-md mx-auto py-20 text-center bg-white dark:bg-slate-900 min-h-screen">
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Your Cart is Empty</h2>
                <Link to="/explore" className="btn-primary inline-block">Start Shopping</Link>
            </div>
        );
    }

    // Get unbooked events/workshops
    const unbookedEventsWorkshops = cartItems.filter(item =>
        item.category !== 'products' && !isBooked(item.id)
    );

    const handleProceedToPayment = () => {
        if (unbookedEventsWorkshops.length === 0) {
            // All events/workshops are booked or no events/workshops, proceed to payment
            navigate('/payment');
        } else if (unbookedEventsWorkshops.length === 1) {
            // Only one unbooked item, go directly to booking
            navigate(`/booking?itemId=${unbookedEventsWorkshops[0].id}`);
        } else {
            // Multiple unbooked items, show selection modal
            setShowSelectionModal(true);
        }
    };

    const handleSelectItem = (itemId) => {
        setShowSelectionModal(false);
        navigate(`/booking?itemId=${itemId}`);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 bg-white dark:bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white">Checkout Summary</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="md:col-span-2 space-y-4">
                    {cartItems.map((item, index) => {
                        const isEventOrWorkshop = item.category !== 'products';
                        const itemBooked = isEventOrWorkshop && isBooked(item.id);
                        const handleItemClick = () => {
                            if (isEventOrWorkshop) {
                                navigate(`/booking?itemId=${item.id}`);
                            }
                        };
                        const handleRemoveClick = (e) => {
                            e.stopPropagation(); // Prevent card click when removing
                            removeFromCart(item.id);
                        };

                        return (
                            <div
                                key={`${item.id}-${index}`}
                                onClick={handleItemClick}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleItemClick();
                                    }
                                }}
                                role={isEventOrWorkshop ? "button" : undefined}
                                tabIndex={isEventOrWorkshop ? 0 : undefined}
                                className={`flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border ${isEventOrWorkshop
                                    ? itemBooked
                                        ? 'border-green-200 dark:border-green-800 cursor-pointer hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all focus:ring-2 focus:ring-urban-green outline-none'
                                        : 'border-red-200 dark:border-red-800 cursor-pointer hover:shadow-md hover:border-red-300 dark:hover:border-red-700 transition-all focus:ring-2 focus:ring-urban-green outline-none'
                                    : 'border-slate-100 dark:border-slate-700'
                                    }`}
                            >
                                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-md" />
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-semibold text-slate-800 dark:text-white ${isEventOrWorkshop ? 'hover:text-urban-green transition-colors' : ''}`}>
                                            {item.title}
                                        </h3>
                                        {isEventOrWorkshop && (
                                            itemBooked ? (
                                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
                                                    <Check className="w-4 h-4" />
                                                    <span>booked</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-xs font-medium">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>Please book</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{item.category}</p>
                                    <p className="font-bold text-urban-green mt-1">Rs. {item.price.toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={handleRemoveClick}
                                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                    aria-label={`Remove ${item.title} from cart`}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 sticky top-24">
                        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Order Summary</h2>
                        <div className="space-y-2 mb-4 text-slate-600 dark:text-slate-300">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rs. {cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (Estimated)</span>
                                <span>Rs. 0</span>
                            </div>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-6">
                            <div className="flex justify-between font-bold text-xl text-slate-800 dark:text-white">
                                <span>Total</span>
                                <span>Rs. {cartTotal.toLocaleString()}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleProceedToPayment}
                            className="w-full btn-primary block text-center"
                        >
                            Proceed to Payment
                        </button>
                        <Link to="/explore" className="block text-center mt-4 text-sm text-slate-500 dark:text-slate-400 hover:text-urban-green">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>

            {/* Selection Modal for Multiple Unbooked Items */}
            {showSelectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Select Event/Workshop to Book</h2>
                            <button
                                onClick={() => setShowSelectionModal(false)}
                                className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 dark:text-slate-300 mb-6">
                                You have multiple unbooked events/workshops. Please select one to book first.
                            </p>
                            <div className="space-y-4">
                                {unbookedEventsWorkshops.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleSelectItem(item.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleSelectItem(item.id);
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        className="flex items-center gap-4 bg-white dark:bg-slate-700 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-600 hover:border-urban-green cursor-pointer transition-all hover:shadow-md focus:ring-2 focus:ring-urban-green outline-none"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{item.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize mb-2">{item.category}</p>
                                            <p className="font-bold text-urban-green">Rs. {item.price.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm font-medium">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Not booked</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
