import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Calendar, MapPin, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ item }) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, Math.min(99, prev + delta)));
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(item, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    // Only show quantity selector for products
    const isProduct = item.category === 'products';
    return (
        <article className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col h-full">
            <Link to={`/item/${item.id}`} className="block relative aspect-video overflow-hidden group">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-urban-green uppercase tracking-wide">
                    {item.category}
                </div>
            </Link>

            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1">
                        <Link to={`/item/${item.id}`} className="hover:text-urban-green transition-colors">
                            {item.title}
                        </Link>
                    </h3>
                    <span className="font-semibold text-earth-brown">
                        {item.price === 0 ? 'Free' : `Rs. ${item.price.toLocaleString()}`}
                    </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4 flex-grow">
                    {item.description}
                </p>

                <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
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

                <div className="flex flex-col gap-2 mt-auto">
                    {isProduct ? (
                        <>
                            {/* Quantity Selector and Add Button Row */}
                            <div className="flex items-center gap-2">
                                {/* Quantity Selector */}
                                <div className="flex items-center border-2 border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-700 shadow-sm">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleQuantityChange(-1);
                                        }}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 active:bg-slate-200 dark:active:bg-slate-500 transition-colors text-slate-600 dark:text-slate-300 hover:text-urban-green"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 min-w-[2.5rem] text-center border-x border-slate-200 dark:border-slate-600">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleQuantityChange(1);
                                        }}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 active:bg-slate-200 dark:active:bg-slate-500 transition-colors text-slate-600 dark:text-slate-300 hover:text-urban-green"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                {/* Quick Add Button */}
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md ${
                                        addedToCart
                                            ? 'bg-green-500 text-white'
                                            : 'bg-urban-green hover:bg-green-700 text-white'
                                    }`}
                                    aria-label={`Add ${quantity} ${item.title} to cart`}
                                >
                                    {addedToCart ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Added!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-4 h-4" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                            {/* View Details Button */}
                            <Link
                                to={`/item/${item.id}`}
                                className="w-full btn-primary text-center inline-block"
                                aria-label={`View details for ${item.title}`}
                            >
                                View Details
                            </Link>
                        </>
                    ) : (
                        <Link
                            to={`/item/${item.id}`}
                            className="w-full btn-primary text-center inline-block"
                            aria-label={`View details for ${item.title}`}
                        >
                            View Details
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
