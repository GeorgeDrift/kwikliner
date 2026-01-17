
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import {
  LayoutGrid, Truck, Box, MessageSquare, Activity, FileText,
  Globe, UserCheck, Settings, LogOut, ChevronDown, Search,
  Bell, Plus, ArrowRight, Gavel, DollarSign, Clock, ShieldCheck,
  Briefcase, Users, PieChart, BarChart3, Trash2, X, Upload,
  Image as ImageIcon, MapPin, MoreHorizontal, TrendingUp, Info, Award, Filter, Megaphone, Menu, ShoppingCart, CreditCard
} from 'lucide-react';
import ChatWidget from '../../components/ChatWidget';
import { api } from '../../services/api';

// Tab Components
import OverviewTab from './logistics/OverviewTab';
import FleetTab from './logistics/FleetTab';
import DriversTab from './logistics/DriversTab';
import AvailabilityTab from './logistics/AvailabilityTab';
import BoardTab from './logistics/BoardTab';
import JobsTab from './logistics/JobsTab';
import ReportTab from './logistics/ReportTab';
import AccountTab from './logistics/AccountTab';
import SettingsTab from './logistics/SettingsTab';
import MarketTab from './shipper/MarketTab';
import VehicleSlider from './shipper/VehicleSlider';

interface LogisticsOwnerDashboardProps {
  user: User;
  onLogout: () => void;
  mobileMenuAction?: number;
}

const LogisticsOwnerDashboard: React.FC<LogisticsOwnerDashboardProps> = ({ user, onLogout, mobileMenuAction }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [jobsTab, setJobsTab] = useState<'requests' | 'bids' | 'proposed'>('requests');
  const [fromLocation, setFromLocation] = useState('All');
  const [toLocation, setToLocation] = useState('All');
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [commitmentJob, setCommitmentJob] = useState<any>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'drivers'>('overview');
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [biddingLoad, setBiddingLoad] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [marketFilter, setMarketFilter] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [hiringUrgency, setHiringUrgency] = useState<Record<string, string>>({});
  const [marketItems] = useState([
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
  ]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // Fleet State (Fetched from API)
  const [fleet, setFleet] = useState<any[]>([]);

  useEffect(() => {
    if (mobileMenuAction && mobileMenuAction > 0) {
      setIsMobileMenuOpen(true);
    }
  }, [mobileMenuAction]);

  useEffect(() => {
    loadFleet();
  }, []);

  const loadFleet = async () => {
    const data = await api.getFleet(user.id);
    setFleet(data);
  };

  // Drivers State
  const [drivers, setDrivers] = useState<any[]>([
    { id: 'drv-1', name: 'John Kamwana', phone: '+265 991 234 567', status: 'Available', trips: 84, currentJob: null, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
    { id: 'drv-2', name: 'Grace Phiri', phone: '+265 888 765 432', status: 'On Job', trips: 102, currentJob: 'Blantyre → Lilongwe', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
    { id: 'drv-3', name: 'Moses Banda', phone: '+265 999 654 321', status: 'Available', trips: 67, currentJob: null, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
    { id: 'drv-4', name: 'Alice Mbewe', phone: '+265 991 123 456', status: 'Off Duty', trips: 45, currentJob: null, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
  ]);

  const [newVehicle, setNewVehicle] = useState({
    make: '', model: '', plate: '', capacity: '', type: 'Flatbed'
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  /*
  const [jobProposals, setJobProposals] = useState([
    { id: 'JP-001', shipper: 'AgriCorp Malawi', route: 'Lilongwe → Blantyre', cargo: 'Fertilizer (25T)', price: 'MWK 450,000', deadline: '2 days', status: 'New' },
    { id: 'JP-002', shipper: 'BuildMart Ltd', route: 'Mzuzu → Zomba', cargo: 'Cement & Steel (18T)', price: 'MWK 380,000', deadline: '3 days', status: 'New' },
    { id: 'JP-003', shipper: 'FreshProduce Co', route: 'Blantyre → Lilongwe', cargo: 'Fresh Produce (12T)', price: 'MWK 280,000', deadline: '1 day', status: 'Urgent' },
    { id: 'JP-004', shipper: 'TechSupply MW', route: 'Zomba → Mzuzu', cargo: 'Electronics (8T)', price: 'MWK 320,000', deadline: '4 days', status: 'New' },
  ]);
  */
  const [jobProposals, setJobProposals] = useState<any[]>([]);

  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [all, allTrips, walletData, transData] = await Promise.all([
        api.getAvailableJobs(),
        api.getDriverTrips(),
        api.getWallet(user.id),
        api.getWalletTransactions(user.id)
      ]);

      setWallet(walletData);
      setTransactions(Array.isArray(transData) ? transData : []);
      // In real app, we might want to fetch logistics-specific trips

      setJobProposals((Array.isArray(all) ? all : []).map((j: any) => ({
        ...j,
        deadline: '2 days',
        status: 'New'
      })));
      setAcceptedJobs((Array.isArray(allTrips) ? allTrips : []).map((j: any) => ({
        ...j,
        assignedDriver: j.assigned_driver_id || null
      })));
    } catch (err) {
      console.warn("Failed to load logistics data");
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);


  const [acceptedJobs, setAcceptedJobs] = useState([
    { id: 'JOB-992', shipper: 'Global Exporters', route: 'Zomba → Lilongwe', cargo: 'Tobacco (12T)', price: 'MWK 420,000', deadline: '1 day', status: 'Approved / Waiting Pick up', assignedDriver: null },
    { id: 'JOB-002', shipper: 'BuildMart Ltd', route: 'Mzuzu → Zomba', cargo: 'Cement & Steel (18T)', price: 'MWK 380,000', deadline: '3 days', status: 'Assigned', assignedDriver: 'John Kamwana' },
  ]);

  const handleAcceptJob = async (job: any) => {
    try {
      if (job.status === 'Finding Driver') {
        await api.driverCommitToJob(job.id, 'COMMIT');
        alert('Direct request accepted!');
      } else if (job.price === 'Open to Bids' || job.priceStr === 'Open to Bids') {
        setBiddingLoad(job);
        setBidAmount('');
        setIsBidModalOpen(true);
      } else {
        await api.bidOnLoad(job.id, { amount: job.price });
        alert('Bid submitted at fixed price!');
      }
      loadData();
    } catch (e) {
      alert('Failed to process job request.');
    }
  };


  const handleSubmitBid = async () => {
    if (!biddingLoad || !bidAmount) return;
    try {
      await api.bidOnLoad(biddingLoad.id, { amount: `MWK ${bidAmount}` });
      alert(`Bid of MWK ${parseInt(bidAmount).toLocaleString()} submitted!`);
      setIsBidModalOpen(false);
      setBiddingLoad(null);
      loadData();
    } catch (e) {
      alert("Failed to submit bid.");
    }
  };

  const handleDirectHire = (driverName: string) => {
    alert(`Direct Request sent to ${driverName}! (Simulated parity with Shipper flow)`);
  };

  const handleLogisticsCommit = async (decision: 'COMMIT' | 'DECLINE') => {
    if (!commitmentJob) return;
    try {
      await api.driverCommitToJob(commitmentJob.id, decision, declineReason);
      alert(decision === 'COMMIT' ? "Trip activated! Your fleet has committed." : "Job declined.");
      setIsCommitModalOpen(false);
      setCommitmentJob(null);
      setDeclineReason('');
      loadData();
    } catch (err) {
      alert("Failed to process commitment.");
    }
  };

  const menuSections = {
    MAIN_MENU: [
      { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Fleet Overview' },
      { id: 'Fleet', icon: <Truck size={20} />, label: 'My Fleet' },
      { id: 'Drivers', icon: <Users size={20} />, label: 'Drivers' },
      { id: 'Messages', icon: <MessageSquare size={20} />, label: 'Messages' },
      { id: 'Availability', icon: <Megaphone size={20} />, label: 'Post Availability' },
      { id: 'Board', icon: <Briefcase size={20} />, label: 'Jobs Proposal' },
      { id: 'Shop', icon: <ShoppingCart size={20} />, label: 'KwikShop' },
    ],
    OPERATIONS: [
      { id: 'Jobs', icon: <Briefcase size={20} />, label: 'Jobs', badge: 3 },
      { id: 'Report', icon: <BarChart3 size={20} />, label: 'Revenue Analytics' },
      { id: 'Account', icon: <ShieldCheck size={20} />, label: 'Compliance Hub' },
    ],
    OTHERS: [
      { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' },
      { id: 'Logout', icon: <LogOut size={20} />, label: 'Log out' },
    ]
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.make || !newVehicle.plate) return;

    await api.addVehicle({
      ...newVehicle,
      status: 'Available',
      image: selectedImage || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400',
      ownerId: user.id
    });

    setIsAddVehicleOpen(false);
    setNewVehicle({ make: '', model: '', plate: '', capacity: '', type: 'Flatbed' });
    setSelectedImage(null);
    loadFleet();
  };

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this vehicle from your fleet?')) {
      await api.deleteVehicle(id);
      loadFleet();
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'Overview':
        return (
          <OverviewTab
            user={user}
            fleet={fleet}
            jobProposals={jobProposals}
            setActiveMenu={setActiveMenu}
            setJobsTab={setJobsTab}
            navigate={navigate}
            wallet={wallet}
          />
        );
      case 'Fleet':
        return (
          <FleetTab
            fleet={fleet}
            setIsAddVehicleOpen={setIsAddVehicleOpen}
            handleDeleteVehicle={handleDeleteVehicle}
          />
        );
      case 'Drivers':
        return <DriversTab drivers={drivers} />;
      case 'Availability':
        return <AvailabilityTab user={user} />;
      case 'Jobs':
        return <JobsTab acceptedJobs={acceptedJobs} handleAcceptJob={handleAcceptJob} />;
      case 'Board':
        return (
          <BoardTab
            jobsTab={jobsTab}
            setJobsTab={setJobsTab}
            jobProposals={jobProposals}
            handleAcceptJob={handleAcceptJob}
            fromLocation={fromLocation}
            setFromLocation={setFromLocation}
            toLocation={toLocation}
            setToLocation={setToLocation}
          />
        );
      case 'Messages':
        return (
          <div className="h-[calc(100vh-140px)] animate-in fade-in duration-500">
            <ChatWidget currentUser={user} onClose={() => setActiveMenu('Overview')} />
          </div>
        );
      case 'Shop':
        return (
          <MarketTab
            setIsCartOpen={setIsCartOpen}
            cart={cart}
            marketFilter={marketFilter}
            setMarketFilter={setMarketFilter}
            marketItems={[
              ...marketItems.filter(i => i.cat !== 'Cargo'),
              ...jobProposals.map(jp => ({
                id: jp.id,
                name: jp.cargo,
                cat: 'Cargo',
                type: 'Cargo',
                price: 0,
                priceStr: jp.price,
                img: jp.img || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
                location: jp.route || `${jp.origin} → ${jp.destination}`,
                provider: jp.shipper || jp.shipperId,
                details: jp.details || 'Verified Shipper Request',
                weight: jp.weight
              }))
            ]}
            addToCart={addToCart}
            VehicleSlider={VehicleSlider}
            handleBookService={(service) => alert(`Service Booked: ${service.name} from ${service.provider}`)}
            hiringUrgency={hiringUrgency}
            setHiringUrgency={setHiringUrgency}
            handleDirectHire={handleDirectHire}
            handleAcceptJob={handleAcceptJob}
          />
        );
      case 'Wallet':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Fleet Wallet</h3>
                <p className="text-slate-500 font-medium mt-1 text-sm">Manage logistics earnings and payouts.</p>
              </div>
              <button className="w-full sm:w-auto px-8 py-4 bg-[#6366F1] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-3">
                <ArrowRight size={18} /> Payout to Bank
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/20 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Net Balance</p>
                  <h4 className="text-4xl font-black tracking-tighter mb-10">
                    {wallet?.currency || 'MWK'} {wallet?.balance?.toLocaleString() || '0.00'}
                  </h4>
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Fleet Lifetime Revenue</p>
                      <p className="text-sm font-black text-indigo-400">MWK 12.8M</p>
                    </div>
                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <TrendingUp size={18} className="text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                  <h5 className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Commission Settings</h5>
                  <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#6366F1] shadow-sm">
                        <PieChart size={24} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-[#6366F1] uppercase tracking-widest">KwikLiner Fee</p>
                        <p className="text-lg font-black text-indigo-900">5% Flat</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-indigo-400 mt-4 leading-relaxed">The 5% commission is automatically deducted from all gross earnings. Your wallet balance reflects your net earnings.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 sm:p-10 border-b border-slate-50 bg-slate-50/50">
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">Transaction History</h4>
                </div>
                <div className="flex-grow overflow-y-auto max-h-[600px] scrollbar-hide">
                  {transactions.length > 0 ? (
                    transactions.map((tx: any) => (
                      <div key={tx.id} className="p-8 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50/50 transition-all cursor-pointer group">
                        <div className="flex items-center gap-6">
                          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm border ${tx.type === 'Sale' || tx.type.includes('Earned') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            tx.type === 'Withdrawal' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-indigo-50 text-indigo-600 border-indigo-100'
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
      case 'Report':
        return <ReportTab />;
      case 'Message':
        return (
          <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] animate-in fade-in duration-500">
            <ChatWidget user={user} />
          </div>
        );
      case 'Account':
        return <AccountTab />;
      case 'Settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#F8F9FB] min-h-screen text-slate-900 overflow-hidden font-['Inter'] relative">


      <aside className="hidden md:flex w-64 bg-white border-r border-slate-100 flex-col p-6 shrink-0 h-screen sticky top-0">
        <div className="flex items-center justify-center mb-10 px-2">
          <div className="bg-[#6366F1] p-2 rounded-xl shadow-lg shadow-indigo-100">
            <Briefcase className="text-white" size={24} />
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
                    onClick={() => item.id === 'Logout' ? onLogout() : setActiveMenu(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${activeMenu === item.id
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
                    {item.badge && <span className="bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MOBILE SIDEBAR (Drawer) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white flex flex-col p-8 animate-in slide-in-from-left duration-300 shadow-2xl">
            <div className="flex items-center justify-between mb-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-[#6366F1] p-2.5 rounded-xl">
                  <Globe className="text-white" size={24} />
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
                        className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all group ${activeMenu === item.id ? 'bg-[#6366F1] text-white shadow-2xl shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        <div className="flex items-center space-x-5">
                          <span className={activeMenu === item.id ? 'text-white' : 'text-slate-400 group-hover:text-[#6366F1] transition-colors'}>{item.icon}</span>
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
                <div className="h-12 w-12 rounded-full bg-white shadow-sm overflow-hidden shrink-0"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="pfp" /></div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                  <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">Fleet Manager</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      <main className={`flex-grow flex flex-col min-w-0 h-screen overflow-y-auto relative ${activeMenu === 'Report' ? 'p-4 md:p-8 lg:p-10 md:pt-12' : 'p-4 md:p-10 lg:p-14 md:pt-16'}`}>
        {renderContent()}

        {/* Add Vehicle Modal */}
        {isAddVehicleOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddVehicleOpen(false)}></div>
            <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 w-full max-w-2xl relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Add New Vehicle</h3>
                <button onClick={() => setIsAddVehicleOpen(false)} className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                  <X size={20} className="sm:size-[24px]" />
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-6 sm:space-y-8">
                {/* ... existing form inputs ... */}
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/3">
                    <label className="block w-full aspect-square rounded-[32px] border-4 border-dashed border-slate-200 hover:border-[#6366F1] hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-400 group relative overflow-hidden">
                      {selectedImage ? (
                        <img src={selectedImage} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                      ) : (
                        <>
                          <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-[#6366F1] transition-colors">
                            <ImageIcon size={24} />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-widest">Upload Photo</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>

                  <div className="w-full md:w-2/3 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Make</label>
                        <input
                          required
                          value={newVehicle.make}
                          onChange={e => setNewVehicle({ ...newVehicle, make: e.target.value })}
                          placeholder="e.g. Volvo"
                          className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Model</label>
                        <input
                          required
                          value={newVehicle.model}
                          onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })}
                          placeholder="e.g. FH16"
                          className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">License Plate</label>
                      <input
                        required
                        value={newVehicle.plate}
                        onChange={e => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                        placeholder="e.g. MC 9928"
                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                        <input
                          required
                          value={newVehicle.capacity}
                          onChange={e => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                          placeholder="e.g. 30T"
                          className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                        <select
                          value={newVehicle.type}
                          onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value })}
                          className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]"
                        >
                          <option value="Flatbed">Flatbed</option>
                          <option value="Tanker">Tanker</option>
                          <option value="Box Body">Box Body</option>
                          <option value="Refrigerated">Refrigerated</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <button type="submit" className="w-full py-5 bg-[#6366F1] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all">
                    Add to Fleet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bidding Modal */}
        {isBidModalOpen && biddingLoad && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsBidModalOpen(false)}></div>
            <div className="bg-white rounded-[40px] p-10 w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Submit Your Bid</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">For: {biddingLoad.cargo || biddingLoad.name}</p>
                </div>
                <button onClick={() => setIsBidModalOpen(false)} className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</span>
                    <span className="text-sm font-bold text-slate-900">{biddingLoad.route || biddingLoad.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight</span>
                    <span className="text-sm font-bold text-slate-900">{biddingLoad.weight || 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Bid Amount (MWK)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300">MWK</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="e.g. 450000"
                      className="w-full bg-slate-50 rounded-[28px] pl-16 pr-6 py-6 font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 border border-transparent text-xl transition-all"
                      autoFocus
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 ml-2 italic">Standard range for this route: MWK 350k - 500k</p>
                </div>

                <button
                  onClick={handleSubmitBid}
                  disabled={!bidAmount}
                  className="w-full py-6 bg-blue-600 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                >
                  <Gavel size={18} /> Send Bid to Shipper
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Commitment / Handshake Modal */}
        {isCommitModalOpen && commitmentJob && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsCommitModalOpen(false)}></div>
            <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-purple-600 text-white">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Award size={20} className="text-purple-200" />
                    <h4 className="text-lg font-black tracking-tight uppercase">Bid Won!</h4>
                  </div>
                  <p className="text-purple-100 font-medium text-xs">Confirm your fleet's commitment to {commitmentJob.id}</p>
                </div>
                <button onClick={() => setIsCommitModalOpen(false)} className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"><X size={20} /></button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</span>
                    <span className="text-xs font-black text-slate-900">{commitmentJob.route}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Negotiated Price</span>
                    <span className="text-base font-black text-blue-600">MWK {commitmentJob.price}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleLogisticsCommit('COMMIT')}
                    className="py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Commit Fleet
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt("Reason for declining:");
                      if (reason) {
                        setDeclineReason(reason);
                        handleLogisticsCommit('DECLINE');
                      }
                    }}
                    className="py-4 bg-white text-slate-400 border border-slate-200 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:text-red-500 transition-all"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assistant Widget integration */}
        <ChatWidget user={user} />
      </main>
    </div>
  );
};

export default LogisticsOwnerDashboard;