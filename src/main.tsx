import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent multi-touch pinch-to-zoom on modern mobile browsers (e.g. iOS Safari)
document.addEventListener('touchstart', (event) => {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

