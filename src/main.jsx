import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import { Analytics } from '@vercel/analytics/react';

export function App() {
  return (
    <div>
      {/* Your existing app components */}
      <Analytics />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);