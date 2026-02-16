import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Plus, Edit, Trash2, Package, Calendar, Users, ArrowLeft, Search } from 'lucide-react';
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

    const fetchItems = async () => {
        setLoading(true);
        try {
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
            return matchesSearch && !isOutOfStock;
        }
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let endpoint = '';
            if (activeTab === 'products') endpoint = '/products';
            else if (activeTab === 'workshops') endpoint = '/workshops';
            else if (activeTab === 'events') endpoint = '/events';

            const isNewItem = !editingItem;
            const isWorkshop = activeTab === 'workshops';

            let dataToSend = {};

            if (activeTab === 'products') {
                dataToSend = {
                    title: formData.title,
                    description: formData.description || '',
                    price: parseFloat(formData.price) || 0,
                    category: 'products',
                    image: formData.image || null,
                    availability: formData.availability || ''
                };
            } else {
                // Auto-detect coordinates from location string if not manually set
                let coords = formData.coordinates;
                if (!coords && formData.location) {
                    const match = formData.location.match(/^([-+]?\d+(\.\d+)?)\s*,\s*([-+]?\d+(\.\d+)?)$/);
                    if (match) {
                        coords = {
                            lat: parseFloat(match[1]),
                            lng: parseFloat(match[3])
                        };
                    }
                }

                dataToSend = {
                    title: formData.title,
                    description: formData.description || '',
                    price: parseFloat(formData.price) || 0,
                    date: formData.date || '',
                    location: formData.location || '',
                    image: formData.image || null,
                    coordinates: coords || null
                };
            }

            if (editingItem) {
                await api.put(`${endpoint}/${editingItem.id}`, dataToSend);
            } else {
                await api.post(endpoint, dataToSend);

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
            if (error.response?.status === 404) {
                // If item doesn't exist on server, just refresh the list to remove it from UI
                fetchItems();
            } else {
                console.error('Failed to delete item:', error);
                alert('Failed to delete item.');
            }
        }
    };

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button
                        onClick={() => {/* Stay on admin or navigate to a safe subpage if we were one */ }}
                        className="hidden items-center text-slate-600 dark:text-slate-300 hover:text-urban-green dark:hover:text-green-400 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t('admin.back')}
                    </button>
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{t('admin.title')}</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">{t('admin.subtitle')}</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingItem(null);
                        resetForm();
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> {t('admin.create')} {t(`categories.${activeTab}`)}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
                {['products', 'workshops', 'events'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setShowForm(false);
                            setEditingItem(null);
                            setSearchTerm('');
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
                        {t(`categories.${tab}`)}
                    </button>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder={t('admin.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
            {loading ? (
                <div className="text-center py-20 text-slate-600 dark:text-slate-400">{t('common.loading')}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                        <div key={item.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 border border-slate-100 dark:border-slate-700">
                            <img
                                src={item.image || 'https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=800&auto=format'}
                                alt={item.title}
                                className="w-full h-48 object-cover rounded-lg mb-4 shadow-sm"
                            />
                            <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">{item.title}</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{item.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-urban-green dark:text-green-400">${item.price?.toFixed(2)}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        title={t('admin.edit')}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title={t('admin.delete')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Admin;
