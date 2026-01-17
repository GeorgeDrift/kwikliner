
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
   CheckCircle2, MapPin, X, Landmark, Smartphone, Info, ChevronRight, Clock, Menu, Award, Filter,
   Zap, ArrowRight, Tag, CreditCard, PieChart
} from 'lucide-react';
import { api } from '../../services/api';
import ChatWidget from '../../components/ChatWidget';

const fileToBase64 = (file: File): Promise<string> => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
   });
};

interface DriverDashboardProps {
   user: User;
   onLogout: () => void;
   mobileMenuAction?: number;
}

const getSmoothPath = (points: { x: number; y: number }[]) => {
   if (points.length === 0) return '';
   let d = `M ${points[0].x} ${points[0].y}`;
   for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[0];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i !== points.length - 2 ? points[i + 2] : p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
   }
   return d;
};

const VehicleSlider: React.FC<{ images: string[] }> = ({ images }) => {
   const [currentIndex, setCurrentIndex] = useState(0);

   React.useEffect(() => {
      const timer = setInterval(() => {
         setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(timer);
   }, [images.length]);

   return (
      <div className="relative w-full h-full overflow-hidden">
         {images.map((img, idx) => (
            <img
               key={idx}
               src={img}
               className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 scale-110 translate-x-0' : 'opacity-0 scale-100'
                  }`}
               style={{
                  transition: 'opacity 1s ease-in-out, transform 5s linear'
               }}
               alt="vehicle"
            />
         ))}
         <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
               <div
                  key={idx}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/40'
                     }`}
               />
            ))}
         </div>
      </div>
   );
};

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, onLogout, mobileMenuAction }) => {
   const navigate = useNavigate();
   const [activeMenu, setActiveMenu] = useState('Overview');
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [activeQuarter, setActiveQuarter] = useState('Q4');
   const [hireDriverTab, setHireDriverTab] = useState<'requests' | 'find'>('requests');
   const [jobsSubTab, setJobsSubTab] = useState<'Market' | 'Requests' | 'Proposed' | 'Rejected'>('Market');
   const [activeChatId, setActiveChatId] = useState<number | null>(null);
   const [statsTimePeriod, setStatsTimePeriod] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
   const [isBidModalOpen, setIsBidModalOpen] = useState(false);
   const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
   const [commitmentJob, setCommitmentJob] = useState<any>(null);
   const [declineReason, setDeclineReason] = useState('');
   const [selectedJob, setSelectedJob] = useState<any>(null);
   const [bidAmount, setBidAmount] = useState('');

   const [jobs, setJobs] = useState<any[]>([]);

   React.useEffect(() => {
      if (mobileMenuAction && mobileMenuAction > 0) {
         setIsMobileMenuOpen(true);
      }
   }, [mobileMenuAction]);

   const loadData = async () => {
      try {
         const [allJobs, allTrips, walletData, transData] = await Promise.all([
            api.getAvailableJobs(),
            api.getDriverTrips(),
            api.getWallet(user.id),
            api.getWalletTransactions(user.id)
         ]);

         setWallet(walletData);
         setTransactions(Array.isArray(transData) ? transData : []);

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

   const [wallet, setWallet] = useState<any>(null);
   const [transactions, setTransactions] = useState<any[]>([]);

   const [chatMessages, setChatMessages] = useState<any[]>([
      { id: 1, sender: 'shipper', text: "Is the 20T truck available for tomorrow's route to Blantyre?", time: '07:03 PM' },
      { id: 2, sender: 'me', text: "Yes, I am available. Please send the manifest details through the direct request tab.", time: '07:05 PM' }
   ]);
   const [chatInput, setChatInput] = useState('');

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

   const [marketFilter, setMarketFilter] = useState('All');
   const [locationFilter, setLocationFilter] = useState('All');
   const [jobsLocationFilter, setJobsLocationFilter] = useState('All');

   const marketItems = [
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
      { id: 'l1', name: 'Fertilizer - 25T Bulk', cat: 'Cargo', type: 'Cargo', price: 0, priceStr: 'MWK 400k', pricingType: 'Direct', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400', location: 'Lilongwe → Blantyre', provider: 'AgriCorp Malawi', details: 'Needs flatbed, 3-day delivery', weight: '25 Tons' },
      { id: 'l2', name: 'Cement & Steel Rods', cat: 'Cargo', type: 'Cargo', price: 0, priceStr: 'Open to Bids', pricingType: 'Bid', img: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=400', location: 'Mzuzu → Zomba', provider: 'BuildMart Ltd', details: 'Construction materials', weight: '18 Tons' },
      { id: 'p1', name: 'High-Performance GPS', cat: 'Equipment', type: 'Hardware', price: 45000, priceStr: 'MWK 45,000', img: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=400', location: 'Lilongwe', provider: 'TechHub MW', details: 'Real-time tracking device' },
   ];

   const activeShippers = [
      { name: 'Darrell Steward', company: 'Lyoto', role: 'Manager', phone: '(+886)923456', img: 'Darrell' },
      { name: 'Musa Banda', company: 'Agri-Chem', role: 'Dispatcher', phone: '(+265)88123', img: 'Musa' },
      { name: 'Jane Phiri', company: 'GreenValley', role: 'Logistics', phone: '(+265)99144', img: 'Jane' }
   ];

   /* 
   const [jobs, setJobs] = useState([
     // ... (Old hardcoded jobs removed/commented)
   ]);
   */

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
               await api.driverCommitToJob(jobId, 'COMMIT');
               alert('Direct request accepted! Please confirm your commitment.');
               loadData();
               return;
            }

            setSelectedJob(job);
            setIsBidModalOpen(true);
         }
      } catch (e) {
         alert('Failed to process job');
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

   // Helper to parse price strings like "MWK 450,000" or "USD 900" into numbers
   const parsePrice = (priceStr: string) => {
      if (priceStr === 'Open Bid') return 0;
      const numeric = priceStr.replace(/[^0-9.]/g, '');
      const value = parseFloat(numeric);
      if (priceStr.includes('USD')) return value * 1000; // Mock conversion for sorting
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 sm:mb-10">
                     <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight text-[28px] sm:text-[40px] whitespace-nowrap">Shipment Track</h2>
                        <div className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[10px] font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-all shrink-0">
                           Status <ChevronDown size={12} />
                        </div>
                     </div>
                     <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                        <div className="flex items-center gap-4 sm:gap-6">
                           <button className="text-slate-400 hover:text-blue-600 transition-colors"><Search size={18} /></button>
                           <button className="text-slate-400 hover:text-blue-600 transition-colors relative">
                              <Bell size={18} />
                              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                           </button>
                        </div>
                        <div className="hidden sm:block h-8 w-px bg-slate-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                           <div className="text-right">
                              <p className="text-xs font-black text-slate-900 leading-none">{profileData.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-1">Driver Profile</p>
                           </div>
                           <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shadow-sm">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`} alt="pfp" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                     <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Orders</p>
                              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">155</h3>
                           </div>
                           <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                              <Box size={20} />
                           </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[10px] font-black text-green-500 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                              <TrendingUp size={10} /> +30%
                           </span>
                           <span className="text-[9px] font-bold text-slate-400">vs last month</span>
                        </div>
                        <div className="h-12 w-full flex items-end gap-1.5 pt-1">
                           {[30, 45, 25, 60, 40, 70, 35, 80, 55, 90, 45, 65].map((h, i) => (
                              <div key={i} className={`flex-1 ${i === 8 ? 'bg-blue-600' : 'bg-blue-50 group-hover:bg-blue-100'} rounded-t-sm sm:rounded-t-md transition-all`} style={{ height: `${h}%` }}></div>
                           ))}
                        </div>
                     </div>
                     <div
                        onClick={() => setActiveMenu('Wallet')}
                        className="col-span-1 md:col-span-1 lg:col-span-4 bg-slate-900 p-5 rounded-[24px] text-white shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all cursor-pointer"
                     >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="relative z-10 flex justify-between items-start mb-2">
                           <div>
                              <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Wallet Balance</p>
                              <h3 className="text-2xl sm:text-3xl font-black text-white">{wallet?.currency || 'MWK'} {wallet?.balance?.toLocaleString() || '0.00'}</h3>
                           </div>
                           <div className="flex flex-col items-end gap-2">
                              <div className="bg-white/10 p-1 rounded-lg flex gap-1">
                                 <button
                                    onClick={(e) => { e.stopPropagation(); setRevenueCycle('H1'); }}
                                    className={`px-2 py-1 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all ${revenueCycle === 'H1' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                 >
                                    H1
                                 </button>
                                 <button
                                    onClick={(e) => { e.stopPropagation(); setRevenueCycle('H2'); }}
                                    className={`px-2 py-1 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all ${revenueCycle === 'H2' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                 >
                                    H2
                                 </button>
                              </div>
                           </div>
                        </div>
                        <div className="relative z-10 h-12 w-full flex items-end gap-1.5 sm:gap-2 pt-1">
                           {activeRevenueData.map((d, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-2 relative group/bar">
                                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white/10 px-1.5 py-0.5 rounded text-[8px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                    {d.amt}
                                 </div>
                                 <div className={`w-full ${i === activeRevenueData.length - 1 ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-white/10'} rounded-t-md transition-all hover:bg-white/20`} style={{ height: `${d.value}%` }}></div>
                                 <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-tighter">{d.month}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Fleet Capacity</p>
                              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{totalCapacity}T</h3>
                           </div>
                           <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                              <Truck size={20} />
                           </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[9px] sm:text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                              Vehicles: {fleet.length} Registered
                           </span>
                        </div>
                        <div className="h-12 w-full flex items-end justify-between pt-1">
                           {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
                              <div key={i} className={`w-4 sm:w-6 rounded-lg ${i === 3 ? 'bg-indigo-600' : 'bg-indigo-50 group-hover:bg-indigo-100'} transition-all`} style={{ height: `${h}%` }}></div>
                           ))}
                        </div>
                     </div>

                     <div
                        onClick={() => setActiveMenu('BrowseJobs')}
                        className="col-span-1 md:col-span-2 lg:col-span-12 bg-blue-600 p-5 rounded-[24px] text-white shadow-2xl relative overflow-hidden group hover:scale-[1.01] transition-all cursor-pointer"
                     >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                           <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-white/20 backdrop-blur-md rounded-[16px] sm:rounded-[20px] flex items-center justify-center text-white shrink-0 group-hover:rotate-12 transition-transform">
                                 <Plus size={24} className="sm:size-[32px]" />
                              </div>
                              <div>
                                 <h3 className="text-xl sm:text-3xl font-black tracking-tighter mb-1">20 New Job Requests</h3>
                                 <p className="text-blue-100 font-bold text-[10px] sm:text-base opacity-80">Shippers are looking for your capacity. Act now to earn more.</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3 sm:gap-4 bg-white text-blue-600 px-5 sm:px-6 py-3 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest shadow-xl group-hover:translate-x-2 transition-transform w-full sm:w-auto justify-center">
                              Explore Jobs <ChevronRight size={16} />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                     <div className="col-span-1 md:col-span-1 lg:col-span-6 bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-[10px] sm:text-[11px] font-black text-slate-900 uppercase tracking-widest">Top 5 Highest Paying Trips</h3>
                           <TrendingUp size={16} className="text-blue-500" />
                        </div>
                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                           {topTrips.map((trip, idx) => (
                              <div key={idx} className="p-4 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100 flex items-center gap-4 sm:gap-5 group hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                                 <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100 text-blue-600 group-hover:scale-110 transition-transform shrink-0">
                                    <DollarSign size={20} />
                                 </div>
                                 <div className="min-w-0 flex-grow">
                                    <div className="flex justify-between items-start gap-2">
                                       <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate">{trip.route}</h4>
                                       <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 sm:py-1 rounded-lg shrink-0">{trip.price}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 sm:mt-2 uppercase tracking-wider truncate">{trip.shipper} • {trip.cargo}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="col-span-1 md:col-span-1 lg:col-span-6 bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600" className="w-36 h-24 sm:w-48 sm:h-32 object-contain rounded-2xl mb-6" alt="Truck" />
                        <h4 className="text-lg sm:text-xl font-black text-slate-900">Current Assigned Fleet</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">WYC-2234 • 30T Flatbed</p>
                     </div>
                  </div>
               </div>
            );
         case 'Report':
            // Driver specific data structure matching the Shipper Analytics design
            const quarterData: any = {
               'Q1': {
                  earnings: 'MWK 1.2M', earningsChange: '+8%',
                  trips: '45 Trips', tripsChange: '+5 trips',
                  rating: '4.8', ratingLabel: 'Excellent',
                  graph: { current: [30, 45, 40, 55, 52, 65, 58], labels: ['Jan', 'Feb', 'Mar'] }
               },
               'Q2': {
                  earnings: 'MWK 1.5M', earningsChange: '+12%',
                  trips: '52 Trips', tripsChange: '+7 trips',
                  rating: '4.9', ratingLabel: 'Outstanding',
                  graph: { current: [50, 58, 55, 68, 62, 78, 72], labels: ['Apr', 'May', 'Jun'] }
               },
               'Q3': {
                  earnings: 'MWK 1.8M', earningsChange: '+15%',
                  trips: '60 Trips', tripsChange: '+8 trips',
                  rating: '4.9', ratingLabel: 'Elite',
                  graph: { current: [65, 72, 70, 85, 78, 92, 85], labels: ['Jul', 'Aug', 'Sep'] }
               },
               'Q4': {
                  earnings: 'MWK 2.1M', earningsChange: '+18%',
                  trips: '68 Trips', tripsChange: '+10 trips',
                  rating: '5.0', ratingLabel: 'Top Rated',
                  graph: { current: [45, 52, 38, 65, 48, 80, 70, 90, 85, 95, 88, 100], labels: ['Oct', 'Nov', 'Dec'] }
               }
            };

            const activeStats = quarterData[activeQuarter];
            const activeData = activeStats.graph;
            const minVal = Math.min(...activeData.current);
            const maxVal = Math.max(...activeData.current);
            const range = maxVal - minVal || 1;

            const createPoints = (data: number[]) => data.map((val, i) => ({
               x: (i / (data.length - 1)) * 100,
               y: 100 - (((val - minVal) / range) * 80 + 10)
            }));

            const aPoints = createPoints(activeData.current);
            const aPathData = getSmoothPath(aPoints);
            const aAreaPathData = `${aPathData} L 100 100 L 0 100 Z`;

            return (
               <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-700">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 mb-4">
                     <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tighter">Performance Analytics</h3>
                        <p className="text-slate-500 font-medium text-xs">Track your earnings, trips, and driver rating.</p>
                     </div>
                     <div className="bg-white/50 backdrop-blur-md p-0.5 rounded-xl border border-white shadow-sm flex gap-1">
                        {['Q1', 'Q2', 'Q3', 'Q4'].map(t => (
                           <button
                              key={t}
                              onClick={() => setActiveQuarter(t)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeQuarter === t ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-400 hover:text-slate-900 hover:bg-white/80'}`}
                           >
                              {t}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                     <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm transition-all hover:border-blue-200 group flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              <DollarSign size={16} />
                           </div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Earnings</p>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{activeStats.earnings}</h4>
                        <span className="text-[10px] font-bold text-blue-600">{activeStats.earningsChange} vs last {activeQuarter === 'Q1' ? 'Year' : 'Quarter'}</span>
                     </div>

                     <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm transition-all hover:border-emerald-200 group flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Navigation size={16} />
                           </div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trips Completed</p>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{activeStats.trips}</h4>
                        <span className="text-[10px] font-bold text-emerald-600">{activeStats.tripsChange} efficiency</span>
                     </div>

                     <div className="bg-slate-900 p-4 rounded-[24px] text-white shadow-lg group overflow-hidden relative flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-6 -mt-6 blur-lg"></div>
                        <div className="relative z-10">
                           <div className="flex items-center gap-3 mb-2">
                              <div className="h-8 w-8 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                                 <Star size={16} className="text-amber-400" fill="currentColor" />
                              </div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Driver Rating</p>
                           </div>
                           <h4 className="text-2xl font-black tracking-tight">{activeStats.rating}</h4>
                           <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                              {activeStats.ratingLabel} <Award size={10} />
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="col-span-12 xl:col-span-8 bg-slate-900 p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[320px] sm:h-[340px]">
                     <div className="flex justify-between items-center mb-4 sm:mb-2 text-white">
                        <div>
                           <h4 className="text-sm font-black tracking-tight">Earnings Trend (MWK)</h4>
                        </div>
                        <button className="text-slate-400 hover:text-white transition-colors">
                           <MoreHorizontal size={16} />
                        </button>
                     </div>

                     {/* Graph Container with Grid Background */}
                     <div className="relative flex-grow min-h-[160px] w-full mt-4 mb-2">
                        {/* Grid Background Pattern */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{
                           backgroundImage: `
                               linear-gradient(to right, rgba(71, 85, 105, 0.1) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(71, 85, 105, 0.1) 1px, transparent 1px)
                           `,
                           backgroundSize: '40px 30px'
                        }}></div>

                        <div className="relative h-full w-full">
                           {/* High-end Area Chart */}
                           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" width="100%" height="100%">
                              <defs>
                                 <linearGradient id="driverGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                 </linearGradient>
                              </defs>

                              {/* Main Area Fill */}
                              <path d={aAreaPathData} fill="url(#driverGradient)" />

                              {/* Main Line Stroke */}
                              <path
                                 d={aPathData}
                                 fill="none"
                                 stroke="#3B82F6"
                                 strokeWidth="3"
                                 vectorEffect="non-scaling-stroke"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                              />

                              {/* Interactive Points */}
                              {aPoints.map((p, i) => (
                                 <circle
                                    key={i}
                                    cx={p.x}
                                    cy={p.y}
                                    r="2.5"
                                    className="fill-blue-600 stroke-white stroke-[1px] hover:r-4 transition-all"
                                    vectorEffect="non-scaling-stroke"
                                 />
                              ))}
                           </svg>
                        </div>
                     </div>

                     {/* X-Axis Labels */}
                     <div className="flex justify-between items-center px-2 mt-2">
                        {activeData.labels.map((label, i) => (
                           <span key={i} className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
                        ))}
                     </div>

                     {/* Bottom Info Bar */}
                     <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800/50">
                        <div className="flex items-center gap-2">
                           <div className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                           <span className="text-[10px] font-bold text-slate-300">Revenue Flow</span>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
                           <Filter size={12} />
                           <span className="text-[9px] font-black uppercase tracking-widest">Options</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-100 flex items-center gap-4">
                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                           <TrendingUp className="text-blue-600" size={18} />
                        </div>
                        <div>
                           <h5 className="text-sm font-black text-slate-900">Performance</h5>
                           <p className="text-slate-500 text-[10px] font-medium leading-tight">Earnings up <span className="text-blue-600 font-black">24%</span>.</p>
                        </div>
                     </div>
                     <div className="bg-blue-600 p-4 rounded-[24px] text-white flex items-center gap-4 shadow-lg shadow-blue-100">
                        <div className="h-10 w-10 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center shrink-0">
                           <Info className="text-white" size={18} />
                        </div>
                        <div>
                           <h5 className="text-sm font-black">Pro Tip</h5>
                           <p className="text-blue-100 text-[10px] font-medium leading-tight opacity-90">Accepting return trips increases revenue by <span className="text-white font-black underline">30%</span>.</p>
                        </div>
                     </div>
                  </div>
               </div>
            );

         case 'Account':
            return (
               <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                     <div>
                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">Driver Identity</h3>
                        <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">Manage your professional credentials and payout settings.</p>
                     </div>
                     {!isEditingAccount ? (
                        <button
                           onClick={() => setIsEditingAccount(true)}
                           className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                        >
                           <Pencil size={16} /> Edit Profile
                        </button>
                     ) : (
                        <button
                           onClick={() => setIsEditingAccount(false)}
                           className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
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
               <div className="flex flex-col md:flex-row h-[calc(100vh-10rem)] bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in duration-500 relative">
                  {/* Conversations Sidebar */}
                  <div className={`${activeChatId !== null ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] lg:w-[400px] border-r border-slate-100 flex-col shrink-0 bg-white`}>
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
                  <div className={`${activeChatId === null ? 'hidden md:flex' : 'flex'} flex-grow flex-col bg-[#F0F2F5] relative overflow-hidden`}>
                     {activeChatId !== null && (
                        <div className="md:hidden absolute top-4 left-4 z-50">
                           <button
                              onClick={() => setActiveChatId(null)}
                              className="h-10 w-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-600 shadow-lg"
                           >
                              <ChevronRight size={24} className="rotate-180" />
                           </button>
                        </div>
                     )}
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
                              {chatMessages.map((msg) => (
                                 <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`${msg.sender === 'me' ? 'bg-blue-600 text-white shadow-md rounded-tr-none' : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'} p-4 rounded-2xl text-[13px] font-medium max-w-[70%]`}>
                                       {msg.text}
                                       <div className="flex justify-end items-center gap-1 mt-2">
                                          <p className={`text-[9px] font-bold uppercase ${msg.sender === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time}</p>
                                          {msg.sender === 'me' && <CheckCircle2 size={12} className="text-blue-300" />}
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <form onSubmit={handleSendChatMessage} className="bg-[#F0F2F5] px-6 py-4 flex items-center gap-4 shrink-0">
                              <button type="button" className="text-slate-500 hover:text-blue-600"><Paperclip size={20} /></button>
                              <div className="flex-grow bg-white rounded-xl flex items-center px-4 py-2 border border-slate-200 shadow-sm">
                                 <input
                                    className="w-full bg-transparent text-sm font-semibold outline-none py-1.5 text-slate-800 placeholder:text-slate-300"
                                    placeholder="Type a message..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                 />
                              </div>
                              <button type="submit" disabled={!chatInput.trim()} className="h-11 w-11 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"><Send size={18} /></button>
                           </form>
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
                     <div className="p-4 sm:p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-6 bg-slate-50/30">
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide">
                           <button onClick={() => setJobsSubTab('Market')} className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Market' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100'}`}>Marketplace</button>
                           <button onClick={() => setJobsSubTab('Proposed')} className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Proposed' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100'}`}>My Proposals</button>
                           <button onClick={() => setJobsSubTab('Requests')} className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Requests' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100'}`}>Direct Requests ({jobs.filter(j => j.type === 'Requests').length})</button>
                           <button onClick={() => setJobsSubTab('Rejected')} className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Rejected' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100'}`}>Rejected</button>
                        </div>

                        {jobsSubTab === 'Market' && (
                           <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-100">
                              <MapPin size={14} className="text-slate-400 ml-2" />
                              {['All', 'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba'].map(loc => (
                                 <button
                                    key={loc}
                                    onClick={() => setJobsLocationFilter(loc)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${jobsLocationFilter === loc ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
                                 >
                                    {loc}
                                 </button>
                              ))}
                           </div>
                        )}
                     </div>

                     <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* If Marketplace, show synchronized Cargo from marketItems, else use jobs state */}
                        {(jobsSubTab === 'Market' ?
                           marketItems.filter(i => i.cat === 'Cargo' && (jobsLocationFilter === 'All' || i.location.includes(jobsLocationFilter))) :
                           jobs.filter(j => j.type === jobsSubTab && (jobsLocationFilter === 'All' || j.route.includes(jobsLocationFilter)))
                        ).map((job: any) => (
                           <div key={job.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
                              <h4 className="text-xl font-black text-slate-900 mb-2 truncate">{job.name || job.route}</h4>
                              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-6">{job.provider || job.shipper}</p>
                              <div className="space-y-3 mb-10">
                                 <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                    <Package size={16} /> {job.details || job.cargo}
                                 </div>
                                 <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                    <MapPin size={16} /> {job.location}
                                 </div>
                                 <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                                    <DollarSign size={16} />
                                    <span className={job.priceStr === 'Open to Bids' ? 'text-amber-600 font-black px-2 py-0.5 bg-amber-50 rounded-lg' : 'font-black'}>
                                       {job.priceStr || job.price}
                                    </span>
                                 </div>
                              </div>
                              <div className="pt-6 border-t border-slate-50 flex items-center justify-between mb-6">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.date || 'New Load'}</span>
                                 <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{job.weight || (job.bids ? `${job.bids} Bids` : 'Available')}</span>
                              </div>
                              {jobsSubTab === 'Market' ? (
                                 <div className="space-y-2">
                                    {job.pricingType === 'Direct' || (job.priceStr && job.priceStr !== 'Open to Bids') ? (
                                       <div className="grid grid-cols-2 gap-2">
                                          <button
                                             onClick={() => handleAcceptJob(job.id)}
                                             className="py-4 bg-blue-600 text-white hover:bg-blue-700 rounded-[20px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                                          >
                                             Accept <CheckCircle2 size={14} />
                                          </button>
                                          <button
                                             onClick={() => { setSelectedJob(job); setIsBidModalOpen(true); }}
                                             className="py-4 bg-white text-amber-600 border border-amber-200 rounded-[20px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-amber-50"
                                          >
                                             Negotiate <Gavel size={14} />
                                          </button>
                                       </div>
                                    ) : (
                                       <button
                                          onClick={() => { setSelectedJob(job); setIsBidModalOpen(true); }}
                                          className="w-full py-4 bg-amber-500 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-amber-100 transition-all hover:scale-[1.02] active:scale-95 hover:bg-amber-600"
                                       >
                                          Propose Price <Gavel size={16} />
                                       </button>
                                    )}
                                 </div>
                              ) : jobsSubTab === 'Requests' ? (
                                 <button
                                    onClick={() => handleAcceptJob(job.id)}
                                    className="w-full py-4 bg-purple-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-purple-100 animate-pulse"
                                 >
                                    <CheckCircle2 size={16} /> Accept Direct Request
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
                                       className="flex-1 py-4 bg-blue-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
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
                  <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-4 sm:p-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.filter(j => j.type === 'Active').length > 0 ? (
                           jobs.filter(j => j.type === 'Active').map(job => (
                              <div key={job.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
                                 <h4 className="text-xl font-black text-slate-900 mb-2">{job.route}</h4>
                                 <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-6">{job.shipper}</p>
                                 <div className="space-y-3 mb-10">
                                    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium"><Package size={16} /> {job.cargo}</div>
                                    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium"><DollarSign size={16} /> {job.price}</div>
                                    <div className="text-[11px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg inline-block">{job.status}</div>
                                 </div>

                                 <div className="flex flex-col gap-3">
                                    {job.status === 'Waiting for Driver Commitment' ? (
                                       <button
                                          onClick={() => handleAcceptJob(job.id)}
                                          className="w-full py-4 bg-orange-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-100 animate-pulse"
                                       >
                                          <CheckCircle2 size={16} /> Commit to Trip
                                       </button>
                                    ) : (
                                       <div className="w-full py-4 bg-green-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-100">
                                          Active Trip <Navigation size={16} />
                                       </div>
                                    )}

                                    {job.status === 'In Transit' && (
                                       <button
                                          onClick={async () => {
                                             await api.updateTripxStatus(job.id, 'Delivered');
                                             loadData();

                                             alert("Trip marked as Delivered! Shipper will be notified.");
                                          }}
                                          className="w-full py-4 bg-blue-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:scale-105 transition-all"
                                       >
                                          Confirm Delivery <CheckCircle2 size={16} />
                                       </button>
                                    )}

                                    {job.status === 'Active (Waiting Delivery)' && (
                                       <button
                                          onClick={async () => {
                                             await api.updateTripxStatus(job.id, 'In Transit');
                                             loadData();

                                          }}
                                          className="w-full py-4 bg-indigo-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:scale-105 transition-all"
                                       >
                                          Start Trip <Navigation size={16} />
                                       </button>
                                    )}
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
         case 'Market':
            return (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 pb-20">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Kwik Shop</h3>
                        <p className="text-slate-500 font-medium mt-1 text-sm">Browse shipper loads, logistics services, and equipment.</p>
                     </div>
                     <div className="relative flex-grow max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input className="bg-white border border-slate-100 rounded-xl pl-12 pr-6 py-3 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus-within:ring-blue-600 outline-none w-full shadow-sm" placeholder="Search Marketplace..." />
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                     {['All', 'Cargo', 'Transport/Logistics', 'Equipment'].map(cat => (
                        <button key={cat} onClick={() => setMarketFilter(cat)} className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${marketFilter === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-600'}`}>
                           {cat}
                        </button>
                     ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {marketItems.filter(i => marketFilter === 'All' || i.cat === marketFilter).map((item, idx) => (
                        <div key={idx} className="bg-white rounded-[32px] p-4 border border-slate-50 shadow-sm hover:shadow-2xl transition-all group">
                           <div className="h-48 rounded-[24px] overflow-hidden mb-4 relative bg-slate-100">
                              {item.cat === 'Transport/Logistics' && item.images ? (
                                 <VehicleSlider images={item.images} />
                              ) : (
                                 <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
                              )}
                              <div className={`absolute top-3 left-3 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest ${item.cat === 'Transport/Logistics' ? 'bg-emerald-500/90 text-white' :
                                 item.cat === 'Cargo' ? 'bg-amber-500/90 text-white' :
                                    'bg-white/90 text-blue-600'
                                 }`}>
                                 {item.cat}
                              </div>
                           </div>
                           <div className="px-2">
                              <h4 className="text-sm font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{item.name}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5 line-clamp-1">
                                 <UserIcon size={10} /> {item.provider} • <MapPin size={10} /> {item.location}
                              </p>

                              <p className="text-xs text-slate-500 mb-2 line-clamp-2">{item.details}</p>

                              {item.cat === 'Cargo' && (item as any).weight && (
                                 <p className="text-xs font-black text-amber-600 mb-3">Weight: {(item as any).weight}</p>
                              )}

                              <p className="text-lg font-black text-blue-600 mb-2">{item.priceStr}</p>

                              {item.cat === 'Cargo' && (item as any).pricingType && (
                                 <div className={`mb-4 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${(item as any).pricingType === 'Direct' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {(item as any).pricingType} Price
                                 </div>
                              )}

                              {item.cat === 'Cargo' ? (
                                 <div className="space-y-2">
                                    {(item as any).pricingType === 'Direct' ? (
                                       <div className="grid grid-cols-2 gap-2">
                                          <button onClick={() => handleAcceptJob(item.id)} className="py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-blue-100 transition-all">
                                             Accept <CheckCircle2 size={12} />
                                          </button>
                                          <button onClick={() => { setSelectedJob(item); setIsBidModalOpen(true); }} className="py-3 bg-white text-amber-600 border border-amber-200 hover:bg-amber-50 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all">
                                             Negotiate <Gavel size={12} />
                                          </button>
                                       </div>
                                    ) : (
                                       <button onClick={() => { setSelectedJob(item); setIsBidModalOpen(true); }} className="w-full py-3 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-100 transition-all">
                                          <Gavel size={14} /> Bid on Load
                                       </button>
                                    )}
                                 </div>
                              ) : (
                                 <button className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all">
                                    <Search size={14} /> View Details
                                 </button>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            );
         case 'PostListing':
            return (
               <div className="max-w-[1920px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                  <div className="text-center">
                     <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Broadcast Availability</h3>
                     <p className="text-slate-500 font-medium mt-2 text-sm sm:text-base">Let shippers find you by posting your current route and capacity.</p>
                  </div>
                  <div className="bg-white p-6 sm:p-12 rounded-[40px] sm:rounded-[48px] border border-slate-100 shadow-2xl space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Hub</label>
                           <input className="w-full bg-slate-50 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 border border-transparent" placeholder="e.g. Lilongwe" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Headed To (Optional)</label>
                           <input className="w-full bg-slate-50 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 border border-transparent" placeholder="e.g. Blantyre" />
                        </div>
                        <div className="space-y-3 md:col-span-1">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Free Capacity (Tons)</label>
                           <input type="number" className="w-full bg-slate-50 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 border border-transparent" placeholder="e.g. 15" />
                        </div>
                        <div className="space-y-3 md:col-span-1">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Price (Trip)</label>
                           <input className="w-full bg-slate-50 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 border border-transparent" placeholder="e.g. MWK 350,000" />
                        </div>

                        {/* Vehicle Image Gallery Selection */}
                        <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-50">
                           <div className="flex justify-between items-center">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Image Gallery (3 Images Required)</label>
                              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Gallery Preview</span>
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                              {[1, 2, 3].map((num) => (
                                 <div key={num} className="group relative aspect-video bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/10 transition-all overflow-hidden">
                                    <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                                       <div className="h-10 w-10 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300">
                                          <ImageIcon size={20} />
                                       </div>
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image {num}</span>
                                    </div>
                                    <div className="absolute top-2 right-2 h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                       <Plus size={14} />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                     <button onClick={handlePostAvailability} className="w-full py-5 sm:py-6 bg-blue-600 text-white rounded-[24px] sm:rounded-[32px] font-black uppercase tracking-widest shadow-2xl shadow-blue-100 text-sm flex items-center justify-center gap-3">

                        <Zap size={18} fill="currentColor" /> Publish Availability
                     </button>
                  </div>
               </div>
            );
         case 'Settings':
            return (
               <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                  <div className="text-left">
                     <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Account Settings</h3>
                     <p className="text-slate-500 font-medium mt-1">Configure your preferences and security options.</p>
                  </div>

                  <div className="bg-white p-8 sm:p-12 rounded-[40px] sm:rounded-[48px] border border-slate-100 shadow-2xl space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50 pb-4">Preferences</h4>
                           <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                              <div>
                                 <p className="font-black text-slate-900 text-sm">Push Notifications</p>
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">New Job Alerts</p>
                              </div>
                              <div className="h-6 w-12 bg-blue-600 rounded-full flex items-center px-1">
                                 <div className="h-4 w-4 bg-white rounded-full ml-auto shadow-sm"></div>
                              </div>
                           </div>
                           <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                              <div>
                                 <p className="font-black text-slate-900 text-sm">Location Tracking</p>
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Real-time Visibility</p>
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
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Last changed 2mo ago</p>
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
                              <h4 className="text-2xl font-black tracking-tight mb-2 italic">Fuel Rewards Program</h4>
                              <p className="text-blue-100 font-bold opacity-80 text-sm">Get up to 10% off at KwikLiner partner hubs.</p>
                           </div>
                           <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl group-hover:scale-105 transition-all">Join Program</button>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                     </div>
                  </div>
               </div>
            );
         case 'Wallet':
            return (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                     <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">My Wallet</h3>
                        <p className="text-slate-500 font-medium mt-1 text-sm">Manage your earnings and payouts.</p>
                     </div>
                     <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3">
                        <ArrowRight size={18} /> Withdraw Funds
                     </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                           <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Available Balance</p>
                           <h4 className="text-4xl font-black tracking-tighter mb-10">
                              {wallet?.currency || 'MWK'} {wallet?.balance?.toLocaleString() || '0.00'}
                           </h4>
                           <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                              <div>
                                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Earned</p>
                                 <p className="text-sm font-black">MWK 4.2M</p>
                              </div>
                              <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                                 <TrendingUp size={18} className="text-emerald-400" />
                              </div>
                           </div>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                           <h5 className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Commission Settings</h5>
                           <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                              <div className="flex items-center gap-4">
                                 <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                    <PieChart size={24} />
                                 </div>
                                 <div>
                                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest">KwikLiner Fee</p>
                                    <p className="text-lg font-black text-blue-900">5% Flat</p>
                                 </div>
                              </div>
                              <p className="text-[10px] font-bold text-blue-400 mt-4 leading-relaxed">The 5% commission is automatically deducted from all gross earnings. Your wallet balance reflects your net earnings.</p>
                           </div>
                        </div>
                     </div>

                     <div className="lg:col-span-8 bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-8 sm:p-10 border-b border-slate-50">
                           <h4 className="text-xl font-black text-slate-900 tracking-tight">Transaction History</h4>
                        </div>
                        <div className="flex-grow overflow-y-auto max-h-[600px] scrollbar-hide">
                           {transactions.length > 0 ? (
                              transactions.map((tx: any) => (
                                 <div key={tx.id} className="p-8 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50/50 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-6">
                                       <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm border ${tx.type === 'Sale' || tx.type.includes('Earned') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                          tx.type === 'Withdrawal' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                             'bg-blue-50 text-blue-600 border-blue-100'
                                          }`}>
                                          {tx.type === 'Sale' || tx.type.includes('Earned') ? <DollarSign size={24} /> :
                                             tx.type === 'Withdrawal' ? <ArrowRight size={24} /> :
                                                <Briefcase size={24} />}
                                       </div>
                                       <div>
                                          <p className="text-sm font-black text-slate-900 mb-1">{tx.type} • {tx.id.substring(0, 8)}</p>
                                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                             {new Date(tx.created_at).toLocaleDateString()} • {tx.method || 'Internal Wallet'}
                                          </p>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <p className={`text-lg font-black ${tx.type === 'Withdrawal' ? 'text-red-500' : 'text-emerald-600'}`}>
                                          {tx.type === 'Withdrawal' ? '-' : '+'}{wallet?.currency || 'MWK'} {parseFloat(tx.net_amount).toLocaleString()}
                                       </p>
                                       <div className="flex items-center justify-end gap-1.5 mt-1">
                                          <div className={`h-1.5 w-1.5 rounded-full ${tx.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tx.status}</p>
                                       </div>
                                       {tx.commission_amount > 0 && (
                                          <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase italic">Inc. 5% Fee: {wallet?.currency} {parseFloat(tx.commission_amount).toLocaleString()}</p>
                                       )}
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <div className="p-20 text-center">
                                 <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CreditCard className="text-slate-200" size={32} />
                                 </div>
                                 <h4 className="text-lg font-black text-slate-900">No transactions yet</h4>
                                 <p className="text-slate-500 text-sm mt-2">Your earning history will appear here once you complete trips.</p>
                              </div>
                           )}
                        </div>
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
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">{title.replace('_', ' ')}</p>
                     <div className="space-y-1">
                        {items.map(item => (
                           <button
                              key={item.id}
                              onClick={() => {
                                 if (item.id === 'Logout') navigate('/');
                                 else if (item.id === 'Settings') navigate('/settings');
                                 else setActiveMenu(item.id);
                              }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${activeMenu === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
                           >
                              <div className="flex items-center space-x-3">
                                 <span className={activeMenu === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 transition-colors'}>{item.icon}</span>
                                 <span className="text-sm font-semibold tracking-tight">{item.label}</span>
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
                           <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.25em] mb-6 px-4">{title.replace('_', ' ')}</p>
                           <div className="space-y-2">
                              {items.map(item => (
                                 <button
                                    key={item.id}
                                    onClick={() => {
                                       if (item.id === 'Logout') navigate('/');
                                       else if (item.id === 'Settings') navigate('/settings');
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
                                 </button>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="pt-8 border-t border-slate-50 mt-8 shrink-0">
                     <div className="bg-slate-50 p-6 rounded-[32px] flex items-center gap-4 border border-slate-100 overflow-hidden">
                        <div className="h-12 w-12 rounded-full bg-white shadow-sm overflow-hidden shrink-0"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`} alt="pfp" /></div>
                        <div className="min-w-0">
                           <p className="text-xs font-black text-slate-900 truncate">{profileData.name}</p>
                           <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Verified Driver</p>
                        </div>
                     </div>
                  </div>
               </aside>
            </div>
         )}

         <main className="flex-grow min-w-0 flex flex-col p-4 md:p-10 lg:p-14 overflow-hidden md:pt-16">
            <div className="flex-grow pb-20 overflow-y-auto scrollbar-hide">
               {renderContent()}
            </div>
            {/* Bidding Modal */}
            {isBidModalOpen && selectedJob && (
               <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsBidModalOpen(false)}></div>
                  <div className="bg-white w-full max-w-lg rounded-[32px] sm:rounded-[48px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                     <div className="p-6 sm:p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div>
                           <h4 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">Submit Proposal</h4>
                           <p className="text-slate-500 font-medium mt-1 text-[11px] sm:text-sm">Propose your price for {selectedJob.id}</p>
                        </div>
                        <button onClick={() => setIsBidModalOpen(false)} className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"><X size={20} /></button>
                     </div>

                     <form onSubmit={handleSubmitBid} className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                        <div className="bg-blue-50/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-blue-100 space-y-2">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] sm:text-[11px] font-black text-blue-600 uppercase tracking-widest">Route Details</span>
                              <span className="text-xs sm:text-sm font-black text-blue-900">{selectedJob.route}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] sm:text-[11px] font-black text-blue-600 uppercase tracking-widest">Cargo</span>
                              <span className="text-xs sm:text-sm font-black text-blue-900">{selectedJob.cargo}</span>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Your Price Proposal</label>
                           <div className="bg-slate-50 rounded-[20px] sm:rounded-[24px] px-5 sm:px-6 py-4 sm:py-5 border-2 border-slate-100 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition-all flex items-center gap-4">
                              <span className="text-base sm:text-lg font-black text-slate-400">MWK</span>
                              <input
                                 type="number"
                                 required
                                 className="bg-transparent w-full text-xl sm:text-2xl font-black text-slate-900 outline-none placeholder:text-slate-200"
                                 placeholder="Enter amount"
                                 value={bidAmount}
                                 onChange={e => setBidAmount(e.target.value)}
                                 autoFocus
                              />
                           </div>
                           <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">Shipper will review your quote and rating</p>
                        </div>

                        <button type="submit" className="w-full py-4 sm:py-5 bg-blue-600 text-white rounded-2xl sm:rounded-3xl font-black uppercase tracking-widest text-xs sm:text-sm shadow-2xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                           Send Proposal <Send size={20} />
                        </button>
                     </form>
                  </div>
               </div>
            )}

            {/* Commitment / Handshake Modal */}
            {isCommitModalOpen && commitmentJob && (
               <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsCommitModalOpen(false)}></div>
                  <div className="bg-white w-full max-w-lg rounded-[32px] sm:rounded-[48px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                     <div className="p-6 sm:p-10 border-b border-slate-50 flex justify-between items-center bg-purple-600 text-white">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <Award size={20} className="text-purple-200" />
                              <h4 className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic">You Won the Bid!</h4>
                           </div>
                           <p className="text-purple-100 font-medium text-[11px] sm:text-sm">Please confirm your commitment to {commitmentJob.id}</p>
                        </div>
                        <button onClick={() => setIsCommitModalOpen(false)} className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-sm"><X size={20} /></button>
                     </div>

                     <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                        <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">Route</span>
                              <span className="text-xs sm:text-sm font-black text-slate-900">{commitmentJob.route}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">Negotiated Price</span>
                              <span className="text-base sm:text-lg font-black text-blue-600">MWK {commitmentJob.price}</span>
                           </div>
                           {commitmentJob.pickupType === 'Shop Pickup' && (
                              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                                 <span className="text-[10px] sm:text-[11px] font-black text-purple-600 uppercase tracking-widest">Special: Shop Pickup</span>
                                 <span className="text-xs sm:text-sm font-bold text-slate-500 italic">Pay on Delivery</span>
                              </div>
                           )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <button
                              onClick={() => handleDriverCommit('COMMIT')}
                              className="py-4 sm:py-5 bg-blue-600 text-white rounded-2xl sm:rounded-[24px] font-black text-[11px] sm:text-xs uppercase tracking-[0.15em] shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                           >
                              <CheckCircle2 size={16} /> Confirm Commitment
                           </button>
                           <button
                              onClick={() => {
                                 const reason = prompt("Please provide a reason for declining:");
                                 if (reason) {
                                    setDeclineReason(reason);
                                    handleDriverCommit('DECLINE');
                                 }
                              }}
                              className="py-4 sm:py-5 bg-white text-slate-400 border border-slate-200 rounded-2xl sm:rounded-[24px] font-black text-[11px] sm:text-xs uppercase tracking-[0.15em] hover:bg-slate-50 hover:text-red-500 transition-all"
                           >
                              Decline
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            <ChatWidget user={user} />
         </main>
      </div>
   );
};

export default DriverDashboard;
