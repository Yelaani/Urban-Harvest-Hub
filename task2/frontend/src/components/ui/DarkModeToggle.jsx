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
            className="p-2 rounded-lg text-slate-600 hover:text-urban-green hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            type="button"
        >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
};

export default DarkModeToggle;
