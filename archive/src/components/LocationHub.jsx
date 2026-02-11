import React, { useState } from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { NotificationService } from '../services/NotificationService';

const HUB_COORDINATES = {
    lat: 40.785091, // Central Park, NY example
    lng: -73.968285
};

const LocationHub = () => {
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
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 max-w-sm w-full mx-auto my-8">
            <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                    <MapPin className="w-6 h-6 text-urban-green" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Visit Our Hub</h3>
                    <p className="text-xs text-slate-500">Central Park, New York</p>
                </div>
            </div>

            <p className="text-slate-600 text-sm mb-6">
                Check how close you are to our main sustainable gardening center!
            </p>

            {distance !== null && (
                <div className="bg-green-50 rounded-lg p-4 mb-4 text-center">
                    <span className="text-3xl font-bold text-urban-green">{distance}</span>
                    <span className="text-sm text-green-700 ml-1">km away</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 rounded-lg p-3 mb-4 flex items-start text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <button
                onClick={handleCheckLocation}
                disabled={loading}
                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="animate-pulse">Locating...</span>
                ) : (
                    <>
                        <Navigation className="w-4 h-4 mr-2" />
                        Check Distance
                    </>
                )}
            </button>
        </div>
    );
};

export default LocationHub;
