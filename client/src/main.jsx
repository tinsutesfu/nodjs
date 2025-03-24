import React from 'react';
import ReactDOM from 'react-dom/client'

import './styles/shared/general.css';
import App from './App';
import { AuthProvider } from './context/authcontext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  
);