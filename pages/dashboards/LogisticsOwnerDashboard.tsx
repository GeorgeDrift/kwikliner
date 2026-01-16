
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import {
  LayoutGrid, Truck, Box, MessageSquare, Activity, FileText,
  Globe, UserCheck, Settings, LogOut, ChevronDown, Search,
  Bell, Plus, ArrowRight, Gavel, DollarSign, Clock, ShieldCheck,
  Briefcase, Users, PieChart, BarChart3, Trash2, X, Upload,
  Image as ImageIcon, MapPin, MoreHorizontal, TrendingUp, Info, Award, Filter, Megaphone, Menu
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

interface LogisticsOwnerDashboardProps { user: User; }

const LogisticsOwnerDashboard: React.FC<LogisticsOwnerDashboardProps> = ({ user }) => {
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

  // Fleet State (Fetched from API)
  const [fleet, setFleet] = useState<any[]>([]);

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

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const jobs = await api.getAvailableJobs();
        if (Array.isArray(jobs)) {
          // Transform or add mock fields missing in API
          setJobProposals(jobs.map(j => ({
            ...j,
            deadline: '2 days',
            status: 'New'
          })));
        }
      } catch (e) { console.error(e); }
    };
    fetchProposals();
  }, []);

  // Simulation: You win a bid after 12 seconds (for testing)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (jobProposals.length > 0) {
        setCommitmentJob(jobProposals[0]);
        setIsCommitModalOpen(true);
      }
    }, 12000);
    return () => clearTimeout(timer);
  }, [jobProposals.length]);

  const [acceptedJobs, setAcceptedJobs] = useState([
    { id: 'JOB-992', shipper: 'Global Exporters', route: 'Zomba → Lilongwe', cargo: 'Tobacco (12T)', price: 'MWK 420,000', deadline: '1 day', status: 'Approved / Waiting Pick up', assignedDriver: null },
    { id: 'JOB-002', shipper: 'BuildMart Ltd', route: 'Mzuzu → Zomba', cargo: 'Cement & Steel (18T)', price: 'MWK 380,000', deadline: '3 days', status: 'Assigned', assignedDriver: 'John Kamwana' },
  ]);

  const handleAcceptJob = async (job: any) => {
    try {
      await api.acceptJob(job.id, user.id);

      // Remove from proposals
      setJobProposals(prev => prev.filter(p => p.id !== job.id));
      // Add to accepted jobs
      const newJob = {
        ...job,
        status: 'Approved / Waiting Pick up',
        assignedDriver: null
      };
      setAcceptedJobs(prev => [newJob, ...prev]);
      // Notify user
      alert(`Job accepted! Shipper notified that trip is approved and waiting to pick up.`);
    } catch (e) {
      console.error(e);
      alert('Failed to accept job. Please try again.');
    }
  };

  const handleLogisticsCommit = async (decision: 'COMMIT' | 'DECLINE') => {
    if (!commitmentJob) return;
    try {
      await api.driverCommitToJob(commitmentJob.id, decision, decision === 'DECLINE' ? declineReason : undefined);

      if (decision === 'COMMIT') {
        alert("Trip activated! Your fleet has committed to this job.");
        setAcceptedJobs(prev => [{ ...commitmentJob, status: 'Ready for Pickup' }, ...prev]);
      } else {
        alert("Job declined. The shipper has been notified.");
      }

      setIsCommitModalOpen(false);
      setCommitmentJob(null);
      setDeclineReason('');
    } catch (err) {
      alert("Failed to process commitment.");
    }
  };

  const menuSections = {
    MAIN_MENU: [
      { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Fleet Overview' },
      { id: 'Fleet', icon: <Truck size={20} />, label: 'My Fleet' },
      { id: 'Drivers', icon: <Users size={20} />, label: 'Drivers' },
      { id: 'Availability', icon: <Megaphone size={20} />, label: 'Post Availability' },
      { id: 'Board', icon: <Briefcase size={20} />, label: 'Jobs Proposal' },
      { id: 'Message', icon: <MessageSquare size={20} />, label: 'Bids Inbox', badge: 4 },
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
        return <JobsTab acceptedJobs={acceptedJobs} />;
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
      case 'Report':
        return <ReportTab />;
      case 'Message':
        return (
          <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] animate-in fade-in duration-500">
            <ChatWidget userType="LogisticsOwner" />
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

      {/* MOBILE HEADER */}
      <header className="md:hidden bg-white border-b border-slate-100 p-4 sticky top-0 z-[150] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#6366F1] p-2 rounded-xl shadow-lg shadow-indigo-100">
            <Globe className="text-white" size={20} />
          </div>
          <span className="font-black tracking-tighter text-lg">KwikLiner</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all">
          <Menu size={24} />
        </button>
      </header>
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
                    onClick={() => item.id === 'Logout' ? navigate('/') : setActiveMenu(item.id)}
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