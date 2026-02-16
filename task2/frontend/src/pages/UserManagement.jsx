import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Trash2, Users, ArrowLeft, UserX, Shield, UserCheck, Search, Eye, WifiOff, X, ClipboardList, CheckCircle2, XCircle, Clock } from 'lucide-react';

const UserManagement = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'bookings'
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [bookingSearchTerm, setBookingSearchTerm] = useState('');
    const [selectedUserBookings, setSelectedUserBookings] = useState([]);
    const [showBookingsModal, setShowBookingsModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            navigate('/login');
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else {
            fetchGlobalBookings();
        }
    }, [activeTab, userSearchTerm, bookingSearchTerm]);

    // Offline detection
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = userSearchTerm ? { search: userSearchTerm } : {};
            const response = await api.get('/users', { params });
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGlobalBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/bookings');
            setBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch global bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserBookings = async (userId) => {
        try {
            const response = await api.get(`/users/${userId}/bookings`);
            setSelectedUserBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch user bookings:', error);
            alert('Failed to fetch user bookings.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!isOnline) {
            alert(t('admin.users.offline_warning'));
            return;
        }

        if (!window.confirm(t('admin.users.delete_confirm'))) return;

        try {
            await api.delete(`/users/${userId}`);
            alert(t('admin.users.user_deleted'));
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
            alert(`Failed to delete user: ${errorMessage}`);
        }
    };

    const handleToggleUserStatus = async (userId, currentStatus) => {
        if (!isOnline) {
            alert(t('admin.users.offline_warning'));
            return;
        }

        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        const confirmMessage = newStatus === 'suspended'
            ? t('admin.users.suspend_confirm')
            : t('admin.users.activate_confirm');

        if (!window.confirm(confirmMessage)) return;

        try {
            await api.patch(`/users/${userId}/status`, { status: newStatus });
            alert(newStatus === 'suspended'
                ? t('admin.users.user_suspended')
                : t('admin.users.user_activated'));
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user status:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
            alert(`Failed to update user status: ${errorMessage}`);
        }
    };

    const handlePromoteUser = async (userId) => {
        if (!isOnline) {
            alert(t('admin.users.offline_warning'));
            return;
        }

        if (!window.confirm(t('admin.users.promote_confirm'))) return;

        try {
            await api.patch(`/users/${userId}/role`, { role: 'admin' });
            alert(t('admin.users.user_promoted'));
            fetchUsers();
        } catch (error) {
            console.error('Failed to promote user:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
            alert(`Failed to promote user: ${errorMessage}`);
        }
    };

    const handleViewBookings = async (userId) => {
        setSelectedUserId(userId);
        setShowBookingsModal(true);
        await fetchUserBookings(userId);
    };

    const handleUpdateBookingStatus = async (bookingId, newStatus) => {
        if (!isOnline) {
            alert(t('admin.users.offline_warning'));
            return;
        }

        try {
            await api.put(`/bookings/${bookingId}`, { status: newStatus });
            alert('Booking status updated successfully');
            fetchGlobalBookings();
        } catch (error) {
            console.error('Failed to update booking status:', error);
            alert('Failed to update booking status.');
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.userName?.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
        b.userEmail?.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
        b.item?.title?.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
        b.status?.toLowerCase().includes(bookingSearchTerm.toLowerCase())
    );

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center text-slate-600 dark:text-slate-300 hover:text-urban-green dark:hover:text-green-400 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t('admin.back')}
                    </button>
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
                        {activeTab === 'users' ? t('admin.users.title') : 'Global Bookings'}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">
                        {activeTab === 'users'
                            ? 'Manage community members and their permissions'
                            : 'Manage all workshop and product reservations'}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${activeTab === 'users'
                        ? 'border-b-2 border-urban-green text-urban-green dark:text-green-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                >
                    <Users className="w-4 h-4" /> Users
                </button>
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${activeTab === 'bookings'
                        ? 'border-b-2 border-urban-green text-urban-green dark:text-green-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                >
                    <ClipboardList className="w-4 h-4" /> All Bookings
                </button>
            </div>

            {/* Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder={activeTab === 'users' ? t('admin.users.search_placeholder') : 'Search bookings by name, item or status...'}
                        value={activeTab === 'users' ? userSearchTerm : bookingSearchTerm}
                        onChange={(e) => activeTab === 'users' ? setUserSearchTerm(e.target.value) : setBookingSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-urban-green"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-400" />
                </div>
            </div>

            {/* Offline Warning Banner */}
            {!isOnline && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-2">
                    <WifiOff className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <p className="text-yellow-800 dark:text-yellow-300">{t('admin.users.offline_warning')}</p>
                </div>
            )}

            {/* Main Content UI */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="text-center py-20 text-slate-600 dark:text-slate-400">{t('common.loading')}</div>
                ) : activeTab === 'users' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        {t('admin.users.username')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        {t('admin.users.email')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        {t('admin.users.role')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        {t('admin.users.status')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        {t('admin.users.active_bookings')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        {t('admin.users.registered')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        {t('admin.users.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                            {t('common.no_results') || 'No users found'}
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((userItem) => (
                                        <tr key={userItem.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                                {userItem.username}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                {userItem.email || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${userItem.role === 'admin'
                                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                                    }`}>
                                                    {userItem.role === 'admin' ? t('admin.users.role_admin') : t('admin.users.role_user')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${userItem.status === 'active'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                                    }`}>
                                                    {userItem.status === 'active' ? t('admin.users.status_active') : t('admin.users.status_suspended')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                {userItem.activeBookings || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewBookings(userItem.id)}
                                                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        aria-label={t('admin.users.view_bookings')}
                                                        title={t('admin.users.view_bookings')}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(userItem.id)}
                                                        disabled={!isOnline || userItem.id === user?.id}
                                                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        aria-label={t('admin.users.delete_user')}
                                                        title={userItem.id === user?.id ? t('admin.users.cannot_delete_self') : t('admin.users.delete_user')}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleUserStatus(userItem.id, userItem.status)}
                                                        disabled={!isOnline}
                                                        className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        aria-label={userItem.status === 'active' ? t('admin.users.suspend_user') : t('admin.users.activate_user')}
                                                        title={userItem.status === 'active' ? t('admin.users.suspend_user') : t('admin.users.activate_user')}
                                                    >
                                                        {userItem.status === 'active' ? (
                                                            <UserX className="w-4 h-4" />
                                                        ) : (
                                                            <UserCheck className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    {userItem.role === 'user' && (
                                                        <button
                                                            onClick={() => handlePromoteUser(userItem.id)}
                                                            disabled={!isOnline}
                                                            className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            aria-label={t('admin.users.promote_to_admin')}
                                                            title={t('admin.users.promote_to_admin')}
                                                        >
                                                            <Shield className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Item
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{booking.userName}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{booking.userEmail}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-900 dark:text-white font-medium">{booking.item?.title || 'Deleted Item'}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{booking.itemType} x{booking.quantity}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                {new Date(booking.bookingDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                    : booking.status === 'pending'
                                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    {booking.status !== 'confirmed' && (
                                                        <button
                                                            onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                                                            title="Confirm Booking"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {booking.status !== 'pending' && (
                                                        <button
                                                            onClick={() => handleUpdateBookingStatus(booking.id, 'pending')}
                                                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg"
                                                            title="Set to Pending"
                                                        >
                                                            <Clock className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {booking.status !== 'cancelled' && (
                                                        <button
                                                            onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                            title="Cancel Booking"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Bookings Modal */}
            {showBookingsModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {t('admin.users.bookings_modal_title')}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowBookingsModal(false);
                                        setSelectedUserBookings([]);
                                        setSelectedUserId(null);
                                    }}
                                    className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    aria-label={t('admin.users.close')}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {selectedUserBookings.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                    {t('admin.users.no_bookings')}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 dark:bg-slate-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                                    {t('admin.users.workshop_title')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                                    {t('admin.users.workshop_date')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                                    {t('admin.users.workshop_location')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                                    {t('admin.users.booking_status')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                            {selectedUserBookings.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                                        {booking.item?.title || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                        {booking.item?.date ? new Date(booking.item.date).toLocaleDateString() : (booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '-')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                        {booking.item?.location || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                            : booking.status === 'pending'
                                                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                                            }`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setShowBookingsModal(false);
                                        setSelectedUserBookings([]);
                                        setSelectedUserId(null);
                                    }}
                                    className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                                >
                                    {t('admin.users.close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
