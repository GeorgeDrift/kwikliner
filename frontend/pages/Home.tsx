
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, ArrowRight, ShieldCheck, Star, ShoppingCart, Briefcase, ChevronRight
} from 'lucide-react';
import { User, UserRole } from '../types';

interface HomeProps {
  user: User | null;
  onLogin?: (user: User) => void;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 min-h-screen transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-slate-900 pt-32 pb-48 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 transform translate-x-1/2 blur-3xl"></div>
        <div className="max-w-[1920px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Africa's Unified Logistics Network</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
            The Future of <br /> <span className="text-blue-600">African Freight.</span>
          </h1>

          <p className="text-slate-400 text-xl md:text-2xl mb-16 max-w-3xl mx-auto font-medium leading-relaxed">
            Revolutionizing how goods move across the continent. Connect with verified shippers, drivers, and equipment owners in one powerful ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => navigate('/marketplace')}
              className="group bg-blue-600 text-white px-12 py-6 rounded-[32px] font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/40 flex items-center gap-3"
            >
              Enter Marketplace <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-white/5 border border-white/10 text-white px-12 py-6 rounded-[32px] font-black text-xl hover:bg-white/10 transition-all backdrop-blur-md"
            >
              Partner with Us
            </button>
          </div>
        </div>
      </section>

      {/* Value Prop Grid */}
      <section className="max-w-7xl mx-auto px-6 -mt-24 mb-32 relative z-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Verified Network', desc: 'Every partner is strictly vetted for reliability and compliance.', icon: <ShieldCheck size={32} className="text-blue-600" /> },
          { title: 'Instant Booking', desc: 'Find and book loads or equipment with real-time availability.', icon: <Truck size={32} className="text-blue-600" /> },
          { title: 'Full Transparency', desc: 'Secure payments and real-time tracking from pickup to delivery.', icon: <Star size={32} className="text-blue-600" /> }
        ].map((prop, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-10 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-3xl flex items-center justify-center mb-8">
              {prop.icon}
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{prop.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{prop.desc}</p>
          </div>
        ))}
      </section>

      {/* Call to Action Roles */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-[1920px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">One Platform, Many Roles.</h2>
            <p className="text-slate-500 font-medium">Join thousands of businesses already scaling with KwikLiner.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { role: UserRole.SHIPPER, title: 'Shipper', icon: <Briefcase />, desc: 'Book loads instantly.' },
              { role: UserRole.DRIVER, title: 'Driver', icon: <Truck />, desc: 'Find work, earn more.' },
              { role: UserRole.LOGISTICS_OWNER, title: 'Fleet Owner', icon: <Star />, desc: 'Manage your business.' },
              { role: UserRole.HARDWARE_OWNER, title: 'Hardware', icon: <ShoppingCart />, desc: 'Sell tools & spares.' },
            ].map((box, i) => (
              <div
                key={i}
                onClick={() => navigate('/register', { state: { role: box.role } })}
                className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:scale-[1.05] transition-all cursor-pointer group border border-slate-100 dark:border-slate-700"
              >
                <div className="bg-blue-600 text-white p-4 rounded-3xl w-fit mb-6 shadow-lg shadow-blue-100 dark:shadow-none">
                  {box.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{box.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{box.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
