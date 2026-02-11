import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Persist cart in localStorage (Discretionary Enhancement)
        const saved = localStorage.getItem('urban_harvest_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [bookedItems, setBookedItems] = useState(() => {
        // Persist booked items in localStorage
        const saved = localStorage.getItem('urban_harvest_booked');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('urban_harvest_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('urban_harvest_booked', JSON.stringify(bookedItems));
    }, [bookedItems]);

    const addToCart = (item, quantity = 1) => {
        // Add item to cart multiple times based on quantity
        const itemsToAdd = Array(quantity).fill(item);
        setCartItems(prev => [...prev, ...itemsToAdd]);
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
        // Remove from booked items when item is removed from cart
        setBookedItems(prev => prev.filter(id => id !== itemId));
    };

    const clearCart = () => {
        setCartItems([]);
        setBookedItems([]);
    };

    /**
     * Mark specific items as booked.
     * This separates the "shopping" state from the "booked" state, 
     * allowing users to browse without losing their booking history.
     */
    const markAsBooked = (itemIds) => {
        // Mark all event/workshop items in cart as booked
        setBookedItems(prev => {
            const newBooked = [...prev];
            itemIds.forEach(id => {
                // Prevent duplicate bookings for the same ID
                if (!newBooked.includes(id)) {
                    newBooked.push(id);
                }
            });
            return newBooked;
        });
    };

    /**
     * Check if an item is already booked.
     * Used in UI to disable booking buttons or show "Booked" status.
     */
    const isBooked = (itemId) => {
        return bookedItems.includes(itemId);
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal, markAsBooked, isBooked }}>
            {children}
        </CartContext.Provider>
    );
};
