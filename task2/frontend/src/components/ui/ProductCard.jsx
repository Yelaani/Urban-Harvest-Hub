import { Link } from 'react-router-dom';
import { Leaf, Calendar, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ item }) => {
    const { t } = useTranslation();

    return (
        <article className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col h-full">
            <Link to={`/item/${item.id}`} className="block relative aspect-video overflow-hidden group">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-urban-green dark:text-green-400 uppercase tracking-wide">
                    {/* Assuming category is a key like 'workshops', 'products' etc. if possible, else keep static if dynamic from DB */}
                    {item.category}
                </div>
            </Link>

            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1">
                        <Link to={`/item/${item.id}`} className="hover:text-urban-green dark:hover:text-green-400 transition-colors">
                            {t(`data.${item.id}.title`, item.title)}
                        </Link>
                    </h3>
                    <span className="font-semibold text-earth-brown dark:text-amber-500">
                        {item.price === 0 ? t('common.free') : `$${item.price}`}
                    </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4 flex-grow">
                    {t(`data.${item.id}.description`, item.description)}
                </p>

                <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {item.date && (
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-urban-green dark:text-green-400" />
                            <span>{item.date}</span>
                        </div>
                    )}
                    {item.location && (
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-urban-green dark:text-green-400" />
                            <span className="line-clamp-1">{item.location}</span>
                        </div>
                    )}
                    {!item.date && !item.location && (
                        <div className="flex items-center">
                            <Leaf className="w-4 h-4 mr-2 text-urban-green dark:text-green-400" />
                            <span>{item.availability || t('common.available_now')}</span>
                        </div>
                    )}
                </div>

                <Link
                    to={`/item/${item.id}`}
                    className="w-full btn-primary text-center mt-auto inline-block"
                    aria-label={`View details for ${item.title}`}
                >
                    {t('common.view_details')}
                </Link>
            </div>
        </article>
    );
};

export default ProductCard;
