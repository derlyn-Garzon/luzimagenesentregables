import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EmpresaAdmin from './components/EmpresaAdmin';
import ClientePortal from './components/ClientePortal';
import Ayuda from './components/Ayuda';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<EmpresaAdmin />} />
            <Route path="/empresa" element={<EmpresaAdmin />} />
            <Route path="/entregables-cliente/:id" element={<ClientePortal />} />
            <Route path="/ayuda" element={<Ayuda />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
