import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Calendar, MapPin, CheckCircle } from 'lucide-react';

const Booking = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const itemId = searchParams.get('itemId');
    const { cartItems, markAsBooked, isBooked } = useCart();
    
    // Find the specific item being booked
    const bookingItem = itemId ? cartItems.find(item => item.id === itemId && item.category !== 'products') : null;
    
    // If no specific item, get first unbooked event/workshop
    const firstUnbookedItem = !bookingItem && cartItems.find(item => 
        item.category !== 'products' && !isBooked(item.id)
    );
    
    const currentBookingItem = bookingItem || firstUnbookedItem;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        agreed: false
    });
    const [errors, setErrors] = useState({});
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);

    if (cartItems.length === 0) {
        return (
            <section className="max-w-md mx-auto py-20 text-center bg-white dark:bg-slate-900 min-h-screen">
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Your Cart is Empty</h2>
                <p className="mb-8 text-slate-600 dark:text-slate-300">Please add items before booking.</p>
                <button onClick={() => navigate('/explore')} className="btn-primary">Browse Collection</button>
            </section>
        );
    }

    if (!currentBookingItem) {
        return (
            <section className="max-w-md mx-auto py-20 text-center bg-white dark:bg-slate-900 min-h-screen">
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">No Event or Workshop to Book</h2>
                <p className="mb-8 text-slate-600 dark:text-slate-300">All events and workshops in your cart are already booked.</p>
                <button onClick={() => navigate('/checkout')} className="btn-primary">Return to Checkout</button>
            </section>
        );
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error on change
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) newErrors.email = 'Valid email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.agreed) newErrors.agreed = 'You must agree to terms';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Mark only the current item being booked
            if (currentBookingItem) {
                markAsBooked([currentBookingItem.id]);
            }
            // Logic to save user details could go here
            // Show success message instead of navigating immediately
            setIsBookingSuccess(true);
        }
    };

    return (
        <section className="max-w-2xl mx-auto px-4 py-12 bg-white dark:bg-slate-900 min-h-screen">
            <header>
                <h1 className="text-3xl font-bold mb-8 text-center text-slate-800 dark:text-white">Booking Registration</h1>
            </header>

            {/* Success Message */}
            {isBookingSuccess ? (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                        Thank you, {formData.name}!
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                        Your booking for the <span className="font-semibold text-urban-green">{currentBookingItem.title}</span> is confirmed.
                    </p>
                    <button
                        onClick={() => navigate('/checkout')}
                        className="btn-primary"
                    >
                        Return to Checkout
                    </button>
                </div>
            ) : (
                <>
                    {/* Event/Workshop Info Card */}
                    <article className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 mb-6">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">Booking for:</h2>
                        <div className="flex gap-4">
                            <img 
                                src={currentBookingItem.image} 
                                alt={currentBookingItem.title} 
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{currentBookingItem.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 capitalize mb-2">{currentBookingItem.category}</p>
                                {currentBookingItem.location && (
                                    <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm mb-1">
                                        <MapPin className="w-4 h-4 mr-2 text-urban-green" />
                                        <span>{currentBookingItem.location}</span>
                                    </div>
                                )}
                                {currentBookingItem.date && (
                                    <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
                                        <Calendar className="w-4 h-4 mr-2 text-urban-green" />
                                        <span>{currentBookingItem.date}</span>
                                    </div>
                                )}
                                <p className="font-bold text-urban-green mt-2">Rs. {currentBookingItem.price.toLocaleString()}</p>
                            </div>
                        </div>
                    </article>

                    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700" noValidate>

                {/* Name */}
                <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-urban-green outline-none transition-all ${errors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-300 dark:border-slate-600'
                            }`}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                        <p id="name-error" className="text-red-500 dark:text-red-400 text-sm mt-1" aria-live="polite">{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-urban-green outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-300 dark:border-slate-600'
                            }`}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                        <p id="email-error" className="text-red-500 dark:text-red-400 text-sm mt-1" aria-live="polite">{errors.email}</p>
                    )}
                </div>

                {/* Phone */}
                <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-urban-green outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-300 dark:border-slate-600'
                            }`}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && (
                        <p id="phone-error" className="text-red-500 dark:text-red-400 text-sm mt-1" aria-live="polite">{errors.phone}</p>
                    )}
                </div>

                {/* Terms */}
                <div className="mb-8">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="agreed"
                            checked={formData.agreed}
                            onChange={handleChange}
                            className="w-5 h-5 text-urban-green border-gray-300 dark:border-slate-600 rounded focus:ring-urban-green bg-white dark:bg-slate-700"
                            aria-invalid={!!errors.agreed}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-300">I agree to the Terms of Service and Privacy Policy.</span>
                    </label>
                    {errors.agreed && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1 pl-8" aria-live="polite">{errors.agreed}</p>
                    )}
                </div>

                        <button type="submit" className="w-full btn-primary text-lg">
                            Proceed to Checkout
                        </button>
                    </form>
                </>
            )}
        </section>
    );
};

export default Booking;
