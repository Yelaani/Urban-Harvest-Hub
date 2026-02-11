import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import { getWeather } from '../services/weatherService';
import { MapPin, Calendar, Cloud, Wind, Thermometer, ArrowLeft, Check } from 'lucide-react';
import { SkeletonDetails } from '../components/ui/SkeletonLoader';

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            setLoading(true);
            try {
                // Try finding it in one of the endpoints. 
                // Since ID usually has prefix, we can guess or just try all 3 or a unified search.
                // Optimally backend should have /api/items/:id or we check prefix.
                // Current ID format: prod-001, wk-001, evt-001. 
                let endpoint = '';
                if (id.startsWith('prod')) endpoint = `/products/${id}`;
                else if (id.startsWith('wk')) endpoint = `/workshops/${id}`;
                else if (id.startsWith('evt')) endpoint = `/events/${id}`;

                if (endpoint) {
                    const response = await api.get(endpoint);
                    setItem(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch item:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchItem();
    }, [id]);

    useEffect(() => {
        if (item?.coordinates) {
            setLoadingWeather(true);
            // Ensure coordinates are object if coming from JSON in SQLite
            const coords = typeof item.coordinates === 'string'
                ? JSON.parse(item.coordinates)
                : item.coordinates;

            getWeather(coords.lat, coords.lng)
                .then(data => setWeather(data))
                .catch(err => console.error(err))
                .finally(() => setLoadingWeather(false));
        }
    }, [item]);

    if (loading) {
        return <SkeletonDetails />;
    }

    if (!item) {
        return <div className="text-center py-20 text-xl text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 min-h-screen">Item not found.</div>;
    }

    const handleBook = () => {
        addToCart(item); // Add to cart
        navigate('/booking'); // Proceed to booking form
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-slate-600 dark:text-slate-300 hover:text-urban-green dark:hover:text-green-400 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Section */}
                <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] relative">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-urban-green text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                        {item.category}
                    </div>
                </div>

                {/* Info Section */}
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">{item.title}</h1>
                    <div className="text-xl font-semibold text-earth-brown dark:text-amber-500 mb-6">
                        {item.price === 0 ? 'Free' : `$${item.price.toFixed(2)}`}
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 text-lg">
                        {item.description}
                    </p>

                    <div className="space-y-4 mb-8">
                        {item.location && (
                            <div className="flex items-center text-slate-700 dark:text-slate-300">
                                <MapPin className="w-5 h-5 mr-3 text-urban-green dark:text-green-400" />
                                <span className="font-medium">{item.location}</span>
                            </div>
                        )}
                        {item.date && (
                            <div className="flex items-center text-slate-700 dark:text-slate-300">
                                <Calendar className="w-5 h-5 mr-3 text-urban-green dark:text-green-400" />
                                <span className="font-medium">{item.date}</span>
                            </div>
                        )}
                        {item.availability && (
                            <div className="flex items-center text-slate-700 dark:text-slate-300">
                                <Check className="w-5 h-5 mr-3 text-urban-green dark:text-green-400" />
                                <span className="font-medium">{item.availability}</span>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleBook}
                        className="w-full md:w-auto px-8 py-3 bg-urban-green hover:bg-green-700 text-white font-bold rounded-lg shadow-md hover:shadow-xl transition-all mb-10 transform active:scale-95"
                    >
                        {item.category === 'products' ? 'Add to Cart' : 'Book Now'}
                    </button>

                    {/* Weather Widget (API Integration) */}
                    {item.coordinates && (
                        <div className="bg-blue-50 dark:bg-slate-800 rounded-xl p-6 border border-blue-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                                <Cloud className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                                Weather Forecast for {item.location}
                            </h3>

                            {loadingWeather ? (
                                <div className="animate-pulse flex space-x-4">
                                    <div className="h-10 w-10 bg-blue-200 dark:bg-slate-700 rounded-full"></div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-2 bg-blue-200 dark:bg-slate-700 rounded"></div>
                                        <div className="h-2 bg-blue-200 dark:bg-slate-700 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ) : weather ? (
                                <>
                                    <div className="flex items-center space-x-8">
                                        <div className="flex flex-col items-center">
                                            <span className="text-3xl font-bold text-slate-800 dark:text-white">{weather.temperature}°C</span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">{weather.condition}</span>
                                        </div>

                                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center">
                                                <Thermometer className="w-4 h-4 mr-2" />
                                                Temp: {weather.temperature}°C
                                            </div>
                                            <div className="flex items-center">
                                                <Wind className="w-4 h-4 mr-2" />
                                                Wind: {weather.windspeed} km/h
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 p-3 bg-blue-100 dark:bg-slate-700/50 rounded-lg text-sm text-blue-800 dark:text-blue-200 font-medium italic text-center">
                                        "{weather.advice}"
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">Weather data currently unavailable.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Details;
