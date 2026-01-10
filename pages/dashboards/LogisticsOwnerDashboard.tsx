
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { 
  LayoutGrid, Truck, Box, MessageSquare, Activity, FileText, 
  Globe, UserCheck, Settings, LogOut, ChevronDown, Search, 
  Bell, Plus, ArrowRight, Gavel, DollarSign, Clock, ShieldCheck,
  Briefcase, Users, PieChart, BarChart3
} from 'lucide-react';
import ChatWidget from '../../components/ChatWidget';

interface LogisticsOwnerDashboardProps { user: User; }

const LogisticsOwnerDashboard: React.FC<LogisticsOwnerDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');

  const menuSections = {
    MAIN_MENU: [
      { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Fleet Overview' },
      { id: 'Fleet', icon: <Users size={20} />, label: 'My Drivers' },
      { id: 'Board', icon: <Gavel size={20} />, label: 'Bidding Board' },
      { id: 'Message', icon: <MessageSquare size={20} />, label: 'Bids Inbox', badge: 4 },
    ],
    OPERATIONS: [
      { id: 'Report', icon: <BarChart3 size={20} />, label: 'Revenue Analytics' },
      { id: 'Account', icon: <ShieldCheck size={20} />, label: 'Compliance Hub' },
    ],
    OTHERS: [
      { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' },
      { id: 'Logout', icon: <LogOut size={20} />, label: 'Log out' },
    ]
  };

  return (
    <div className="flex bg-[#F8F9FB] min-h-screen text-slate-900 overflow-hidden font-['Inter']">
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 shrink-0 h-screen">
        <div className="flex items-center justify-center mb-10 px-2">
           <div className="bg-[#6366F1] p-2 rounded-xl shadow-lg shadow-indigo-100">
              <Briefcase className="text-white" size={24} />
           </div>
        </div>
        <div className="flex-grow space-y-8 overflow-y-auto pr-2 scrollbar-hide">
          {Object.entries(menuSections).map(([title, items]) => (
            <div key={title}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">{title.replace('_', ' ')}</p>
              <div className="space-y-1">
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => item.id === 'Logout' ? navigate('/') : setActiveMenu(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                      activeMenu === item.id 
                      ? 'bg-[#6366F1]/5 text-[#6366F1]' 
                      : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={activeMenu === item.id ? 'text-[#6366F1]' : 'text-slate-400 group-hover:text-slate-600'}>
                        {item.icon}
                      </span>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </div>
                    {item.badge && <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto p-8 pt-16">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm relative overflow-hidden group">
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Gross Revenue</h3>
             <div className="flex items-end space-x-4 mb-8">
                <span className="text-4xl font-black tracking-tighter">MWK 12.8M</span>
                <span className="text-xs font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">↑ 22%</span>
             </div>
             <div className="h-24 w-full flex items-end space-x-1">
                {[40, 60, 30, 80, 50, 90, 70, 45, 85].map((h, i) => (
                  <div key={i} className="flex-grow bg-indigo-50 rounded-t-lg group-hover:bg-indigo-600 transition-all" style={{ height: `${h}%` }}></div>
                ))}
             </div>
          </div>

          <div className="col-span-4 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Fleet Capacity</h3>
             <div className="flex items-baseline space-x-2 mb-8">
                <span className="text-4xl font-black tracking-tighter">84%</span>
                <span className="text-xs font-black text-indigo-500">Utilization</span>
             </div>
             <div className="flex space-x-1.5 h-16 items-end">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className={`flex-1 rounded-full ${i < 17 ? 'bg-[#6366F1]' : 'bg-slate-100'}`} style={{ height: `${Math.random() * 60 + 40}%` }}></div>
                ))}
             </div>
          </div>

          <div className="col-span-4 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm text-center">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ngoma" className="h-16 w-16 mx-auto rounded-full bg-slate-50 mb-4 shadow-xl border-4 border-white" />
             <h4 className="text-xl font-black text-slate-900 leading-none">Banda Ngoma</h4>
             <p className="text-xs font-bold text-slate-400 mt-2">requests to join fleet</p>
             <div className="grid grid-cols-2 gap-3 mt-8">
                <button className="py-3 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest">Reject</button>
                <button className="py-3 bg-[#14B8A6] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-100">Accept</button>
             </div>
          </div>

          <div className="col-span-8 bg-white p-10 rounded-[40px] border border-slate-50 shadow-sm">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-900">Live Bidding Status</h3>
             </div>
             <div className="space-y-6">
                {[
                  { id: '#B-441', route: 'Lilongwe → Port', cargo: 'Tobacco', bid: '1.2M', status: 'Bid Sent' },
                  { id: '#B-442', route: 'Harare → Mutare', cargo: 'Mining Gear', bid: '2.5M', status: 'Negotiating' },
                ].map((bid, idx) => (
                  <div key={idx} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                     <div className="flex items-center space-x-6">
                        <div className="h-14 w-14 bg-[#6366F1] text-white rounded-2xl flex items-center justify-center font-black">
                           <Gavel size={24} />
                        </div>
                        <div>
                           <p className="text-lg font-black text-slate-900">{bid.route}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cargo: {bid.cargo} • ID: {bid.id}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xl font-black text-indigo-600">MWK {bid.bid}</p>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bid.status}</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="col-span-4 bg-[#6366F1] p-10 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <h3 className="text-2xl font-black leading-tight mb-4">Market Discovery</h3>
                <p className="text-indigo-100 text-sm font-medium mb-8">Discover new high-value freight manifests globally.</p>
                <button onClick={() => navigate('/')} className="w-full py-4 bg-white text-[#6366F1] rounded-2xl font-black text-sm uppercase tracking-widest">
                   Find Loads
                </button>
             </div>
             <Globe size={200} className="absolute right-[-60px] top-[-60px] opacity-[0.05]" />
          </div>
        </div>
      </main>

      {/* Assistant Widget integration */}
      <ChatWidget user={user} />
    </div>
  );
};

export default LogisticsOwnerDashboard;
