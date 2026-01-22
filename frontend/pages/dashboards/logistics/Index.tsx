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
import MarketTab from '../shipper/MarketTab';
import VehicleSlider from '../shipper/VehicleSlider';

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
  const [marketFilter, setMarketFilter] = useState('All');
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

  const marketItems = useMemo(() => {
    const fleets = availableFleets.map(f => ({
      id: f.id,
      name: f.vehicle_type,
      cat: 'Transport/Logistics',
      type: 'Transport',
      price: 0,
      priceStr: `MWK ${f.price}/trip`,
      img: (f.images && f.images[0]) || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400',
      images: f.images || [],
      location: f.location,
      provider: f.driver_name,
      details: `Route: ${f.route}`,
      capacity: f.capacity
    }));

    const products = marketProducts.map(p => ({
      id: p.id,
      name: p.name,
      cat: 'Equipment',
      type: 'Hardware',
      price: parseFloat(p.price),
      priceStr: `MWK ${parseFloat(p.price).toLocaleString()}`,
      img: (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=400',
      location: 'KwikShop',
      provider: p.seller || 'Verified Seller',
      details: p.description
    }));

    return [...fleets, ...products];
  }, [availableFleets, marketProducts]);



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

  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [
        allJobs,
        allTrips,
        walletData,
        transData,
        logisticsStats,
        logisticsDrivers,
        logisticsListings,
        fleets,
        products,
        logisticsAnalytics
      ] = await Promise.all([
        api.getAvailableJobs(),
        api.getDriverTrips(),
        api.getWallet(user.id),
        api.getWalletTransactions(user.id),
        api.getLogisticsStats(),
        api.getLogisticsDrivers(),
        api.getLogisticsListings(),
        api.getAvailableFleets(),
        api.getProducts(),
        api.getLogisticsAnalytics()
      ]);

      setWallet(walletData);
      setTransactions(Array.isArray(transData) ? transData : []);
      setStats(logisticsStats);
      setDrivers(logisticsDrivers);
      setListings(logisticsListings);
      setAvailableFleets(fleets);
      setMarketProducts(products);
      setAnalytics(logisticsAnalytics);

      setJobProposals((Array.isArray(allJobs) ? allJobs : []).map((j: any) => ({
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
        setIsOpen={setIsMobileMenuOpen}
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