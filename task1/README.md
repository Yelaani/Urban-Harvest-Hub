# Task 1: Component-Based Web Application

## Overview

This is a standalone React + Vite Single Page Application (SPA) for Urban Harvest Hub. It demonstrates component-based design, client-side routing, data handling from internal JSON and external APIs, and Tailwind CSS styling.

## Features

- ✅ React + Vite SPA with client-side routing
- ✅ Component-based architecture with reusable components
- ✅ Data from internal JSON file (`src/data/inventory.json`)
- ✅ External API integration (Weather API)
- ✅ Master-detail view (Category → Details)
- ✅ Search and filter functionality
- ✅ Tailwind CSS with custom colors and fonts
- ✅ Accessibility features (ARIA roles, semantic HTML)
- ✅ Form validation

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
task1/
├── src/
│   ├── components/      # Reusable React components
│   │   ├── layout/      # Layout components (Navbar, Footer, Layout)
│   │   └── ui/          # UI components (ProductCard, etc.)
│   ├── pages/           # Page components (Home, Category, Details, etc.)
│   ├── context/         # React Context (AuthContext)
│   ├── contexts/        # Additional contexts (CartContext)
│   ├── services/        # External API services (weatherService)
│   ├── data/           # Static data (inventory.json)
│   ├── App.jsx         # Main app component with routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles with Tailwind
├── public/             # Static assets
├── index.html         # HTML template
├── package.json       # Dependencies
├── vite.config.js     # Vite configuration
└── tailwind.config.js # Tailwind customization
```

## Key Features Explained

### Data Sources
- **Internal JSON**: Products, workshops, and events are loaded from `src/data/inventory.json`
- **External API**: Weather data is fetched from Open-Meteo API for items with coordinates

### Routing
- `/` - Home page
- `/explore` - Browse all items
- `/explore/:category` - Filter by category (products, workshops, events)
- `/item/:id` - Item details page
- `/booking` - Booking form
- `/checkout` - Checkout page
- `/payment` - Payment page
- `/login` - Login page

### Component Architecture
- **Layout Components**: Navbar, Footer, Layout (wrapper)
- **UI Components**: ProductCard, LocationHub
- **Pages**: Home, Category, Details, Booking, Checkout, Payment, Login, NotFound

### State Management
- **CartContext**: Manages shopping cart state (localStorage persistence)
- **AuthContext**: Manages authentication state (local-only, no backend)

### Styling
- **Tailwind CSS** with custom configuration:
  - Custom colors: `urban-green`, `earth-brown`
  - Custom font: `Outfit` (Google Fonts)
  - Custom utility: `.btn-primary` component class

## Testing

1. **Run the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to** `http://localhost:5173`

3. **Test features:**
   - Browse categories on the home page
   - Filter items by category
   - Search for items
   - View item details (includes weather widget)
   - Add items to cart
   - Complete booking flow

## Notes

- This is a **standalone SPA** - no backend required
- Authentication is **local-only** (mock authentication for demo purposes)
- Data is loaded from **local JSON file** (no backend API calls)
- External **Weather API** is integrated for demonstration
- All PWA features are excluded (see Task 2 for PWA implementation)

## Assignment Requirements Met

✅ Client-Side SPA (React + Vite with routing)  
✅ Component-Based Design (reusable components, props, context)  
✅ Data Handling (internal JSON + external API, master-detail view)  
✅ Tailwind Styling (custom colors, font, utilities)  
✅ Accessibility (ARIA roles, semantic HTML, focus states)  
✅ Form Validation (booking form)
