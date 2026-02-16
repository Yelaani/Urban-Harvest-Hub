import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
    // Get initial state
    const getInitialDarkMode = () => {
        if (typeof window === 'undefined') return false;
        const saved = localStorage.getItem('darkMode');
        return saved === 'true';
    };

    const [darkMode, setDarkMode] = useState(getInitialDarkMode);

    // Apply dark mode to HTML element
    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('darkMode', String(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <button
            onClick={toggleDarkMode}
            className={`
                relative inline-flex h-8 w-14 items-center rounded-full 
                border-2 border-urban-green transition-all duration-300 
                focus:outline-none group overflow-hidden
                ${darkMode ? 'bg-slate-700 shadow-inner' : 'bg-slate-200'}
            `}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            type="button"
        >
            <span
                className={`
                    inline-block h-6 w-6 transform rounded-full bg-white 
                    transition-all duration-300 ease-in-out shadow-md
                    flex items-center justify-center
                    ${darkMode ? 'translate-x-7 rotate-0' : 'translate-x-0.5 rotate-[360deg]'}
                `}
            >
                {darkMode ? (
                    <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
                ) : (
                    <Moon className="w-4 h-4 text-urban-green" />
                )}
            </span>

            {/* Subtle icons in the background */}
            <div className={`absolute right-1 text-slate-400 pointer-events-none transition-opacity duration-300 ${darkMode ? 'opacity-0' : 'opacity-40'}`}>
                <Sun className="w-3 h-3" />
            </div>
            <div className={`absolute left-1 text-slate-500 pointer-events-none transition-opacity duration-300 ${darkMode ? 'opacity-40' : 'opacity-0'}`}>
                <Moon className="w-3 h-3" />
            </div>
        </button>
    );
};

export default DarkModeToggle;

