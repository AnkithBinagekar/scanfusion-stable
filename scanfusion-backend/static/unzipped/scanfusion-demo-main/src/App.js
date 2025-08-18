// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FusionPage from './pages/FusionPage';
import FusionResult from './pages/FusionResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/fusion" element={<FusionPage />} />
        <Route path="/results" element={<FusionResult />} />
      </Routes>
    </Router>
  );
}

export default App;
