import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { SkeletonGrid } from '../components/ui/SkeletonLoader';
import { Search } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const Category = () => {
    const { t } = useTranslation();
    const { category } = useParams(); // Optional category param
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState(category || 'all');
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all 3 resources and combine
                const [productsRes, workshopsRes, eventsRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/workshops'),
                    api.get('/events')
                ]);

                // Normalize data structure if needed, or assume they are compatible
                // Adding 'category' transparently if backend doesn't, but our seed data has it.
                const combined = [
                    ...productsRes.data,
                    ...workshopsRes.data,
                    ...eventsRes.data
                ];
                setInventory(combined);
            } catch (error) {
                console.error("Failed to fetch inventory:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredItems = useMemo(() => {
        let items = inventory;

        // Filter by Category
        if (activeFilter !== 'all') {
            items = items.filter(item => item.category === activeFilter);
        }

        // Filter by Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            items = items.filter(item =>
                item.title.toLowerCase().includes(lower) ||
                (item.description && item.description.toLowerCase().includes(lower))
            );
        }

        return items;
    }, [activeFilter, searchTerm, inventory]);

    const categories = ['all', 'products', 'workshops', 'events'];

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-12 text-center">
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-96 mx-auto animate-pulse"></div>
                </header>
                <SkeletonGrid count={8} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 capitalize">
                    {activeFilter === 'all' ? t('explore') : t(`categories.${activeFilter}`)}
                </h1>
                <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Browse our selection of eco-friendly products, educational workshops, and community events.
                </p>
            </header>

            {/* Controls: Filter & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors capitalize ${activeFilter === cat
                                ? 'bg-urban-green text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                            aria-pressed={activeFilter === cat}
                        >
                            {t(`categories.${cat}`)}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:border-urban-green focus:ring-1 focus:ring-urban-green outline-none transition-colors"
                        aria-label="Search items"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-400" />
                </div>
            </div>

            {/* Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map(item => (
                        <ProductCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400 text-lg">No items found matching your criteria.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}
                        className="mt-4 text-urban-green dark:text-green-400 font-semibold hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Category;
