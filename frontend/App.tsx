
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RegistrationFlow from './pages/RegistrationFlow';
import Settings from './pages/Settings';
import ShipperDashboard from './pages/dashboards/ShipperDashboard';
import DriverDashboard from './pages/dashboards/DriverDashboard';
import LogisticsOwnerDashboard from './pages/dashboards/LogisticsOwnerDashboard';
import HardwareOwnerDashboard from './pages/dashboards/HardwareOwnerDashboard';
import { User, UserRole } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Persistence simulation
  useEffect(() => {
    const savedUser = localStorage.getItem('kwikliner_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUpdateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('kwikliner_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kwikliner_user');
  };

  const [mobileMenuAction, setMobileMenuAction] = useState(0);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col relative">
        <Navbar user={user} onLogout={handleLogout} onMenuToggle={() => setMobileMenuAction(prev => prev + 1)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home user={user} onLogin={handleUpdateUser} />} />
            <Route
              path="/register"
              element={<RegistrationFlow onRegister={handleUpdateUser} />}
            />
            <Route
              path="/settings"
              element={user ? <Settings user={user} onUpdate={handleUpdateUser} /> : <Navigate to="/register" />}
            />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                !user ? (
                  <Navigate to="/register" />
                ) : user.role === UserRole.SHIPPER ? (
                  <ShipperDashboard user={user} onLogout={handleLogout} mobileMenuAction={mobileMenuAction} />
                ) : user.role === UserRole.DRIVER ? (
                  <DriverDashboard user={user} onLogout={handleLogout} mobileMenuAction={mobileMenuAction} />
                ) : user.role === UserRole.HARDWARE_OWNER ? (
                  <HardwareOwnerDashboard user={user} onLogout={handleLogout} mobileMenuAction={mobileMenuAction} />
                ) : (
                  <LogisticsOwnerDashboard user={user} onLogout={handleLogout} mobileMenuAction={mobileMenuAction} />
                )
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-sm border-t border-slate-800">
          <p>© 2024 KwikLiner. All rights reserved. Africa's Premier Logistics Marketplace.</p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
