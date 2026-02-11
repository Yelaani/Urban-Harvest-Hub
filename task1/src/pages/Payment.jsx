import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CheckCircle, CreditCard } from 'lucide-react';

const Payment = () => {
    const navigate = useNavigate();
    const { clearCart, cartTotal } = useCart();
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePayment = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate API call
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            clearCart();
        }, 2000);
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto py-20 px-4 text-center bg-white dark:bg-slate-900 min-h-screen">
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
        <div className="max-w-lg mx-auto px-4 py-12 bg-white dark:bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center text-slate-800 dark:text-white">Payment Details</h1>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
                <div className="mb-6 flex justify-between items-center text-lg font-semibold bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <span className="text-slate-800 dark:text-white">Total Amount:</span>
                    <span className="text-urban-green">Rs. {cartTotal.toLocaleString()}</span>
                </div>

                <form onSubmit={handlePayment}>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Card Number</label>
                        <div className="relative">
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-urban-green outline-none" required />
                            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-urban-green outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">CVC</label>
                            <input type="text" placeholder="123" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-urban-green outline-none" required />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full btn-primary flex justify-center items-center ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {processing ? 'Processing...' : `Pay Rs. ${cartTotal.toLocaleString()}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
