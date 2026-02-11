import React, { useState, useEffect } from 'react';
import { WifiOff, X } from 'lucide-react';

const OfflineToast = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            setIsVisible(true);
            setTimeout(() => setIsVisible(false), 3000); // Hide "Back Online" message after 3s
        };

        const handleOffline = () => {
            setIsOffline(true);
            setIsVisible(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isVisible && !isOffline) return null;

    return (
        <div className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`flex items-center px-4 py-3 rounded-lg shadow-lg border ${isOffline
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-green-50 border-green-200 text-green-800'
                }`}>
                {isOffline ? (
                    <>
                        <WifiOff className="w-5 h-5 mr-3" />
                        <div>
                            <p className="font-bold text-sm">You are offline</p>
                            <p className="text-xs opacity-90">Using cached data</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-3 animate-pulse"></div>
                        <p className="font-bold text-sm">Back online</p>
                    </>
                )}
                <button
                    onClick={() => setIsVisible(false)}
                    className="ml-4 p-1 hover:bg-black/5 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default OfflineToast;
