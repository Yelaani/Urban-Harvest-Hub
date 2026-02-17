import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CheckCircle, CreditCard, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Payment = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart, cartTotal } = useCart();
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try {
            // Retrieve booking user info from localStorage
            const userName = localStorage.getItem('booking_user_name') || 'Valued Customer';
            const userEmail = localStorage.getItem('booking_user_email');

            if (!userEmail) {
                throw new Error("User email not found. Please go back to the booking form.");
            }

            // Call the real backend API to process payment and send email
            await api.post('/bookings/process-payment', {
                items: cartItems,
                userEmail,
                userName,
                total: cartTotal
            });

            setSuccess(true);
            clearCart();

            // Clean up temporary info
            localStorage.removeItem('booking_user_name');
            localStorage.removeItem('booking_user_email');

        } catch (err) {
            console.error("Payment failed:", err);
            setError(err.response?.data?.message || err.message || "An error occurred during payment.");
        } finally {
            setProcessing(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto py-20 px-4 text-center bg-slate-50 dark:bg-slate-900 min-h-screen">
                <CheckCircle className="w-20 h-20 text-green-500 dark:text-green-400 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Payment Successful!</h1>
                <p className="text-slate-600 dark:text-slate-300 mb-8">
                    Thank you for your purchase. A confirmation email has been sent.
                </p>
                <button onClick={() => navigate('/')} className="btn-primary w-full">
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto px-4 py-12 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center text-slate-800 dark:text-white">Payment Details</h1>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
                <div className="mb-6 flex justify-between items-center text-lg font-semibold bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <span className="text-slate-800 dark:text-white">Total Amount:</span>
                    <span className="text-urban-green dark:text-green-400">${cartTotal.toFixed(2)}</span>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center text-red-800 dark:text-red-400 animate-in fade-in">
                        <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handlePayment}>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Card Number</label>
                        <div className="relative">
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-urban-green outline-none" required />
                            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-urban-green outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">CVC</label>
                            <input type="text" placeholder="123" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-urban-green outline-none" required />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full btn-primary flex justify-center items-center ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {processing ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
