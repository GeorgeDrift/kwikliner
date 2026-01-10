
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { 
  LayoutGrid, Truck, Box, MessageSquare, Activity, FileText, 
  Globe, UserCheck, Settings, LogOut, ChevronDown, Search, 
  Bell, Plus, ShoppingCart, DollarSign, Tag, Store, Ruler, Square
} from 'lucide-react';
import ChatWidget from '../../components/ChatWidget';

interface HardwareOwnerDashboardProps { user: User; }

const HardwareOwnerDashboard: React.FC<HardwareOwnerDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');

  const menuSections = {
    MAIN_MENU: [
      { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Overview' },
      { id: 'Inventory', icon: <Box size={20} />, label: 'My SKUs' },
      { id: 'Sales', icon: <Tag size={20} />, label: 'Market Orders' },
      { id: 'Message', icon: <MessageSquare size={20} />, label: 'Inquiries', badge: 5 },
    ],
    MERCHANT: [
      { id: 'Store', icon: <Store size={20} />, label: 'Storefront' },
      { id: 'Report', icon: <FileText size={20} />, label: 'Revenue Report' },
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
           <div className="bg-[#6366F1] p-2 rounded-xl shadow-lg">
              <Store className="text-white" size={24} />
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
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Net Sales</h3>
             <div className="flex items-end space-x-4 mb-8">
                <span className="text-4xl font-black tracking-tighter">MWK 3.2M</span>
                <span className="text-xs font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">↑ 18%</span>
             </div>
             <div className="h-24 w-full flex items-end space-x-1">
                {[50, 40, 60, 30, 85, 45, 90, 60, 40].map((h, i) => (
                  <div key={i} className="flex-grow bg-indigo-50 rounded-t-lg group-hover:bg-indigo-600 transition-all" style={{ height: `${h}%` }}></div>
                ))}
             </div>
          </div>

          <div className="col-span-4 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Inventory Health</h3>
             <div className="flex items-baseline space-x-2 mb-8">
                <span className="text-4xl font-black tracking-tighter">1,240</span>
                <span className="text-xs font-black text-slate-300">Total Units</span>
             </div>
             <div className="flex space-x-1.5 h-16 items-end">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className={`flex-1 rounded-full ${i < 19 ? 'bg-[#14B8A6]' : 'bg-slate-100'}`} style={{ height: `${Math.random() * 20 + 80}%` }}></div>
                ))}
             </div>
          </div>

          <div className="col-span-4 bg-[#6366F1] p-10 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <h3 className="text-2xl font-black leading-tight mb-4">List Equipment</h3>
                <p className="text-indigo-100 text-sm font-medium mb-8">Post spare parts to the global shop.</p>
                <button className="w-full py-4 bg-white text-[#6366F1] rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3">
                   <Plus size={20} /> Add New SKU
                </button>
             </div>
             <Box size={200} className="absolute right-[-60px] top-[-60px] opacity-[0.05]" />
          </div>

          <div className="col-span-8 bg-white p-10 rounded-[40px] border border-slate-50 shadow-sm">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-900">Recent Marketplace Orders</h3>
             </div>
             <div className="space-y-6">
                {[
                  { id: '#OD-550', item: 'GPS Tracker v4', buyer: 'Musa (Driver)', price: '45K', status: 'Shipped' },
                  { id: '#OD-551', item: 'Heavy-Duty 20T Jack', buyer: 'Fleet Co Ltd', price: '85K', status: 'Processing' },
                ].map((order, idx) => (
                  <div key={idx} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                     <div className="flex items-center space-x-6">
                        <div className="h-14 w-14 bg-[#6366F1] text-white rounded-2xl flex items-center justify-center font-black">
                           <ShoppingCart size={24} />
                        </div>
                        <div>
                           <p className="text-lg font-black text-slate-900">{order.item}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Buyer: {order.buyer} • ID: {order.id}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xl font-black text-indigo-600">MWK {order.price}</p>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${order.status === 'Shipped' ? 'text-green-500' : 'text-orange-500'}`}>{order.status}</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="col-span-4 bg-white p-10 rounded-[40px] border border-slate-50 shadow-sm flex flex-col h-full">
             <h3 className="text-xl font-black text-slate-900 mb-8">Product Categories</h3>
             <div className="space-y-6">
                {[
                  { label: 'Spare Parts', pct: 45, color: 'bg-indigo-500' },
                  { label: 'Agri Tools', pct: 30, color: 'bg-teal-500' },
                  { label: 'Tech Gadgets', pct: 25, color: 'bg-amber-500' }
                ].map((cat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                      <span>{cat.label}</span>
                      <span className="text-slate-900">{cat.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full">
                      <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </main>

      {/* Assistant Widget integration */}
      <ChatWidget user={user} />
    </div>
  );
};

export default HardwareOwnerDashboard;
