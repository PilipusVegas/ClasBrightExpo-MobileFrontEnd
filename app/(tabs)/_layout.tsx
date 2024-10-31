import React from 'react';
import Dashboard from './index';
import PoDetail from './PoDetail';
import LoginScreen from './LoginScreen';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/beranda" element={<Dashboard />} />
        <Route path="/podetail/:id_po" element={<PoDetail />} />
      </Routes>
    </Router>
  );
}
