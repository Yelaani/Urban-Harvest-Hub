import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useTranslation } from 'react-i18next';

const Booking = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        agreed: false
    });
    const [errors, setErrors] = useState({});

    if (cartItems.length === 0) {
        return (
            <div className="max-w-md mx-auto py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">{t('booking.empty_cart')}</h2>
                <p className="mb-8">{t('booking.add_items_prompt')}</p>
                <button onClick={() => navigate('/explore')} className="btn-primary">{t('booking.browse_collection')}</button>
            </div>
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
            // Logic to save user details could go here
            navigate('/checkout');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">{t('booking.title')}</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-100" noValidate>

                {/* Name */}
                <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('booking.full_name')}</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-urban-green outline-none transition-all ${errors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-300 dark:border-slate-600'
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
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('booking.email')}</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-urban-green outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-300 dark:border-slate-600'
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
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('booking.phone')}</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-urban-green outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-300 dark:border-slate-600'
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
                        <span className="text-sm text-slate-600 dark:text-slate-300">{t('booking.agree_terms')}</span>
                    </label>
                    {errors.agreed && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1 pl-8" aria-live="polite">{errors.agreed}</p>
                    )}
                </div>

                <button type="submit" className="w-full btn-primary text-lg">
                    {t('booking.proceed_checkout')}
                </button>
            </form>
        </div>
    );
};

export default Booking;
