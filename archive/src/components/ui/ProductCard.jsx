import { Link } from 'react-router-dom';
import { Leaf, Calendar, MapPin } from 'lucide-react';

const ProductCard = ({ item }) => {
    return (
        <article className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-slate-100 flex flex-col h-full">
            <Link to={`/item/${item.id}`} className="block relative aspect-video overflow-hidden group">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-urban-green uppercase tracking-wide">
                    {item.category}
                </div>
            </Link>

            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                        <Link to={`/item/${item.id}`} className="hover:text-urban-green transition-colors">
                            {item.title}
                        </Link>
                    </h3>
                    <span className="font-semibold text-earth-brown">
                        {item.price === 0 ? 'Free' : `$${item.price}`}
                    </span>
                </div>

                <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
                    {item.description}
                </p>

                <div className="space-y-2 text-sm text-slate-500 mb-4">
                    {item.date && (
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-urban-green" />
                            <span>{item.date}</span>
                        </div>
                    )}
                    {item.location && (
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-urban-green" />
                            <span className="line-clamp-1">{item.location}</span>
                        </div>
                    )}
                    {!item.date && !item.location && (
                        <div className="flex items-center">
                            <Leaf className="w-4 h-4 mr-2 text-urban-green" />
                            <span>{item.availability || 'Available Now'}</span>
                        </div>
                    )}
                </div>

                <Link
                    to={`/item/${item.id}`}
                    className="w-full btn-primary text-center mt-auto inline-block"
                    aria-label={`View details for ${item.title}`}
                >
                    View Details
                </Link>
            </div>
        </article>
    );
};

export default ProductCard;
