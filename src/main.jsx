import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import App from './App';
import './index.css';
import { getTheme } from './utils/storage';

// Initialize theme
document.documentElement.setAttribute('data-theme', getTheme());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  </StrictMode>
);
