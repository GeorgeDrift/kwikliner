
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, LogOut, User as UserIcon, Bell, LayoutGrid } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg shadow-md shadow-blue-200">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">Kwik<span className="text-blue-600">Liner</span></span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hidden md:flex items-center text-slate-600 hover:text-blue-600 font-semibold text-sm">
              <LayoutGrid className="h-4 w-4 mr-1" /> Marketplace
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-semibold text-sm px-3 py-2">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                  <button className="text-slate-400 hover:text-blue-600">
                    <Bell className="h-5 w-5" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="hidden sm:inline text-sm font-bold text-slate-700">{user.name}</span>
                  </div>
                  <button onClick={() => { onLogout(); navigate('/'); }} className="p-2 text-slate-400 hover:text-red-500" title="Logout">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/register" className="text-slate-600 hover:text-slate-900 font-bold text-sm">Log In</Link>
                <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 text-sm">
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
