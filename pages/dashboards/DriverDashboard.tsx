
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Vehicle } from '../../types';
import {
   LayoutGrid, Truck, Box, MessageSquare, Activity,
   Settings, LogOut, Search,
   Bell, Navigation, AlertCircle, DollarSign,
   Plus, MoreHorizontal, Star, Lock, Send, Paperclip, ImageIcon,
   Gavel, Briefcase, Package, BarChart3, User as UserIcon, ChevronDown,
   TrendingUp, Users, ShieldCheck, Pencil, Save, PlusCircle,
   CheckCircle2, MapPin, X, Landmark, Smartphone, Info, ChevronRight, Clock
} from 'lucide-react';
import ChatWidget from '../../components/ChatWidget';

interface DriverDashboardProps { user: User; }

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user }) => {
   const navigate = useNavigate();
   const [activeMenu, setActiveMenu] = useState('Overview');
   const [jobsSubTab, setJobsSubTab] = useState<'Market' | 'Requests' | 'Proposed' | 'Rejected'>('Market');
   const [activeChatId, setActiveChatId] = useState<number | null>(null);
   const [statsTimePeriod, setStatsTimePeriod] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');

   // Spline path helper for modern linear graphs
   const getCurvedPath = (dataPoints: { x: number, y: number }[]) => {
      if (dataPoints.length < 2) return "";
      let path = `M ${dataPoints[0].x},${dataPoints[0].y}`;
      for (let i = 0; i < dataPoints.length - 1; i++) {
         const p0 = dataPoints[i];
         const p1 = dataPoints[i + 1];
         const cp1x = p0.x + (p1.x - p0.x) / 2;
         const cp1y = p0.y;
         const cp2x = p0.x + (p1.x - p0.x) / 2;
         const cp2y = p1.y;
         path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
      }
      return path;
   };

   // Editable Profile State
   const [isEditingAccount, setIsEditingAccount] = useState(false);
   const [profileData, setProfileData] = useState({
      name: user.name,
      phone: user.phone,
      email: user.email || 'musa.driver@kwikliner.com',
      hub: 'Lilongwe Gateway Hub',
      company: user.companyName || 'Independent Haulier',
      idNumber: 'MW-1923000-B',
      payoutMethod: user.primaryPayoutMethod || 'BANK' as 'BANK' | 'MOBILE_MONEY',
      licenses: user.licenses || ['Heavy Truck License (Class C1)', 'SADC Cross-Border Permit']
   });

   const [fleet] = useState<Vehicle[]>([
      { id: 'v1', make: 'Volvo', model: 'FH16', plate: 'MC 9928', capacity: '30T', type: 'FLATBED', status: 'Available', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400' }
   ]);

   const totalCapacity = fleet.reduce((acc, v) => {
      const size = parseInt(v.capacity);
      return isNaN(size) ? acc : acc + size;
   }, 0);

   const [newLicenseInput, setNewLicenseInput] = useState('');

   const activeShippers = [
      { name: 'Darrell Steward', company: 'Lyoto', role: 'Manager', phone: '(+886)923456', img: 'Darrell' },
      { name: 'Musa Banda', company: 'Agri-Chem', role: 'Dispatcher', phone: '(+265)88123', img: 'Musa' },
      { name: 'Jane Phiri', company: 'GreenValley', role: 'Logistics', phone: '(+265)99144', img: 'Jane' }
   ];

   const [jobs, setJobs] = useState([
      { id: '#JB-101', route: 'Lilongwe → Blantyre', shipper: 'Agri-Chem', cargo: 'Fertilizer (20T)', price: 'MWK 450,000', type: 'Proposed', date: 'Just now', bids: 3 },
      { id: '#JB-102', route: 'Blantyre → Mwanza', shipper: 'Global Trade', cargo: 'Cement (15T)', price: 'Open Bid', type: 'Market', date: '2h ago', bids: 5 },
      { id: '#JB-103', route: 'Lusaka → Lilongwe', shipper: 'Zambian Exports', cargo: 'Maize (25T)', price: 'USD 900', type: 'Requests', date: '5h ago', bids: 0 },
      { id: '#JB-104', route: 'Salima → Dedza', shipper: 'Lake Fish Ltd', cargo: 'Fish (5T)', price: 'Open Bid', type: 'Market', date: '30m ago', bids: 2 },
      { id: '#JB-105', route: 'Lilongwe → Bt', shipper: 'Musa Banda', cargo: '50kg Bag', price: 'Open Bid', type: 'Market', date: '10m ago', bids: 1 },
      { id: '#JB-106', route: 'Mzuzu → Bt', shipper: 'KwikTransit', cargo: 'Oil (10T)', price: 'MWK 600,000', type: 'Rejected', date: '1d ago', bids: 4 },
   ]);

   const handleAcceptJob = (jobId: string) => {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, type: 'Accepted' } : j));
      alert("Job Accepted! The shipper has been notified that you are ready for pick up.");
   };

   const menuSections = {
      MAIN_MENU: [
         { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Overview' },
         { id: 'BrowseJobs', icon: <Briefcase size={20} />, label: 'Browse Jobs' },
         { id: 'MyTrips', icon: <Navigation size={20} />, label: 'My Trips', badge: jobs.filter(j => j.type === 'Accepted').length },
         { id: 'Message', icon: <MessageSquare size={20} />, label: 'Messages', badge: 6 },
      ],
      GENERAL: [
         { id: 'PostListing', icon: <Plus size={20} />, label: 'Post Listing' },
         { id: 'Report', icon: <BarChart3 size={20} />, label: 'Statistics' },
         { id: 'Account', icon: <UserIcon size={20} />, label: 'Account' },
      ],
      OTHERS: [
         { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' },
         { id: 'Logout', icon: <LogOut size={20} />, label: 'Log out' },
      ]
   };

   const addLicense = () => {
      if (newLicenseInput.trim()) {
         setProfileData({ ...profileData, licenses: [...profileData.licenses, newLicenseInput] });
         setNewLicenseInput('');
      }
   };

   const removeLicense = (index: number) => {
      const newList = [...profileData.licenses];
      newList.splice(index, 1);
      setProfileData({ ...profileData, licenses: newList });
   };

   const [revenueCycle, setRevenueCycle] = useState<'H1' | 'H2'>('H1');
   const h1Data = [
      { month: 'Jan', value: 40, amt: '150K' }, { month: 'Feb', value: 50, amt: '200K' },
      { month: 'Mar', value: 45, amt: '180K' }, { month: 'Apr', value: 60, amt: '250K' },
      { month: 'May', value: 55, amt: '220K' }, { month: 'Jun', value: 75, amt: '300K' }
   ];
   const h2Data = [
      { month: 'Jul', value: 70, amt: '280K' }, { month: 'Aug', value: 85, amt: '350K' },
      { month: 'Sep', value: 80, amt: '320K' }, { month: 'Oct', value: 95, amt: '400K' },
      { month: 'Nov', value: 85, amt: '350K' }, { month: 'Dec', value: 100, amt: '450K' }
   ];

   const activeRevenueData = revenueCycle === 'H1' ? h1Data : h2Data;

   const totalCycleRevenue = revenueCycle === 'H1' ? '1.3M' : '2.15M';

   const renderContent = () => {
      switch (activeMenu) {
         case 'Overview':
            return (
               <div className="space-y-8 animate-in fade-in duration-500 pb-20">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-10">
                     <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight text-[40px]">Shipment Track</h2>
                        <div className="px-4 py-1.5 bg-white border border-slate-100 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-all">
                           Status <ChevronDown size={14} />
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors"><Search size={20} /></button>
                        <button className="text-slate-400 hover:text-blue-600 transition-colors relative">
                           <Bell size={20} />
                           <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="h-10 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-3">
                           <div className="text-right">
                              <p className="text-sm font-black text-slate-900 leading-none">{profileData.name}</p>
                              <p className="text-[11px] font-bold text-slate-400 mt-1">Driver Profile</p>
                           </div>
                           <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shadow-sm">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`} alt="pfp" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-12 gap-6">
                     <div className="col-span-12 lg:col-span-4 bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start mb-8">
                           <div>
                              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Orders</p>
                              <h3 className="text-4xl font-black text-slate-900">155</h3>
                           </div>
                           <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                              <Box size={24} />
                           </div>
                        </div>
                        <div className="flex items-center gap-2 mb-8">
                           <span className="text-xs font-black text-green-500 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                              <TrendingUp size={12} /> +30%
                           </span>
                           <span className="text-[11px] font-bold text-slate-400">vs last month</span>
                        </div>
                        <div className="h-24 w-full flex items-end gap-1.5 pt-4">
                           {[30, 45, 25, 60, 40, 70, 35, 80, 55, 90, 45, 65].map((h, i) => (
                              <div key={i} className={`flex-1 ${i === 8 ? 'bg-blue-600' : 'bg-blue-50 group-hover:bg-blue-100'} rounded-t-lg transition-all`} style={{ height: `${h}%` }}></div>
                           ))}
                        </div>
                     </div>
                     <div className="col-span-12 lg:col-span-4 bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group hover:-translate-y-1 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="relative z-10 flex justify-between items-start mb-6">
                           <div>
                              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Total Revenue ({revenueCycle === 'H1' ? 'H1' : 'H2'})</p>
                              <h3 className="text-4xl font-black text-white">MWK {totalCycleRevenue}</h3>
                           </div>
                           <div className="flex flex-col items-end gap-2">
                              <div className="bg-white/10 p-1 rounded-xl flex gap-1">
                                 <button
                                    onClick={(e) => { e.stopPropagation(); setRevenueCycle('H1'); }}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${revenueCycle === 'H1' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                 >
                                    Jan-Jun
                                 </button>
                                 <button
                                    onClick={(e) => { e.stopPropagation(); setRevenueCycle('H2'); }}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${revenueCycle === 'H2' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                 >
                                    Jul-Dec
                                 </button>
                              </div>
                           </div>
                        </div>
                        <div className="relative z-10 h-36 w-full flex items-end gap-3 pt-4">
                           {activeRevenueData.map((d, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-3 relative group/bar">
                                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 px-2 py-1 rounded-lg text-[9px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                    {d.amt}
                                 </div>
                                 <div className={`w-full ${i === activeRevenueData.length - 1 ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-white/10'} rounded-t-lg transition-all hover:bg-white/20`} style={{ height: `${d.value}%` }}></div>
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{d.month}</span>
                                 <span className="text-[8px] font-bold text-slate-600 mt-[-8px]">{d.amt}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="col-span-12 lg:col-span-4 bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start mb-8">
                           <div>
                              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Fleet Capacity</p>
                              <h3 className="text-4xl font-black text-slate-900">{totalCapacity}T</h3>
                           </div>
                           <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                              <Truck size={24} />
                           </div>
                        </div>
                        <div className="flex items-center gap-2 mb-8">
                           <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                              Vehicles: {fleet.length} Registered
                           </span>
                        </div>
                        <div className="h-24 w-full flex items-end justify-between pt-4">
                           {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
                              <div key={i} className={`w-8 rounded-xl ${i === 3 ? 'bg-indigo-600' : 'bg-indigo-50 group-hover:bg-indigo-100'} transition-all`} style={{ height: `${h}%` }}></div>
                           ))}
                        </div>
                     </div>

                     <div
                        onClick={() => setActiveMenu('BrowseJobs')}
                        className="col-span-12 lg:col-span-12 bg-blue-600 p-12 rounded-[56px] text-white shadow-2xl relative overflow-hidden group hover:scale-[1.01] transition-all cursor-pointer"
                     >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                           <div className="flex items-center gap-8">
                              <div className="h-20 w-20 bg-white/20 backdrop-blur-md rounded-[28px] flex items-center justify-center text-white shrink-0 group-hover:rotate-12 transition-transform">
                                 <Plus size={40} />
                              </div>
                              <div>
                                 <h3 className="text-4xl font-black tracking-tighter mb-2">20 New Job Requests</h3>
                                 <p className="text-blue-100 font-bold text-lg opacity-80">Shippers are looking for your capacity. Act now to earn more.</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl group-hover:translate-x-2 transition-transform">
                              Explore Jobs <ChevronRight size={18} />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-12 gap-6">
                     <div className="col-span-12 lg:col-span-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest text-[11px]">Active Shippers</h3>
                           <Users size={16} className="text-slate-400" />
                        </div>
                        <div className="space-y-4 max-h-[280px] overflow-y-auto scrollbar-hide pr-2">
                           {activeShippers.map((shipper, idx) => (
                              <div key={idx} className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                                 <div className="h-12 w-12 rounded-2xl bg-white overflow-hidden shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${shipper.img}`} alt={shipper.name} />
                                 </div>
                                 <div className="min-w-0 flex-grow">
                                    <h4 className="text-sm font-black text-slate-900 leading-none truncate">{shipper.name}</h4>
                                    <p className="text-[11px] font-bold text-blue-500 mt-1 uppercase tracking-wider">{shipper.company}</p>
                                 </div>
                                 <button className="h-8 w-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
                                    <MessageSquare size={14} />
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="col-span-12 lg:col-span-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600" className="w-48 h-32 object-contain rounded-2xl mb-6" alt="Truck" />
                        <h4 className="text-xl font-black text-slate-900">Current Assigned Fleet</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">WYC-2234 • 30T Flatbed</p>
                     </div>
                  </div>
               </div>
            );
         case 'Report':
            // Dynamic data based on period
            const periodData = {
               Weekly: [40, 60, 45, 90, 65, 85, 75],
               Monthly: [25, 45, 35, 75, 55, 90, 65, 98, 80, 60, 85, 95],
               Yearly: [30, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 90]
            };
            const currentGraphData = periodData[statsTimePeriod];
            const graphLabels = statsTimePeriod === 'Weekly'
               ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
               : statsTimePeriod === 'Monthly'
                  ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                  : ['2020', '2021', '2022', '2023', '2024', '2025'];

            const points = currentGraphData.map((val, i) => ({
               x: (i / (currentGraphData.length - 1)) * 100,
               y: 100 - val
            }));

            const splinePath = getCurvedPath(points);
            const areaSplinePath = `${splinePath} L 100 100 L 0 100 Z`;

            return (
               <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                     <div>
                        <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Business Intelligence</h3>
                        <p className="text-slate-500 font-medium mt-2 text-lg">Real-time performance metrics and predictive growth insights.</p>
                     </div>
                     <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-[24px] border border-white shadow-xl flex gap-1">
                        {(['Weekly', 'Monthly', 'Yearly'] as const).map(t => (
                           <button
                              key={t}
                              onClick={() => setStatsTimePeriod(t)}
                              className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${statsTimePeriod === t ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'text-slate-400 hover:text-slate-900 hover:bg-white/80'}`}
                           >
                              {t}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[48px] text-white shadow-2xl transition-all hover:-translate-y-2">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <div className="relative z-10">
                           <div className="h-14 w-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6">
                              <DollarSign size={28} />
                           </div>
                           <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1 opacity-80">Total Revenue</p>
                           <h4 className="text-3xl font-black tracking-tight">MWK 4.2M</h4>
                        </div>
                     </div>

                     <div className="group relative overflow-hidden bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl transition-all hover:-translate-y-2">
                        <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                           <Navigation size={28} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Trips</p>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight">1,248</h4>
                     </div>

                     <div className="group relative overflow-hidden bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl transition-all hover:-translate-y-2">
                        <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                           <Truck size={28} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Areas Visited</p>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight">24</h4>
                     </div>

                     <div className="group relative overflow-hidden bg-slate-900 p-8 rounded-[48px] text-white shadow-2xl transition-all hover:-translate-y-2">
                        <div className="h-14 w-14 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6">
                           <Star size={28} className="text-amber-400" fill="currentColor" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Requests</p>
                        <h4 className="text-3xl font-black tracking-tight">1,842</h4>
                     </div>
                  </div>

                  <div className="grid grid-cols-12 gap-8">
                     <div className="col-span-12 xl:col-span-8 bg-white p-12 rounded-[64px] border border-slate-100 shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-16">
                           <div>
                              <h4 className="text-3xl font-black text-slate-900 tracking-tight">Earnings Velocity</h4>
                              <p className="text-slate-500 font-medium">Visualizing your financial growth trajectory.</p>
                           </div>
                           <div className="flex items-center gap-3 text-indigo-600">
                              <span className="text-sm font-black uppercase tracking-widest">Growing Path</span>
                              <TrendingUp size={24} />
                           </div>
                        </div>

                        <div className="relative h-96 w-full mb-12">
                           <div className="absolute inset-x-0 inset-y-4 flex flex-col justify-between pointer-events-none opacity-40">
                              {[0, 1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-slate-100"></div>)}
                           </div>

                           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible relative z-10">
                              <defs>
                                 <linearGradient id="splineArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                                 </linearGradient>
                                 <filter id="splineGlow">
                                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                                    <feMerge>
                                       <feMergeNode in="blur" />
                                       <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                 </filter>
                              </defs>
                              <path d={areaSplinePath} fill="url(#splineArea)" className="transition-all duration-1000" />
                              <path
                                 d={splinePath}
                                 fill="none"
                                 stroke="#4F46E5"
                                 strokeWidth="3.5"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 filter="url(#splineGlow)"
                                 className="transition-all duration-1000"
                              />
                           </svg>

                           <div className="absolute -bottom-10 w-full flex justify-between px-2">
                              {graphLabels.map((m, i) => (
                                 <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m}</span>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="col-span-12 xl:col-span-4 bg-indigo-600 p-12 rounded-[64px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                        <div className="relative z-10">
                           <h4 className="text-3xl font-black mb-8 leading-tight">Inspiring Growth</h4>
                           <p className="text-indigo-100 font-medium text-lg leading-relaxed mb-10">"You have completed <span className="text-white font-black underline decoration-indigo-400 underline-offset-4">12% more trips</span> this week than your average. Your reliability is outstanding."</p>

                        </div>
                        <TrendingUp className="absolute bottom-[-40px] right-[-40px] h-64 w-64 text-white/5 -rotate-12" />
                     </div>
                  </div>
               </div>
            );

         case 'Account':
            return (
               <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Driver Identity</h3>
                        <p className="text-slate-500 font-medium mt-1">Manage your professional credentials and payout settings.</p>
                     </div>
                     {!isEditingAccount ? (
                        <button
                           onClick={() => setIsEditingAccount(true)}
                           className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                        >
                           <Pencil size={16} /> Edit Profile
                        </button>
                     ) : (
                        <button
                           onClick={() => setIsEditingAccount(false)}
                           className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                        >
                           <Save size={16} /> Save Changes
                        </button>
                     )}
                  </div>

                  <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-2xl relative overflow-hidden">
                     <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
                        <div className="relative group">
                           <div className="h-44 w-44 rounded-[48px] bg-slate-100 border-8 border-white shadow-2xl overflow-hidden">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`} alt="pfp" className="w-full h-full object-cover" />
                           </div>
                           {isEditingAccount && (
                              <div className="absolute inset-0 bg-slate-900/40 rounded-[48px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                 <ImageIcon className="text-white" size={32} />
                              </div>
                           )}
                        </div>
                        <div className="text-center md:text-left space-y-4 flex-grow">
                           {isEditingAccount ? (
                              <input
                                 value={profileData.name}
                                 onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                 className="text-4xl font-black text-slate-900 bg-slate-50 border-none rounded-2xl px-4 py-2 w-full focus:ring-4 focus:ring-blue-100 outline-none"
                              />
                           ) : (
                              <h4 className="text-5xl font-black text-slate-900 tracking-tight">{profileData.name}</h4>
                           )}

                           <div className="flex flex-wrap justify-center md:justify-start gap-3">
                              {profileData.licenses.map((license, idx) => (
                                 <span key={idx} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck size={12} /> {license}
                                    {isEditingAccount && (
                                       <button onClick={() => removeLicense(idx)} className="ml-1 text-red-500 hover:text-red-700">
                                          <X size={12} />
                                       </button>
                                    )}
                                 </span>
                              ))}
                              {isEditingAccount && (
                                 <div className="flex gap-2">
                                    <input
                                       placeholder="Add New License..."
                                       value={newLicenseInput}
                                       onChange={(e) => setNewLicenseInput(e.target.value)}
                                       className="text-[11px] font-black uppercase tracking-widest px-4 py-1.5 bg-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                                    />
                                    <button onClick={addLicense} className="text-blue-600"><PlusCircle size={20} /></button>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                           <h5 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50 pb-4">Personal Details</h5>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                                 {isEditingAccount ? (
                                    <input
                                       value={profileData.phone}
                                       onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                       className="w-full bg-slate-50 p-4 rounded-2xl font-black text-sm outline-none border border-transparent focus:border-blue-600"
                                    />
                                 ) : (
                                    <p className="text-lg font-black text-slate-900 ml-1">{profileData.phone}</p>
                                 )}
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                 {isEditingAccount ? (
                                    <input
                                       value={profileData.email}
                                       onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                       className="w-full bg-slate-50 p-4 rounded-2xl font-black text-sm outline-none border border-transparent focus:border-blue-600"
                                    />
                                 ) : (
                                    <p className="text-lg font-black text-slate-900 ml-1">{profileData.email}</p>
                                 )}
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">ID Number</label>
                                 {isEditingAccount ? (
                                    <input
                                       value={profileData.idNumber}
                                       onChange={(e) => setProfileData({ ...profileData, idNumber: e.target.value })}
                                       className="w-full bg-slate-50 p-4 rounded-2xl font-black text-sm outline-none border border-transparent focus:border-blue-600"
                                    />
                                 ) : (
                                    <p className="text-lg font-black text-slate-900 ml-1">{profileData.idNumber}</p>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="space-y-8">
                           <h5 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50 pb-4">Payment & Financials</h5>
                           <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-6">
                              <div className="flex items-center gap-5">
                                 <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                    {profileData.payoutMethod === 'BANK' ? <Landmark size={24} /> : <Smartphone size={24} />}
                                 </div>
                                 <div className="flex-grow">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Primary Payout</p>
                                    {isEditingAccount ? (
                                       <select
                                          value={profileData.payoutMethod}
                                          onChange={(e) => setProfileData({ ...profileData, payoutMethod: e.target.value as any })}
                                          className="bg-transparent font-black text-blue-600 outline-none mt-1"
                                       >
                                          <option value="BANK">Bank Transfer</option>
                                          <option value="MOBILE_MONEY">Mobile Money</option>
                                       </select>
                                    ) : (
                                       <p className="text-sm font-bold text-slate-500 mt-1">{profileData.payoutMethod === 'BANK' ? 'Standard Bank Account' : 'Airtel Money / TNM'}</p>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            );
         case 'Message':
            return (
               <div className="flex h-[calc(100vh-10rem)] bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in duration-500">
                  {/* Conversations Sidebar */}
                  <div className="w-[320px] lg:w-[400px] border-r border-slate-100 flex flex-col shrink-0 bg-white">
                     <div className="p-6 pb-2 shrink-0">
                        <div className="flex items-center justify-between mb-6">
                           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h3>
                           <div className="flex items-center gap-2">
                              <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-blue-600"><Plus size={20} /></button>
                              <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-blue-600"><MoreHorizontal size={20} /></button>
                           </div>
                        </div>
                        <div className="relative mb-4">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                           <input className="w-full bg-slate-100/80 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600/20" placeholder="Search chats..." />
                        </div>
                     </div>
                     <div className="flex-grow overflow-y-auto scrollbar-hide">
                        {activeShippers.map((chat, idx) => (
                           <div key={idx} onClick={() => setActiveChatId(idx)} className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition-colors border-b border-slate-50/50 ${activeChatId === idx ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
                              <div className="h-14 w-14 rounded-full bg-slate-100 border border-slate-100 overflow-hidden">
                                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.img}`} alt="avatar" />
                              </div>
                              <div className="flex-grow min-w-0">
                                 <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className="text-sm font-bold text-slate-900 truncate">{chat.name}</h4>
                                    <span className="text-[11px] font-bold text-slate-400 shrink-0">Just now</span>
                                 </div>
                                 <p className="text-[12px] font-medium text-slate-500 truncate leading-tight">Incoming manifest update...</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  {/* Chat Area */}
                  <div className="flex-grow flex flex-col bg-[#F0F2F5] relative overflow-hidden">
                     {activeChatId === null ? (
                        <div className="flex-grow flex flex-col items-center justify-center p-10 text-center">
                           <div className="h-40 w-40 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mb-10">
                              <Truck className="h-14 w-14 text-slate-300" strokeWidth={1.5} />
                           </div>
                           <h2 className="text-3xl font-light text-slate-700 mb-4 tracking-tight">KwikLiner Messenger</h2>
                           <p className="text-slate-500 font-normal text-sm max-w-sm">Secure end-to-end encrypted messaging for all logistics operations.</p>
                        </div>
                     ) : (
                        <>
                           <div className="h-16 bg-[#F0F2F5] px-6 flex items-center justify-between border-b border-slate-200 shrink-0">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-full bg-white overflow-hidden shadow-sm">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeShippers[activeChatId].img}`} alt="avatar" />
                                 </div>
                                 <h4 className="text-sm font-bold text-slate-900">{activeShippers[activeChatId].name}</h4>
                              </div>
                           </div>
                           <div className="flex-grow p-10 space-y-4 overflow-y-auto flex flex-col scrollbar-hide">
                              <div className="flex justify-start">
                                 <div className="bg-white p-4 rounded-2xl rounded-tl-none text-[13px] font-medium text-slate-700 shadow-sm border border-slate-100 max-w-[70%]">
                                    Is the 20T truck available for tomorrow's route to Blantyre?
                                    <p className="text-[9px] font-bold text-slate-400 text-right mt-2 uppercase">07:03 PM</p>
                                 </div>
                              </div>
                              <div className="flex justify-end">
                                 <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-[13px] font-bold text-white shadow-md max-w-[70%]">
                                    Yes, I am available. Please send the manifest details through the direct request tab.
                                    <div className="flex justify-end items-center gap-1 mt-2">
                                       <p className="text-[9px] font-bold text-blue-200 uppercase">07:05 PM</p>
                                       <CheckCircle2 size={12} className="text-blue-300" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="bg-[#F0F2F5] px-6 py-4 flex items-center gap-4 shrink-0">
                              <button className="text-slate-500 hover:text-blue-600"><Paperclip size={20} /></button>
                              <div className="flex-grow bg-white rounded-xl flex items-center px-4 py-2 border border-slate-200 shadow-sm">
                                 <input className="w-full bg-transparent text-sm font-semibold outline-none py-1.5 text-slate-800 placeholder:text-slate-300" placeholder="Type a message..." />
                              </div>
                              <button className="h-11 w-11 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"><Send size={18} /></button>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            );
         case 'BrowseJobs':
            return (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Job Marketplace</h3>
                  <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                     <div className="p-8 border-b border-slate-50 flex gap-4 bg-slate-50/30 overflow-x-auto scrollbar-hide">
                        <button onClick={() => setJobsSubTab('Market')} className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Market' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100'}`}>Marketplace</button>
                        <button onClick={() => setJobsSubTab('Proposed')} className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Proposed' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100'}`}>My Proposals</button>
                        <button onClick={() => setJobsSubTab('Requests')} className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Requests' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100'}`}>Direct Requests ({jobs.filter(j => j.type === 'Requests').length})</button>
                        <button onClick={() => setJobsSubTab('Rejected')} className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Rejected' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100'}`}>Rejected</button>
                     </div>
                     <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.filter(j => j.type === jobsSubTab).map(job => (
                           <div key={job.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
                              <h4 className="text-xl font-black text-slate-900 mb-2">{job.route}</h4>
                              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-6">{job.shipper}</p>
                              <div className="space-y-3 mb-10">
                                 <div className="flex items-center gap-3 text-slate-500 text-sm font-medium"><Package size={16} /> {job.cargo}</div>
                                 <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                    <DollarSign size={16} />
                                    <span className={job.price === 'Open Bid' ? 'text-amber-600 font-black px-2 py-0.5 bg-amber-50 rounded-lg' : ''}>{job.price}</span>
                                 </div>
                              </div>
                              <div className="pt-6 border-t border-slate-50 flex items-center justify-between mb-6">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.date}</span>
                                 <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{job.bids} Bids</span>
                              </div>
                              {jobsSubTab === 'Market' ? (
                                 <button className={`w-full py-4 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02] active:scale-95 ${job.price === 'Open Bid' ? 'bg-amber-500 shadow-amber-100 hover:bg-amber-600' : 'bg-blue-600 shadow-blue-100'}`}>
                                    {job.price === 'Open Bid' ? 'Propose Price' : 'Accept Load'} <Gavel size={16} />
                                 </button>
                              ) : jobsSubTab === 'Proposed' ? (
                                 <div className="w-full py-4 bg-slate-50 text-slate-400 rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-slate-100">
                                    Pending Shipper <Clock size={16} />
                                 </div>
                              ) : jobsSubTab === 'Rejected' ? (
                                 <div className="w-full py-4 bg-red-50 text-red-600 rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-red-100">
                                    Load Rejected <X size={16} />
                                 </div>
                              ) : job.type === 'Accepted' ? (
                                 <div className="w-full py-4 bg-green-50 text-green-600 rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-green-100">
                                    Trip Approved <CheckCircle2 size={16} />
                                 </div>
                              ) : (
                                 <div className="flex gap-2">
                                    <button
                                       onClick={() => handleAcceptJob(job.id)}
                                       className="flex-1 py-4 bg-blue-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl"
                                    >
                                       Accept
                                    </button>
                                    <button className="flex-1 py-4 bg-white text-slate-400 border border-slate-100 rounded-[20px] font-black text-xs uppercase tracking-widest">Chat</button>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            );
         case 'MyTrips':
            return (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">My Trips</h3>
                        <p className="text-slate-500 font-medium mt-1 text-sm">Manage your accepted and active trips.</p>
                     </div>
                  </div>
                  <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.filter(j => j.type === 'Accepted').length > 0 ? (
                           jobs.filter(j => j.type === 'Accepted').map(job => (
                              <div key={job.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
                                 <h4 className="text-xl font-black text-slate-900 mb-2">{job.route}</h4>
                                 <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-6">{job.shipper}</p>
                                 <div className="space-y-3 mb-10">
                                    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium"><Package size={16} /> {job.cargo}</div>
                                    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium"><DollarSign size={16} /> {job.price}</div>
                                 </div>
                                 <div className="w-full py-4 bg-green-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-100">
                                    Active Trip <Navigation size={16} />
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="col-span-full py-20 text-center">
                              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                 <Navigation className="text-slate-200" size={32} />
                              </div>
                              <h4 className="text-lg font-black text-slate-900">No active trips yet</h4>
                              <p className="text-slate-500 text-sm mt-2">Go to Browse Jobs to find your next load.</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            );
         case 'PostListing':
            return (
               <div className="max-w-[1920px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center">
                     <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Broadcast Availability</h3>
                     <p className="text-slate-500 font-medium mt-2">Let shippers find you by posting your current route and capacity.</p>
                  </div>
                  <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-2xl space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Hub</label>
                           <input className="w-full bg-slate-50 rounded-[28px] px-6 py-6 font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 border border-transparent" placeholder="e.g. Lilongwe" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Headed To (Optional)</label>
                           <input className="w-full bg-slate-50 rounded-[28px] px-6 py-6 font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 border border-transparent" placeholder="e.g. Blantyre" />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Free Capacity (Tons)</label>
                           <input type="number" className="w-full bg-slate-50 rounded-[28px] px-6 py-6 font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 border border-transparent" placeholder="e.g. 15" />
                        </div>
                     </div>
                     <button className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black uppercase tracking-widest shadow-2xl shadow-blue-100">Publish Listing</button>
                  </div>
               </div>
            );
         default: return null;
      }
   };

   return (
      <div className="flex bg-[#F8F9FB] min-h-screen text-slate-900 font-['Inter'] relative overflow-hidden">
         <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-8 shrink-0 h-screen sticky top-0 overflow-hidden">
            <div className="flex items-center justify-center mb-14 shrink-0 px-2">
               <div className="bg-blue-600 p-3 rounded-[20px] shadow-xl shadow-blue-100">
                  <Truck className="text-white" size={28} />
               </div>
            </div>
            <div className="flex-grow space-y-10 overflow-y-auto pr-2 scrollbar-hide">
               {Object.entries(menuSections).map(([title, items]) => (
                  <div key={title}>
                     <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.25em] mb-6 px-4">{title.replace('_', ' ')}</p>
                     <div className="space-y-2">
                        {items.map(item => (
                           <button
                              key={item.id}
                              onClick={() => {
                                 if (item.id === 'Logout') navigate('/');
                                 else if (item.id === 'Settings') navigate('/settings');
                                 else setActiveMenu(item.id);
                              }}
                              className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all group ${activeMenu === item.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200 translate-x-2' : 'text-slate-500 hover:bg-slate-50'}`}
                           >
                              <div className="flex items-center space-x-5">
                                 <span className={activeMenu === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 transition-colors'}>{item.icon}</span>
                                 <span className="text-sm font-black tracking-tight">{item.label}</span>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
            <div className="pt-10 border-t border-slate-50 mt-10 shrink-0">
               <div className="bg-slate-50 p-6 rounded-[32px] flex items-center gap-4 border border-slate-100 overflow-hidden">
                  <div className="h-12 w-12 rounded-full bg-white shadow-sm overflow-hidden shrink-0"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`} alt="pfp" /></div>
                  <div className="min-w-0">
                     <p className="text-xs font-black text-slate-900 truncate">{profileData.name}</p>
                     <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Verified Driver</p>
                  </div>
               </div>
            </div>
         </aside>

         <main className="flex-grow min-w-0 flex flex-col p-6 md:p-10 lg:p-14 overflow-hidden pt-16">
            <div className="flex-grow pb-20 overflow-y-auto scrollbar-hide">
               {renderContent()}
            </div>
         </main>
         <ChatWidget user={user} />
      </div>
   );
};

export default DriverDashboard;
