import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ThemeRegistry from './components/ThemeRegistry';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeRegistry>
        <App />
      </ThemeRegistry>
    </BrowserRouter>
  </React.StrictMode>,
);
