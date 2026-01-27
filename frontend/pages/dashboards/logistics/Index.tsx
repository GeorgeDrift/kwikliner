import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../types';
import {
  LayoutGrid, Truck, MessageSquare,
  Settings, LogOut, Briefcase, Users,
  BarChart3, ShieldCheck, Megaphone, ShoppingCart
} from 'lucide-react';
import { io } from 'socket.io-client';
import ChatWidget from '../../../components/ChatWidget';
import { api } from '../../../services/api';
import { fileToBase64 } from '../../../services/fileUtils';

// Tab Components
import OverviewTab from './OverviewTab';
import FleetTab from './FleetTab';
import DriversTab from './DriversTab';
import AvailabilityTab from './AvailabilityTab';
import BoardTab from './BoardTab';
import MyTripsTab from '../driver/MyTripsTab';
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
import PostAvailabilityModal from './PostAvailabilityModal';
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
  const [isPostFromFleetOpen, setIsPostFromFleetOpen] = useState(false);
  const [selectedFleetVehicle, setSelectedFleetVehicle] = useState<any>(null);
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
  const [jobs, setJobs] = useState<any[]>([]);
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
    make: '', model: '', plate: '', capacity: '', type: 'Flatbed', location: '', operating_range: ''
  });

  const [jobProposals, setJobProposals] = useState<any[]>([]);

  const marketItems = useMemo(() => {
    return availableFleets; // This will hold the socket data from marketplace_items
  }, [availableFleets]);

  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoadError(null);
      const [
        allTrips,
        walletData,
        transData,
        logisticsStats,
        logisticsDrivers,
        logisticsListings,
        logisticsAnalytics,
        logisticsFleet
      ] = await Promise.all([
        api.getLogisticsTrips().catch((e) => { console.warn('Trips failed:', e); return []; }),
        api.getWallet(user.id).catch((e) => { console.warn('Wallet failed:', e); return {}; }),
        api.getWalletTransactions(user.id).catch((e) => { console.warn('Transactions failed:', e); return []; }),
        api.getLogisticsStats().catch((e) => { console.warn('Stats failed:', e); return {}; }),
        api.getLogisticsDrivers().catch((e) => { console.warn('Drivers failed:', e); return []; }),
        api.getLogisticsListings().catch((e) => { console.warn('Listings failed:', e); return []; }),
        api.getLogisticsAnalytics().catch((e) => { console.warn('Analytics failed:', e); return []; }),
        api.getFleet().catch((e) => { console.warn('Fleet failed:', e); return []; })
      ]);

      setWallet(walletData);
      setTransactions(Array.isArray(transData) ? transData : []);

      setStats(logisticsStats as any);
      setDrivers(logisticsDrivers);
      setListings(logisticsListings);
      setAnalytics(logisticsAnalytics);
      setFleet(Array.isArray(logisticsFleet) ? logisticsFleet : []);

      setJobs((Array.isArray(allTrips) ? allTrips : []).map((d: any) => ({
        ...d,
        type: (['Waiting for Driver Commitment', 'Pending Deposit', 'Active (Waiting Delivery)', 'In Transit'].includes(d.status)) ? 'Active' : 'History',
        date: d.created_at ? new Date(d.created_at).toLocaleDateString() : 'Just now'
      })));

      setAcceptedJobs((Array.isArray(allTrips) ? allTrips : []).filter((j: any) => j.status !== 'Delivered' && j.status !== 'Completed').map((j: any) => ({
        ...j,
        assignedDriver: j.assigned_driver_id || null
      })));
    } catch (err) {
      console.error("Failed to load logistics data:", err);
      setLoadError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  useEffect(() => {
    loadData();

    // Socket Integration
    const newSocket = io('http://localhost:5000');

    newSocket.on('connect', () => {
      console.log('Logistics Socket Connected');
      newSocket.emit('join_room', user.id);
      newSocket.emit('request_market_data');
    });

    newSocket.on('market_data_update', (data: any[]) => {
      console.log('Logistics Socket: Received unified market data', data.length);
      console.log('Transport/Logistics items:', data.filter((item: any) => item.cat === 'Transport/Logistics').length);
      console.log('Sample Transport item:', data.find((item: any) => item.cat === 'Transport/Logistics'));
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
      { id: 'MyTrips', icon: <Megaphone size={20} />, label: 'My Trips' },
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        return await fileToBase64(file);
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to process image.');
        return null;
      }
    }
    return null;
  };

  const handleImageRemove = () => {
    // No longer needed in parent
  };

  const handleAddVehicle = async (e: React.FormEvent, images: string[]) => {
    e.preventDefault();
    if (!newVehicle.make || !newVehicle.plate) return;

    await api.addVehicle({
      ...newVehicle,
      status: 'Available',
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400'],
      ownerId: user.id
    });

    setIsAddVehicleOpen(false);
    setNewVehicle({ make: '', model: '', plate: '', capacity: '', type: 'Flatbed', location: '', operating_range: '' });
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
      case 'MyTrips':
        return <MyTripsTab jobs={jobs} handleAcceptJob={handleAcceptJob} loadData={loadData} />;
      case 'Fleet':
        return (
          <FleetTab
            fleet={fleet}
            setIsAddVehicleOpen={setIsAddVehicleOpen}
            handleDeleteVehicle={handleDeleteVehicle}
            onPostVehicle={async (vehicle) => {
              // One-Click Posting if data is complete
              if (vehicle.price && vehicle.location) {
                // Show loading feedback (optional, or use toast promise)
                try {
                  await api.postVehicleAvailability({
                    location: vehicle.location,
                    operatingRange: vehicle.operating_range || 'National',
                    price: vehicle.price,
                    capacity: vehicle.capacity || 'N/A',
                    vehicleType: vehicle.type,
                    manufacturer: vehicle.make,
                    model: vehicle.model,
                    images: vehicle.images || (vehicle.image ? [vehicle.image, '', ''] : ['', '', ''])
                  });
                  // Refresh listings
                  const freshListings = await api.getLogisticsListings();
                  setListings(freshListings);
                  // We rely on socket for 'availableFleets' update, or force refresh if needed.
                  // Toast happens inside API service? If not, we should adding it here?
                  // Assuming API service doesn't toast, we can add toast here if we had access to addToast
                  // But existing handleSuccess logic confirms posting.
                } catch (e) {
                  console.error("Quick post failed", e);
                  // Fallback to modal on error
                  setSelectedFleetVehicle(vehicle);
                  setIsPostFromFleetOpen(true);
                }
              } else {
                // Fallback to modal if missing data
                setSelectedFleetVehicle(vehicle);
                setIsPostFromFleetOpen(true);
              }
            }}
          />
        );
      case 'Drivers':
        return <DriversTab drivers={drivers} />;
      case 'Availability':
        const refreshListings = async () => {
          try {
            const freshListings = await api.getLogisticsListings();
            setListings(freshListings);
          } catch (e) {
            console.error('Failed to refresh listings:', e);
          }
        };
        return <AvailabilityTab user={user} listings={listings} onRefresh={refreshListings} />;
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
        {loadError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-800 dark:text-red-200 font-bold">Error loading dashboard data: {loadError}</p>
            <button
              onClick={() => loadData()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold"
            >
              Retry
            </button>
          </div>
        )}
        {renderContent()}

        <AddVehicleModal
          isOpen={isAddVehicleOpen}
          onClose={() => setIsAddVehicleOpen(false)}
          handleAddVehicle={handleAddVehicle}
          newVehicle={newVehicle}
          setNewVehicle={setNewVehicle}
          handleImageUpload={handleImageUpload}
        />

        <PostAvailabilityModal
          isOpen={isPostFromFleetOpen}
          onClose={() => setIsPostFromFleetOpen(false)}
          user={user}
          onSuccess={async () => {
            // Refresh listings after posting
            const freshListings = await api.getLogisticsListings();
            setListings(freshListings);
          }}
          postVehicleAvailability={api.postVehicleAvailability}
          initialData={selectedFleetVehicle ? {
            manufacturer: selectedFleetVehicle.make,
            model: selectedFleetVehicle.model,
            vehicleType: selectedFleetVehicle.type,
            capacity: selectedFleetVehicle.capacity,
            location: selectedFleetVehicle.location, // Pre-fill location
            operatingRange: selectedFleetVehicle.operating_range, // Pre-fill range
            images: selectedFleetVehicle.images || (selectedFleetVehicle.image ? [selectedFleetVehicle.image, '', ''] : ['', '', ''])
          } : {}}
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