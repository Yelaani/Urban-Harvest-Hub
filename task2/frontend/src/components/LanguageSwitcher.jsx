import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        // Persist language preference if needed, though language detector handles this
    };

    return (
        <div className="relative group">
            <button
                className="flex items-center text-slate-600 dark:text-slate-300 hover:text-urban-green transition-colors p-2"
                aria-label="Change Language"
            >
                <Globe className="w-5 h-5 mr-1" />
                <span className="uppercase font-semibold text-sm">{i18n.language.split('-')[0]}</span>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <button
                    onClick={() => changeLanguage('en')}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${i18n.language === 'en' ? 'text-urban-green font-bold' : 'text-slate-700 dark:text-slate-200'}`}
                >
                    English
                </button>
                <button
                    onClick={() => changeLanguage('si')}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${i18n.language === 'si' ? 'text-urban-green font-bold' : 'text-slate-700 dark:text-slate-200'}`}
                >
                    Sinhala (සිංහල)
                </button>
                <button
                    onClick={() => changeLanguage('ta')}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${i18n.language === 'ta' ? 'text-urban-green font-bold' : 'text-slate-700 dark:text-slate-200'}`}
                >
                    Tamil (தமிழ்)
                </button>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
