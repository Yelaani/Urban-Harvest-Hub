import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Translation keys
const translations = {
    en: {
        // Navigation
        home: 'Home',
        explore: 'Explore',
        login: 'Login',
        admin: 'Admin',
        cart: 'Cart',
        
        // Home page
        heroTitle: 'Cultivate Your',
        heroTitleHighlight: 'Urban Oasis',
        heroSubtitle: 'Discover sustainable workshops, eco-friendly products, and community events to bring nature into your city life.',
        exploreCollection: 'Explore Collection',
        visitHub: 'Visit Our Hub',
        visitHubDesc: 'Get directions and check how close you are to our main center.',
        workshops: 'Workshops',
        ecoProducts: 'Eco Products',
        communityEvents: 'Community Events',
        
        // Category page
        exploreCollectionTitle: 'Explore Our Collection',
        browseSelection: 'Browse our selection of eco-friendly products, educational workshops, and community events.',
        search: 'Search...',
        all: 'All',
        products: 'Products',
        events: 'Events',
        noItemsFound: 'No items found matching your criteria.',
        clearFilters: 'Clear filters',
        
        // Details page
        back: 'Back',
        addToCart: 'Add to Cart',
        bookNow: 'Book Now',
        free: 'Free',
        weatherForecast: 'Weather Forecast for',
        weatherUnavailable: 'Weather data currently unavailable.',
        
        // Booking
        bookingRegistration: 'Booking Registration',
        fullName: 'Full Name',
        emailAddress: 'Email Address',
        phoneNumber: 'Phone Number',
        agreeTerms: 'I agree to the Terms of Service and Privacy Policy.',
        proceedToCheckout: 'Proceed to Checkout',
        cartEmpty: 'Your Cart is Empty',
        addItemsBeforeBooking: 'Please add items before booking.',
        browseCollection: 'Browse Collection',
        
        // Location Hub
        checkDistance: 'Check Distance',
        locating: 'Locating...',
        kmAway: 'km away',
        
        // Admin
        adminDashboard: 'Admin Dashboard',
        manageContent: 'Manage products, workshops, and events',
        addNew: 'Add New',
        edit: 'Edit',
        delete: 'Delete',
        create: 'Create',
        update: 'Update',
        cancel: 'Cancel',
        title: 'Title',
        description: 'Description',
        price: 'Price',
        imageUrl: 'Image URL',
        date: 'Date',
        location: 'Location',
        availability: 'Availability',
        
        // Common
        loading: 'Loading...',
        error: 'Error',
        success: 'Success'
    },
    si: {
        // Navigation
        home: 'මුල් පිටුව',
        explore: 'ගවේෂණය',
        login: 'පිවිසීම',
        admin: 'පරිපාලක',
        cart: 'කරත්තය',
        
        // Home page
        heroTitle: 'ඔබේ',
        heroTitleHighlight: 'නාගරික උයන',
        heroSubtitle: 'නගර ජීවිතයට ස්වභාවිකත්වය ගෙන ඒම සඳහා තිරසාර වැඩමුළු, පාරිසරික නිෂ්පාදන සහ ප්‍රජා සිදුවීම් සොයා ගන්න.',
        exploreCollection: 'ගබ්සාව ගවේෂණය',
        visitHub: 'අපගේ මධ්‍යස්ථානයට පැමිණෙන්න',
        visitHubDesc: 'දිශානුගත වන්න සහ අපගේ ප්‍රධාන මධ්‍යස්ථානයට ඔබ කොතරම් ආසන්නදැයි පරීක්ෂා කරන්න.',
        workshops: 'වැඩමුළු',
        ecoProducts: 'පාරිසරික නිෂ්පාදන',
        communityEvents: 'ප්‍රජා සිදුවීම්',
        
        // Category page
        exploreCollectionTitle: 'අපගේ එකතුව ගවේෂණය',
        browseSelection: 'පාරිසරික නිෂ්පාදන, අධ්‍යාපනික වැඩමුළු සහ ප්‍රජා සිදුවීම් අපගේ තේරීම පිරික්සන්න.',
        search: 'සොයන්න...',
        all: 'සියල්ල',
        products: 'නිෂ්පාදන',
        events: 'සිදුවීම්',
        noItemsFound: 'ඔබගේ නිර්ණායක සමඟ ගැලපෙන අයිතම නොමැත.',
        clearFilters: 'පෙරහන් මකන්න',
        
        // Details page
        back: 'ආපසු',
        addToCart: 'කරත්තයට එක් කරන්න',
        bookNow: 'දැන් වෙන්කරන්න',
        free: 'නොමිලේ',
        weatherForecast: 'සඳහා කාලගුණ පුරෝකථනය',
        weatherUnavailable: 'කාලගුණ දත්ත දැනට ලබා ගත නොහැක.',
        
        // Booking
        bookingRegistration: 'වෙන්කිරීමේ ලියාපදිංචිය',
        fullName: 'සම්පූර්ණ නම',
        emailAddress: 'විද්‍යුත් තැපැල් ලිපිනය',
        phoneNumber: 'දුරකථන අංකය',
        agreeTerms: 'මම සේවා කොන්දේසි සහ රහස්‍යතා ප්‍රතිපත්තියට එකඟ වෙමි.',
        proceedToCheckout: 'ගෙවීමට ඉදිරියට',
        cartEmpty: 'ඔබගේ කරත්තය හිස්',
        addItemsBeforeBooking: 'කරුණාකර වෙන්කිරීමට පෙර අයිතම එක් කරන්න.',
        browseCollection: 'ගබ්සාව පිරික්සන්න',
        
        // Location Hub
        checkDistance: 'දුර පරීක්ෂා කරන්න',
        locating: 'ස්ථානගත කරමින්...',
        kmAway: 'කි.මී. දුරින්',
        
        // Admin
        adminDashboard: 'පරිපාලක උපකරණ පුවරුව',
        manageContent: 'නිෂ්පාදන, වැඩමුළු සහ සිදුවීම් කළමනාකරණය',
        addNew: 'නව එකතු කරන්න',
        edit: 'සංස්කරණය',
        delete: 'මකන්න',
        create: 'සාදන්න',
        update: 'යාවත්කාලීන කරන්න',
        cancel: 'අවලංගු කරන්න',
        title: 'ශීර්ෂය',
        description: 'විස්තරය',
        price: 'මිල',
        imageUrl: 'රූපය URL',
        date: 'දිනය',
        location: 'ස්ථානය',
        availability: 'ලබා ගත හැකියාව',
        
        // Common
        loading: 'පූරණය වෙමින්...',
        error: 'දෝෂය',
        success: 'සාර්ථකත්වය'
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language');
        return saved || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key) => {
        return translations[language]?.[key] || key;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'si' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
