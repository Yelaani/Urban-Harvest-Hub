import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
    // Get initial state from localStorage
    const getInitialDarkMode = () => {
        if (typeof window === 'undefined') return false;
        const saved = localStorage.getItem('darkMode');
        return saved === 'true';
    };

    const [isDark, setIsDark] = useState(getInitialDarkMode);

    // Apply dark mode to HTML element
    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('darkMode', String(isDark));
    }, [isDark]);

    const handleToggle = () => {
        setIsDark(prev => !prev);
    };

    return (
        <button
            onClick={handleToggle}
            className="relative w-14 h-7 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-urban-green focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {/* Toggle Track */}
            <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                isDark ? 'bg-slate-600' : 'bg-slate-300'
            }`} />
            
            {/* Sliding Knob */}
            <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-500 ease-in-out flex items-center justify-center ${
                isDark ? 'translate-x-7' : 'translate-x-0'
            }`}>
                {/* Icon inside knob */}
                <div className="relative w-4 h-4">
                    {/* Moon Icon - shown in light mode (left position) */}
                    <Moon 
                        className={`absolute inset-0 w-4 h-4 text-slate-600 transition-all duration-500 ease-in-out ${
                            isDark 
                                ? 'opacity-0 rotate-90 scale-0' 
                                : 'opacity-100 rotate-0 scale-100'
                        }`}
                    />
                    {/* Sun Icon - shown in dark mode (right position) */}
                    <Sun 
                        className={`absolute inset-0 w-4 h-4 text-slate-600 transition-all duration-500 ease-in-out ${
                            isDark 
                                ? 'opacity-100 rotate-0 scale-100' 
                                : 'opacity-0 -rotate-90 scale-0'
                        }`}
                    />
                </div>
            </div>
        </button>
    );
};

export default DarkModeToggle;
