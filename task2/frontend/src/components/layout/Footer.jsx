import { Twitter, Instagram, Facebook } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-white dark:text-white mb-4">Urban Harvest Hub</h3>
                        <p className="text-sm leading-relaxed text-slate-400 dark:text-slate-400">
                            {t('footer.description')}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white dark:text-white mb-4">{t('footer.quick_links')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-slate-400 dark:text-slate-400 hover:text-urban-green dark:hover:text-green-400 transition-colors">{t('footer.about')}</a></li>
                            <li><a href="#" className="text-slate-400 dark:text-slate-400 hover:text-urban-green dark:hover:text-green-400 transition-colors">{t('footer.workshops')}</a></li>
                            <li><a href="#" className="text-slate-400 dark:text-slate-400 hover:text-urban-green dark:hover:text-green-400 transition-colors">{t('footer.eco_products')}</a></li>
                            <li><a href="#" className="text-slate-400 dark:text-slate-400 hover:text-urban-green dark:hover:text-green-400 transition-colors">{t('footer.contact')}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white dark:text-white mb-4">{t('footer.connect')}</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-400 dark:text-slate-400 hover:text-urban-green dark:hover:text-green-400 transition-colors" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="text-slate-400 dark:text-slate-400 hover:text-urban-green dark:hover:text-green-400 transition-colors" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="text-slate-400 dark:text-slate-400 hover:text-urban-green dark:hover:text-green-400 transition-colors" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-800 dark:border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500 dark:text-slate-500">
                    {t('footer.rights')}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
