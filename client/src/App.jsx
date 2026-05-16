import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BusinessProfile from './pages/BusinessProfile';
import Campaigns from './pages/Campaigns';
import AskAtom from './pages/AskAtom';
import ContentHistory from './pages/ContentHistory';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/business-profile" element={<BusinessProfile />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/ask-atom" element={<AskAtom />} />
          <Route path="/content-history" element={<ContentHistory />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;