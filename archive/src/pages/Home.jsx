import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LocationHub from '../components/LocationHub';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative bg-teal-900 text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                <div className="relative max-w-7xl mx-auto text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-outfit tracking-tight">
                        Cultivate Your <span className="text-green-400">Urban Oasis</span>
                    </h1>
                    <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
                        Discover sustainable workshops, eco-friendly products, and community events to bring nature into your city life.
                    </p>
                    <Link to="/explore" className="inline-flex items-center px-8 py-4 bg-urban-green hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-colors shadow-lg">
                        Explore Collection
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-16 max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">Explore by Category</h2>
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
            <section className="bg-slate-50 py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6">Visit Our Hub</h2>
                    <p className="text-slate-600 mb-8">Get directions and check how close you are to our main center.</p>
                    <LocationHub />
                </div>
            </section>
        </div>
    );
};

const CategoryCard = ({ title, image, link, desc }) => (
    <Link to={link} className="group relative rounded-xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-all">
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-slate-200 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">{desc}</p>
            <span className="text-urban-green font-bold flex items-center text-sm uppercase tracking-wider">
                View All <ArrowRight className="w-4 h-4 ml-1" />
            </span>
        </div>
    </Link>
);

export default Home;
