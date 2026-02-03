
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ToastContext';
import { ThemeProvider } from './components/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RegistrationFlow from './pages/RegistrationFlow';
import Settings from './pages/Settings';
import ShipperDashboard from './pages/dashboards/shipper/Index';
import DriverDashboard from './pages/dashboards/driver/Index';
import LogisticsOwnerDashboard from './pages/dashboards/logistics/Index';
import HardwareOwnerDashboard from './pages/dashboards/hardware/Index';
import AdminDashboard from './pages/dashboards/admin/Index';
import VerifyEmail from './pages/VerifyEmail';
import Marketplace from './pages/Marketplace';
import { User, UserRole } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kwikliner_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Persistence: Validate token and fetch fresh user data on load
  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('kwikliner_user');

      if (!token) {
        // Clear any stale user data if no token
        if (savedUser) localStorage.removeItem('kwikliner_user');
        setUser(null);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const freshUserData = await response.json();
          setUser(freshUserData);
          localStorage.setItem('kwikliner_user', JSON.stringify(freshUserData));
        } else {
          console.error('Session invalid, logging out');
          handleLogout();
        }
      } catch (error) {
        console.error('Error validating session:', error);
        // On network error, clear user to be safe and force re-login
        handleLogout();
      }
    };

    validateSession();
  }, []);

  const handleUpdateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('kwikliner_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kwikliner_user');
    localStorage.removeItem('token');
    // Navigate to home will be handled by useEffect watching user state
  };

  const [mobileMenuAction, setMobileMenuAction] = useState(0);

  return (
    <ThemeProvider>
      <ToastProvider>
        <HashRouter>
          <div className="min-h-screen flex flex-col relative bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
            <Navbar user={user} onLogout={handleLogout} onMenuToggle={() => setMobileMenuAction(prev => prev + 1)} />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home user={user} onLogin={handleUpdateUser} />} />
                <Route
                  path="/register"
                  element={<RegistrationFlow onRegister={handleUpdateUser} />}
                />
                <Route path="/marketplace" element={<Marketplace user={user} />} />
                <Route
                  path="/login"
                  element={<RegistrationFlow onRegister={handleUpdateUser} defaultMode="login" />}
                />
                <Route path="/verify-email" element={<VerifyEmail onVerify={handleUpdateUser} />} />
                <Route
                  path="/settings"
                  element={user ? <Settings user={user} onUpdate={handleUpdateUser} /> : <Navigate to="/login" />}
                />

                {/* Protected Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    !user ? (
                      <Navigate to="/login" />
                    ) : user.role === UserRole.ADMIN ? (
                      <AdminDashboard user={user} onLogout={handleLogout} mobileMenuAction={mobileMenuAction} />
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
            <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-sm border-t border-slate-800 dark:bg-black dark:border-slate-900">
              <p>© 2024 KwikLiner. All rights reserved. Africa's Premier Logistics Marketplace.</p>
            </footer>
          </div>
        </HashRouter>
      </ToastProvider>
    </ThemeProvider>
  );
};


export default App;
