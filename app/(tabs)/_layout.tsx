import React from 'react';
import Login from './Login';
import Dashboard from './index';
import PoDetail from './PoDetail';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/beranda" element={<Dashboard />} />
        <Route path="/podetail/:id_po" element={<PoDetail />} />
      </Routes>
    </Router>
  );
}
