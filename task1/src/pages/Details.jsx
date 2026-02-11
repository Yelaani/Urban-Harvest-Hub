import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import inventoryData from '../data/inventory.json';
import { useCart } from '../contexts/CartContext';
import { getWeather } from '../services/weatherService';
import { MapPin, Calendar, Cloud, Wind, Thermometer, ArrowLeft, Check, Plus, Minus, ShoppingCart, AlertCircle } from 'lucide-react';

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(false);
    const [weatherError, setWeatherError] = useState(null);

    useEffect(() => {
        // Load item from local JSON data (Task 1 requirement: internal JSON for static seed data)
        setLoading(true);
        try {
            const foundItem = inventoryData.find(item => item.id === id);
            setItem(foundItem || null);
        } catch (error) {
            console.error("Failed to load item:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (item?.coordinates) {
            setLoadingWeather(true);
            setWeatherError(null);
            // Ensure coordinates are object if coming from JSON in SQLite
            const coords = typeof item.coordinates === 'string'
                ? JSON.parse(item.coordinates)
                : item.coordinates;

            getWeather(coords.lat, coords.lng)
                .then(data => {
                    if (data) {
                        setWeather(data);
                        setWeatherError(null);
                    } else {
                        setWeatherError('Failed to fetch weather data. Please try again later.');
                        setWeather(null);
                    }
                })
                .catch(err => {
                    console.error('Weather API error:', err);
                    setWeatherError('Unable to load weather information. The weather service may be temporarily unavailable.');
                    setWeather(null);
                })
                .finally(() => setLoadingWeather(false));
        }
    }, [item]);

    if (loading) {
        return (
            <section className="text-center py-20">
                <p className="text-slate-800 dark:text-slate-200">Loading item details...</p>
            </section>
        );
    }

    if (!item) {
        return (
            <section className="text-center py-20 text-xl text-slate-500 dark:text-slate-400">
                <p>Item not found.</p>
            </section>
        );
    }

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, Math.min(99, prev + delta)));
    };

    const handleAddToCart = () => {
        if (item.category === 'products') {
            addToCart(item, quantity);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        } else {
            addToCart(item);
            navigate('/booking');
        }
    };

    return (
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-slate-900 min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-slate-600 dark:text-slate-300 hover:text-urban-green mb-6 transition-colors"
                aria-label="Go back to previous page"
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
                    <div className="text-xl font-semibold text-earth-brown mb-6">
                        {item.price === 0 ? 'Free' : `Rs. ${item.price.toLocaleString()}`}
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 text-lg">
                        {item.description}
                    </p>

                    <div className="space-y-4 mb-8">
                        {item.location && (
                            <div className="flex items-center text-slate-700 dark:text-slate-300">
                                <MapPin className="w-5 h-5 mr-3 text-urban-green" />
                                <span className="font-medium">{item.location}</span>
                            </div>
                        )}
                        {item.date && (
                            <div className="flex items-center text-slate-700 dark:text-slate-300">
                                <Calendar className="w-5 h-5 mr-3 text-urban-green" />
                                <span className="font-medium">{item.date}</span>
                            </div>
                        )}
                        {item.availability && (
                            <div className="flex items-center text-slate-700 dark:text-slate-300">
                                <Check className="w-5 h-5 mr-3 text-urban-green" />
                                <span className="font-medium">{item.availability}</span>
                            </div>
                        )}
                    </div>

                    {/* Action Section */}
                    <div className="mb-10">
                        {item.category === 'products' ? (
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                {/* Quantity Selector */}
                                <div className="flex items-center gap-3">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quantity:</label>
                                    <div className="flex items-center border-2 border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 hover:text-urban-green active:bg-slate-200 dark:active:bg-slate-600"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>
                                        <span className="px-6 py-3 text-lg font-bold text-slate-800 dark:text-slate-200 min-w-[3rem] text-center border-x border-slate-200 dark:border-slate-600">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 hover:text-urban-green active:bg-slate-200 dark:active:bg-slate-600"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 sm:flex-initial px-8 py-3 font-bold rounded-lg shadow-md hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                                        addedToCart
                                            ? 'bg-green-500 text-white'
                                            : 'bg-urban-green hover:bg-green-700 text-white'
                                    }`}
                                >
                                    {addedToCart ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Added to Cart!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="w-full md:w-auto px-8 py-3 bg-urban-green hover:bg-green-700 text-white font-bold rounded-lg shadow-md hover:shadow-xl transition-all transform active:scale-95"
                            >
                                Book Now
                            </button>
                        )}
                    </div>

                    {/* Weather Widget (API Integration) */}
                    {item.coordinates && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                                <Cloud className="w-5 h-5 mr-2 text-blue-500" />
                                Weather Forecast for {item.location}
                            </h3>

                            {loadingWeather ? (
                                <div className="animate-pulse flex space-x-4">
                                    <div className="h-10 w-10 bg-blue-200 dark:bg-blue-800 rounded-full"></div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded"></div>
                                        <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ) : weatherError ? (
                                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" aria-hidden="true" />
                                    <p className="text-sm text-red-700 dark:text-red-400" role="alert">{weatherError}</p>
                                </div>
                            ) : weather ? (
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
                                            Condition: {weather.condition}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">Weather data currently unavailable.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

export default Details;
