import { useLanguage } from '../../contexts/LanguageContext';
import { Languages } from 'lucide-react';

const LanguageToggle = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg text-slate-600 hover:text-urban-green hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300 transition-colors flex items-center gap-2"
            aria-label={`Switch to ${language === 'en' ? 'Sinhala' : 'English'}`}
            type="button"
        >
            <Languages className="w-5 h-5" />
            <span className="text-sm font-medium">{language === 'en' ? 'EN' : 'SI'}</span>
        </button>
    );
};

export default LanguageToggle;
