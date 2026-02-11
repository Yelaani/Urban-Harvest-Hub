import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Package, Calendar, Users, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const MyBookings = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [isAuthenticated, navigate]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/bookings/my-bookings');
            setBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
            default:
                return <AlertCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
            case 'pending':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
            case 'cancelled':
                return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
            default:
                return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300';
        }
    };

    const getItemIcon = (itemType) => {
        switch (itemType) {
            case 'product':
                return <Package className="w-5 h-5" />;
            case 'workshop':
                return <Calendar className="w-5 h-5" />;
            case 'event':
                return <Users className="w-5 h-5" />;
            default:
                return <Package className="w-5 h-5" />;
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        return booking.status === filter;
    });

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-600 dark:text-slate-300 hover:text-urban-green dark:hover:text-green-400 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back') || 'Back'}
                </button>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{t('bookings.my_bookings')}</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">{t('bookings.my_bookings_subtitle')}</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
                {['all', 'pending', 'confirmed', 'cancelled'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-6 py-3 font-semibold capitalize transition-colors ${filter === status
                            ? 'border-b-2 border-urban-green text-urban-green dark:text-green-400'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                    >
                        {t(`bookings.status_${status}`)}
                    </button>
                ))}
            </div>

            {/* Bookings List */}
            {loading ? (
                <div className="text-center py-20 text-slate-600 dark:text-slate-400">{t('common.loading')}</div>
            ) : filteredBookings.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-100 dark:border-slate-700">
                    <Package className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                        {t('bookings.no_bookings')}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        {t('bookings.no_bookings_description')}
                    </p>
                    <button
                        onClick={() => navigate('/explore')}
                        className="btn-primary"
                    >
                        {t('bookings.browse_collection')}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                {/* Left Section - Item Info */}
                                <div className="flex gap-4 flex-1">
                                    {booking.item?.image && (
                                        <img
                                            src={booking.item.image}
                                            alt={booking.item.title}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {getItemIcon(booking.itemType)}
                                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                                                {t(`categories.${booking.itemType}`)}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                                            {booking.item?.title || t('bookings.item_deleted')}
                                        </h3>
                                        {booking.item?.description && (
                                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2">
                                                {booking.item.description}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                                            {booking.item?.date && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(booking.item.date).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            {booking.item?.location && (
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{booking.item.location}</span>
                                                </div>
                                            )}
                                            {booking.item?.availability && (
                                                <div className="flex items-center gap-1">
                                                    <Package className="w-4 h-4" />
                                                    <span>{booking.item.availability}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section - Booking Details */}
                                <div className="flex flex-col items-end gap-3">
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        <span className="capitalize">{t(`bookings.status_${booking.status}`)}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                            {t('bookings.quantity')}: {booking.quantity}
                                        </p>
                                        <p className="text-2xl font-bold text-urban-green dark:text-green-400">
                                            ${booking.totalPrice?.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            {t('bookings.booked_on')}: {new Date(booking.bookingDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
