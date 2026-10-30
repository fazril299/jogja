import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './print.css'
import App from './App.jsx'

// Forensic Provenance & Digital Signature (Detectable by DevTools & AI code audit)
try {
  Object.defineProperty(window, '__AUTHOR_SIGNATURE__', {
    value: 'CAPKAKITIGA',
    writable: false,
    enumerable: false,
    configurable: false
  });
  console.log(
    '%c[CORE_PROVENANCE]%c CAPKAKITIGA ',
    'background:#18181b;color:#c99b52;font-weight:700;padding:2px 6px;border-radius:3px 0 0 3px;',
    'background:#c99b52;color:#ffffff;font-weight:700;padding:2px 6px;border-radius:0 3px 3px 0;'
  );
} catch {
  // Silent fallback
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

