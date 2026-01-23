import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../types';
import {
  LayoutGrid, Truck, MessageSquare,
  Settings, LogOut, Briefcase, Users,
  BarChart3, ShieldCheck, Megaphone, ShoppingCart
} from 'lucide-react';
import ChatWidget from '../../../components/ChatWidget';
import { api } from '../../../services/api';

// Tab Components
import OverviewTab from './OverviewTab';
import FleetTab from './FleetTab';
import DriversTab from './DriversTab';
import AvailabilityTab from './AvailabilityTab';
import BoardTab from './BoardTab';
import JobsTab from './JobsTab';
import ReportTab from './ReportTab';
import AccountTab from './AccountTab';
import SettingsTab from './SettingsTab';
import WalletTab from './WalletTab';
import MessageTab from './MessageTab';
import MarketTab from '../../../components/MarketTab';
import VehicleSlider from '../../../components/VehicleSlider';

// Sidebar & Modals
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import AddVehicleModal from './AddVehicleModal';
import BidModal from './BidModal';
import CommitmentModal from './CommitmentModal';

interface LogisticsOwnerDashboardProps {
  user: User;
  onLogout: () => void;
  mobileMenuAction?: number;
}

const LogisticsOwnerDashboard = ({ user, onLogout, mobileMenuAction }: LogisticsOwnerDashboardProps) => {
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
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [biddingLoad, setBiddingLoad] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [marketFilter, setMarketFilter] = useState('Cargo');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [hiringUrgency, setHiringUrgency] = useState<Record<string, string>>({});
  const [stats, setStats] = useState({
    fleetSize: 0,
    activeJobs: 0,
    pendingBids: 0,
    wallet: { balance: 0, currency: 'MWK' }
  });
  const [listings, setListings] = useState<any[]>([]);
  const [availableFleets, setAvailableFleets] = useState<any[]>([]);
  const [marketProducts, setMarketProducts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);





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



  // Drivers State
  const [drivers, setDrivers] = useState<any[]>([]);

  // Chat State
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [conversations] = useState<any[]>([]);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, {
      id: Date.now(),
      text: chatInput,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatInput('');
  };

  const [newVehicle, setNewVehicle] = useState({
    make: '', model: '', plate: '', capacity: '', type: 'Flatbed'
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [jobProposals, setJobProposals] = useState<any[]>([]);

  const marketItems = useMemo(() => {
    return availableFleets; // This will hold the socket data from marketplace_items
  }, [availableFleets]);

  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [
        allTrips,
        walletData,
        transData,
        logisticsStats,
        logisticsDrivers,
        logisticsListings,
        logisticsAnalytics
      ] = await Promise.all([
        api.getDriverTrips().catch(() => []),
        api.getWallet(user.id).catch(() => ({})),
        api.getWalletTransactions(user.id).catch(() => []),
        api.getLogisticsStats().catch(() => ({})),
        api.getLogisticsDrivers().catch(() => []),
        api.getLogisticsListings().catch(() => []),
        api.getLogisticsAnalytics().catch(() => [])
      ]);

      setWallet(walletData);
      setTransactions(Array.isArray(transData) ? transData : []);

      setStats(logisticsStats);
      setDrivers(logisticsDrivers);
      setListings(logisticsListings);
      setAnalytics(logisticsAnalytics);

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

    // Socket Integration
    const { io } = require('socket.io-client');
    const newSocket = io('http://localhost:5000');

    newSocket.on('connect', () => {
      console.log('Logistics Socket Connected');
      newSocket.emit('join_room', user.id);
      newSocket.emit('request_market_data');
    });

    newSocket.on('market_data_update', (data: any[]) => {
      console.log('Logistics Socket: Received unified market data', data.length);
      setAvailableFleets(data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user.id]);


  const [acceptedJobs, setAcceptedJobs] = useState<any[]>([]);

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
    loadData();
  };

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this vehicle from your fleet?')) {
      await api.deleteVehicle(id);
      loadData();
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
            stats={stats}
            listings={listings}
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
        return <AvailabilityTab user={user} listings={listings} />;
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

      case 'Shop':
        return (
          <MarketTab
            setIsCartOpen={setIsCartOpen}
            cart={cart}
            marketFilter={marketFilter}
            setMarketFilter={setMarketFilter}
            marketItems={marketItems}
            addToCart={addToCart}
            handleBookService={(service) => alert(`Service Booked: ${service.name} from ${service.provider}`)}
            hiringUrgency={hiringUrgency}
            setHiringUrgency={setHiringUrgency}
            handleDirectHire={handleDirectHire}
            handleAcceptJob={handleAcceptJob}
          />
        );
      case 'Wallet':
        return <WalletTab wallet={wallet} transactions={transactions} />;
      case 'Report':
        return <ReportTab stats={stats} analytics={analytics} />;
      case 'Messages':
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
      case 'Account':
        return <AccountTab />;
      case 'Settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#F8F9FB] dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100 overflow-hidden font-['Inter'] relative transition-colors duration-200">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} menuSections={menuSections} onLogout={onLogout} />
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

      <main className={`flex-grow flex flex-col min-w-0 h-screen overflow-y-auto relative ${activeMenu === 'Report' ? 'p-4 md:p-8 lg:p-10 md:pt-12' : 'p-4 md:p-10 lg:p-14 md:pt-16'}`}>
        {renderContent()}

        <AddVehicleModal
          isOpen={isAddVehicleOpen}
          onClose={() => setIsAddVehicleOpen(false)}
          handleAddVehicle={handleAddVehicle}
          newVehicle={newVehicle}
          setNewVehicle={setNewVehicle}
          handleImageUpload={handleImageUpload}
          selectedImage={selectedImage}
        />

        <BidModal
          isOpen={isBidModalOpen}
          onClose={() => setIsBidModalOpen(false)}
          biddingLoad={biddingLoad}
          bidAmount={bidAmount}
          setBidAmount={setBidAmount}
          handleSubmitBid={handleSubmitBid}
        />

        <CommitmentModal
          isOpen={isCommitModalOpen}
          onClose={() => setIsCommitModalOpen(false)}
          commitmentJob={commitmentJob}
          handleLogisticsCommit={handleLogisticsCommit}
          setDeclineReason={setDeclineReason}
        />

        {/* Assistant Widget integration */}
        <ChatWidget user={user} />
      </main>
    </div>
  );
};

export default LogisticsOwnerDashboard;