# Urban Harvest Hub - Project Setup & Documentation

Welcome to the **Urban Harvest Hub** project. This repository contains two main parts of the assignment: **Task 1 (SPA)** and **Task 2 (PWA & Full-Stack)**.

## Project Structure

- [**Task 1 (SPA)**](./task1/README.md): A component-based Single Page Application focused on frontend architecture and design.
- [**Task 2 (PWA)**](./task2/README.md): A full-stack Progressive Web Application with REST API, SQLite database, and mobile capabilities.

---

## Quick Start

### Task 1: SPA
1. Navigate to task1: `cd task1`
2. Install: `npm install`
3. Run: `npm run dev`

### Task 2: PWA & Full-Stack
**Backend:**
1. Navigate to server: `cd task2/server`
2. Install: `npm install`
3. Seed Database: `npm run seed`
4. Run: `npm start`

**Frontend:**
1. Navigate to frontend: `cd task2/frontend`
2. Install: `npm install`
3. Run: `npm run dev`

---

## PWA Verification & Metrics

To verify the PWA functionality and check performance metrics:

1. **Lighthouse Audit**:
   - Open the app in Chrome.
   - Press `F12` > **Lighthouse** tab.
   - Select "Progressive Web App" and "Performance".
   - Click "Analyze page load".

2. **Core Web Vitals**:
   - The application now logs [Web Vitals] metrics directly to the browser console (**LCP**, **INP**, **CLS**).
   - Check the console while navigating the app to see real-time performance data.

3. **Offline Mode**:
   - In DevTools, go to the **Application** tab > **Service Workers**.
   - Check "Offline" and reload the page to verify it works without internet.

---

## Default Admin Credentials (Task 2)
- **Username**: `admin`
- **Password**: `admin123`
