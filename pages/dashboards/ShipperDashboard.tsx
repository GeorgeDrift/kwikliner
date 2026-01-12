
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import {
   LayoutGrid, Truck, Box, MessageSquare, Activity, FileText,
   Globe, UserCheck, Settings, LogOut, ChevronDown, Search,
   Bell, Plus, ArrowRight, Package, DollarSign, Clock,
   MapPin, Star, MoreHorizontal, User as UserIcon, Send,
   ShieldCheck, Filter, ShoppingCart, Wrench, HardHat, Zap, Shield, Gavel,
   ClipboardList, CheckCircle2, X, Trash2, CreditCard, Smartphone,
   ChevronRight, Paperclip, Mic, Image as ImageIcon, Lock, BarChart3, TrendingUp, Info, Award
} from 'lucide-react';
import ChatWidget from '../../components/ChatWidget';

interface ShipperDashboardProps { user: User; }

interface CartItem {
   id: string;
   name: string;
   price: number;
   priceStr: string;
   img: string;
   quantity: number;
}

const ShipperDashboard: React.FC<ShipperDashboardProps> = ({ user }) => {
   const navigate = useNavigate();
   const [activeMenu, setActiveMenu] = useState('Overview');
   const [marketFilter, setMarketFilter] = useState('All');
   const [locationFilter, setLocationFilter] = useState('All');
   const [loadsSubTab, setLoadsSubTab] = useState('Active');
   const [activeChatId, setActiveChatId] = useState<number | null>(null);
   const [hiringUrgency, setHiringUrgency] = useState<Record<string, string>>({}); // Track urgency per driver card

   // Cart State
   const [cart, setCart] = useState<CartItem[]>([]);
   const [isCartOpen, setIsCartOpen] = useState(false);
   const [isCheckingOut, setIsCheckingOut] = useState(false);
   const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment' | 'success'>('review');

   // Modal State
   const [isPostModalOpen, setIsPostModalOpen] = useState(false);
   const [newShipment, setNewShipment] = useState({
      origin: '',
      destination: '',
      cargo: '',
      weight: '',
      price: ''
   });

   const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);
   const [selectedLoadForBids, setSelectedLoadForBids] = useState<any>(null);

   const availableBids = [
      { id: 'b1', driver: 'Musa Banda', rating: 4.9, amount: 'MWK 420,000', eta: '20 mins', truck: '30T Flatbed', jobs: 124 },
      { id: 'b2', driver: 'Isaac Ngoma', rating: 4.8, amount: 'MWK 435,000', eta: '1 hour', truck: '15T Box', jobs: 89 },
      { id: 'b3', driver: 'Dunamis Adoro', rating: 4.7, amount: 'MWK 410,000', eta: '45 mins', truck: '20T Sider', jobs: 56 },
   ];

   const [shipmentsData, setShipmentsData] = useState({
      Active: [
         { id: '#KW-900224', route: 'Lilongwe → Blantyre', cargo: 'Fertilizer (12T)', price: 'MWK 450,000', status: 'In Transit', color: 'text-blue-600 bg-blue-50', bids: 0 },
         { id: '#KW-900312', route: 'Lilongwe → Bt', cargo: '50kg Bag', price: 'Open Bid', status: 'Bidding Open', color: 'text-amber-600 bg-amber-50', bids: 3 },
         { id: '#KW-900226', route: 'Lilongwe → Lusaka', cargo: 'Equipment (4T)', price: 'USD 1,200', status: 'Finding Driver', color: 'text-blue-600 bg-blue-50', bids: 0 },
      ],
      Rejected: [
         { id: '#KW-882109', route: 'Bt → Mwanza', cargo: 'Glass (2T)', price: 'MWK 150,000', status: 'Rejected', color: 'text-red-500 bg-red-50', bids: 1 },
      ],
      Completed: [
         { id: '#KW-900110', route: 'Blantyre → Mwanza', cargo: 'Cement (20T)', price: 'MWK 580,000', status: 'Delivered', color: 'text-green-600 bg-green-50', bids: 1 },
      ],
      History: [
         { id: '#KW-890552', route: 'Mzuzu → Lilongwe', cargo: 'Grain (15T)', price: 'MWK 390,000', status: 'Archived', color: 'text-slate-500 bg-slate-50', bids: 4 },
         { id: '#KW-882103', route: 'Salima → Dedza', cargo: 'Fish (5T)', price: 'MWK 120,000', status: 'Archived', color: 'text-slate-500 bg-slate-50', bids: 2 },
      ]
   });

   const menuSections: Record<string, { id: string; icon: React.ReactNode; label: string; badge?: number }[]> = {
      MAIN: [
         { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Overview' },
         { id: 'Loads', icon: <Package size={20} />, label: 'Load Postings', badge: shipmentsData.Active.filter(s => s.status === 'Bidding Open' || s.status === 'Finding Driver').length },
         { id: 'Shipments', icon: <Truck size={20} />, label: 'My Shipments', badge: shipmentsData.Active.filter(s => s.status === 'In Transit' || s.status === 'Approved / Waiting Pick up').length },
         { id: 'Marketplace', icon: <UserCheck size={20} />, label: 'Hire Drivers' },
         { id: 'Market', icon: <ShoppingCart size={20} />, label: 'KwikShop' },
         { id: 'Analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
      ],
      COMMUNICATION: [
         { id: 'Message', icon: <MessageSquare size={20} />, label: 'Messages', badge: 2 },
      ],
      OTHERS: [
         { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' },
         { id: 'Logout', icon: <LogOut size={20} />, label: 'Log out' },
      ]
   };

   const marketItems = [
      { id: 'p1', name: 'High-Performance GPS', cat: 'Tech', price: 45000, priceStr: 'MWK 45,000', img: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=400', location: 'Lilongwe' },
      { id: 'p2', name: 'Heavy-Duty 20T Jack', cat: 'Hardware', price: 85000, priceStr: 'MWK 85,000', img: 'https://images.unsplash.com/photo-1635773103130-1845943f6067?auto=format&fit=crop&q=80&w=400', location: 'Blantyre' },
      { id: 'p3', name: 'Cargo Straps (Set of 4)', cat: 'Hardware', price: 15000, priceStr: 'MWK 15,000', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400', location: 'Mzuzu' },
      { id: 'p4', name: 'Truck Spare Parts Kit', cat: 'Spares', price: 120000, priceStr: 'MWK 120,000', img: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=400', location: 'Zomba' },
   ];

   const addToCart = (item: typeof marketItems[0]) => {
      setCart(prev => {
         const existing = prev.find(i => i.id === item.id);
         if (existing) {
            return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
         }
         return [...prev, { ...item, quantity: 1 }];
      });
      setIsCartOpen(true);
   };

   const removeFromCart = (id: string) => {
      setCart(prev => prev.filter(i => i.id !== id));
   };

   const updateQuantity = (id: string, delta: number) => {
      setCart(prev => prev.map(i => {
         if (i.id === id) {
            const newQty = Math.max(1, i.quantity + delta);
            return { ...i, quantity: newQty };
         }
         return i;
      }));
   };

   const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

   const inventoryMix = useMemo(() => {
      const allLoads = [...shipmentsData.Active, ...shipmentsData.Completed, ...shipmentsData.History];
      const totals: Record<string, number> = {};
      let grandTotal = 0;
      allLoads.forEach(load => {
         const match = load.cargo.match(/^([^(]+)\s*\((\d+)T\)$/);
         if (match) {
            const category = match[1].trim();
            const weight = parseInt(match[2], 10);
            totals[category] = (totals[category] || 0) + weight;
            grandTotal += weight;
         }
      });
      const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500', 'bg-rose-500'];
      return Object.entries(totals).map(([label, weight], index) => ({
         label, val: `${weight} Tons`, pct: Math.round((weight / grandTotal) * 100), color: colors[index % colors.length]
      })).sort((a, b) => b.pct - a.pct);
   }, [shipmentsData]);

   const handlePostShipment = (e: React.FormEvent) => {
      e.preventDefault();
      // Price is now optional (Budget)
      if (!newShipment.origin || !newShipment.destination || !newShipment.cargo || !newShipment.weight) return;

      const id = `#KW-${Math.floor(100000 + Math.random() * 900000)}`;
      const entry = {
         id,
         route: `${newShipment.origin} → ${newShipment.destination}`,
         cargo: `${newShipment.cargo} (${newShipment.weight}T)`,
         price: newShipment.price ? `MWK ${Number(newShipment.price).toLocaleString()}` : 'Open Bid',
         status: 'Bidding Open',
         color: 'text-amber-600 bg-amber-50'
      };
      setShipmentsData(prev => ({ ...prev, Active: [entry, ...prev.Active] }));
      setNewShipment({ origin: '', destination: '', cargo: '', weight: '', price: '' });
      setIsPostModalOpen(false);
      setActiveMenu('Loads');
      setLoadsSubTab('Active');
   };

   const renderContent = () => {
      switch (activeMenu) {
         case 'Overview':
            return (
               <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                     <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
                        <div>
                           <h3 className="text-2xl font-black text-slate-900 leading-tight">Shipment Progress</h3>
                           <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-2 uppercase tracking-widest">
                              Shipment ID: {shipmentsData.Active[0]?.id || 'N/A'}
                           </p>
                        </div>
                        <div className="bg-emerald-50 px-6 py-4 rounded-3xl border border-emerald-100 flex items-center gap-6">
                           <div>
                              <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Escrow Amount</p>
                              <span className="text-2xl font-black text-emerald-700 tracking-tighter">{shipmentsData.Active[0]?.price || 'MWK 0'}</span>
                           </div>
                           <div className="h-10 w-px bg-emerald-200"></div>
                           <div>
                              <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Payment</p>
                              <span className="text-xs font-black text-emerald-900 uppercase">Secured</span>
                           </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                           <div className="flex items-center gap-4 mb-6">
                              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                 <ClipboardList size={24} />
                              </div>
                              <h4 className="font-black text-slate-900">Current Milestone</h4>
                           </div>
                           <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                 <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                    <CheckCircle2 size={14} />
                                 </div>
                                 <p className="text-sm font-bold text-slate-900">Handover Complete</p>
                              </div>
                              <div className="flex items-center gap-4 opacity-50">
                                 <div className="h-6 w-6 rounded-full border-2 border-slate-200 shrink-0"></div>
                                 <p className="text-sm font-bold text-slate-500">Departed Origin Hub</p>
                              </div>
                              <div className="flex items-center gap-4 opacity-50">
                                 <div className="h-6 w-6 rounded-full border-2 border-slate-200 shrink-0"></div>
                                 <p className="text-sm font-bold text-slate-500">Destination Arrival</p>
                              </div>
                           </div>
                           <div className="mt-10 p-4 bg-white rounded-2xl border border-slate-100 flex justify-between items-center">
                              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Last Update</span>
                              <span className="text-xs font-black text-slate-900">Today, 08:30 AM</span>
                           </div>
                        </div>
                        <div className="space-y-8 py-4">
                           <div className="flex items-start gap-6 relative">
                              <div className="absolute left-[7px] top-6 bottom-[-32px] w-[2px] bg-slate-100"></div>
                              <div className="h-4 w-4 rounded-full border-4 border-white bg-blue-600 mt-1 relative z-10 shadow-sm"></div>
                              <div>
                                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Origin</p>
                                 <p className="text-lg font-black text-slate-900 mt-1">{shipmentsData.Active[0]?.route.split(' → ')[0] || 'Unknown'}</p>
                              </div>
                           </div>
                           <div className="flex items-start gap-6 relative">
                              <div className="h-4 w-4 rounded-full border-4 border-white bg-slate-100 mt-1 relative z-10 shadow-sm"></div>
                              <div>
                                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Next Check-in</p>
                                 <p className="text-lg font-black text-slate-900 mt-1">Manual Update Required</p>
                              </div>
                           </div>
                           <div className="flex items-start gap-6">
                              <div className="h-4 w-4 rounded-full border-4 border-white bg-slate-50 mt-1 relative z-10"></div>
                              <div>
                                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                                 <p className="text-lg font-black text-slate-900 mt-1">{shipmentsData.Active[0]?.route.split(' → ')[1] || 'Unknown'}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-span-12 lg:col-span-4 space-y-8">
                     <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                           <h3 className="text-2xl font-black leading-tight mb-4 text-white">Move Goods?</h3>
                           <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">List your cargo manifest to receive driver quotes.</p>
                           <button onClick={() => setIsPostModalOpen(true)} className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20">
                              Post New Load
                           </button>
                        </div>
                        <Package size={200} className="absolute right-[-40px] bottom-[-40px] opacity-[0.05]" />
                     </div>
                     <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-8">Freight Mix Analytics</h3>
                        <div className="space-y-6">
                           {inventoryMix.length > 0 ? inventoryMix.map((item, i) => (
                              <div key={i} className="space-y-2">
                                 <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-400">
                                    <span>{item.label}</span>
                                    <span className="text-slate-900">{item.val}</span>
                                 </div>
                                 <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                                 </div>
                              </div>
                           )) : (
                              <p className="text-xs font-bold text-slate-400 text-center py-4">No manifest data found to calculate mix.</p>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            );
         case 'Market':
            return (
               <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 relative">
                  {/* Cart Trigger */}
                  <div className="fixed bottom-32 right-8 z-[60]">
                     <button onClick={() => setIsCartOpen(true)} className="h-20 w-20 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center relative hover:scale-110 active:scale-95 transition-all">
                        <ShoppingCart size={32} />
                        {cart.length > 0 && (
                           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black h-8 w-8 rounded-full flex items-center justify-center border-4 border-white">
                              {cart.reduce((a, b) => a + b.quantity, 0)}
                           </span>
                        )}
                     </button>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Kwik Shop</h3>
                        <p className="text-slate-500 font-medium mt-1 text-sm">Browse the global marketplace. Shop hardware, spares, and gear.</p>
                     </div>
                     <div className="relative flex-grow max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input className="bg-white border border-slate-100 rounded-xl pl-12 pr-6 py-3 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-600 outline-none w-full shadow-sm" placeholder="Search Marketplace..." />
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                     {['All', 'Hardware', 'Spares', 'Agri', 'Tech', 'Safety'].map(cat => (
                        <button key={cat} onClick={() => setMarketFilter(cat)} className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${marketFilter === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-600'}`}>
                           {cat}
                        </button>
                     ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {marketItems.filter(i => marketFilter === 'All' || i.cat === marketFilter).map((item, idx) => (
                        <div key={idx} className="bg-white rounded-[32px] p-4 border border-slate-50 shadow-sm hover:shadow-2xl transition-all group">
                           <div className="h-48 rounded-[24px] overflow-hidden mb-4 relative bg-slate-100">
                              <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
                              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-black text-blue-600 uppercase tracking-widest">
                                 {item.cat}
                              </div>
                           </div>
                           <div className="px-2 pb-2">
                              <div className="flex justify-between items-start mb-1">
                                 <h4 className="font-black text-slate-900 text-sm line-clamp-1">{item.name}</h4>
                              </div>
                              <p className="text-lg font-black text-blue-600 mb-4">{item.priceStr}</p>
                              <button onClick={() => addToCart(item)} className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all">
                                 <ShoppingCart size={14} /> Add to Cart
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            );
         case 'Marketplace':
            return (
               <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Hire Verified Drivers</h3>
                        <p className="text-slate-500 font-medium mt-1 text-sm">Direct access to active haulers ready to move.</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-sm hover:border-blue-600 transition-all">
                           All Categories <ChevronDown size={14} />
                        </div>
                        <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100">
                           Refine List
                        </button>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {[
                        { name: 'Musa Banda', rating: 4.9, truck: '30T Flatbed', status: 'Available', loc: 'Lilongwe', reviews: 124 },
                        { name: 'Isaac Ngoma', rating: 4.8, truck: '15T Tanker', status: 'In Transit', loc: 'Blantyre', reviews: 89 },
                        { name: 'Chisomo Phiri', rating: 4.7, truck: '10T Closed Van', status: 'Available', loc: 'Mzuzu', reviews: 56 },
                     ].map((driver, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between">
                           <div>
                              <div className="flex justify-between items-start mb-8">
                                 <div className="h-20 w-20 rounded-[28px] bg-slate-50 border-4 border-white shadow-xl overflow-hidden relative">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.name}`} alt="pfp" />
                                    <div className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                                 </div>
                                 <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                                       <Star size={14} fill="currentColor" />
                                       <span className="text-sm font-black text-slate-900">{driver.rating}</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{driver.reviews} trips</span>
                                 </div>
                              </div>
                              <h4 className="text-2xl font-black text-slate-900 leading-none">{driver.name}</h4>
                              <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mt-2 mb-8 bg-blue-50 w-fit px-3 py-1 rounded-lg">{driver.truck}</p>
                              <div className="space-y-3 mb-10 text-slate-500">
                                 <div className="flex items-center gap-3">
                                    <MapPin size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">{driver.loc} Hub</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <Shield size={16} className="text-green-500" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Identity Verified</span>
                                 </div>
                              </div>
                           </div>

                           {/* Urgency Selector */}
                           <div className="mb-8">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Shipment Urgency</p>
                              <div className="grid grid-cols-3 gap-2">
                                 {[
                                    { id: 'urgent', label: 'Urgent', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' },
                                    { id: 'standard', label: 'Standard', icon: Truck, color: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100' },
                                    { id: 'flexible', label: 'Flexible', icon: Clock, color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' }
                                 ].map((level) => (
                                    <button
                                       key={level.id}
                                       onClick={() => setHiringUrgency({ ...hiringUrgency, [idx]: level.id })}
                                       className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${(hiringUrgency[idx] || 'standard') === level.id
                                          ? `${level.color} shadow-sm ring-1 ring-offset-2 ring-offset-white ${level.id === 'urgent' ? 'ring-amber-200' : level.id === 'standard' ? 'ring-blue-200' : 'ring-emerald-200'}`
                                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                          }`}
                                    >
                                       <level.icon size={16} className="mb-1" />
                                       <span className="text-[9px] font-black uppercase tracking-widest">{level.label}</span>
                                    </button>
                                 ))}
                              </div>
                           </div>

                           <div className="flex items-center gap-4 border-t border-slate-50 pt-8">
                              <button className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95 touch-manipulation ${(hiringUrgency[idx] || 'standard') === 'urgent' ? 'bg-amber-500 shadow-amber-100 hover:bg-amber-600' :
                                 (hiringUrgency[idx] || 'standard') === 'flexible' ? 'bg-emerald-500 shadow-emerald-100 hover:bg-emerald-600' :
                                    'bg-blue-600 shadow-blue-100 hover:bg-blue-700'
                                 }`}>
                                 Hire • {(hiringUrgency[idx] || 'standard')}
                              </button>
                              <button className="h-14 w-14 border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600"><MessageSquare size={20} /></button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            );
         case 'Loads':
            return (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Load Postings</h3>
                        <p className="text-slate-500 font-medium mt-1 text-sm">Post new jobs and manage active bidding processes.</p>
                     </div>
                  </div>
                  <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                     <div className="p-8 border-b border-slate-50 flex flex-wrap gap-4 items-center justify-between bg-slate-50/30">
                        <div className="flex gap-4">
                           <button className="px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg shadow-blue-100">Bidding Active</button>
                           <button className="px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest bg-white text-slate-400 border border-slate-100 hover:bg-slate-50">Drafts</button>
                        </div>
                        <div className="flex items-center gap-4">
                           <button onClick={() => setIsPostModalOpen(true)} className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-100 flex items-center gap-3 hover:scale-105 transition-all">
                              <Plus size={16} /> Post New Shipment
                           </button>
                        </div>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="border-b border-slate-50">
                                 <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Load ID</th>
                                 <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                                 <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Cargo</th>
                                 <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Price/Budget</th>
                                 <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                 <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {shipmentsData.Active.filter(s => s.status === 'Bidding Open' || s.status === 'Finding Driver').map((row, i) => (
                                 <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer">
                                    <td className="px-8 py-6 text-sm font-black text-slate-900">{row.id}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-700">{row.route}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-500">{row.cargo}</td>
                                    <td className="px-8 py-6 text-sm font-black text-blue-600">{row.price}</td>
                                    <td className="px-8 py-6">
                                       <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest ${row.color}`}>{row.status}</span>
                                       {row.bids > 0 && row.status === 'Bidding Open' && (
                                          <span className="ml-2 bg-amber-500 text-white px-2 py-1 rounded-md text-[9px] font-black">{row.bids} BIDS</span>
                                       )}
                                    </td>
                                    <td className="px-8 py-6">
                                       <button
                                          onClick={() => { setSelectedLoadForBids(row); setIsBidsModalOpen(true); }}
                                          className="px-4 py-2 bg-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-100 flex items-center gap-2 hover:bg-amber-600 transition-all"
                                       >
                                          <Gavel size={14} /> View Bids
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            );
         case 'Shipments':
            return (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">My Shipments</h3>
                        <p className="text-slate-500 font-medium mt-1 text-sm">Track your shipments that have been accepted and are in progress.</p>
                     </div>
                  </div>
                  <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                     <div className="p-8 border-b border-slate-50 flex flex-wrap gap-4 items-center justify-between bg-slate-50/30">
                        <div className="flex gap-4">
                           {['Accepted', 'Rejected', 'Completed', 'History'].map(t => (
                              <button key={t} onClick={() => setLoadsSubTab(t === 'Accepted' ? 'Active' : t)} className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest cursor-pointer transition-all ${((loadsSubTab === 'Active' && t === 'Accepted') || loadsSubTab === t) ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}>{t}</button>
                           ))}
                        </div>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="border-b border-slate-50">
                                 <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Shipment ID</th>
                                 <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Route Details</th>
                                 <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Cargo Type</th>
                                 <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Price Paid</th>
                                 <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
                                 <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Manage</th>
                              </tr>
                           </thead>
                           <tbody>
                              {(loadsSubTab === 'Active' ? shipmentsData.Active.filter(s => s.status === 'In Transit' || s.status === 'Approved / Waiting Pick up') : (shipmentsData[loadsSubTab as keyof typeof shipmentsData] || [])).map((row, i) => (
                                 <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer">
                                    <td className="px-8 py-6 text-sm font-black text-slate-900">{row.id}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-700">{row.route}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-500">{row.cargo}</td>
                                    <td className="px-8 py-6 text-sm font-black text-blue-600">{row.price}</td>
                                    <td className="px-8 py-6">
                                       <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest ${row.color}`}>{row.status}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                       <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                                          <MoreHorizontal size={18} />
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            );
         case 'Message':
            return (
               <div className="flex h-[calc(100vh-10rem)] bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in duration-500">
                  {/* Conversations Sidebar (Left - Precisely like the image) */}
                  <div className="w-[320px] lg:w-[400px] border-r border-slate-100 flex flex-col shrink-0 bg-white">
                     {/* Sidebar Header */}
                     <div className="p-6 pb-2 shrink-0">
                        <div className="flex items-center justify-between mb-6">
                           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h3>
                           <div className="flex items-center gap-2">
                              <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                                 <Plus size={20} />
                              </button>
                              <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                                 <MoreHorizontal size={20} />
                              </button>
                           </div>
                        </div>
                        {/* Search Bar - Precise Pill Shape */}
                        <div className="relative mb-4">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                           <input className="w-full bg-slate-100/80 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600/20 transition-all border border-transparent" placeholder="Search or start new chat" />
                        </div>
                     </div>

                     {/* Conversations List */}
                     <div className="flex-grow overflow-y-auto scrollbar-hide">
                        {[
                           { id: 0, name: 'Musa Banda', last: 'Shipment manifest #900224 is confirmed.', time: '7:03 pm', unread: true, verified: true },
                           { id: 1, name: '+265 881 52 24 74', last: 'Payment details received, thanks!', time: '7:01 pm', unread: false, verified: false },
                           { id: 2, name: 'Dunamis Adoro', last: 'ETA for the fertilizer load is 2pm.', time: '5:44 pm', unread: true, verified: true },
                           { id: 3, name: 'Ridex Technologies', last: 'Order #OD-550 has been dispatched.', time: '4:12 pm', unread: false, verified: true },
                           { id: 4, name: '_iam Cryptic', last: 'Is the truck available for Salima route?', time: '3:52 pm', unread: false, verified: false },
                           { id: 5, name: 'John Banda', last: 'Copy that, manifest attached.', time: '3:37 pm', unread: false, verified: false },
                           { id: 6, name: 'KwikIntel', last: 'Automated fleet report for May 24th.', time: '3:06 pm', unread: true, verified: true, isMe: true },
                        ].map((chat) => (
                           <div
                              key={chat.id}
                              onClick={() => setActiveChatId(chat.id)}
                              className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition-colors relative border-b border-slate-50/50 ${activeChatId === chat.id ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                           >
                              <div className="h-14 w-14 rounded-full bg-slate-100 border border-slate-100 flex-shrink-0 overflow-hidden shadow-sm">
                                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} alt="avatar" />
                              </div>
                              <div className="flex-grow min-w-0">
                                 <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">{chat.name}</h4>
                                    <span className="text-[11px] font-bold text-slate-400 shrink-0">{chat.time}</span>
                                 </div>
                                 <div className="flex items-center gap-1.5 min-w-0">
                                    {chat.verified && (
                                       <span className="shrink-0 flex items-center text-blue-500">
                                          <CheckCircle2 size={12} fill="currentColor" className="text-white" />
                                          <CheckCircle2 size={12} className="-ml-2.5" />
                                       </span>
                                    )}
                                    <p className="text-[12px] font-medium text-slate-500 truncate leading-tight">
                                       {chat.isMe && <span className="text-blue-600 mr-1 italic">You:</span>}
                                       {chat.last}
                                    </p>
                                 </div>
                              </div>
                              {chat.unread && !chat.isMe && activeChatId !== chat.id && (
                                 <div className="absolute right-6 bottom-5 h-2 w-2 bg-blue-600 rounded-full shadow-sm shadow-blue-200"></div>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Main Content Area (Right - Matches the Splash screen/Chat look) */}
                  <div className="flex-grow flex flex-col bg-[#F0F2F5] relative overflow-hidden">
                     {activeChatId === null ? (
                        /* High-Fidelity Splash Screen (Empty State) */
                        <div className="flex-grow flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-700">
                           <div className="h-40 w-40 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white/20 mb-10">
                              <div className="h-28 w-28 bg-white rounded-full flex items-center justify-center shadow-inner">
                                 <Truck className="h-14 w-14 text-slate-300" strokeWidth={1.5} />
                              </div>
                           </div>
                           <h2 className="text-3xl font-light text-slate-700 mb-4 tracking-tight">KwikLiner for Web</h2>
                           <p className="text-slate-500 font-normal text-sm max-w-sm leading-relaxed mb-1">
                              Send and receive messages without keeping your phone online.
                           </p>
                           <p className="text-slate-400 font-normal text-sm max-w-sm leading-relaxed">
                              Use KwikLiner on up to 4 linked devices at the same time.
                           </p>

                           {/* Encrypted Footer */}
                           <div className="absolute bottom-12 flex items-center gap-2 text-slate-400 font-medium text-[11px] uppercase tracking-widest opacity-60">
                              <Lock size={12} /> Your personal messages are end-to-end encrypted
                           </div>
                        </div>
                     ) : (
                        /* Active Chat Redesign */
                        <>
                           {/* Chat Header */}
                           <div className="h-16 bg-[#F0F2F5] px-6 flex items-center justify-between border-b border-slate-200 shrink-0">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-full bg-white overflow-hidden border border-slate-100 shadow-sm">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${['Musa Banda', 'Isaac Ngoma', 'Dunamis Adoro', 'Ridex', 'Cryptic', 'John', 'KwikIntel'][activeChatId]}`} alt="avatar" />
                                 </div>
                                 <div>
                                    <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                                       {['Musa Banda', 'Isaac Ngoma', 'Dunamis Adoro', 'Ridex Technologies', '_iam Cryptic', 'John Banda', 'KwikIntel'][activeChatId]}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Online</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-5 text-slate-500">
                                 <Search size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
                                 <MoreHorizontal size={20} className="cursor-pointer hover:text-blue-600 transition-colors" />
                              </div>
                           </div>

                           {/* Messages List Area */}
                           <div className="flex-grow p-10 space-y-4 overflow-y-auto flex flex-col scrollbar-hide bg-[#F0F2F5]">
                              <div className="flex justify-center mb-8">
                                 <span className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest shadow-sm">Today</span>
                              </div>

                              {/* Received Message */}
                              <div className="flex justify-start">
                                 <div className="bg-white p-4 rounded-2xl rounded-tl-none text-[13px] font-medium text-slate-700 shadow-sm border border-slate-100 max-w-[70%] leading-relaxed">
                                    Shipment manifest #900224 is confirmed. Heading out from the Lilongwe Hub now.
                                    <p className="text-[9px] font-bold text-slate-400 text-right mt-2 uppercase">07:03 PM</p>
                                 </div>
                              </div>

                              {/* Sent Message */}
                              <div className="flex justify-end">
                                 <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-[13px] font-bold text-white shadow-md max-w-[70%] leading-relaxed">
                                    Perfect. We are tracking your position on the map. Safe travels, Musa.
                                    <div className="flex justify-end items-center gap-1 mt-2">
                                       <p className="text-[9px] font-bold text-blue-200 uppercase">07:05 PM</p>
                                       <CheckCircle2 size={12} className="text-blue-300" />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Chat Input Area (Pill-like Input) */}
                           <div className="bg-[#F0F2F5] px-6 py-4 flex items-center gap-4 shrink-0">
                              <button className="text-slate-500 hover:text-blue-600 transition-colors"><Paperclip size={20} /></button>
                              <div className="flex-grow bg-white rounded-xl flex items-center px-4 py-2 border border-slate-200 shadow-sm">
                                 <input className="w-full bg-transparent text-sm font-semibold outline-none py-1.5 text-slate-800 placeholder:text-slate-300" placeholder="Type a message..." />
                              </div>
                              <button className="h-11 w-11 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all transform active:scale-95">
                                 <Send size={18} />
                              </button>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            );
         case 'Analytics':
            const analyticsData = [45, 52, 38, 65, 48, 80, 70, 90, 85, 95, 88, 100];
            const aPoints = analyticsData.map((val, i) => ({
               x: (i / (analyticsData.length - 1)) * 100,
               y: 100 - val
            }));
            const aPathData = `M ${aPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
            const aAreaPathData = `${aPathData} L 100 100 L 0 100 Z`;

            return (
               <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                     <div>
                        <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Supply Chain Intelligence</h3>
                        <p className="text-slate-500 font-medium mt-2 text-lg">Real-time insights into your freight spend and delivery performance.</p>
                     </div>
                     <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-[24px] border border-white shadow-xl flex gap-1">
                        {['Q1', 'Q2', 'Q3', 'Q4'].map(t => (
                           <button key={t} className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${t === 'Q4' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'text-slate-400 hover:text-slate-900 hover:bg-white/80'}`}>
                              {t}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-xl transition-all hover:border-indigo-200 group">
                        <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                           <DollarSign size={32} />
                        </div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Logistics Spend</p>
                        <h4 className="text-5xl font-black text-slate-900 tracking-tight mb-2">MWK 12.8M</h4>
                        <span className="text-sm font-bold text-indigo-600">+12% vs last quarter</span>
                     </div>

                     <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-xl transition-all hover:border-emerald-200 group">
                        <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                           <Activity size={32} />
                        </div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Lead Time Average</p>
                        <h4 className="text-5xl font-black text-slate-900 tracking-tight mb-2">4.2 Days</h4>
                        <span className="text-sm font-bold text-emerald-600">-0.8 days improvement</span>
                     </div>

                     <div className="bg-slate-900 p-10 rounded-[56px] text-white shadow-2xl group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <div className="relative z-10">
                           <div className="h-16 w-16 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-all">
                              <Star size={32} className="text-amber-400" fill="currentColor" />
                           </div>
                           <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Carrier Reliability</p>
                           <h4 className="text-5xl font-black tracking-tight mb-2">99.1%</h4>
                           <span className="text-sm font-bold text-amber-400 flex items-center gap-2">
                              Excellent Rating <Award size={14} />
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white p-12 rounded-[64px] border border-slate-100 shadow-2xl relative overflow-hidden">
                     <div className="flex justify-between items-end mb-16">
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                              <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                              <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Spend Trend Analysis</span>
                           </div>
                           <h4 className="text-4xl font-black text-slate-900 tracking-tighter">Budget Allocation Map</h4>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className="text-right">
                              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Peak Month</p>
                              <span className="text-xl font-black text-slate-900">December</span>
                           </div>
                           <div className="h-12 w-px bg-slate-100"></div>
                           <div className="text-right">
                              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Savings Impact</p>
                              <span className="text-xl font-black text-emerald-600">+MWK 1.4M</span>
                           </div>
                        </div>
                     </div>

                     <div className="relative h-96 w-full mb-10">
                        {/* High-end Area Chart */}
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                           <defs>
                              <linearGradient id="shipperGradient" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                                 <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                              </linearGradient>
                           </defs>
                           <path d={aAreaPathData} fill="url(#shipperGradient)" className="animate-in fade-in duration-700" />
                           <path d={aPathData} fill="none" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-xl" />
                           {aPoints.map((p, i) => (
                              <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="white" stroke="#6366F1" strokeWidth="2.5" className="hover:r-3 transition-all cursor-pointer" />
                           ))}
                        </svg>

                        {/* X-Axis */}
                        <div className="absolute -bottom-10 w-full flex justify-between px-2">
                           {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Dec'].map((m, i) => (
                              <span key={i} className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{m}</span>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-slate-50 p-10 rounded-[56px] border border-slate-100 flex items-center gap-8">
                        <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-xl shrink-0">
                           <TrendingUp className="text-indigo-600" size={40} />
                        </div>
                        <div>
                           <h5 className="text-xl font-black text-slate-900 mb-2">Inspiring Performance</h5>
                           <p className="text-slate-500 font-medium leading-relaxed">Your logistics efficiency has increased by <span className="text-indigo-600 font-black">24%</span> this year. Keep optimizing your routes for better cost management.</p>
                        </div>
                     </div>
                     <div className="bg-indigo-600 p-10 rounded-[56px] text-white flex items-center gap-8 shadow-2xl shadow-indigo-100">
                        <div className="h-24 w-24 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center shrink-0">
                           <Info className="text-white" size={40} />
                        </div>
                        <div>
                           <h5 className="text-xl font-black mb-2">KwikInsider Tip</h5>
                           <p className="text-indigo-100 font-medium leading-relaxed opacity-90">Booking fuel tankers 48h in advance reduces your lead cost by average <span className="text-white font-black underline">15%</span>.</p>
                        </div>
                     </div>
                  </div>
               </div>
            );
         default: return null;
      }
   };

   return (
      <div className="flex bg-[#F8F9FB] min-h-screen text-slate-900 font-['Inter'] relative overflow-hidden">

         {/* SIDEBAR NAVIGATION */}
         <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-8 shrink-0 h-screen sticky top-0 overflow-hidden">
            <div className="flex items-center justify-center mb-14 shrink-0 px-2">
               <div className="bg-blue-600 p-3 rounded-[20px] shadow-xl shadow-blue-100">
                  <Truck className="text-white" size={28} />
               </div>
            </div>
            <div className="flex-grow space-y-10 overflow-y-auto pr-2 scrollbar-hide">
               {Object.entries(menuSections).map(([title, items]) => (
                  <div key={title}>
                     <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.25em] mb-6 px-4">{title}</p>
                     <div className="space-y-2">
                        {items.map(item => (
                           <button key={item.id} onClick={() => item.id === 'Logout' ? navigate('/') : setActiveMenu(item.id)} className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all group ${activeMenu === item.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200 translate-x-2' : 'text-slate-500 hover:bg-slate-50'}`}>
                              <div className="flex items-center space-x-5">
                                 <span className={activeMenu === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 transition-colors'}>{item.icon}</span>
                                 <span className="text-sm font-black tracking-tight">{item.label}</span>
                              </div>
                              {item.badge && <span className={`${activeMenu === item.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white'} text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm`}>{item.badge}</span>}
                           </button>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
            <div className="pt-10 border-t border-slate-50 mt-10 shrink-0">
               <div className="bg-slate-50 p-6 rounded-[32px] flex items-center gap-4 border border-slate-100 overflow-hidden">
                  <div className="h-12 w-12 rounded-full bg-white shadow-sm overflow-hidden shrink-0"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="pfp" /></div>
                  <div className="min-w-0">
                     <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                     <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Verified Shipper</p>
                  </div>
               </div>
            </div>
         </aside>

         {/* MAIN CONTENT AREA */}
         <main className="flex-grow min-w-0 flex flex-col p-6 md:p-10 lg:p-14 overflow-hidden pt-16">
            <div className="flex-grow pb-20 overflow-y-auto scrollbar-hide">
               {renderContent()}
            </div>
         </main>
         <ChatWidget user={user} />

         {/* POST SHIPMENT MODAL */}
         {isPostModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsPostModalOpen(false)}></div>
               <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                     <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Post New Shipment</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1">Drivers will bid on your request.</p>
                     </div>
                     <button onClick={() => setIsPostModalOpen(false)} className="h-8 w-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                        <X size={16} />
                     </button>
                  </div>
                  <form onSubmit={handlePostShipment} className="p-8 space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Origin City</label>
                           <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3">
                              <MapPin size={16} className="text-slate-400" />
                              <input
                                 className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                 placeholder="e.g. Lilongwe"
                                 value={newShipment.origin}
                                 onChange={e => setNewShipment({ ...newShipment, origin: e.target.value })}
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Destination</label>
                           <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3">
                              <MapPin size={16} className="text-slate-400" />
                              <input
                                 className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                 placeholder="e.g. Blantyre"
                                 value={newShipment.destination}
                                 onChange={e => setNewShipment({ ...newShipment, destination: e.target.value })}
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Cargo Details</label>
                        <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3">
                           <Package size={16} className="text-slate-400" />
                           <input
                              className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                              placeholder="What are you shipping? (e.g. Fertilizer)"
                              value={newShipment.cargo}
                              onChange={e => setNewShipment({ ...newShipment, cargo: e.target.value })}
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Weight (Tons)</label>
                           <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3">
                              <Box size={16} className="text-slate-400" />
                              <input
                                 type="number"
                                 className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                 placeholder="e.g. 30"
                                 value={newShipment.weight}
                                 onChange={e => setNewShipment({ ...newShipment, weight: e.target.value })}
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Budget (Opt)</label>
                           <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3">
                              <span className="text-xs font-black text-slate-400">MWK</span>
                              <input
                                 type="number"
                                 className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                 placeholder="Offer"
                                 value={newShipment.price}
                                 onChange={e => setNewShipment({ ...newShipment, price: e.target.value })}
                              />
                           </div>
                        </div>
                     </div>

                     <div className="pt-4">
                        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all">
                           Post For Bidding
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* GLOBAL CART DRAWER (Kept for Marketplace functionality) */}
         {isCartOpen && (
            <div className="fixed inset-0 z-[200] flex justify-end">
               <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); }}></div>
               <div className="w-full max-w-md bg-white h-screen shadow-2xl relative z-10 flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
                     <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                        <ShoppingCart className="text-blue-600" /> {isCheckingOut ? 'Checkout' : 'Your KwikCart'}
                     </h2>
                     <button onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); }} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all">
                        <X size={20} />
                     </button>
                  </div>

                  {!isCheckingOut ? (
                     <div className="flex-grow flex flex-col overflow-hidden">
                        <div className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
                           {cart.length === 0 ? (
                              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                                 <ShoppingCart size={80} strokeWidth={1} />
                                 <p className="font-black uppercase tracking-widest text-xs">Your cart is empty</p>
                              </div>
                           ) : (
                              cart.map(item => (
                                 <div key={item.id} className="flex gap-4 group">
                                    <div className="h-24 w-24 rounded-2xl bg-slate-50 overflow-hidden shrink-0">
                                       <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                                    </div>
                                    <div className="flex-grow">
                                       <div className="flex justify-between items-start">
                                          <h4 className="font-black text-slate-900 text-sm">{item.name}</h4>
                                          <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                       </div>
                                       <p className="text-blue-600 font-black text-sm mt-1">{item.priceStr}</p>
                                       <div className="flex items-center gap-3 mt-4">
                                          <button onClick={() => updateQuantity(item.id, -1)} className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 hover:bg-blue-600 hover:text-white transition-all">-</button>
                                          <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                          <button onClick={() => updateQuantity(item.id, 1)} className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 hover:bg-blue-600 hover:text-white transition-all">+</button>
                                       </div>
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                        {cart.length > 0 && (
                           <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
                              <div className="flex justify-between items-center">
                                 <span className="text-sm font-bold text-slate-500">Subtotal</span>
                                 <span className="text-lg font-black text-slate-900">MWK {cartTotal.toLocaleString()}</span>
                              </div>
                              <button onClick={() => setIsCheckingOut(true)} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all">
                                 Proceed to Payment
                              </button>
                           </div>
                        )}
                     </div>
                  ) : (
                     <div className="flex-grow flex flex-col overflow-hidden">
                        <div className="flex-grow overflow-y-auto p-8 space-y-10 scrollbar-hide">
                           {checkoutStep === 'review' && (
                              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                 <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Order Summary</h3>
                                    <div className="space-y-3">
                                       {cart.map(item => (
                                          <div key={item.id} className="flex justify-between text-sm">
                                             <span className="font-bold text-slate-700">{item.name} (x{item.quantity})</span>
                                             <span className="font-black text-slate-900">MWK {(item.price * item.quantity).toLocaleString()}</span>
                                          </div>
                                       ))}
                                       <div className="h-px bg-slate-200 my-4"></div>
                                       <div className="flex justify-between text-sm">
                                          <span className="font-bold text-slate-500">Processing Fee</span>
                                          <span className="font-black text-slate-900">MWK 1,500</span>
                                       </div>
                                       <div className="flex justify-between text-xl pt-4">
                                          <span className="font-black text-slate-900">Total</span>
                                          <span className="font-black text-blue-600">MWK {(cartTotal + 1500).toLocaleString()}</span>
                                       </div>
                                    </div>
                                 </div>
                                 <button onClick={() => setCheckoutStep('payment')} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">
                                    Select Payment Method
                                 </button>
                              </div>
                           )}
                           {checkoutStep === 'payment' && (
                              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Payment Method</h3>
                                 <div className="space-y-4">
                                    <button onClick={() => setCheckoutStep('success')} className="w-full flex items-center justify-between p-6 bg-white border-2 border-blue-600 rounded-[32px] shadow-xl group hover:-translate-y-1 transition-all">
                                       <div className="flex items-center gap-4">
                                          <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><CreditCard size={24} /></div>
                                          <div className="text-left">
                                             <p className="font-black text-slate-900 text-sm leading-none">KwikWallet Balance</p>
                                             <p className="text-[11px] font-bold text-blue-400 mt-1">Available: MWK 1.2M</p>
                                          </div>
                                       </div>
                                       <ChevronRight size={20} className="text-blue-600" />
                                    </button>
                                 </div>
                                 <button onClick={() => setCheckoutStep('review')} className="w-full py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition-colors">Go Back</button>
                              </div>
                           )}
                           {checkoutStep === 'success' && (
                              <div className="space-y-10 animate-in zoom-in-95 duration-500 text-center flex flex-col items-center py-20">
                                 <div className="h-24 w-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-100 mb-8 scale-110">
                                    <CheckCircle2 size={48} />
                                 </div>
                                 <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Payment Confirmed</h3>
                                    <p className="text-slate-400 font-bold mt-2 text-sm uppercase tracking-widest">Transaction ID: #KW-8821102</p>
                                 </div>
                                 <button onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); setCart([]); }} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">
                                    Back to KwikShop
                                 </button>
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         )}
         {/* Bids Viewer Modal */}
         {isBidsModalOpen && selectedLoadForBids && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
               <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                  <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                     <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">Market Bids</h4>
                        <p className="text-slate-500 font-medium mt-1 text-sm">Reviewing offers for Load {selectedLoadForBids.id}</p>
                     </div>
                     <button onClick={() => setIsBidsModalOpen(false)} className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"><X size={24} /></button>
                  </div>

                  <div className="p-10 max-h-[60vh] overflow-y-auto space-y-6">
                     <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mb-8">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Shipment Details</span>
                           <span className="text-sm font-black text-blue-900">{selectedLoadForBids.route}</span>
                        </div>
                        <p className="text-sm font-bold text-blue-700">{selectedLoadForBids.cargo}</p>
                     </div>

                     <div className="space-y-4">
                        {availableBids.map((bid) => (
                           <div key={bid.id} className="p-6 bg-white border border-slate-100 rounded-[32px] hover:border-blue-600 transition-all group flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                 <div className="h-16 w-16 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bid.driver}`} alt="driver" />
                                 </div>
                                 <div>
                                    <div className="flex items-center gap-2 mb-1">
                                       <h5 className="font-black text-slate-900">{bid.driver}</h5>
                                       <div className="flex items-center gap-1 text-amber-400">
                                          <Star size={14} fill="currentColor" />
                                          <span className="text-xs font-black text-slate-900">{bid.rating}</span>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                       <span>{bid.truck}</span>
                                       <span>•</span>
                                       <span>{bid.jobs} Jobs</span>
                                       <span>•</span>
                                       <span className="text-blue-600">ETA {bid.eta}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-2xl font-black text-blue-600 tracking-tight mb-3">{bid.amount}</p>
                                 <button
                                    onClick={() => {
                                       setShipmentsData(prev => ({
                                          ...prev,
                                          Active: prev.Active.map(s => s.id === selectedLoadForBids.id ? { ...s, price: bid.amount, status: 'In Transit', color: 'text-blue-600 bg-blue-50' } : s)
                                       }));
                                       setIsBidsModalOpen(false);
                                    }}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-105 transition-all"
                                 >
                                    Accept Bid
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex justify-center">
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={14} className="text-green-500" />
                        Bids are secure and verified by KwikLiner
                     </p>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ShipperDashboard;

