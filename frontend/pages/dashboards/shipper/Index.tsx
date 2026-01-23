
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../types';
import {
   LayoutGrid, Truck, Box, MessageSquare, Activity, FileText,
   Globe, UserCheck, Settings, LogOut, ChevronDown, Search,
   Bell, Plus, ArrowRight, Package, DollarSign, Clock,
   MapPin, Star, MoreHorizontal, User as UserIcon, Send,
   ShieldCheck, Filter, ShoppingCart, Wrench, HardHat, Zap, Shield, Gavel,
   ClipboardList, CheckCircle2, X, Trash2, CreditCard, Smartphone,
   ChevronRight, Paperclip, Mic, Image as ImageIcon, Lock, BarChart3, TrendingUp, Info,
   Award, Landmark, Menu, Tag, Briefcase, Loader2
} from 'lucide-react';
import { api } from '../../../services/api';
import ChatWidget from '../../../components/ChatWidget'; // Assuming exists
import { useToast } from '../../../components/ToastContext';
import { io } from 'socket.io-client';

import OverviewTab from './OverviewTab';
import LoadsTab from './LoadsTab';
import ShipmentsTab from './ShipmentsTab';
import MarketplaceTab from './MarketplaceTab';
import JobsTab from './JobsTab';
import MarketTab from '../../../components/MarketTab';
import MessageTab from './MessageTab';
import SettingsTab from './SettingsTab';
import VehicleSlider from '../../../components/VehicleSlider';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import PaymentSelectionModal from '../../../components/PaymentSelectionModal';
import PostShipmentModal from './PostShipmentModal';
import RatingModal from '../../../components/RatingModal';
import DirectHireModal from './DirectHireModal';

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
   const { addToast } = useToast();

   const [activeMenu, setActiveMenu] = useState('Overview');
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   // Filters & UI State
   const [marketFilter, setMarketFilter] = useState('Cargo');
   const [locationFilter, setLocationFilter] = useState('All');
   const [loadsSubTab, setLoadsSubTab] = useState<'Active' | 'History' | 'Rejected' | 'Completed'>('Active');
   const [activeChatId, setActiveChatId] = useState<number | null>(null);
   const [chatMessages, setChatMessages] = useState<any[]>([]);
   const [conversations, setConversations] = useState<any[]>([]);
   const [chatInput, setChatInput] = useState('');
   const [hiringUrgency, setHiringUrgency] = useState<Record<string, string>>({});
   const [hireDriverTab, setHireDriverTab] = useState<'requests' | 'find'>('requests');

   // Cart State
   const [cart, setCart] = useState<any[]>([]);
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
      quantity: '',
      images: [] as string[],
      price: '',
      priceOption: 'fixed' as 'fixed' | 'open',
      pickupType: 'Standard' as 'Standard' | 'Shop Pickup',
      orderRef: '',
      paymentTiming: 'Deposit' as 'Deposit' | 'Full on Delivery',
      pickupDate: new Date().toISOString().split('T')[0]
   });

   const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);
   const [selectedLoadForBids, setSelectedLoadForBids] = useState<any>(null);

   const [isDirectHireModalOpen, setIsDirectHireModalOpen] = useState(false);
   const [selectedDriverForHire, setSelectedDriverForHire] = useState<any>(null);

   // Payment Modal State
   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
   const [activePaymentShipmentId, setActivePaymentShipmentId] = useState<string | null>(null);

   // Rating Modal State
   const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
   const [activeRatingShipmentId, setActiveRatingShipmentId] = useState<string | null>(null);

   // Data State
   const [availableBids, setAvailableBids] = useState<any[]>([]);
   const [stats, setStats] = useState({
      totalShipments: 0,
      activeShipments: 0,
      totalSpend: 0,
      growth: 0
   });
   const [availableFleets, setAvailableFleets] = useState<any[]>([]);
   const [logisticsServices, setLogisticsServices] = useState<any[]>([]);
   const [marketProducts, setMarketProducts] = useState<any[]>([]);
   const [allAvailableJobs, setAllAvailableJobs] = useState<any[]>([]);
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
      (window as any).handlePayDeposit = handlePayDeposit;
      (window as any).handleOpenRating = handleOpenRating;
   }, [mobileMenuAction]);

   const handleAcceptJob = (item: any) => {
      if (item.provider === 'My Shipment') {
         setActiveMenu('Loads');
         addToast("Opening your loads to see bids.", 'info');
      } else {
         addToast("Interested in this load? Contact the shipper via messages.", 'info');
         setActiveMenu('Message');
      }
   };

   const loadData = async () => {
      try {
         // CRITICAL DATA: Load first to unblock UI
         const [statsData] = await Promise.all([
            api.getShipperStats().catch(e => { console.error("getShipperStats failed:", e); return { totalShipments: 0, activeShipments: 0, totalSpend: 0, growth: 0 }; }),
         ]);

         setIsLoading(false); // <--- HIDE SPINNER EARLY

         // NON-CRITICAL DATA: Load in background
         api.getLogisticsServices().then(setLogisticsServices).catch(() => { });
         api.getProducts().then(setMarketProducts).catch(() => { });
         api.getAvailableFleets().then(setAvailableFleets).catch(() => { });

         setStats(statsData);
      } catch (err) {
         console.error("Failed to load shipper data:", err);
         setIsLoading(false);
      }
   };

   useEffect(() => {
      loadData();

      // Socket.IO Integration
      const newSocket = io('http://localhost:5000');

      newSocket.on('connect', () => {
         console.log('Shipper Socket Connected:', newSocket.id);
         // Join private room for targeted updates
         newSocket.emit('join_room', user.id);
         // Initial data requests via socket
         newSocket.emit('request_market_data');
         newSocket.emit('request_shipper_shipments', user.id);
         newSocket.emit('request_shipper_bids', user.id);
      });

      newSocket.on('market_data_update', (data: any[]) => {
         console.log('Shipper Socket: Market data update', data?.length);
         if (data) {
            setAllAvailableJobs(data);
         }
      });

      newSocket.on('shipper_shipments_update', (loads: any[]) => {
         console.log('Shipper Socket: Private shipments update', loads?.length);
         if (loads) {
            const mappedLoads = loads.map((s: any) => ({
               ...s,
               details: s.order_ref
            }));

            setShipmentsData({
               Active: mappedLoads.filter((s: any) => ['Bidding Open', 'Finding Driver', 'Waiting for Driver Commitment', 'Pending Deposit', 'Active (Waiting Delivery)', 'In Transit', 'Delivered'].includes(s.status)),
               Rejected: mappedLoads.filter((s: any) => s.status === 'Rejected'),
               Completed: mappedLoads.filter((s: any) => s.status === 'Completed'),
               History: mappedLoads.filter((s: any) => s.status === 'Completed' || s.status === 'Delivered')
            });
         }
      });

      newSocket.on('shipper_bids_update', (bds: any[]) => {
         console.log('Shipper Socket: Private bids update', bds?.length);
         if (bds) {
            setAvailableBids(bds.map((b: any) => ({
               id: b.id,
               loadId: b.load_id,
               driver: b.driver_name,
               amount: `MWK ${parseFloat(b.amount).toLocaleString()}`,
               rating: b.driver_rating || 5.0,
               truck: b.vehicle_type || 'Truck',
               jobs: b.previous_jobs || 0,
               eta: '2h'
            })));
         }
      });

      return () => {
         newSocket.disconnect();
      };
   }, [user.id]);

   const menuSections = {
      MAIN: [
         { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Overview' },
         { id: 'Loads', icon: <Package size={20} />, label: 'Load Postings', badge: shipmentsData.Active.filter(s => s.status === 'Bidding Open' || s.status === 'Finding Driver' || !s.driver_id).length },
         { id: 'Jobs', icon: <Briefcase size={20} />, label: 'My Jobs' },
         { id: 'Shipments', icon: <Truck size={20} />, label: 'My Shipments', badge: shipmentsData.Active.filter(s => (s.driver_id || s.assigned_driver_id) && ['In Transit', 'Pending Deposit', 'Waiting for Driver Commitment', 'Active (Waiting Delivery)', 'Ready for Pickup'].includes(s.status)).length },
         { id: 'Marketplace', icon: <UserCheck size={20} />, label: 'Hire Drivers' },
         { id: 'Market', icon: <ShoppingCart size={20} />, label: 'KwikShop' },
      ],
      COMMUNICATION: [
         { id: 'Message', icon: <MessageSquare size={20} />, label: 'Messages', badge: conversations.length },
      ],
      OTHERS: [
         { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' },
         { id: 'Logout', icon: <LogOut size={20} />, label: 'Log out' },
      ]
   };

   const marketItems = useMemo(() => {
      // allAvailableJobs now contains everything from the centralized marketplace table
      // which has been mapped to the expected format by the backend socket
      return allAvailableJobs;
   }, [allAvailableJobs]);

   const addToCart = (item: typeof marketItems[0]) => {
      setCart(prev => {
         const existing = prev.find(i => i.id === item.id);
         if (existing) {
            addToast(`Updated quantity for ${item.name}`, 'info');
            return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
         }
         addToast(`${item.name} added to cart`, 'success');
         return [...prev, { ...item, quantity: 1 }];
      });
      setIsCartOpen(true);
   };

   const removeFromCart = (id: string) => {
      setCart(prev => prev.filter(i => i.id !== id));
      addToast("Item removed from cart");
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

   const handlePostShipment = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!newShipment.origin || !newShipment.destination || !newShipment.cargo || (!newShipment.weight && !newShipment.quantity)) {
         addToast("Please fill in required fields (at least weight or quantity).", 'error');
         return;
      }

      const payload = {
         shipperId: user.id,
         origin: newShipment.origin,
         destination: newShipment.destination,
         cargo: newShipment.cargo,
         weight: newShipment.weight,
         quantity: newShipment.quantity,
         images: newShipment.images,
         price: newShipment.priceOption === 'fixed' ? newShipment.price : 'Open Bid',
         priceOption: newShipment.priceOption,
         pickupType: newShipment.pickupType,
         orderRef: newShipment.orderRef,
         paymentTiming: newShipment.paymentTiming,
         pickupDate: newShipment.pickupDate,
         status: 'Bidding Open'
      };

      try {
         await api.postLoad(payload);
         addToast("New shipment posted successfully!", 'success');
         setNewShipment({
            origin: '',
            destination: '',
            cargo: '',
            weight: '',
            quantity: '',
            images: [],
            price: '',
            priceOption: 'fixed',
            pickupType: 'Standard',
            orderRef: '',
            paymentTiming: 'Deposit',
            pickupDate: new Date().toISOString().split('T')[0]
         });
         setIsPostModalOpen(false);
         setActiveMenu('Loads');
         loadData();
      } catch (error) {
         addToast("Failed to post shipment.", 'error');
      }
   };

   const handleAcceptBid = async (driverName: string, amount: string, bidId?: string, loadId?: string) => {
      const finalLoadId = loadId || selectedLoadForBids?.id;
      if (!finalLoadId || !bidId) {
         addToast("Missing bid or load information.", 'error');
         return;
      }

      try {
         await api.acceptBid(finalLoadId, bidId);
         addToast(`Bid of ${amount} accepted from ${driverName}!`, 'success');
         setIsBidsModalOpen(false);
         loadData();
      } catch (err) {
         addToast("Failed to accept bid.", 'error');
      }
   };

   const handlePayDeposit = (shipmentId: string) => {
      setActivePaymentShipmentId(shipmentId);
      setIsPaymentModalOpen(true);
   };

   const handleConfirmPayment = async (type: 'online' | 'physical' | 'later', details?: { phoneNumber: string, providerRefId: string }) => {
      if (!activePaymentShipmentId) return;

      try {
         if (type === 'online' && details) {
            const activeShipment = shipmentsData.Active.find(s => s.id === activePaymentShipmentId);
            const amountStr = activeShipment ? (activeShipment.price || '0').toString().replace(/[^0-9.]/g, '') : '0';
            const amount = parseFloat(amountStr);

            const res = await api.initiatePayment({
               rideId: activePaymentShipmentId,
               amount: amount,
               mobileNumber: details.phoneNumber,
               providerRefId: details.providerRefId
            });

            if (res.status === 'success' || res.charge_id) {
               addToast(`Payment initiated! Please check your phone (${details.phoneNumber}) to confirm.`, 'info');
            } else {
               addToast(`Payment failed: ${res.error || res.message || 'Unknown error'}`, 'error');
            }
         } else {
            addToast(`Payment via ${type} recorded. Waiting for verification.`, 'success');
         }

         setIsPaymentModalOpen(false);
         setActivePaymentShipmentId(null);
         loadData();
      } catch (err) {
         addToast("Payment operation failed.", 'error');
      }
   };

   // Triggered when user clicks "Hire" on a driver card
   const handleDirectHire = (driverName: string, driverId?: string) => {
      if (!driverId) {
         addToast("Cannot hire this driver directly.", 'error');
         return;
      }
      setSelectedDriverForHire({ id: driverId, name: driverName, vehicleType: 'Truck' });
      setIsDirectHireModalOpen(true);
   };

   const handleSubmitDirectHire = async (details: any) => {
      try {
         const payload = {
            shipperId: user.id,
            origin: details.origin,
            destination: details.destination,
            cargo: details.cargo,
            weight: details.weight,
            price: details.price,
            assigned_driver_id: details.driverId,
            status: 'Finding Driver', // Or 'Direct Request'
            pickupDate: details.pickupDate,
            details: details.details
         };

         await api.postLoad(payload);
         addToast(`Direct Request sent to ${details.driverName}!`, 'success');
         setIsDirectHireModalOpen(false);
         setActiveMenu('Loads');
         loadData();
      } catch (err) {
         addToast("Failed to send direct request.", 'error');
      }
   };

   const handleDebugDriverConfirm = async (shipmentId: string) => {
      try {
         await api.driverCommitToJob(shipmentId, 'COMMIT');
         addToast("Debug: Driver committed. Ready for deposit.", 'success');
         loadData();
      } catch (e) {
         addToast("Debug Action Failed", 'error');
      }
   };

   const handleBookService = async (service: any) => {
      try {
         const res = await api.bookService(service.id);
         if (res.success) {
            addToast(`Booking request sent to ${service.provider}! They will contact you shortly.`, 'success');
         } else {
            addToast("Failed to book service.", 'error');
         }
      } catch (e) {
         addToast("Failed to book service.", 'error');
      }
   };

   const handleOpenRating = (shipmentId: string) => {
      setActiveRatingShipmentId(shipmentId);
      setIsRatingModalOpen(true);
   };

   const handleSubmitRating = async (rating: number, comment: string) => {
      if (!activeRatingShipmentId) return;
      try {
         await api.rateDriver(activeRatingShipmentId, rating, comment);
         addToast("Rating submitted successfully!", 'success');
         loadData();
      } catch (err) {
         addToast("Failed to submit rating.", 'error');
         throw err;
      }
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

      // Simulation
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

   const handleCheckout = async () => {
      try {
         await api.purchaseProducts(cart);
         setCheckoutStep('success');
         setCart([]);
         loadData();
         addToast("Purchase successful! Transaction recorded.", 'success');
      } catch (e: any) {
         addToast(e.message || 'Checkout Failed. Please check your wallet balance.', 'error');
      }
   };

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] text-slate-400 gap-3">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <span className="font-bold text-sm tracking-widest uppercase">Loading Dashboard...</span>
         </div>
      );
   }

   const renderContent = () => {
      switch (activeMenu) {
         case 'Jobs':
            return (
               <JobsTab
                  shipments={shipmentsData.Active}
                  onAction={(id, action) => {
                     if (action === 'view') setActiveMenu('Shipments');
                  }}
               />
            );
         case 'Overview':
            return (
               <OverviewTab
                  shipmentsData={shipmentsData}
                  stats={stats}
                  user={user}
                  setIsPostModalOpen={setIsPostModalOpen}
                  handleDebugDriverConfirm={handleDebugDriverConfirm} // Keep for now, maybe hide in future
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
                  handleBookService={handleBookService}
                  hiringUrgency={hiringUrgency}
                  setHiringUrgency={setHiringUrgency}
                  handleDirectHire={handleDirectHire}
                  handleAcceptJob={handleAcceptJob}
                  userId={user.id}
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
                  conversations={conversations}
               />
            );
         case 'Settings':
            return (
               <SettingsTab user={user} />
            );
         default: return null;
      }
   };

   return (
      <div className="flex flex-col md:flex-row bg-[#F8F9FB] dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100 font-['Inter'] relative overflow-hidden transition-colors duration-200">

         {/* SIDEBAR NAVIGATION (Desktop) */}
         <Sidebar
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            menuSections={menuSections}
            user={user}
            onLogout={onLogout}
         />

         {/* MOBILE SIDEBAR (Drawer) */}
         <MobileSidebar
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            menuSections={menuSections}
            user={user}
            navigate={navigate}
            onLogout={onLogout}
         />

         {/* MAIN CONTENT AREA */}
         <main className="flex-grow min-w-0 flex flex-col p-4 md:p-10 lg:p-14 overflow-hidden md:pt-16">
            <div className="flex-grow pb-20 overflow-y-auto scrollbar-hide">
               {renderContent()}
            </div>
         </main>
         <ChatWidget user={user} />

         {/* MODALS */}

         <PaymentSelectionModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onSelectPayment={handleConfirmPayment}
            amount={(() => {
               const activeShipment = shipmentsData.Active.find(s => s.id === activePaymentShipmentId);
               return activeShipment ? parseFloat((activeShipment.price || '0').toString().replace(/[^0-9.]/g, '')) : 0;
            })()}
            rideDetails={(() => {
               const activeShipment = shipmentsData.Active.find(s => s.id === activePaymentShipmentId);
               return {
                  type: 'hire',
                  origin: activeShipment?.origin || activeShipment?.route?.split('→')[0]?.trim() || 'Unknown',
                  destination: activeShipment?.destination || activeShipment?.route?.split('→')[1]?.trim() || 'Unknown',
                  driverName: activeShipment?.assignedDriver || 'Assigned Driver'
               };
            })()}
         />

         <RatingModal
            isOpen={isRatingModalOpen}
            onClose={() => setIsRatingModalOpen(false)}
            onSubmit={handleSubmitRating}
            shipmentId={activeRatingShipmentId || ''}
         />

         <PostShipmentModal
            isOpen={isPostModalOpen}
            onClose={() => setIsPostModalOpen(false)}
            newShipment={newShipment}
            setNewShipment={setNewShipment}
            handlePostShipment={handlePostShipment}
         />

         <DirectHireModal
            isOpen={isDirectHireModalOpen}
            onClose={() => setIsDirectHireModalOpen(false)}
            driver={selectedDriverForHire}
            onSubmit={handleSubmitDirectHire}
         />

         {/* GLOBAL CART DRAWER */}
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
                                    <button onClick={handleCheckout} className="w-full flex items-center justify-between p-6 bg-white border-2 border-blue-600 rounded-[32px] shadow-xl group hover:-translate-y-1 transition-all">
                                       <div className="flex items-center gap-4">
                                          <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><CreditCard size={24} /></div>
                                          <div className="text-left">
                                             <p className="font-black text-slate-900 text-sm leading-none">KwikWallet Balance</p>
                                             <p className="text-[11px] font-bold text-blue-400 mt-1">Available: MWK {stats.totalSpend ? '...' : 'Checking...'}</p>
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
         )
         }

         {/* Bids Viewer Modal */}
         {
            isBidsModalOpen && selectedLoadForBids && (
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
                           {availableBids.length > 0 ? availableBids.map((bid) => (
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
                           )) : (
                              <div className="text-center py-10 opacity-50">
                                 <p className="font-bold text-slate-400">No bids yet for this load.</p>
                              </div>
                           )}
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
            )
         }

      </div>
   );
};

export default ShipperDashboard;
