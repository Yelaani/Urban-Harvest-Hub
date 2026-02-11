import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Plus, Edit, Trash2, Package, Calendar, Users, ArrowLeft, UserX, Shield, UserCheck, Search, Eye, WifiOff, X } from 'lucide-react';
import { NotificationService } from '../services/NotificationService';

const Admin = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('products');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState('all'); // all, in_stock, out_of_stock
    const [users, setUsers] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [selectedUserBookings, setSelectedUserBookings] = useState([]);
    const [showBookingsModal, setShowBookingsModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        category: 'products',
        image: '',
        availability: '',
        date: '',
        location: '',
        coordinates: null
    });

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            navigate('/login');
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

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

    // Debounced user search
    useEffect(() => {
        if (activeTab === 'users') {
            const timeoutId = setTimeout(() => {
                fetchUsers();
            }, 300);

            return () => clearTimeout(timeoutId);
        }
    }, [userSearchTerm, activeTab]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                await fetchUsers();
                return;
            }

            let endpoint = '';
            if (activeTab === 'products') endpoint = '/products';
            else if (activeTab === 'workshops') endpoint = '/workshops';
            else if (activeTab === 'events') endpoint = '/events';

            const response = await api.get(endpoint);
            setItems(response.data);
        } catch (error) {
            console.error('Failed to fetch items:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = userSearchTerm ? { search: userSearchTerm } : {};
            const response = await api.get('/users', { params });
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            alert('Failed to fetch users.');
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

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab !== 'products') {
            return matchesSearch;
        }

        if (stockFilter === 'all') return matchesSearch;

        const isOutOfStock = item.availability?.toLowerCase().includes('out of stock') ||
            item.availability?.toLowerCase().includes('sold out');

        if (stockFilter === 'out_of_stock') {
            return matchesSearch && isOutOfStock;
        } else {
            // in_stock
            return matchesSearch && !isOutOfStock;
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let endpoint = '';
            if (activeTab === 'products') endpoint = '/products';
            else if (activeTab === 'workshops') endpoint = '/workshops';
            else if (activeTab === 'events') endpoint = '/events';

            const isNewItem = !editingItem;
            const isWorkshop = activeTab === 'workshops';

            // Prepare data based on item type - only send relevant fields
            let dataToSend = {};

            if (activeTab === 'products') {
                // Products only need: title, description, price, category, image, availability
                dataToSend = {
                    title: formData.title,
                    description: formData.description || '',
                    price: parseFloat(formData.price) || 0,
                    category: 'products',
                    image: formData.image || '',
                    availability: formData.availability || ''
                };
            } else if (activeTab === 'workshops' || activeTab === 'events') {
                // Workshops and Events need: title, description, price, date, location, image, coordinates
                dataToSend = {
                    title: formData.title,
                    description: formData.description || '',
                    price: parseFloat(formData.price) || 0,
                    date: formData.date || '',
                    location: formData.location || '',
                    image: formData.image || '',
                    coordinates: formData.coordinates || null
                };
            }

            if (editingItem) {
                await api.put(`${endpoint}/${editingItem.id}`, dataToSend);
            } else {
                await api.post(endpoint, dataToSend);

                // Send notification when new workshop is added
                if (isNewItem && isWorkshop) {
                    await NotificationService.requestPermission();
                    NotificationService.showNotification(
                        'New Workshop Added!',
                        `${formData.title} has been added to the workshop collection.`
                    );
                }
            }

            setShowForm(false);
            setEditingItem(null);
            resetForm();
            fetchItems();
        } catch (error) {
            console.error('Failed to save item:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
            alert(`Failed to save item: ${errorMessage}`);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            description: item.description || '',
            price: item.price || 0,
            category: item.category || activeTab,
            image: item.image || '',
            availability: item.availability || '',
            date: item.date || '',
            location: item.location || '',
            coordinates: item.coordinates || null
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.delete_confirm'))) return;

        try {
            let endpoint = '';
            if (activeTab === 'products') endpoint = '/products';
            else if (activeTab === 'workshops') endpoint = '/workshops';
            else if (activeTab === 'events') endpoint = '/events';

            await api.delete(`${endpoint}/${id}`);
            fetchItems();
        } catch (error) {
            console.error('Failed to delete item:', error);
            alert('Failed to delete item.');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            price: 0,
            category: activeTab,
            image: '',
            availability: '',
            date: '',
            location: '',
            coordinates: null
        });
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

    const handleSearchUsers = (searchTerm) => {
        setUserSearchTerm(searchTerm);
    };

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-slate-600 dark:text-slate-300 hover:text-urban-green dark:hover:text-green-400 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t('admin.back')}
                    </button>
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{t('admin.title')}</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">{t('admin.subtitle')}</p>
                </div>
                {activeTab !== 'users' && (
                    <button
                        onClick={() => {
                            resetForm();
                            setEditingItem(null);
                            setShowForm(true);
                        }}
                        className="btn-primary flex items-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        {t('admin.add_new')}
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
                {['products', 'workshops', 'events', 'users'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setShowForm(false);
                            setEditingItem(null);
                            setSearchTerm('');
                            setUserSearchTerm('');
                            setStockFilter('all');
                        }}
                        className={`px-6 py-3 font-semibold capitalize transition-colors ${activeTab === tab
                            ? 'border-b-2 border-urban-green text-urban-green dark:text-green-400'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                    >
                        {tab === 'products' && <Package className="w-4 h-4 inline mr-2" />}
                        {tab === 'workshops' && <Calendar className="w-4 h-4 inline mr-2" />}
                        {tab === 'events' && <Users className="w-4 h-4 inline mr-2" />}
                        {tab === 'users' && <Users className="w-4 h-4 inline mr-2" />}
                        {tab === 'users' ? t('admin.users.title') : t(`categories.${tab}`)}
                    </button>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder={activeTab === 'users' ? t('admin.users.search_placeholder') : t('admin.search_placeholder')}
                        value={activeTab === 'users' ? userSearchTerm : searchTerm}
                        onChange={(e) => activeTab === 'users' ? handleSearchUsers(e.target.value) : setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-urban-green"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-400" />
                </div>

                {activeTab === 'products' && (
                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-urban-green"
                    >
                        <option value="all">{t('admin.all_status')}</option>
                        <option value="in_stock">{t('admin.in_stock')}</option>
                        <option value="out_of_stock">{t('admin.out_of_stock')}</option>
                    </select>
                )}
            </div>

            {/* Offline Warning Banner */}
            {activeTab === 'users' && !isOnline && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-2">
                    <WifiOff className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <p className="text-yellow-800 dark:text-yellow-300">{t('admin.users.offline_warning')}</p>
                </div>
            )}

            {/* User Management UI */}
            {activeTab === 'users' && (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 overflow-hidden">
                    {loading ? (
                        <div className="text-center py-20 text-slate-600 dark:text-slate-400">{t('common.loading')}</div>
                    ) : (
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
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        userItem.role === 'admin' 
                                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                                    }`}>
                                                        {userItem.role === 'admin' ? t('admin.users.role_admin') : t('admin.users.role_user')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        userItem.status === 'active' 
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
                    )}
                </div>
            )}

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
                                                        {booking.workshop?.title || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                        {booking.workshop?.date ? new Date(booking.workshop.date).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                        {booking.workshop?.location || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                            booking.status === 'confirmed' 
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

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
                                {editingItem ? t('admin.edit') : t('admin.create')} {t(`categories.${activeTab}`)}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">{t('admin.form.title')} *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-urban-green"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">{t('admin.form.description')}</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-urban-green"
                                        rows="3"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">{t('admin.form.price')} *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-urban-green"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">{t('admin.form.image_url')}</label>
                                        <input
                                            type="url"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-urban-green"
                                        />
                                    </div>
                                </div>
                                {(activeTab === 'workshops' || activeTab === 'events') && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">{t('admin.form.date')} *</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-urban-green"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">{t('admin.form.location')} *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-urban-green"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {activeTab === 'products' && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">{t('admin.form.availability')}</label>
                                        <input
                                            type="text"
                                            value={formData.availability}
                                            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-urban-green"
                                            placeholder="e.g., In Stock"
                                        />
                                    </div>
                                )}
                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="btn-primary flex-1">
                                        {editingItem ? t('admin.update') : t('admin.create')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingItem(null);
                                            resetForm();
                                        }}
                                        className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                                    >
                                        {t('admin.cancel')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Items List */}
            {activeTab !== 'users' && (
                <>
                    {loading ? (
                        <div className="text-center py-20 text-slate-600 dark:text-slate-400">{t('common.loading')}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map(item => (
                                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 border border-slate-100 dark:border-slate-700">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{item.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-urban-green dark:text-green-400">${item.price?.toFixed(2)}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                aria-label={t('admin.edit')}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                aria-label={t('admin.delete')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Admin;
