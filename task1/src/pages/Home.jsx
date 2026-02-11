import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import LocationHub from '../components/LocationHub';

const Home = () => {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-teal-900 dark:bg-slate-900 text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-20 dark:opacity-30 bg-[url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80')] bg-cover bg-center blur-sm" />
                <div className="relative max-w-7xl mx-auto text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-outfit tracking-tight">
                        Cultivate Your <span className="text-green-400">Urban Oasis</span>
                    </h1>
                    <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
                        Discover sustainable workshops, eco-friendly products, and community events to bring nature into your city life.
                    </p>
                    <Link to="/explore" className="inline-flex items-center px-8 py-4 bg-urban-green hover:bg-green-600 text-white rounded-lg font-bold text-lg transition-colors shadow-lg">
                        Explore Collection
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-16 max-w-7xl mx-auto px-4 bg-white dark:bg-slate-900">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-12 text-center">Explore by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CategoryCard
                        title="Workshops"
                        image="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e10?auto=format&fit=crop&q=80"
                        link="/explore/workshops"
                        desc="Learn composting, gardening, and more."
                    />
                    <CategoryCard
                        title="Eco Products"
                        image="https://images.unsplash.com/photo-1615486511484-92e172cc416d?auto=format&fit=crop&q=80"
                        link="/explore/products"
                        desc="Seeds, tools, and sustainable kits."
                    />
                    <CategoryCard
                        title="Community Events"
                        image="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80"
                        link="/explore/events"
                        desc="Connect with your local green community."
                    />
                </div>
            </section>

            {/* Location Hub */}
            <section className="relative bg-slate-50 dark:bg-slate-900 py-16 px-4 overflow-hidden">
                {/* Background Image - Lightly blurred */}
                <div className="absolute inset-0 opacity-30 dark:opacity-20 bg-[url('https://images.unsplash.com/photo-1416879741263-d301e1e50c70?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center blur-sm" />
                <div className="relative max-w-7xl mx-auto text-center z-10">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Visit Our Hub</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-8">Get directions and check how close you are to our main center.</p>
                    <LocationHub />
                </div>
            </section>
        </div>
    );
};

const CategoryCard = ({ title, image, link, desc }) => {
    // For Workshops and Eco Products, use dark cards with green icons
    if (title === 'Workshops' || title === 'Eco Products') {
        return (
            <Link to={link}>
                <article className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[4/3] flex flex-col justify-between p-6">
                    <div className="flex flex-col items-start">
                        <div className="flex items-center mb-4">
                            <Leaf className="w-5 h-5 text-urban-green dark:text-green-400 mr-2" />
                            <span className="text-urban-green dark:text-green-400 text-sm font-medium">{title}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
                    </div>
                    <div className="mt-auto">
                        <div className="inline-flex items-center text-urban-green font-semibold text-sm hover:text-green-700 dark:hover:text-green-400 transition-colors">
                            VIEW ALL
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                </article>
            </Link>
        );
    }
    
    // For Community Events, use image card
    return (
        <article className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <Link to={link} className="group block relative">
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <img 
                        src={image} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Gradient Overlay at Bottom for Text - Larger area */}
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-white/95 dark:from-slate-900/95 via-white/85 dark:via-slate-900/85 to-white/40 dark:to-slate-900/40" />
                    
                    {/* Text Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
                        <div className="inline-flex items-center text-urban-green font-semibold text-sm hover:text-green-700 dark:hover:text-green-400 transition-colors group/link">
                            VIEW ALL
                            <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default Home;
