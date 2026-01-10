
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { 
  LayoutGrid, Truck, Box, MessageSquare, Activity, 
  Settings, LogOut, Search, 
  Bell, Navigation, AlertCircle, DollarSign,
  Plus, MoreHorizontal, Star, Lock, Send, Paperclip, ImageIcon,
  Gavel, Briefcase, Package, BarChart3, User as UserIcon, ChevronDown, 
  TrendingUp, Users, ShieldCheck, Pencil, Save, PlusCircle, 
  CheckCircle2, MapPin, X, Landmark, Smartphone
} from 'lucide-react';
import ChatWidget from '../../components/ChatWidget';

interface DriverDashboardProps { user: User; }

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [jobsSubTab, setJobsSubTab] = useState<'Requests' | 'Proposed'>('Proposed');
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  // Editable Profile State
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    phone: user.phone,
    email: user.email || 'musa.driver@kwikliner.com',
    hub: 'Lilongwe Gateway Hub',
    company: user.companyName || 'Independent Haulier',
    idNumber: 'MW-1923000-B',
    payoutMethod: user.primaryPayoutMethod || 'BANK',
    licenses: ['Heavy Truck License (Class C1)', 'SADC Cross-Border Permit']
  });

  const [newLicenseInput, setNewLicenseInput] = useState('');

  const activeShippers = [
    { name: 'Darrell Steward', company: 'Lyoto', role: 'Manager', phone: '(+886)923456', img: 'Darrell' },
    { name: 'Musa Banda', company: 'Agri-Chem', role: 'Dispatcher', phone: '(+265)88123', img: 'Musa' },
    { name: 'Jane Phiri', company: 'GreenValley', role: 'Logistics', phone: '(+265)99144', img: 'Jane' }
  ];

  const availableJobs = [
    { id: '#JB-101', route: 'Lilongwe → Blantyre', shipper: 'Agri-Chem', cargo: 'Fertilizer (20T)', price: 'MWK 450,000', type: 'Proposed' },
    { id: '#JB-102', route: 'Blantyre → Mwanza', shipper: 'Global Trade', cargo: 'Cement (15T)', price: 'MWK 380,000', type: 'Proposed' },
    { id: '#JB-103', route: 'Lusaka → Lilongwe', shipper: 'Zambian Exports', cargo: 'Maize (25T)', price: 'USD 900', type: 'Requests' },
    { id: '#JB-104', route: 'Salima → Dedza', shipper: 'Lake Fish Ltd', cargo: 'Fish (5T)', price: 'MWK 120,000', type: 'Requests' },
  ];

  const menuSections = {
    MAIN_MENU: [
      { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Overview' },
      { id: 'BrowseJobs', icon: <Briefcase size={20} />, label: 'Browse Jobs' },
      { id: 'Message', icon: <MessageSquare size={20} />, label: 'Messages', badge: 6 },
      { id: 'Activity', icon: <Activity size={20} />, label: 'Activity' },
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
                       <p className="text-[10px] font-bold text-slate-400 mt-1">Driver Profile</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shadow-sm">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`} alt="pfp" />
                    </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
               <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest text-[10px]">Total Orders</h3>
                  <div className="flex items-center gap-4 mb-4">
                     <span className="text-3xl font-black">155</span>
                     <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">↑ 30%</span>
                  </div>
                  <div className="h-24 w-full flex items-end gap-1.5">
                     {[30, 45, 25, 60, 40, 70, 35, 80, 55, 90, 45, 65].map((h, i) => (
                       <div key={i} className={`flex-1 ${i === 8 ? 'bg-blue-600' : 'bg-blue-50'} rounded-t-lg transition-all`} style={{ height: `${h}%` }}></div>
                     ))}
                  </div>
               </div>
               <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest text-[10px]">Monthly Revenue</h3>
                  <div className="flex items-baseline gap-2 mb-8">
                     <span className="text-4xl font-black text-blue-600">MWK 2.4M</span>
                  </div>
                  <div className="h-16 w-full relative flex items-end gap-1">
                     {[40, 50, 45, 60, 55, 75, 70, 85, 80, 95, 85, 100].map((h, i) => (
                       <div key={i} className={`flex-1 ${i === 11 ? 'bg-blue-600' : 'bg-blue-100'} rounded-t-sm`} style={{ height: `${h}%` }}></div>
                     ))}
                  </div>
               </div>
               <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest text-[10px]">Capacity Available</h3>
                  <div className="flex h-32 items-end justify-between relative z-10">
                     {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
                       <div key={i} className="flex flex-col items-center gap-3">
                          <div className={`w-8 rounded-xl ${i === 3 ? 'bg-blue-600' : 'bg-blue-100'}`} style={{ height: `${h}px` }}></div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest text-[10px]">Active Shippers</h3>
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
                        <p className="text-[10px] font-bold text-blue-500 mt-1 uppercase tracking-wider">{shipper.company}</p>
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
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">WYC-2234 • 30T Flatbed</p>
              </div>
            </div>
          </div>
        );
      case 'Report':
        const graphData = [25, 40, 30, 65, 50, 85, 60, 95, 75, 55, 70, 90];
        const points = graphData.map((val, i) => ({
          x: (i / (graphData.length - 1)) * 100,
          y: 100 - val
        }));
        const pathData = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;
        const areaPathData = `${pathData} L 100 100 L 0 100 Z`;

        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
               <div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Statistics Center</h3>
                  <p className="text-slate-500 font-medium mt-1 text-sm">Comprehensive performance metrics for your freight operations.</p>
               </div>
               <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex gap-1">
                  {['Weekly', 'Monthly', 'Yearly'].map(t => (
                    <button key={t} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t === 'Monthly' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:text-slate-900'}`}>
                       {t}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6">
                     <DollarSign size={32} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Revenue Generated</p>
                  <span className="text-4xl font-black text-slate-900">MWK 4.2M</span>
               </div>
               <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6">
                     <Truck size={32} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Trips Completed</p>
                  <span className="text-4xl font-black text-slate-900">142</span>
               </div>
               <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-6">
                     <Box size={32} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Cargo Handled</p>
                  <span className="text-4xl font-black text-slate-900">312,400 KG</span>
               </div>
            </div>

            <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-center mb-12">
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">Revenue Breakdown</h4>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={24} />
                    <span className="text-sm font-black text-blue-600">+12.5%</span>
                  </div>
               </div>
               
               <div className="relative h-80 w-full mb-10 group">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-40">
                    {[0,1,2,3,4].map(i => <div key={i} className="w-full h-px bg-slate-100"></div>)}
                  </div>
                  
                  {/* Line Graph */}
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                     <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
                           <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
                        </linearGradient>
                     </defs>
                     <path d={areaPathData} fill="url(#areaGradient)" />
                     <path d={pathData} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                     {points.map((p, i) => (
                        <circle 
                          key={i} 
                          cx={p.x} 
                          cy={p.y} 
                          r="1.2" 
                          fill="white" 
                          stroke="#2563EB" 
                          strokeWidth="1.5"
                          className="hover:r-2 transition-all cursor-crosshair"
                        />
                     ))}
                  </svg>
                  
                  {/* X-Axis Labels */}
                  <div className="absolute -bottom-8 w-full flex justify-between px-2">
                    {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                       <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.charAt(0)}</span>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        );
      case 'Account':
        return (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
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
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="text-4xl font-black text-slate-900 bg-slate-50 border-none rounded-2xl px-4 py-2 w-full focus:ring-4 focus:ring-blue-100 outline-none"
                        />
                      ) : (
                        <h4 className="text-5xl font-black text-slate-900 tracking-tight">{profileData.name}</h4>
                      )}
                      
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {profileData.licenses.map((license, idx) => (
                          <span key={idx} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
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
                              className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
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
                                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
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
                                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
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
                                onChange={(e) => setProfileData({...profileData, idNumber: e.target.value})}
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
                                    onChange={(e) => setProfileData({...profileData, payoutMethod: e.target.value as any})}
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
                              <span className="text-[10px] font-bold text-slate-400 shrink-0">Just now</span>
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
               <div className="p-8 border-b border-slate-50 flex gap-4 bg-slate-50/30">
                  <button onClick={() => setJobsSubTab('Proposed')} className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${jobsSubTab === 'Proposed' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100'}`}>Proposed Jobs</button>
                  <button onClick={() => setJobsSubTab('Requests')} className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${jobsSubTab === 'Requests' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100'}`}>Direct Requests</button>
               </div>
               <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableJobs.filter(j => j.type === jobsSubTab).map(job => (
                    <div key={job.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
                        <h4 className="text-xl font-black text-slate-900 mb-2">{job.route}</h4>
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-6">{job.shipper}</p>
                        <div className="space-y-3 mb-10">
                           <div className="flex items-center gap-3 text-slate-500 text-sm font-medium"><Package size={16} /> {job.cargo}</div>
                           <div className="flex items-center gap-3 text-slate-500 text-sm font-medium"><DollarSign size={16} /> {job.price}</div>
                        </div>
                        <button className="w-full py-4 bg-blue-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                           Propose Bid <Gavel size={16} />
                        </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );
      case 'PostListing':
        return (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Broadcast Availability</h3>
                <p className="text-slate-500 font-medium mt-2">Let shippers find you by posting your current route and capacity.</p>
             </div>
             <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-2xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Hub</label>
                      <input className="w-full bg-slate-50 rounded-[28px] px-6 py-6 font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 border border-transparent" placeholder="e.g. Lilongwe" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Headed To (Optional)</label>
                      <input className="w-full bg-slate-50 rounded-[28px] px-6 py-6 font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 border border-transparent" placeholder="e.g. Blantyre" />
                   </div>
                   <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Free Capacity (Tons)</label>
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
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-6 px-4">{title.replace('_', ' ')}</p>
              <div className="space-y-2">
                {items.map(item => (
                  <button key={item.id} onClick={() => item.id === 'Logout' ? navigate('/') : setActiveMenu(item.id)} className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all group ${activeMenu === item.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200 translate-x-2' : 'text-slate-500 hover:bg-slate-50'}`}>
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
                 <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Verified Driver</p>
              </div>
           </div>
        </div>
      </aside>

      <main className="flex-grow min-w-0 flex flex-col p-10 lg:p-14 overflow-hidden pt-16">
        <div className="flex-grow pb-20 overflow-y-auto scrollbar-hide">
           {renderContent()}
        </div>
      </main>
      <ChatWidget user={user} />
    </div>
  );
};

export default DriverDashboard;
