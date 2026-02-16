import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Leaf } from 'lucide-react';
import LocationHub from '../components/LocationHub';

import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    // Debug: Check if dark class exists
    if (typeof window !== 'undefined') {
        console.log('Home component - HTML has dark class?', document.documentElement.classList.contains('dark'));
        console.log('Home component - HTML classes:', document.documentElement.className);
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-teal-900 dark:bg-slate-900 text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-20 dark:opacity-30 bg-[url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80')] bg-cover bg-center blur-sm" />
                <div className="relative max-w-7xl mx-auto text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-outfit tracking-tight">
                        {t('home.hero_title')}
                    </h1>
                    <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
                        {t('home.hero_subtitle')}
                    </p>
                    <Link to="/explore" className="inline-flex items-center px-8 py-4 bg-urban-green hover:bg-green-600 text-white rounded-lg font-bold text-lg transition-colors shadow-lg">
                        {t('explore')}
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-16 max-w-7xl mx-auto px-4 bg-white dark:bg-slate-900">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-12 text-center">{t('home.featured_title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CategoryCard
                        title={t('categories.workshops')}
                        image={null}
                        link="/explore/workshops"
                        desc={t('home.cat_workshop_desc')}
                    />
                    <CategoryCard
                        title={t('categories.products')}
                        image={null}
                        link="/explore/products"
                        desc={t('home.cat_product_desc')}
                    />
                    <CategoryCard
                        title={t('categories.events')}
                        image="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80"
                        link="/explore/events"
                        desc={t('home.cat_event_desc')}
                    />
                </div>
            </section>

            {/* Location Hub */}
            <section className="bg-slate-50 dark:bg-slate-900 py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">{t('home.visit_hub')}</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-8">{t('home.get_directions')}</p>
                    <LocationHub />
                </div>
            </section>
        </div>
    );
};

const CategoryCard = ({ title, image, link, desc }) => {
    const { t } = useTranslation();

    if (image) {
        // Card with image (Community Events)
        return (
            <Link to={link} className="group relative rounded-xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-all">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
                    <h3 className="text-2xl font-bold mb-2">{title}</h3>
                    <p className="text-slate-200 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">{desc}</p>
                    <span className="text-urban-green font-bold flex items-center text-sm uppercase tracking-wider">
                        {t('common.view_all')} <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                </div>
            </Link>
        );
    }

    // Card without image (Workshops, Eco Products) - dark background with green icon in dark mode
    return (
        <Link to={link} className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-md hover:shadow-xl flex flex-col justify-between p-6">
            <div className="flex flex-col items-start">
                <div className="flex items-center mb-4">
                    <Leaf className="w-5 h-5 text-urban-green dark:text-green-400 mr-2" />
                    <span className="text-urban-green dark:text-green-400 text-sm font-medium">{title}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
            </div>
            <div className="mt-auto">
                <span className="text-urban-green font-bold flex items-center text-sm uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    {t('common.view_all')} <ArrowRight className="w-4 h-4 ml-1" />
                </span>
            </div>
        </Link>
    );
};

export default Home;
