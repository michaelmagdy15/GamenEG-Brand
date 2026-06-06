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

// Force page reload on dynamic import/chunk failures (happens when new deployment deletes old chunks)
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

window.addEventListener('error', (e) => {
  const isChunkError = e.message && (
    e.message.includes('chunk') || 
    e.message.includes('Loading chunk') || 
    e.message.includes('Failed to fetch dynamically imported module')
  );
  if (isChunkError) {
    window.location.reload();
  }
}, true);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

