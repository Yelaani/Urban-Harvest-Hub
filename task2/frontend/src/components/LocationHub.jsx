import React, { useState } from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { NotificationService } from '../services/NotificationService';
import { useTranslation } from 'react-i18next';

const HUB_COORDINATES = {
    lat: 7.2906, // Kandy, Sri Lanka
    lng: 80.6337
};

const LocationHub = () => {
    const { t } = useTranslation();
    const [distance, setDistance] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Haversine formula to calculate distance in km
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d.toFixed(1);
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const handleCheckLocation = () => {
        NotificationService.triggerHaptic([50]);
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const dist = calculateDistance(
                    position.coords.latitude,
                    position.coords.longitude,
                    HUB_COORDINATES.lat,
                    HUB_COORDINATES.lng
                );
                setDistance(dist);
                setLoading(false);
                NotificationService.triggerHaptic([100, 50, 100]); // Success pattern
            },
            (err) => {
                setError(`Unable to retrieve your location: ${err.message}`);
                setLoading(false);
                NotificationService.triggerHaptic([200, 100, 200]); // Error pattern
            }
        );
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 max-w-lg w-full transition-all hover:shadow-2xl duration-300">
            <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="flex-1">
                    <div className="flex items-center mb-4">
                        <div className="bg-green-100 dark:bg-green-500/20 p-3 rounded-full mr-4">
                            <MapPin className="w-6 h-6 text-urban-green" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('location_hub.title')}</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t('location_hub.city')}</p>
                        </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {t('location_hub.description')}
                    </p>
                </div>

                {/* Map Preview Thumbnail */}
                <div className="sm:w-32 h-32 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 flex-shrink-0 relative group self-center sm:self-start">
                    <img
                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=300"
                        alt="Map Preview"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-urban-green/20 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Navigation className="w-6 h-6 text-white drop-shadow-lg animate-bounce" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {distance !== null && (
                    <div className="bg-green-50 dark:bg-green-500/10 rounded-xl p-6 text-center border border-green-200 dark:border-green-500/30 animate-in zoom-in duration-300">
                        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest mb-1 font-bold">Estimated Distance</p>
                        <div className="flex items-baseline justify-center">
                            <span className="text-4xl font-extrabold text-urban-green">{distance}</span>
                            <span className="text-lg font-bold text-green-700 dark:text-green-400 ml-2">{t('location_hub.away')}</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-4 flex items-start text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 animate-in slide-in-from-top duration-300">
                        <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleCheckLocation}
                    disabled={loading}
                    className="w-full py-4 bg-urban-green hover:bg-green-600 active:bg-green-700 text-white rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    {loading ? (
                        <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                            {t('location_hub.locating')}
                        </div>
                    ) : (
                        <>
                            <Navigation className="w-5 h-5 mr-2" />
                            {t('location_hub.check_distance')}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default LocationHub;
