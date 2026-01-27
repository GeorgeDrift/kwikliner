
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, LogOut, User as UserIcon, Bell, LayoutGrid, Menu, Moon, Sun } from 'lucide-react';
import { User } from '../types';
import { useTheme } from './ThemeContext';
import { BRANDS } from '../constants/branding';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps & { onMenuToggle?: () => void }> = ({ user, onLogout, onMenuToggle }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-[100] shadow-sm transition-colors duration-200">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity z-50">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center h-12 w-44">
              <img src={BRANDS.LOGO_KWIKLINER_WIDE} alt="KwikLiner" className="max-h-full max-w-full object-contain" />
            </div>
          </Link>

          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer z-50"
              type="button"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-amber-400" />}
            </button>

            <Link
              to="/marketplace"
              className="hidden md:flex items-center text-slate-600 dark:text-slate-300 hover:text-blue-600 font-bold text-sm transition-all hover:scale-105 active:scale-95 z-50 group"
            >
              <LayoutGrid className="h-4 w-4 mr-1 group-hover:rotate-12 transition-transform" /> Marketplace
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="hidden sm:block text-slate-600 dark:text-slate-300 hover:text-blue-600 font-bold text-sm px-3 py-2 transition-all hover:scale-105 active:scale-95 z-50">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 sm:space-x-4 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-700">
                  <button className="text-slate-400 hover:text-blue-600 hidden xs:block transition-colors cursor-pointer z-50" type="button" title="Notifications">
                    <Bell className="h-5 w-5" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center overflow-hidden">
                      <img
                        src={user ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest`}
                        alt="pfp"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="hidden lg:inline text-sm font-bold text-slate-700 dark:text-slate-200">{user.name}</span>
                  </div>
                  <button onClick={() => { onLogout(); navigate('/'); }} className="p-2 text-slate-400 hover:text-red-500 hidden sm:block transition-colors cursor-pointer z-50" title="Logout" type="button">
                    <LogOut className="h-5 w-5" />
                  </button>

                  {/* MOBILE MENU TRIGGER */}
                  <button
                    onClick={onMenuToggle}
                    className="md:hidden h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-700 cursor-pointer z-50"
                    type="button"
                  >
                    <Menu size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4 z-50">
                <Link
                  to="/login"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-black text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tight"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black uppercase tracking-tight hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-100 dark:shadow-blue-900/50 text-sm cursor-pointer border-b-4 border-blue-800"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
