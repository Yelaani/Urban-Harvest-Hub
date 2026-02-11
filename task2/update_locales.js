
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inventoryPath = path.join(__dirname, 'frontend/src/data/inventory.json');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));

const baseEn = {
    "welcome": "Welcome to Urban Harvest Hub",
    "explore": "Explore",
    "book_now": "Book Now",
    "login": "Login",
    "logout": "Logout",
    "search_placeholder": "Search events, products...",
    "categories": {
        "all": "All",
        "workshops": "Workshops",
        "products": "Products",
        "events": "Events"
    },
    "common": {
        "loading": "Loading...",
        "error": "Something went wrong",
        "price": "Price",
        "date": "Date",
        "location": "Location",
        "in_stock": "In Stock",
        "available_now": "Available Now",
        "free": "Free",
        "view_details": "View Details"
    },
    "home": {
        "hero_title": "Welcome to Urban Harvest Hub",
        "hero_subtitle": "Discover sustainable workshops, eco-friendly products, and community events to bring nature into your city life.",
        "featured_title": "Explore by Category",
        "visit_hub": "Visit Our Hub",
        "get_directions": "Get directions and check how close you are to our main center."
    },
    "footer": {
        "about": "About Us",
        "workshops": "Workshops",
        "eco_products": "Eco Products",
        "contact": "Contact",
        "quick_links": "Quick Links",
        "connect": "Connect",
        "description": "Connecting urban communities with sustainable gardening, eco-friendly events, and organic products.",
        "rights": "©2028 Urban Harvest Hub. All rights reserved."
    },
    "booking": {
        "title": "Booking Registration",
        "empty_cart": "Your Cart is Empty",
        "add_items_prompt": "Please add items before booking.",
        "browse_collection": "Browse Collection",
        "full_name": "Full Name",
        "email": "Email Address",
        "phone": "Phone Number",
        "agree_terms": "I agree to the Terms of Service and Privacy Policy.",
        "proceed_checkout": "Proceed to Checkout"
    },
    "location_hub": {
        "title": "Visit Our Hub",
        "city": "Kandy, Sri Lanka",
        "description": "Check how close you are to our main sustainable gardening center!",
        "check_distance": "Check Distance",
        "locating": "Locating...",
        "away": "km away",
        "error_geolocation": "Geolocation is not supported by your browser",
        "error_retrieve": "Unable to retrieve your location"
    }
};

const baseSi = {
    "welcome": "Urban Harvest Hub වෙත සාදරයෙන් පිළිගනිමු",
    "explore": "ගවේෂණය කරන්න",
    "book_now": "දැන් වෙන්කරවා ගන්න",
    "login": "පිවිසෙන්න",
    "logout": "පිටවන්න",
    "search_placeholder": "සිදුවීම්, නිෂ්පාදන සොයන්න...",
    "categories": {
        "all": "සියල්ල",
        "workshops": "වැඩමුළු",
        "products": "නිෂ්පාදන",
        "events": "සිදුවීම්"
    },
    "common": {
        "loading": "පූරණය වෙමින්...",
        "error": "යම් දෝෂයක් සිදුවී ඇත",
        "price": "මිල",
        "date": "දිනය",
        "location": "ස්ථානය",
        "in_stock": "තොග ඇත",
        "available_now": "දැන් ලබා ගත හැක",
        "free": "නොමිලේ",
        "view_details": "විස්තර බලන්න"
    },
    "home": {
        "hero_title": "Urban Harvest Hub වෙත සාදරයෙන් පිළිගනිමු",
        "hero_subtitle": "තිරසාර වැඩමුළු, පරිසර හිතකාමී නිෂ්පාදන සහ ප්‍රජා වැඩසටහන් සොයා ගන්න.",
        "featured_title": "වර්ගය අනුව සොයන්න",
        "visit_hub": "අපගේ මධ්‍යස්ථානයට පිවිසෙන්න",
        "get_directions": "දිශාවන් ලබාගෙන අපගේ මධ්‍යස්ථානයට ඇති දුර පරීක්ෂා කරන්න."
    },
    "footer": {
        "about": "අපි ගැන",
        "workshops": "වැඩමුළු",
        "eco_products": "පරිසර හිතකාමී නිෂ්පාදන",
        "contact": "සම්බන්ධ වන්න",
        "quick_links": "ඉක්මන් සබැඳි",
        "connect": "සම්බන්ධ වන්න",
        "description": "තිරසාර ගෙවතු වගාව, පරිසර හිතකාමී වැඩසටහන් සහ කාබනික නිෂ්පාදන සමඟ නාගරික ප්‍රජාවන් සම්බන්ධ කිරීම.",
        "rights": "©2028 Urban Harvest Hub. සියලුම හිමිකම් ඇවිරිණි."
    },
    "booking": {
        "title": "වෙන්කරවා ගැනීමේ ලියාපදිංචිය",
        "empty_cart": "ඔබගේ කූඩය හිස්ය",
        "add_items_prompt": "කරුණාකර වෙන්කරවා ගැනීමට පෙර අයිතම එකතු කරන්න.",
        "browse_collection": "එකතුව පිරික්සන්න",
        "full_name": "සම්පූර්ණ නම",
        "email": "විද්‍යුත් තැපැල් ලිපිනය",
        "phone": "දුරකථන අංකය",
        "agree_terms": "මම සේවා කොන්දේසි සහ පුද්ගලිකත්ව ප්‍රතිපත්තියට එකඟ වෙමි.",
        "proceed_checkout": "මුදල් ගෙවීමට යන්න"
    },
    "location_hub": {
        "title": "අපගේ මධ්‍යස්ථානයට පිවිසෙන්න",
        "city": "මහනුවර, ශ්‍රී ලංකාව",
        "description": "අපගේ ප්‍රධාන තිරසාර ගෙවතු වගා මධ්‍යස්ථානයට ඔබ කොපමණ සමීපදැයි පරීක්ෂා කරන්න!",
        "check_distance": "දුර පරීක්ෂා කරන්න",
        "locating": "ස්ථානගත කරමින්...",
        "away": "කි.මී. දුරින්",
        "error_geolocation": "ඔබගේ බ්‍රව්සරය භූ ස්ථානගත කිරීම සදහා සහාය නොදක්වයි",
        "error_retrieve": "ඔබගේ ස්ථානය ලබා ගැනීමට නොහැකි විය"
    }
};

const baseTa = {
    "welcome": "Urban Harvest Hub- වෙත ல்வரவேற்கிறோம்",
    "explore": "ஆராயுங்கள்",
    "book_now": "முன்பதிவு செய்",
    "login": "உள்நுழை",
    "logout": "வெளியேறு",
    "search_placeholder": "நிகழ்வுகள், தயாரிப்புகளைத் தேடுங்கள்...",
    "categories": {
        "all": "அனைத்தும்",
        "workshops": "பட்டறைகள்",
        "products": "தயாரிப்புகள்",
        "events": "நிகழ்வுகள்"
    },
    "common": {
        "loading": "ஏற்றப்படுகிறது...",
        "error": "ஏதோ தவறு நடந்துவிட்டது",
        "price": "விலை",
        "date": "தேதி",
        "location": "இடம்",
        "in_stock": "கையிருப்பில் உள்ளது",
        "available_now": "இப்போது கிடைக்கிறது",
        "free": "இலவசம்",
        "view_details": "விவரங்களைப் பார்க்க"
    },
    "home": {
        "hero_title": "Urban Harvest Hub-க்கு வரவேற்கிறோம்",
        "hero_subtitle": "நிலையான பட்டறைகள், சுற்றுச்சூழல் நட்பு தயாரிப்புகள் மற்றும் சமூக நிகழ்வுகளைக் கண்டறியவும்.",
        "featured_title": "வகை வாரியாக ஆராயுங்கள்",
        "visit_hub": "எங்கள் மையத்தைப் பார்வையிடவும்",
        "get_directions": "வழிகளைப் பெற்று எங்கள் மையத்திற்கு எவ்வளவு தூரம் என்பதைச் சரிபார்க்கவும்."
    },
    "footer": {
        "about": "எங்களைப் பற்றி",
        "workshops": "பட்டறைகள்",
        "eco_products": "சுற்றுச்சூழல் தயாரிப்புகள்",
        "contact": "தொடர்பு கொள்ள",
        "quick_links": "விரைவு இணைப்புகள்",
        "connect": "இணைக்கவும்",
        "description": "நிலையான தோட்டக்கலை, சுற்றுச்சூழல் நட்பு நிகழ்வுகள் மற்றும் கரிம தயாரிப்புகளுடன் நகர்ப்புற சமூகங்களை இணைத்தல்.",
        "rights": "©2028 Urban Harvest Hub. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை."
    },
    "booking": {
        "title": "முன்பதிவு பதிவு",
        "empty_cart": "உங்கள் கூடை காலியாக உள்ளது",
        "add_items_prompt": "முன்பதிவு செய்வதற்கு முன் பொருட்களைச் சேர்க்கவும்.",
        "browse_collection": "தொகுப்பை உலாவுக",
        "full_name": "முழு பெயர்",
        "email": "மின்னஞ்சல் முகவரி",
        "phone": "தொலைபேசி எண்",
        "agree_terms": "சேவை விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை நான் ஒப்புக்கொள்கிறேன்.",
        "proceed_checkout": "செக்அவுட்டுக்குச் செல்லவும்"
    },
    "location_hub": {
        "title": "எங்கள் மையத்தைப் பார்வையிடவும்",
        "city": "கண்டி, இலங்கை",
        "description": "எங்கள் முக்கிய நிலையான தோட்டக்கலை மையத்திற்கு நீங்கள் எவ்வளவு நெருக்கமாக இருக்கிறீர்கள் என்பதைச் சரிபார்க்கவும்!",
        "check_distance": "தூரத்தைச் சரிபார்க்கவும்",
        "locating": "கண்டறிகிறது...",
        "away": "கி.மீ தொலைவில்",
        "error_geolocation": "உங்கள் உலாவி புவிஇருப்பிடத்தை ஆதரிக்கவில்லை",
        "error_retrieve": "உங்கள் இருப்பிடத்தை மீட்டெடுக்க முடியவில்லை"
    }
};

const generateData = (lang) => {
    const data = {};
    inventory.forEach(item => {
        data[item.id] = {
            title: item.title + (lang === 'en' ? '' : (lang === 'si' ? ' (SI)' : ' (TA)')),
            description: item.description + (lang === 'en' ? '' : (lang === 'si' ? ' (SI)' : ' (TA)'))
        };
    });
    return data;
};

const writeLocale = (pathStr, base, lang) => {
    const data = generateData(lang);
    const content = { ...base, data };
    fs.writeFileSync(pathStr, JSON.stringify(content, null, 4));
    console.log(`Updated ${lang}`);
};

writeLocale(path.join(__dirname, 'frontend/src/locales/en.json'), baseEn, 'en');
writeLocale(path.join(__dirname, 'frontend/src/locales/si.json'), baseSi, 'si');
writeLocale(path.join(__dirname, 'frontend/src/locales/ta.json'), baseTa, 'ta');
