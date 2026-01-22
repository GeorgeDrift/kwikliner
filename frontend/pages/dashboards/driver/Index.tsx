import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Vehicle } from '../../../types';
import {
   LayoutGrid, Briefcase, Tag, Navigation, MessageSquare, Plus,
   BarChart3, User as UserIcon, Settings, LogOut
} from 'lucide-react';
import { api } from '../../../services/api';
import ChatWidget from '../../../components/ChatWidget';

// Components
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import OverviewTab from './OverviewTab';
import BrowseJobsTab from './BrowseJobsTab';
import MarketTab from './MarketTab';
import MyTripsTab from './MyTripsTab';
import MessageTab from './MessageTab';
import PostListingTab from './PostListingTab';
import ReportTab from './ReportTab';
import AccountTab from './AccountTab';
import SettingsTab from './SettingsTab';
import WalletTab from './WalletTab';
import BidModal from './BidModal';
import CommitmentModal from './CommitmentModal';
import DirectRequestModal from './DirectRequestModal';
import WithdrawalModal from './WithdrawalModal';

interface DriverDashboardProps {
   user: User;
   onLogout: () => void;
   mobileMenuAction?: number;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, onLogout, mobileMenuAction }) => {
   const navigate = useNavigate();
   const [activeMenu, setActiveMenu] = useState('Overview');
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [activeQuarter, setActiveQuarter] = useState('Q4');
   const [jobsSubTab, setJobsSubTab] = useState<'Market' | 'Requests' | 'Proposed' | 'Rejected'>('Market');
   const [activeChatId, setActiveChatId] = useState<number | null>(null);

   // Negotiation / Bid Modals
   const [isBidModalOpen, setIsBidModalOpen] = useState(false);
   const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
   const [isDirectRequestModalOpen, setIsDirectRequestModalOpen] = useState(false);
   const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

   const [commitmentJob, setCommitmentJob] = useState<any>(null);
   const [selectedDirectRequestJob, setSelectedDirectRequestJob] = useState<any>(null);
   const [declineReason, setDeclineReason] = useState('');
   const [selectedJob, setSelectedJob] = useState<any>(null);
   const [bidAmount, setBidAmount] = useState('');

   const [jobs, setJobs] = useState<any[]>([]);
   const [wallet, setWallet] = useState<any>(null);
   const [transactions, setTransactions] = useState<any[]>([]);
   const [dbStats, setDbStats] = useState<any>(null);

   React.useEffect(() => {
      if (mobileMenuAction && mobileMenuAction > 0) {
         setIsMobileMenuOpen(true);
      }
   }, [mobileMenuAction]);

   const loadData = async () => {
      try {
         const [allJobs, allTrips, walletData, transData, fleetData, productsData, statsData] = await Promise.all([
            api.getAvailableJobs(),
            api.getDriverTrips(),
            api.getWallet(user.id),
            api.getWalletTransactions(user.id),
            api.getFleet(user.id),
            api.getProducts(),
            api.getDriverStats()
         ]);

         setDbStats(statsData);
         setWallet(statsData.wallet);
         setTransactions(Array.isArray(transData) ? transData : []);
         setFleet(Array.isArray(fleetData) ? fleetData : []);
         const cargoLoads = (Array.isArray(allJobs) ? allJobs : [])
            .filter((j: any) => j.status === 'Finding Driver' || j.status === 'Bidding Open')
            .map((j: any) => ({
               id: j.id,
               name: j.cargo || 'General Cargo',
               cat: 'Cargo',
               type: 'Cargo',
               price: parseFloat((j.price || '0').replace(/[^0-9.]/g, '')),
               priceStr: j.price || 'Open to Bids',
               img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
               location: j.route,
               provider: 'Verified Shipper',
               details: `Route: ${j.route} | Weight: ${j.weight || 'N/A'}`,
               weight: j.weight,
               date: j.created_at ? new Date(j.created_at).toLocaleDateString() : 'New Load'
            }));

         const hardwareProducts = (Array.isArray(productsData) ? productsData : []).map((p: any) => ({
            ...p,
            cat: p.category || 'Hardware',
            priceStr: p.price_str || `MWK ${parseFloat(p.price).toLocaleString()}`,
            location: 'KwikShop',
            provider: p.seller || 'Verified Seller'
         }));

         setMarketItems([...cargoLoads, ...hardwareProducts]);

         const combined = [...(Array.isArray(allJobs) ? allJobs : []), ...(Array.isArray(allTrips) ? allTrips : [])]
            .reduce((acc: any[], curr: any) => {
               if (!acc.find(x => x.id === curr.id)) acc.push(curr);
               return acc;
            }, []);

         setJobs(combined.map((d: any) => ({
            ...d,
            type: (d.bidder_ids && d.bidder_ids.includes(user.id)) ? 'Proposed' :
               (d.assigned_driver_id === user.id && d.status === 'Finding Driver') ? 'Requests' :
                  (d.status === 'Bidding Open' || d.status === 'Finding Driver') ? 'Market' :
                     (['Waiting for Driver Commitment', 'Pending Deposit', 'Active (Waiting Delivery)', 'In Transit'].includes(d.status)) ? 'Active' : 'History',
            bids: d.bids_count || d.bids || 0,
            date: d.created_at ? new Date(d.created_at).toLocaleDateString() : 'Just now'
         })));
      } catch (e) {
         console.warn("API Error", e);
      }
   };

   React.useEffect(() => {
      loadData();
      const interval = setInterval(loadData, 10000);
      return () => clearInterval(interval);
   }, [user.id]);

   const [chatMessages, setChatMessages] = useState<any[]>([]);
   const [chatInput, setChatInput] = useState('');

   // Editable Profile State
   const [isEditingAccount, setIsEditingAccount] = useState(false);
   const [profileData, setProfileData] = useState({
      name: user.name,
      phone: user.phone || 'N/A',
      email: user.email || 'N/A',
      hub: 'KwikLiner Network',
      company: user.companyName || 'Independent',
      idNumber: 'PENDING',
      payoutMethod: (user as any).primaryPayoutMethod || 'BANK',
      licenses: (user as any).licenses || []
   });

   const [fleet, setFleet] = useState<Vehicle[]>([]);

   const totalCapacity = fleet.reduce((acc, v) => {
      const size = parseInt(v.capacity);
      return isNaN(size) ? acc : acc + size;
   }, 0);

   const [newLicenseInput, setNewLicenseInput] = useState('');
   const [marketFilter, setMarketFilter] = useState('All');
   const [jobsLocationFilter, setJobsLocationFilter] = useState('All');

   const [marketItems, setMarketItems] = useState<any[]>([]);

   const [activeShippers, setActiveShippers] = useState<any[]>([]);

   // --- CART STATE ---
   const [cart, setCart] = useState<any[]>([]);
   const [isCartOpen, setIsCartOpen] = useState(false);
   const [isCheckingOut, setIsCheckingOut] = useState(false);
   const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment' | 'success'>('review');

   const addToCart = (item: any) => {
      setCart(prev => {
         const existing = prev.find((i: any) => i.id === item.id);
         if (existing) {
            return prev.map((i: any) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
         }
         return [...prev, { ...item, quantity: 1 }];
      });
      setIsCartOpen(true);
   };

   const removeFromCart = (id: string) => {
      setCart(prev => prev.filter((i: any) => i.id !== id));
   };

   const updateQuantity = (id: string, delta: number) => {
      setCart(prev => prev.map((i: any) => {
         if (i.id === id) {
            return { ...i, quantity: Math.max(1, i.quantity + delta) };
         }
         return i;
      }));
   };

   const cartTotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

   const handleCheckout = async () => {
      try {
         await api.purchaseProducts(cart);
         setCheckoutStep('success');
         setCart([]);
         loadData();
         alert("Purchase successful!");
      } catch (e: any) {
         alert(e.message || 'Checkout Failed. Check wallet balance.');
      }
   };


   const handleAcceptJob = async (jobId: string) => {
      try {
         const job = jobs.find(j => j.id === jobId);
         if (job) {
            if (job.status === 'Waiting for Driver Commitment') {
               setCommitmentJob(job);
               setIsCommitModalOpen(true);
               return;
            }

            if (job.status === 'Finding Driver' && (job.assigned_driver_id === user.id)) {
               // Direct Request: Open Negotiation Modal instead of auto-commit
               setSelectedDirectRequestJob(job);
               setIsDirectRequestModalOpen(true);
               return;
            }

            setSelectedJob(job);
            setIsBidModalOpen(true);
         }
      } catch (e) {
         alert('Failed to process job');
      }
   };

   const handleAcceptDirectRequest = async () => {
      if (!selectedDirectRequestJob) return;
      try {
         await api.driverCommitToJob(selectedDirectRequestJob.id, 'COMMIT');
         alert('Direct request accepted! Please confirm your commitment in the next step.');
         setIsDirectRequestModalOpen(false);
         setSelectedDirectRequestJob(null);
         loadData();
      } catch (err) {
         alert("Failed to accept request.");
      }
   };

   const handleNegotiateDirectRequest = async (amount: string) => {
      if (!selectedDirectRequestJob) return;
      try {
         await api.bidOnLoad(selectedDirectRequestJob.id, { amount: `MWK ${amount}` });
         alert('Counter-offer sent! Shipper will review your negotiated price.');
         setIsDirectRequestModalOpen(false);
         setSelectedDirectRequestJob(null);
         loadData();
      } catch (err) {
         alert("Failed to send negotiation.");
      }
   };

   const handleDriverCommit = async (decision: 'COMMIT' | 'DECLINE') => {
      if (!commitmentJob) return;
      try {
         await api.driverCommitToJob(commitmentJob.id, decision, declineReason);
         setIsCommitModalOpen(false);
         setCommitmentJob(null);
         setDeclineReason('');
         alert(decision === 'COMMIT' ? "Trip activated! You have committed to this job." : "Job declined.");
         loadData();
      } catch (err) {
         alert("Failed to process commitment.");
      }
   };

   const handleSubmitBid = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!bidAmount || !selectedJob) return;

      try {
         await api.bidOnLoad(selectedJob.id, { amount: `MWK ${bidAmount}` });
         setIsBidModalOpen(false);
         setBidAmount('');
         setJobsSubTab('Proposed');
         alert('Bid submitted successfully! The shipper will review your proposal.');
         loadData();
      } catch (e) {
         alert('Failed to submit bid.');
      }
   };

   const handleWithdraw = async (amount: number, method: string, details: any) => {
      try {
         await api.withdrawFunds(user.id, amount, method, {
            ...details,
            mobile: method === 'Mobile Money' ? details.number : undefined,
            account_number: method === 'Bank' ? details.number : undefined,
            account_name: details.name,
            bank_code: details.bank_code
         });
         alert('Withdrawal request submitted! Processing time: 2-24 hours.');
         loadData();
      } catch (err) {
         alert("Failed to process withdrawal.");
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

      // Mock auto-reply
      setTimeout(() => {
         const reply = {
            id: Date.now() + 1,
            sender: 'shipper',
            text: "Received! Let me review the manifest and get back to you.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         };
         setChatMessages(prev => [...prev, reply]);
      }, 1500);
   };

   const handlePostAvailability = async () => {
      try {
         const post = {
            driverName: user.name,
            vehicleType: fleet[0].model,
            capacity: fleet[0].capacity,
            route: 'Lilongwe Router',
            price: 'MWK 350,000',
            location: 'Lilongwe',
            images: [
               'C:/Users/Admin/.gemini/antigravity/brain/e30de761-41c6-41bc-91d1-fe430548a242/truck_exterior_1_1768577726403.png',
               'C:/Users/Admin/.gemini/antigravity/brain/e30de761-41c6-41bc-91d1-fe430548a242/truck_interior_2_1768577751662.png',
               'C:/Users/Admin/.gemini/antigravity/brain/e30de761-41c6-41bc-91d1-fe430548a242/truck_cargo_3_1768577778905.png'
            ]
         };
         await api.postVehicleAvailability(post);
         alert('Availability published! Shippers can now find and hire you directly.');
         setActiveMenu('Overview');
      } catch (e) {
         alert('Failed to publish availability');
      }
   };

   const menuSections = {
      MAIN_MENU: [
         { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Overview' },
         { id: 'BrowseJobs', icon: <Briefcase size={20} />, label: 'Browse Jobs' },
         { id: 'Market', icon: <Tag size={20} />, label: 'Kwik Shop' },
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

   // Helper to parse price strings
   const parsePrice = (priceStr: string) => {
      if (priceStr === 'Open Bid') return 0;
      const numeric = priceStr.replace(/[^0-9.]/g, '');
      const value = parseFloat(numeric);
      if (priceStr.includes('USD')) return value * 1000;
      return value;
   };

   // Derive Top 5 Highest Paying Trips
   const topTrips = [...jobs]
      .sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
      .slice(0, 5);

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

   const revenueData = useMemo(() => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = new Date().getFullYear();

      const grouped = transactions.reduce((acc: any, t: any) => {
         const d = new Date(t.created_at);
         if (d.getFullYear() === currentYear) {
            const m = months[d.getMonth()];
            acc[m] = (acc[m] || 0) + parseFloat(t.net_amount || 0);
         }
         return acc;
      }, {});

      const max = Math.max(...Object.values(grouped) as number[], 1);

      return months.map(m => {
         const val = grouped[m] || 0;
         return {
            month: m,
            value: (val / max) * 100,
            amt: val > 1000 ? `${(val / 1000).toFixed(1)}K` : val.toString()
         };
      });
   }, [transactions]);

   const activeRevenueData = revenueCycle === 'H1' ? revenueData.slice(0, 6) : revenueData.slice(6, 12);

   const renderContent = () => {
      switch (activeMenu) {
         case 'Overview':
            return (
               <OverviewTab
                  profileData={profileData}
                  wallet={wallet}
                  revenueCycle={revenueCycle}
                  setRevenueCycle={setRevenueCycle}
                  activeRevenueData={activeRevenueData}
                  totalCapacity={dbStats?.fleet?.capacity || 0}
                  fleet={fleet}
                  setActiveMenu={setActiveMenu}
                  topTrips={topTrips}
                  jobsCount={dbStats?.marketJobs || 0}
                  totalOrders={dbStats?.totalOrders || 0}
               />
            );
         case 'Report':
            return <ReportTab activeQuarter={activeQuarter} setActiveQuarter={setActiveQuarter} transactions={transactions} />;
         case 'Account':
            return (
               <AccountTab
                  isEditingAccount={isEditingAccount}
                  setIsEditingAccount={setIsEditingAccount}
                  profileData={profileData}
                  setProfileData={setProfileData}
                  removeLicense={removeLicense}
                  addLicense={addLicense}
                  newLicenseInput={newLicenseInput}
                  setNewLicenseInput={setNewLicenseInput}
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
                  activeShippers={activeShippers}
               />
            );
         case 'BrowseJobs':
            return (
               <BrowseJobsTab
                  jobs={jobs}
                  marketItems={marketItems}
                  jobsSubTab={jobsSubTab}
                  setJobsSubTab={setJobsSubTab}
                  jobsLocationFilter={jobsLocationFilter}
                  setJobsLocationFilter={setJobsLocationFilter}
                  handleAcceptJob={handleAcceptJob}
                  setSelectedJob={setSelectedJob}
                  setIsBidModalOpen={setIsBidModalOpen}
               />
            );
         case 'MyTrips':
            return <MyTripsTab jobs={jobs} handleAcceptJob={handleAcceptJob} loadData={loadData} />;
         case 'Market':
            return (
               <MarketTab
                  marketFilter={marketFilter}
                  setMarketFilter={setMarketFilter}
                  marketItems={marketItems}
                  handleAcceptJob={handleAcceptJob}
                  setSelectedJob={setSelectedJob}
                  setIsBidModalOpen={setIsBidModalOpen}
               />
            );
         case 'PostListing':
            return <PostListingTab handlePostAvailability={handlePostAvailability} />;
         case 'Wallet':
            return <WalletTab wallet={wallet} transactions={transactions} onWithdraw={() => setIsWithdrawModalOpen(true)} />;
         case 'Settings':
            return <SettingsTab />;
         default:
            return null;
      }
   };

   return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-200">
         {/* Sidebar */}
         <Sidebar
            user={user}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            menuSections={menuSections as any}
            onLogout={onLogout}
         />

         {/* Mobile Sidebar */}
         <MobileSidebar
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            user={user}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            menuSections={menuSections as any}
            onLogout={onLogout}
         />

         {/* Main Content */}
         <main className="flex-grow min-w-0 flex flex-col p-4 md:p-10 lg:p-14 overflow-hidden md:pt-16">
            <div className="flex-grow pb-20 overflow-y-auto scrollbar-hide">
               {renderContent()}
            </div>

            <BidModal
               isOpen={isBidModalOpen}
               onClose={() => setIsBidModalOpen(false)}
               selectedJob={selectedJob}
               bidAmount={bidAmount}
               setBidAmount={setBidAmount}
               handleSubmitBid={handleSubmitBid}
            />

            <DirectRequestModal
               isOpen={isDirectRequestModalOpen}
               onClose={() => setIsDirectRequestModalOpen(false)}
               job={selectedDirectRequestJob}
               onAccept={handleAcceptDirectRequest}
               onNegotiate={handleNegotiateDirectRequest}
            />

            <WithdrawalModal
               isOpen={isWithdrawModalOpen}
               onClose={() => setIsWithdrawModalOpen(false)}
               walletBalance={wallet?.balance || 0}
               onWithdraw={handleWithdraw}
            />

            <CommitmentModal
               isOpen={isCommitModalOpen}
               onClose={() => setIsCommitModalOpen(false)}
               commitmentJob={commitmentJob}
               handleDriverCommit={handleDriverCommit}
               declineReason={declineReason}
               setDeclineReason={setDeclineReason}
            />

            <ChatWidget user={user} />

            {/* GLOBAL CART DRAWER */}
            {isCartOpen && (
               <div className="fixed inset-0 z-[200] flex justify-end">
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); }}></div>
                  <div className="w-full sm:max-w-md bg-white h-screen shadow-2xl relative z-10 flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
                     <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                           {/* Using Simple Text if Icon not imported, or assume imported */}
                           Your KwikCart
                        </h2>
                        <button onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); }} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all">
                           X
                        </button>
                     </div>

                     {!isCheckingOut ? (
                        <div className="flex-grow flex flex-col overflow-hidden">
                           <div className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
                              {cart.length === 0 ? (
                                 <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                                    <p className="font-black uppercase tracking-widest text-xs">Your cart is empty</p>
                                 </div>
                              ) : (
                                 cart.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 group">
                                       <div className="h-24 w-24 rounded-2xl bg-slate-50 overflow-hidden shrink-0">
                                          <img src={item.img || item.image} className="w-full h-full object-cover" alt={item.name} />
                                       </div>
                                       <div className="flex-grow">
                                          <div className="flex justify-between items-start">
                                             <h4 className="font-black text-slate-900 text-sm">{item.name}</h4>
                                             <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">Del</button>
                                          </div>
                                          <p className="text-blue-600 font-black text-sm mt-1">{item.priceStr || `MWK ${item.price}`}</p>
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
                                          {cart.map((item: any) => (
                                             <div key={item.id} className="flex justify-between text-sm">
                                                <span className="font-bold text-slate-700">{item.name} (x{item.quantity})</span>
                                                <span className="font-black text-slate-900">MWK {(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
                                             </div>
                                          ))}
                                          <div className="h-px bg-slate-200 my-4"></div>
                                          <div className="flex justify-between text-xl pt-4">
                                             <span className="font-black text-slate-900">Total</span>
                                             <span className="font-black text-blue-600">MWK {cartTotal.toLocaleString()}</span>
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
                                             <div className="text-left">
                                                <p className="font-black text-slate-900 text-sm leading-none">KwikWallet Balance</p>
                                                <p className="text-[11px] font-bold text-blue-400 mt-1">Available: MWK {wallet?.balance ? parseFloat(wallet.balance).toLocaleString() : '...'}</p>
                                             </div>
                                          </div>
                                       </button>
                                    </div>
                                    <button onClick={() => setCheckoutStep('review')} className="w-full py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition-colors">Go Back</button>
                                 </div>
                              )}
                              {checkoutStep === 'success' && (
                                 <div className="space-y-10 animate-in zoom-in-95 duration-500 text-center flex flex-col items-center py-20">
                                    <div>
                                       <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Payment Confirmed</h3>
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
         </main>
      </div>
   );
};

export default DriverDashboard;
