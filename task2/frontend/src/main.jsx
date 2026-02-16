import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n'; // Initialize i18n
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

// Report Core Web Vitals
const reportVitals = (metric) => {
  console.log('[Web Vitals]', metric.name, metric.value.toFixed(2), metric.rating);
};

onCLS(reportVitals);
onINP(reportVitals);
onLCP(reportVitals);
onFCP(reportVitals);
onTTFB(reportVitals);

// Initialize dark mode BEFORE React renders
(function () {
  const saved = localStorage.getItem('darkMode');
  const isDark = saved === 'true';

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
