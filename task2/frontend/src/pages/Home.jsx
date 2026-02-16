import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Leaf, MapPin } from 'lucide-react';
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
                        image="https://orangadevelopment.co.nz/public/assets/blog-image/2023-05/J001770-OR1-Oranga-Community-Garden-Workshop-2_1MB.jpeg"
                        link="/explore/workshops"
                        desc={t('home.cat_workshop_desc')}
                    />
                    <CategoryCard
                        title={t('categories.products')}
                        image="https://cavemanorganics.pk/cdn/shop/articles/pixelcut-export_fb8a1cef-ce02-40b5-ae4d-1cb42965945b.jpg?v=1713979861"
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
            <section className="bg-[#f0f9f4] dark:bg-slate-900/40 py-20 px-4 border-y border-green-100 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl -z-10" />
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="text-left animate-in fade-in slide-in-from-left duration-700">
                        <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-urban-green dark:text-green-400 rounded-full text-sm font-semibold mb-4">
                            <MapPin className="w-4 h-4 mr-2" />
                            {t('location_hub.city')}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6 leading-tight font-outfit">
                            {t('home.visit_hub')}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl">
                            {t('home.get_directions')}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <img
                                        key={i}
                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                        className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800"
                                        alt="User"
                                    />
                                ))}
                            </div>
                            <span>500+ visitors this month</span>
                        </div>
                    </div>
                    <div className="flex justify-center lg:justify-end animate-in fade-in slide-in-from-right duration-700">
                        <LocationHub />
                    </div>
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
