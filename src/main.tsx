import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initSentry } from './utils/sentry';
import App from './App';
import './index.css';

initSentry();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
