# Task 2: Progressive Web Application with REST API and Database Integration

## Overview

This is a full-stack Progressive Web Application (PWA) for Urban Harvest Hub. It includes a React frontend with PWA features, an Express backend REST API, and SQLite database integration.

## Features

- ✅ Progressive Web App (PWA) with service worker, manifest, and offline support
- ✅ Full-stack architecture (React frontend + Express backend)
- ✅ REST API with CRUD operations (GET, POST, PUT, DELETE)
- ✅ SQLite database with Sequelize ORM
- ✅ JWT authentication with admin role support
- ✅ Admin dashboard for content management
- ✅ Mobile capabilities: Dark mode, Geolocation, Push notifications, Offline access
- ✅ External API integration (Weather API)
- ✅ Responsive mobile-first design

## Project Structure

```
task2/
├── frontend/              # React PWA application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components (includes Admin.jsx)
│   │   ├── context/      # Auth context
│   │   ├── contexts/     # Cart context
│   │   ├── services/     # API services
│   │   └── ...
│   ├── public/           # PWA icons and assets
│   ├── package.json
│   └── vite.config.js    # Vite config with PWA plugin
├── server/               # Express backend API
│   ├── config/          # Database configuration
│   ├── controllers/     # API controllers
│   ├── models/          # Sequelize models
│   ├── routes/          # Express routes
│   ├── middleware/      # Auth and validation middleware
│   ├── index.js         # Server entry point
│   └── seed.js          # Database seeding script
└── database.sqlite      # SQLite database file
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

```bash
cd task2/server
npm install
```

**Create a `.env` file in `task2/server/`:**

```env
PORT=3000
JWT_SECRET=your-secret-key-here-change-in-production
```

**Seed the database (optional):**

```bash
npm run seed
```

This will:
- Create database tables
- Populate with sample data from `frontend/src/data/inventory.json`
- Create an admin user (username: `admin`, password: `admin123`)

**Start the backend server:**

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
cd task2/frontend
npm install
```

**Start the development server:**

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

**Build for production:**

```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT token)

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Products (Admin Only - requires JWT token)
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Workshops (Same pattern as products)
- `GET /api/workshops` - Get all workshops
- `GET /api/workshops/:id` - Get workshop by ID
- `POST /api/workshops` - Create workshop (Admin)
- `PUT /api/workshops/:id` - Update workshop (Admin)
- `DELETE /api/workshops/:id` - Delete workshop (Admin)

### Events (Same pattern as products)
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (Admin)
- `PUT /api/events/:id` - Update event (Admin)
- `DELETE /api/events/:id` - Delete event (Admin)

### Health Check
- `GET /api/health` - Server health check

## Authentication

1. **Register/Login**: Use `/login` page or API endpoints
2. **Get Token**: After login, JWT token is stored in localStorage
3. **Use Token**: Frontend automatically includes token in `Authorization: Bearer <token>` header
4. **Admin Access**: Admin users can access `/admin` dashboard

**Default Admin Credentials** (after seeding):
- Username: `admin`
- Password: `admin123`

## PWA Features

### Service Worker
- Automatically registered via `vite-plugin-pwa`
- Caches API responses, images, and static resources
- Enables offline functionality

### Manifest
- App name: "Urban Harvest Hub"
- Installable as standalone app
- Custom icons (192x192 and 512x512)
- Theme color: #2F855A

### Offline Support
- OfflineToast component shows connection status
- Cached data available when offline
- Service worker handles network requests

### Installability
- Users can install the app on mobile devices
- Works on desktop browsers (Chrome, Edge, etc.)
- Appears in app launcher/home screen

## Mobile Capabilities

1. **Dark Mode**: Toggle in navbar (persists in localStorage)
2. **Geolocation**: LocationHub component calculates distance to hub
3. **Push Notifications**: NotificationService for browser notifications
4. **Offline Access**: Service worker caches content for offline use

## Admin Dashboard

Access at `/admin` (requires admin role)

Features:
- View all products, workshops, and events
- Create new items
- Edit existing items
- Delete items
- Tab-based interface for different content types

## Testing

### Test Backend API

```bash
# Health check
curl http://localhost:3000/api/health

# Get all products
curl http://localhost:3000/api/products

# Login (get token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Create product (requires token)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Product","price":10.99,"category":"products"}'
```

### Test Frontend

1. Open `http://localhost:5173`
2. Test PWA features:
   - Go offline (DevTools > Network > Offline)
   - Check service worker registration (DevTools > Application > Service Workers)
   - Test install prompt (Chrome: address bar install icon)
3. Test admin features:
   - Login as admin
   - Navigate to `/admin`
   - Create, edit, delete items

## Deployment

### Frontend (Netlify/Vercel)

1. Build the frontend:
   ```bash
   cd task2/frontend
   npm run build
   ```

2. Deploy `dist/` folder to hosting service

3. Configure environment variables if needed

### Backend (Render/Railway)

1. Set environment variables:
   - `PORT` (usually auto-assigned)
   - `JWT_SECRET` (generate a secure random string)

2. Update database path if needed (for SQLite)

3. Deploy server folder

4. Update frontend API baseURL to point to deployed backend

## Assignment Requirements Met

✅ PWA Implementation (Service worker, manifest, offline, installable)  
✅ REST API with Express (CRUD operations)  
✅ Database Integration (SQLite with Sequelize)  
✅ Frontend Integration (React SPA consumes API)  
✅ Mobile Device Capabilities (Dark mode, Geolocation, Notifications, Offline)  
✅ Deployment Ready (Can be deployed to production)

## Notes

- Database file (`database.sqlite`) is included but can be regenerated with `npm run seed`
- JWT secret should be changed in production
- CORS is enabled for development (configure for production)
- Service worker uses Workbox for caching strategies
