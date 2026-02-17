# Urban Harvest Hub - Viva Preparation Guide

This document provides a comprehensive overview of the technical implementation of the Urban Harvest Hub project, specifically structured to address the marking criteria for **Task 1** and **Task 2**.

---

## Task 1: Client-Side SPA Implementation

### 1. Client-Side SPA (5 Marks)
- **Framework**: Built using **React** with **Vite** for optimized development and production builds.
- **Routing**: Implemented using `react-router-dom` in `task1/src/App.jsx`.
  - `/`: Home view showcasing featured categories and latest events.
  - `/explore`: Categories view for browsing products and workshops.
  - `/item/:id`: Master-Detail view for specific item details.
  - `/booking`: Booking form for workshops and events.
  - `/payment`: Checkout/Payment flow simulation.

### 2. Component-Based Design (10 Marks)
- **Reusability**:
  - `ProductCard`: Used across Home and Category pages for consistent item display.
  - `Navbar` & `Footer`: Global layout components in `src/components/layout/`.
  - `Button`: Custom UI component with variants (primary/secondary).
- **State Management**: Uses **React Context API** (`src/contexts/CartContext.jsx` and `src/context/AuthContext.jsx`) to pass state across nested components without prop-drilling.
- **Separation of Concerns**: Logic is separated into Services (`api.js`, `weatherService.js`), UI Components, and Page containers.

### 3. Data Handling (10 Marks)
- **Internal Data**: Static seed data is loaded from `src/data/inventory.json`.
- **External API**: Integrated the **Open-Meteo API** in `src/services/weatherService.js` to fetch real-time weather data for outdoor gardening events.
- **Master-Detail View**:
```markdown
  - **Master**: `src/pages/Category.jsx` lists items with filtering.
  - **Detail**: `src/pages/Details.jsx` fetches and displays full information for a selected ID.
``` 
- **State Management**: Reactive state handled via `useState` and `useReducer` inside Contexts.

### 4. Tailwind Styling (5 Marks)
- **Custom Config**: Extended `tailwind.config.js` with:
  - **Colors**: `urban-green` (#2F855A) and `earth-brown` (#7B341E).
  - **Font**: **Outfit** Google Font.
- **Custom Utility**: Implemented `.btn-primary` using `@layer components` in `src/index.css` for consistent, accessible button styling.

### 5. Special Features & Polish (5 Marks)
- **Simulated Payment**: A complete checkout flow implemented in `src/pages/Payment.jsx` with card validation and processing states (simulated with timeouts).
- **Geolocation**: The `LocationHub.jsx` component uses the Browser Geolocation API and the Haversine formula to calculate the user's distance from the Hub.
- **Accessibility**: Uses semantic HTML (`<main>`, `<section>`, `<nav>`) and visible focus states (`:focus-visible`).
- **Validation**: `Booking.jsx` includes complex field validation (email format, date selection, phone numbers) before submission.
- **Responsive**: Fully fluid layout using Tailwind's grid and flex utilities.

---

## Task 2: PWA & Full-Stack Implementation

### 1. PWA Implementation & Testing (15 Marks)
- **Service Worker**: Uses `vite-plugin-pwa` with `injectManifest` strategy. Source in `task2/frontend/src/sw.js`.
- **Caching**: Implements **Workbox strategies**:
  - `StaleWhileRevalidate` for API requests (ensures offline access to last-viewed data).
  - `CacheFirst` for static images and assets.
- **Installability**: Defined in `vite.config.js` manifest section (icons, theme_color, standalone display).
- **Offline Mode**: `OfflineToast.jsx` detects connection status and alerts the user.

### 2. API Development (15 Marks)
- **Backend**: **Node.js** with **Express** server in `task2/server/index.js`.
- **REST Principles**:
  - `GET /api/products`: Fetch all products.
  - `POST /api/bookings`: Create new booking with validation.
  - `GET /api/users`: Admin-only user management (CRUD).
- **Validation**: Uses middleware to validate JWT tokens and input data formats.

### 3. Database Integration (10 Marks)
- **Database**: **SQLite** managed via **Sequelize ORM** for structured data storage.
- **Models**: Defined in `task2/server/models/` (User, Product, Booking, etc.) with relational associations (e.g., User has many Bookings).
- **Seeding**: Robust `seed.js` script to populate initial data for testing.

### 4. Frontend Integration (10 Marks)
- **Dynamic Content**: Frontend fetches and displays data from the Express backend via Axios/Fetch.
- **Search/Filter**: `Category.jsx` implements client-side and server-side filtering for products and workshops.
- **Master-Detail**: Integrated dynamic routing where item IDs are used to query the backend database.

### 5. Mobile Device Capabilities (5 Marks)
- **Geolocation**: `LocationHub.jsx` uses the **Browser Geolocation API** to calculate distance between the user and the gardening hub using the Haversine formula.
- **Dark Mode**: Implemented using Tailwind's `dark:` classes and persistent state (toggled in Layout).
- **Push Notifications**: Integrated `web-push` library on the backend and Service Worker listeners on the frontend to alert users of new events.

### 6. Application Design & Presentation (5 Marks)
- **Multilingual Support**: Uses `react-i18next` for English, Sinhala, and Tamil localization.
- **Optimized Media**: Images are cached and lazy-loaded to improve Lighthouse performance.
- **UX Polish**: Subtle micro-animations using Framer Motion or CSS transitions.

---

## Final Viva Checklist
1. **Explain the Tech Stack**: "I used React/Vite for the frontend and Express/SQLite for the backend."
2. **PWA Benefits**: "The service worker allows offline access and faster subsequent loads via caching."
3. **Database Relationships**: "We use Sequelize to handle relationships, such as linking workshop bookings to specific user IDs."
4. **Security**: "Authentication is handled via JWT (JSON Web Tokens) stored in local storage/cookies."
