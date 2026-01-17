
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import {
   LayoutGrid, Truck, Box, MessageSquare, Activity, FileText,
   Globe, UserCheck, Settings, LogOut, ChevronDown, Search,
   Bell, Plus, ArrowRight, Package, DollarSign, Clock,
   MapPin, Star, MoreHorizontal, User as UserIcon, Send,
   ShieldCheck, Filter, ShoppingCart, Wrench, HardHat, Zap, Shield, Gavel,
   ClipboardList, CheckCircle2, X, Trash2, CreditCard, Smartphone,
   ChevronRight, Paperclip, Mic, Image as ImageIcon, Lock, BarChart3, TrendingUp, Info,
   Award, Landmark, Menu, Tag, AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import ChatWidget from '../../components/ChatWidget';

import OverviewTab from './shipper/OverviewTab';
import LoadsTab from './shipper/LoadsTab';
import ShipmentsTab from './shipper/ShipmentsTab';
import MarketplaceTab from './shipper/MarketplaceTab';
import MarketTab from './shipper/MarketTab';
import MessageTab from './shipper/MessageTab';
import SettingsTab from './shipper/SettingsTab';
import VehicleSlider from './shipper/VehicleSlider';

interface ShipperDashboardProps {
   user: User;
   onLogout: () => void;
   mobileMenuAction?: number;
}

interface CartItem {
   id: string;
   name: string;
   price: number;
   priceStr: string;
   img: string;
   quantity: number;
}

const ShipperDashboard: React.FC<ShipperDashboardProps> = ({ user, onLogout, mobileMenuAction }) => {
   const navigate = useNavigate();
   const [activeMenu, setActiveMenu] = useState('Overview');
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [marketFilter, setMarketFilter] = useState('All');
   const [locationFilter, setLocationFilter] = useState('All');
   const [loadsSubTab, setLoadsSubTab] = useState<'Active' | 'History'>('Active');
   const [graphView, setGraphView] = useState<'weekly' | 'yearly'>('weekly');
   const [activeChatId, setActiveChatId] = useState<number | null>(null);
   const [activeQuarter, setActiveQuarter] = useState('Q4');
   const [chatMessages, setChatMessages] = useState<any[]>([
      { id: 1, sender: 'driver', text: "Is the 20T truck available for tomorrow's route to Blantyre?", time: '07:03 PM' },
      { id: 2, sender: 'me', text: "Yes, I am available. Please send the manifest details through the direct request tab.", time: '07:05 PM' }
   ]);
   const [chatInput, setChatInput] = useState('');
   const [hiringUrgency, setHiringUrgency] = useState<Record<string, string>>({}); // Track urgency per driver card
   const [hireDriverTab, setHireDriverTab] = useState<'requests' | 'find'>('requests');

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
      price: '',
      priceOption: 'fixed' as 'fixed' | 'open',
      pickupType: 'Standard' as 'Standard' | 'Shop Pickup',
      orderRef: '',
      paymentTiming: 'Deposit' as 'Deposit' | 'Full on Delivery'
   });

   const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);
   const [selectedLoadForBids, setSelectedLoadForBids] = useState<any>(null);

   // Payment Modal State
   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
   const [paymentMethod, setPaymentMethod] = useState<'BANK' | 'MOBILE_MONEY'>('BANK');
   const [activePaymentShipmentId, setActivePaymentShipmentId] = useState<string | null>(null);

   const [availableBids, setAvailableBids] = useState<any[]>([]);

   const fetchBids = async (loadId: string) => {
      try {
         const bids = await api.getLoadBids(loadId);
         setAvailableBids(bids);
      } catch (error) {
         console.error("Failed to fetch bids", error);
         setAvailableBids([]);
      }
   };

   const [shipmentsData, setShipmentsData] = useState({
      Active: [] as any[],
      Rejected: [] as any[],
      Completed: [] as any[],
      History: [] as any[]
   });

   useEffect(() => {
      if (mobileMenuAction && mobileMenuAction > 0) {
         setIsMobileMenuOpen(true);
      }
      // Expose for child tabs to access if prop drilling is too deep
      (window as any).handlePayDeposit = handlePayDeposit;
   }, [mobileMenuAction]);

   const loadData = async () => {
      try {
         const all = await api.getShipperLoads(user.id);
         setShipmentsData({
            Active: all.filter((s: any) => ['Bidding Open', 'Finding Driver', 'Waiting for Driver Commitment', 'Pending Deposit', 'Active (Waiting Delivery)', 'In Transit', 'Delivered'].includes(s.status)),
            Rejected: all.filter((s: any) => s.status === 'Rejected'),
            Completed: all.filter((s: any) => s.status === 'Completed'),
            History: all.filter((s: any) => s.status === 'Completed' || s.status === 'Delivered')
         });
      } catch (err) {
         console.warn("Failed to load shipper data");
      }
   };

   useEffect(() => {
      loadData();
      const interval = setInterval(loadData, 10000);
      return () => clearInterval(interval);
   }, [user.id]);


   const menuSections: Record<string, { id: string; icon: React.ReactNode; label: string; badge?: number }[]> = {
      MAIN: [
         { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Overview' },
         { id: 'Loads', icon: <Package size={20} />, label: 'Load Postings', badge: shipmentsData.Active.filter(s => s.status === 'Bidding Open' || s.status === 'Finding Driver').length },
         { id: 'Shipments', icon: <Truck size={20} />, label: 'My Shipments', badge: shipmentsData.Active.filter(s => s.status === 'In Transit' || s.status === 'Approved / Waiting Pick up').length },
         { id: 'Marketplace', icon: <UserCheck size={20} />, label: 'Hire Drivers' },
         { id: 'Market', icon: <ShoppingCart size={20} />, label: 'KwikShop' },
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
      // TRANSPORT/LOGISTICS - Transport offerings from Drivers/Logistics Owners
      {
         id: 's1',
         name: '30T Flatbed - Lilongwe Routes',
         cat: 'Transport/Logistics',
         type: 'Transport',
         price: 0,
         priceStr: 'MWK 350k/trip',
         img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400',
         images: [
            'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1591768793355-74d04bb66ea4?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1519003722824-192d992a6023?auto=format&fit=crop&q=80&w=400'
         ],
         location: 'Lilongwe',
         provider: 'KwikLine Transport',
         details: 'Available for inter-city hauls',
         capacity: '30 Tons'
      },
      {
         id: 's2',
         name: 'Refrigerated Van Service',
         cat: 'Transport/Logistics',
         type: 'Transport',
         price: 0,
         priceStr: 'MWK 280k/trip',
         img: 'https://images.unsplash.com/photo-1615750185825-9451a2a1c3d6?auto=format&fit=crop&q=80&w=400',
         images: [
            'https://images.unsplash.com/photo-1615750185825-9451a2a1c3d6?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1549111306-03fc71e4d075?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1554522434-c7b411d94be3?auto=format&fit=crop&q=80&w=400'
         ],
         location: 'Blantyre',
         provider: 'ColdChain Logistics',
         details: 'Temperature-controlled transport',
         capacity: '15 Tons'
      },
      {
         id: 's3',
         name: 'Tanker - Fuel Transport',
         cat: 'Transport/Logistics',
         type: 'Transport',
         price: 0,
         priceStr: 'MWK 450k/trip',
         img: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=400',
         images: [
            'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400'
         ],
         location: 'Mzuzu',
         provider: 'SafeHaul MW',
         details: 'Licensed for hazardous materials',
         capacity: '20,000L'
      },
      {
         id: 's4',
         name: 'General Cargo Van',
         cat: 'Transport/Logistics',
         type: 'Transport',
         price: 0,
         priceStr: 'MWK 180k/trip',
         img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400',
         images: [
            'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1606206591513-adbf0100f91e?auto=format&fit=crop&q=80&w=400'
         ],
         location: 'Zomba',
         provider: 'Swift Movers',
         details: 'Quick delivery service',
         capacity: '8 Tons'
      },

      // CARGO - Cargo listings from Shippers
      { id: 'l1', name: 'Fertilizer - 25T Bulk', cat: 'Cargo', type: 'Cargo', price: 0, priceStr: 'MWK 400k', pricingType: 'Direct', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400', location: 'Lilongwe → Blantyre', provider: 'AgriCorp Malawi', details: 'Needs flatbed, 3-day delivery', weight: '25 Tons' },
      { id: 'l2', name: 'Cement & Steel Rods', cat: 'Cargo', type: 'Cargo', price: 0, priceStr: 'Open to Bids', pricingType: 'Bid', img: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=400', location: 'Mzuzu → Zomba', provider: 'BuildMart Ltd', details: 'Construction materials', weight: '18 Tons' },
      { id: 'l3', name: 'Fresh Produce Delivery', cat: 'Cargo', type: 'Cargo', price: 0, priceStr: 'MWK 250k', pricingType: 'Direct', img: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=400', location: 'Blantyre → Lilongwe', provider: 'FreshProduce Co', details: 'Requires refrigerated transport', weight: '12 Tons' },
      { id: 'l4', name: 'Electronics Shipment', cat: 'Cargo', type: 'Cargo', price: 0, priceStr: 'Open to Bids', pricingType: 'Bid', img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=400', location: 'Zomba → Mzuzu', provider: 'TechSupply MW', details: 'Fragile, secure transport needed', weight: '8 Tons' },

      // EQUIPMENT - Hardware and tools from Hardware Owners
      { id: 'p1', name: 'High-Performance GPS', cat: 'Equipment', type: 'Hardware', price: 45000, priceStr: 'MWK 45,000', img: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=400', location: 'Lilongwe', provider: 'TechHub MW', details: 'Real-time tracking device' },
      { id: 'p2', name: 'Heavy-Duty 20T Jack', cat: 'Equipment', type: 'Hardware', price: 85000, priceStr: 'MWK 85,000', img: 'https://images.unsplash.com/photo-1635773103130-1845943f6067?auto=format&fit=crop&q=80&w=400', location: 'Blantyre', provider: 'Industrial Tools Ltd', details: 'Hydraulic lifting jack' },
      { id: 'p3', name: 'Cargo Straps (Set of 4)', cat: 'Equipment', type: 'Hardware', price: 15000, priceStr: 'MWK 15,000', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400', location: 'Mzuzu', provider: 'Safety First Store', details: 'Heavy-duty tie-downs' },
      { id: 'p4', name: 'Truck Spare Parts Kit', cat: 'Equipment', type: 'Hardware', price: 120000, priceStr: 'MWK 120,000', img: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=400', location: 'Zomba', provider: 'AutoParts Central', details: 'Complete maintenance kit' },
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

   const handlePostShipment = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!newShipment.origin || !newShipment.destination || !newShipment.cargo || !newShipment.weight) {
         alert("Please fill in all required fields.");
         return;
      }

      const payload = {
         shipperId: user.id,
         origin: newShipment.origin,
         destination: newShipment.destination,
         cargo: newShipment.cargo,
         weight: newShipment.weight,
         price: newShipment.priceOption === 'fixed' ? newShipment.price : 'Open Bid',
         priceOption: newShipment.priceOption,
         pickupType: newShipment.pickupType,
         orderRef: newShipment.orderRef,
         paymentTiming: newShipment.paymentTiming,
         status: 'Bidding Open'
      };

      try {
         await api.postLoad(payload);
         alert(`New shipment posted! Your load is now live.`);
         setNewShipment({ origin: '', destination: '', cargo: '', weight: '', price: '', priceOption: 'fixed', pickupType: 'Standard', orderRef: '', paymentTiming: 'Deposit' });
         setIsPostModalOpen(false);
         setActiveMenu('Loads');
         loadData();
      } catch (error) {
         alert("Failed to post shipment.");
      }
   };

   const handleAcceptBid = async (driverName: string, amount: string, bidId?: string) => {
      if (!selectedLoadForBids) return;

      try {
         if (bidId) await api.acceptBid(selectedLoadForBids.id, bidId);
         alert(`Bid accepted! Waiting for ${driverName} to confirm commitment.`);
         setIsBidsModalOpen(false);
         loadData();
      } catch (err) {
         alert("Failed to accept bid.");
      }
   };

   const handlePayDeposit = (shipmentId: string) => {
      setActivePaymentShipmentId(shipmentId);
      setIsPaymentModalOpen(true);
   };

   const handleProcessPayment = async () => {
      if (!activePaymentShipmentId) return;

      try {
         // In real app, call payment API then update shipment
         // await api.updateTripxStatus(activePaymentShipmentId, 'Active (Waiting Delivery)');
         alert(`Payment processed! The trip will be updated once confirmed by the system.`);
         setIsPaymentModalOpen(false);
         setActivePaymentShipmentId(null);
         loadData();
      } catch (err) {
         alert("Payment failed.");
      }
   };

   const handleDirectHire = async (driverName: string) => {
      try {
         const payload = {
            shipperId: user.id,
            origin: 'Lilongwe Hub',
            destination: 'Blantyre City',
            cargo: 'Direct Request Goods',
            weight: '2.5',
            price: '150000',
            assigned_driver_id: 'driver-musa', // In real app, use actual driver ID
            status: 'Finding Driver'
         };
         await api.postLoad(payload);
         alert(`Direct Request sent to ${driverName}! Redirecting to active shipments...`);
         setActiveMenu('Loads');
         loadData();
      } catch (err) {
         alert("Failed to send direct request.");
      }
   };

   const handleDebugDriverConfirm = async (shipmentId: string) => {
      try {
         // Simulate driver committing to the job
         await api.driverCommitToJob(shipmentId, 'COMMIT');
         alert("Debug: Driver has confirmed! You can now pay the deposit.");
         loadData();
      } catch (e) {
         alert("Debug Action Failed");
      }
   };

   const handleBookService = (service: any) => {
      alert(`Service Booked: ${service.name} from ${service.provider}. Our team will contact you for coordination.`);
   };

   const handleSendChatMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatInput.trim()) return;

      const newMessage = {
         id: Date.now(),
         sender: 'me',
         text: chatInput,
         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, newMessage]);
      setChatInput('');

      setTimeout(() => {
         const reply = {
            id: Date.now() + 1,
            sender: 'driver',
            text: "Got it, I'll update the manifest on my end as well.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         };
         setChatMessages(prev => [...prev, reply]);
      }, 1500);
   };

   const renderContent = () => {
      switch (activeMenu) {
         case 'Overview':
            return (
               <OverviewTab
                  shipmentsData={shipmentsData}
                  user={user}
                  setIsPostModalOpen={setIsPostModalOpen}
                  handleDebugDriverConfirm={handleDebugDriverConfirm}
                  handlePayDeposit={handlePayDeposit}
               />
            );
         case 'Market':
            return (
               <MarketTab
                  setIsCartOpen={setIsCartOpen}
                  cart={cart}
                  marketFilter={marketFilter}
                  setMarketFilter={setMarketFilter}
                  marketItems={marketItems}
                  addToCart={addToCart}
                  VehicleSlider={VehicleSlider}
                  handleBookService={handleBookService}
                  hiringUrgency={hiringUrgency}
                  setHiringUrgency={setHiringUrgency}
                  handleDirectHire={handleDirectHire}
               />
            );
         case 'Marketplace':
            return (
               <MarketplaceTab
                  hireDriverTab={hireDriverTab}
                  setHireDriverTab={setHireDriverTab}
                  availableBids={availableBids}
                  handleAcceptBid={handleAcceptBid}
                  locationFilter={locationFilter}
                  setLocationFilter={setLocationFilter}
                  marketItems={marketItems}
                  hiringUrgency={hiringUrgency}
                  setHiringUrgency={setHiringUrgency}
                  VehicleSlider={VehicleSlider}
                  handleDirectHire={handleDirectHire}
               />
            );
         case 'Loads':
            return (
               <LoadsTab
                  setIsPostModalOpen={setIsPostModalOpen}
                  shipmentsData={shipmentsData}
                  setSelectedLoadForBids={setSelectedLoadForBids}
                  setIsBidsModalOpen={setIsBidsModalOpen}
               />
            );
         case 'Shipments':
            return (
               <ShipmentsTab
                  loadsSubTab={loadsSubTab}
                  setLoadsSubTab={setLoadsSubTab}
                  shipmentsData={shipmentsData}
               />
            );
         case 'Message':
            return (
               <MessageTab
                  activeChatId={activeChatId}
                  setActiveChatId={setActiveChatId}
                  chatMessages={chatMessages}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  handleSendChatMessage={handleSendChatMessage}
               />
            );
         case 'Settings':
            return (
               <SettingsTab user={user} />
            );
         case 'Settings':
            return (
               <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                  <div className="text-left">
                     <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Account Settings</h3>
                     <p className="text-slate-500 font-medium mt-1">Configure your shipper preferences and security.</p>
                  </div>

                  <div className="bg-white p-8 sm:p-12 rounded-[40px] sm:rounded-[48px] border border-slate-100 shadow-2xl space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50 pb-4">Preferences</h4>
                           <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                              <div>
                                 <p className="font-black text-slate-900 text-sm">Bid Notifications</p>
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Updates on your loads</p>
                              </div>
                              <div className="h-6 w-12 bg-blue-600 rounded-full flex items-center px-1">
                                 <div className="h-4 w-4 bg-white rounded-full ml-auto shadow-sm"></div>
                              </div>
                           </div>
                           <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                              <div>
                                 <p className="font-black text-slate-900 text-sm">Delivery Alerts</p>
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Real-time status tracking</p>
                              </div>
                              <div className="h-6 w-12 bg-blue-600 rounded-full flex items-center px-1">
                                 <div className="h-4 w-4 bg-white rounded-full ml-auto shadow-sm"></div>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50 pb-4">Security</h4>
                           <button className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all">
                              <div className="text-left">
                                 <p className="font-black text-slate-900 text-sm">Change Password</p>
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Last changed 5mo ago</p>
                              </div>
                              <ChevronRight size={18} className="text-slate-300" />
                           </button>
                           <button className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all text-red-600">
                              <div className="text-left">
                                 <p className="font-black text-sm">Delete Account</p>
                                 <p className="text-[11px] font-bold text-red-300 uppercase tracking-wider mt-1">Permanent action</p>
                              </div>
                              <AlertCircle size={18} className="text-red-300" />
                           </button>
                        </div>
                     </div>

                     <div className="bg-blue-600 p-8 sm:p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
                           <div className="text-center md:text-left">
                              <h4 className="text-2xl font-black tracking-tight mb-2 italic">Premium Shipper</h4>
                              <p className="text-blue-100 font-bold opacity-80 text-sm">Get priority support and lower fees.</p>
                           </div>
                           <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl group-hover:scale-105 transition-all">Upgrade Now</button>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                     </div>
                  </div>
               </div>
            );
         default: return null;
      }
   };

   return (
      <div className="flex flex-col md:flex-row bg-[#F8F9FB] min-h-screen text-slate-900 font-['Inter'] relative overflow-hidden">



         {/* SIDEBAR NAVIGATION (Desktop) */}
         <aside className="hidden md:flex w-64 bg-white border-r border-slate-100 flex-col p-6 shrink-0 h-screen sticky top-0 overflow-hidden">
            <div className="flex items-center justify-center mb-10 shrink-0 px-2">
               <div className="bg-blue-600 p-2.5 rounded-[16px] shadow-lg shadow-blue-100">
                  <Truck className="text-white" size={24} />
               </div>
            </div>
            <div className="flex-grow space-y-8 overflow-y-auto pr-2 scrollbar-hide">
               {Object.entries(menuSections).map(([title, items]) => (
                  <div key={title}>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">{title}</p>
                     <div className="space-y-1">
                        {items.map(item => (
                           <button key={item.id} onClick={() => item.id === 'Logout' ? onLogout() : setActiveMenu(item.id)} className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${activeMenu === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}>
                              <div className="flex items-center space-x-3">
                                 <span className={activeMenu === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 transition-colors'}>{item.icon}</span>
                                 <span className="text-sm font-semibold tracking-tight">{item.label}</span>
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

         {/* MOBILE SIDEBAR (Drawer) */}
         {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[200] md:hidden">
               <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
               <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white flex flex-col p-8 animate-in slide-in-from-left duration-300 shadow-2xl">
                  <div className="flex items-center justify-between mb-10 shrink-0">
                     <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2.5 rounded-xl">
                           <Truck className="text-white" size={24} />
                        </div>
                        <span className="font-black text-xl tracking-tighter">KwikLiner</span>
                     </div>
                     <button onClick={() => setIsMobileMenuOpen(false)} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <X size={20} />
                     </button>
                  </div>

                  <div className="flex-grow space-y-10 overflow-y-auto pr-2 scrollbar-hide">
                     {Object.entries(menuSections).map(([title, items]) => (
                        <div key={title}>
                           <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.25em] mb-6 px-4">{title}</p>
                           <div className="space-y-2">
                              {items.map(item => (
                                 <button
                                    key={item.id}
                                    onClick={() => {
                                       if (item.id === 'Logout') navigate('/');
                                       else {
                                          setActiveMenu(item.id);
                                          setIsMobileMenuOpen(false);
                                       }
                                    }}
                                    className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all group ${activeMenu === item.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
                                 >
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

                  <div className="pt-8 border-t border-slate-50 mt-8 shrink-0">
                     <div className="bg-slate-50 p-6 rounded-[32px] flex items-center gap-4 border border-slate-100 overflow-hidden">
                        <div className="h-12 w-12 rounded-full bg-white shadow-sm overflow-hidden shrink-0">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="pfp" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                           <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Shipper</p>
                        </div>
                     </div>
                  </div>
               </aside>
            </div>
         )}

         {/* MAIN CONTENT AREA */}
         <main className="flex-grow min-w-0 flex flex-col p-4 md:p-10 lg:p-14 overflow-hidden md:pt-16">
            <div className="flex-grow pb-20 overflow-y-auto scrollbar-hide">
               {renderContent()}
            </div>
         </main>
         <ChatWidget user={user} />

         {/* PAYMENT MODAL */}
         {isPaymentModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsPaymentModalOpen(false)}></div>
               <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                     <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Secure Payment</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1">Pay 50% deposit to confirm pickup.</p>
                     </div>
                     <button onClick={() => setIsPaymentModalOpen(false)} className="h-8 w-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                        <X size={16} />
                     </button>
                  </div>
                  <div className="p-8">
                     <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                           onClick={() => setPaymentMethod('BANK')}
                           className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === 'BANK' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                        >
                           <Landmark size={24} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Bank Direct</span>
                        </button>
                        <button
                           onClick={() => setPaymentMethod('MOBILE_MONEY')}
                           className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === 'MOBILE_MONEY' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                        >
                           <Smartphone size={24} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Mobile Money</span>
                        </button>
                     </div>

                     <div className="bg-slate-50 p-6 rounded-2xl mb-8 space-y-3">
                        <div className="flex justify-between items-center">
                           <span className="text-xs font-bold text-slate-500">Service Fee</span>
                           <span className="text-xs font-bold text-slate-900">MWK 2,500</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-xs font-bold text-slate-500">Deposit (50%)</span>
                           <span className="text-lg font-black text-slate-900">MWK 225,000</span>
                        </div>
                     </div>

                     <button onClick={handleProcessPayment} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Lock size={16} /> Process Secure Payment
                     </button>
                  </div>
               </div>
            </div>
         )}

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
                  <form onSubmit={handlePostShipment} className="p-6 sm:p-8 space-y-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                              list="cargo-options"
                              className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                              placeholder="What are you shipping? (e.g. Fertilizer)"
                              value={newShipment.cargo}
                              onChange={e => setNewShipment({ ...newShipment, cargo: e.target.value })}
                           />
                           <datalist id="cargo-options">
                              <option value="Maize" />
                              <option value="Fertilizer" />
                              <option value="Cement" />
                              <option value="Grain" />
                              <option value="Fish" />
                              <option value="Tobacco" />
                              <option value="Soya" />
                              <option value="Sugar" />
                              <option value="General Cargo" />
                           </datalist>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Pickup Type</label>
                           <div className="flex gap-2">
                              <button
                                 type="button"
                                 onClick={() => setNewShipment({ ...newShipment, pickupType: 'Standard' })}
                                 className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newShipment.pickupType === 'Standard' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                              >
                                 Standard
                              </button>
                              <button
                                 type="button"
                                 onClick={() => setNewShipment({ ...newShipment, pickupType: 'Shop Pickup', priceOption: 'open', paymentTiming: 'Full on Delivery' })}
                                 className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newShipment.pickupType === 'Shop Pickup' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                              >
                                 Shop Pickup
                              </button>
                           </div>
                        </div>

                        {newShipment.pickupType === 'Shop Pickup' && (
                           <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Order Reference / Shop Name</label>
                              <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3">
                                 <Tag size={16} className="text-slate-400" />
                                 <input
                                    className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                    placeholder="e.g. Shoprite Mzuzu - Order #12345"
                                    value={newShipment.orderRef}
                                    onChange={e => setNewShipment({ ...newShipment, orderRef: e.target.value })}
                                 />
                              </div>
                           </div>
                        )}

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Pricing Model</label>
                           <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                 type="button"
                                 disabled={newShipment.pickupType === 'Shop Pickup'}
                                 onClick={() => setNewShipment({ ...newShipment, priceOption: 'fixed' })}
                                 className={`w-full sm:flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newShipment.priceOption === 'fixed'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                    : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
                                    } ${newShipment.pickupType === 'Shop Pickup' ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                 Fixed Price
                              </button>
                              <button
                                 type="button"
                                 onClick={() => setNewShipment({ ...newShipment, priceOption: 'open' })}
                                 className={`w-full sm:flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newShipment.priceOption === 'open'
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-100'
                                    : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
                                    }`}
                              >
                                 Open Bid
                              </button>
                           </div>

                           {newShipment.priceOption === 'fixed' && (
                              <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                 <span className="text-xs font-black text-slate-400">MWK</span>
                                 <input
                                    type="number"
                                    className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                    placeholder="Enter your offer"
                                    value={newShipment.price}
                                    onChange={e => setNewShipment({ ...newShipment, price: e.target.value })}
                                 />
                              </div>
                           )}
                           {newShipment.priceOption === 'open' && (
                              <div className="bg-amber-50/50 rounded-2xl px-4 py-3 border border-amber-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                 <Info size={16} className="text-amber-500" />
                                 <span className="text-[10px] font-bold text-amber-600/80">Drivers will submit their best offers for this trip.</span>
                              </div>
                           )}
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
               <div className="w-full sm:max-w-md bg-white h-screen shadow-2xl relative z-10 flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
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
                              <div className="text-center sm:text-right w-full sm:w-auto">
                                 <p className="text-2xl font-black text-blue-600 tracking-tight mb-3">{bid.amount}</p>
                                 <button
                                    onClick={() => handleAcceptBid(bid.driver, bid.amount, bid.id)}
                                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-105 transition-all"
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
         {/* Payment Modal */}
         {isPaymentModalOpen && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
               <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                  <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                     <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">Pay Deposit</h4>
                        <p className="text-slate-500 font-medium mt-1 text-sm uppercase tracking-widest">Job ID: {activePaymentShipmentId}</p>
                     </div>
                     <button onClick={() => setIsPaymentModalOpen(false)} className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"><X size={24} /></button>
                  </div>

                  <div className="p-10 space-y-8">
                     <div className="bg-blue-600 p-8 rounded-[32px] text-white shadow-xl shadow-blue-100">
                        <div className="flex justify-between items-center mb-4">
                           <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Total Amount Due</span>
                           <Landmark size={20} className="opacity-60" />
                        </div>
                        <div className="flex items-baseline gap-2">
                           <span className="text-4xl font-black">MWK</span>
                           <span className="text-5xl font-black tracking-tighter">
                              {(() => {
                                 const s = shipmentsData.Active.find(s => s.id === activePaymentShipmentId);
                                 return s ? s.price : '---';
                              })()}
                           </span>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Select Payment Method</p>

                        <div className="grid grid-cols-2 gap-4">
                           <button
                              onClick={() => setPaymentMethod('BANK')}
                              className={`p-6 rounded-[32px] border-2 transition-all flex flex-col gap-3 items-start ${paymentMethod === 'BANK' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-blue-200'}`}
                           >
                              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'BANK' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                 <Landmark size={24} />
                              </div>
                              <span className={`text-sm font-black ${paymentMethod === 'BANK' ? 'text-blue-600' : 'text-slate-900'}`}>Bank Transfer</span>
                           </button>

                           <button
                              onClick={() => setPaymentMethod('MOBILE_MONEY')}
                              className={`p-6 rounded-[32px] border-2 transition-all flex flex-col gap-3 items-start ${paymentMethod === 'MOBILE_MONEY' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-blue-200'}`}
                           >
                              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'MOBILE_MONEY' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                 <Smartphone size={24} />
                              </div>
                              <span className={`text-sm font-black ${paymentMethod === 'MOBILE_MONEY' ? 'text-blue-600' : 'text-slate-900'}`}>Mobile Money</span>
                           </button>
                        </div>
                     </div>

                     <button
                        onClick={handleProcessPayment}
                        className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                     >
                        Process Payment <ArrowRight size={18} />
                     </button>
                  </div>

                  <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex justify-center">
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={14} className="text-green-500" />
                        Secure Escrow Payment System
                     </p>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ShipperDashboard;
