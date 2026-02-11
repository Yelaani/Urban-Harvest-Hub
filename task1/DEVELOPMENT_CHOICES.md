# Task 1: Development Choices & Architecture

## 1. Frontend Framework: React with Vite
**Why React?**
- **Component-Based Architecture**: Allows for reusable UI elements like `ProductCard`, `Navbar`, and `LocationHub`. This modularity makes the codebase easier to maintain and scale.
- **Virtual DOM**: Ensures high performance by only updating changed parts of the UI, crucial for a smooth user experience in an SPA.
- **Ecosystem**: rich library support (e.g., `react-router-dom` for routing, `lucide-react` for icons).

**Why Vite?**
- **Speed**: Significantly faster startup and Hot Module Replacement (HMR) compared to Create React App (Webpack).
- **Modern**: Native ES modules support for efficient development builds.

## 2. Styling: Tailwind CSS
**Why Tailwind?**
- **Utility-First**: Rapid UI development without leaving the JSX file.
- **Consistency**: Enforces a consistent design system (spacing, colors, typography) via `tailwind.config.js`.
- **Customizability**: easily extended with project-specific branding colors like `urban-green` (#2F855A) and `earth-brown` (#7B341E).
- **Responsive Design**: Built-in modifiers (`md:`, `lg:`) make mobile-first design straightforward.

## 3. State Management: React Context API
**Why Context API?**
- **Simplicity**: Built-in to React, avoiding the boilerplate of Redux for this scale of application.
- **Global Access**: Perfect for data needed across the app, such as:
  - `AuthContext`: Manages user login state and global user data.
  - `CartContext`: Manages the shopping cart, total price calculations, and booking status across pages.

## 4. Routing: React Router v6
- **Client-Side Routing**: Enables a true Single Page Application (SPA) experience with no page reloads.
- **Dynamic Routes**: Handles dynamic URLs like `/item/:id` and `/explore/:category` to render specific content based on URL parameters.

## 5. Accessibility (A11y)
- **Semantic HTML**: Use of `<article>`, `<section>`, `<header>`, and `<nav>` for meaningful structure.
- **ARIA Roles**: Explicit roles added where semantic HTML wasn't enough (e.g., `role="button"` on interactive divs).
- **Keyboard Navigation**: Ensured all interactive elements are focusable and usable via keyboard.
