import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import inventoryData from '../data/inventory.json';
import ProductCard from '../components/ui/ProductCard';
import { Search, Filter } from 'lucide-react';

const Category = () => {
    const { category } = useParams(); // Optional category param
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState(category || 'all');
    const [priceRange, setPriceRange] = useState('all');
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load data from local JSON file (Task 1 requirement: internal JSON for static seed data)
        setLoading(true);
        try {
            // Use the imported inventory data directly
            setInventory(inventoryData);
        } catch (error) {
            console.error("Failed to load inventory:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Memoized filtering logic to ensure performance when inventory is large.
    // Filters are applied in sequence: Category -> Search Term -> Price Range.
    const filteredItems = useMemo(() => {
        let items = inventory;

        // 1. Filter by Category (if not 'all')
        if (activeFilter !== 'all') {
            items = items.filter(item => item.category === activeFilter);
        }

        // 2. Filter by Search Term (Title or Description)
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            items = items.filter(item =>
                item.title.toLowerCase().includes(lower) ||
                (item.description && item.description.toLowerCase().includes(lower))
            );
        }

        // 3. Filter by Price Range
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            items = items.filter(item => {
                // Handle specific edge cases like Free items or "5000+"
                if (item.price === 0) return priceRange === 'free';
                if (priceRange === 'free') return false;
                if (priceRange === '5000+') return item.price >= 5000;
                return item.price >= min && item.price <= max;
            });
        }

        return items;
    }, [activeFilter, searchTerm, priceRange, inventory]);

    const categories = ['all', 'products', 'workshops', 'events'];

    if (loading) {
        return (
            <section className="text-center py-20">
                <p className="text-slate-800 dark:text-slate-200">Loading...</p>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-slate-900 min-h-screen">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 capitalize">
                    {activeFilter === 'all' ? 'Explore Our Collection' : `${activeFilter}`}
                </h1>
                <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Browse our selection of eco-friendly products, educational workshops, and community events.
                </p>
            </header>

            {/* Controls: Filter & Search */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
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
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-urban-green focus:ring-1 focus:ring-urban-green outline-none transition-colors"
                            aria-label="Search items"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    </div>
                </div>

                {/* Price Range Filter */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        <label htmlFor="priceRange" className="text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            Price Range:
                        </label>
                        <select
                            id="priceRange"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="flex-1 md:flex-initial px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:border-urban-green focus:ring-1 focus:ring-urban-green outline-none transition-colors text-sm"
                            aria-label="Filter by price range"
                        >
                            <option value="all">All Prices</option>
                            <option value="free">Free</option>
                            <option value="0-1000">Under Rs. 1,000</option>
                            <option value="1000-2500">Rs. 1,000 - Rs. 2,500</option>
                            <option value="2500-4000">Rs. 2,500 - Rs. 4,000</option>
                            <option value="4000-5000">Rs. 4,000 - Rs. 5,000</option>
                            <option value="5000+">Rs. 5,000 and above</option>
                        </select>
                    </div>
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
                        onClick={() => { setSearchTerm(''); setActiveFilter('all'); setPriceRange('all'); }}
                        className="mt-4 text-urban-green font-semibold hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </section>
    );
};

export default Category;
