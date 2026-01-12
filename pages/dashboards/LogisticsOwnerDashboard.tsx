
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import {
  LayoutGrid, Truck, Box, MessageSquare, Activity, FileText,
  Globe, UserCheck, Settings, LogOut, ChevronDown, Search,
  Bell, Plus, ArrowRight, Gavel, DollarSign, Clock, ShieldCheck,
  Briefcase, Users, PieChart, BarChart3, Trash2, X, Upload,
  Image as ImageIcon, MapPin, MoreHorizontal, TrendingUp, Info, Award, Filter, Megaphone
} from 'lucide-react';
import ChatWidget from '../../components/ChatWidget';
import { api } from '../../services/api';

interface LogisticsOwnerDashboardProps { user: User; }

const LogisticsOwnerDashboard: React.FC<LogisticsOwnerDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [jobsTab, setJobsTab] = useState<'requests' | 'bids' | 'proposed'>('requests');
  const [fromLocation, setFromLocation] = useState('All');
  const [toLocation, setToLocation] = useState('All');

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

  const [jobProposals, setJobProposals] = useState([
    { id: 'JP-001', shipper: 'AgriCorp Malawi', route: 'Lilongwe → Blantyre', cargo: 'Fertilizer (25T)', price: 'MWK 450,000', deadline: '2 days', status: 'New' },
    { id: 'JP-002', shipper: 'BuildMart Ltd', route: 'Mzuzu → Zomba', cargo: 'Cement & Steel (18T)', price: 'MWK 380,000', deadline: '3 days', status: 'New' },
    { id: 'JP-003', shipper: 'FreshProduce Co', route: 'Blantyre → Lilongwe', cargo: 'Fresh Produce (12T)', price: 'MWK 280,000', deadline: '1 day', status: 'Urgent' },
    { id: 'JP-004', shipper: 'TechSupply MW', route: 'Zomba → Mzuzu', cargo: 'Electronics (8T)', price: 'MWK 320,000', deadline: '4 days', status: 'New' },
  ]);

  const [acceptedJobs, setAcceptedJobs] = useState([
    { id: 'JOB-992', shipper: 'Global Exporters', route: 'Zomba → Lilongwe', cargo: 'Tobacco (12T)', price: 'MWK 420,000', deadline: '1 day', status: 'Approved / Waiting Pick up', assignedDriver: null },
    { id: 'JOB-002', shipper: 'BuildMart Ltd', route: 'Mzuzu → Zomba', cargo: 'Cement & Steel (18T)', price: 'MWK 380,000', deadline: '3 days', status: 'Assigned', assignedDriver: 'John Kamwana' },
  ]);

  const handleAcceptJob = (job: any) => {
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
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-12 gap-8">
              {/* Same widgets as before, keeping layout consistent */}
              <div className="col-span-12 md:col-span-4 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm relative overflow-hidden group">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Gross Revenue</h3>
                <div className="flex items-end space-x-4 mb-8">
                  <span className="text-4xl font-black tracking-tighter">MWK 12.8M</span>
                  <span className="text-xs font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">↑ 22%</span>
                </div>
                <div className="h-24 w-full flex items-end space-x-1">
                  {[40, 60, 30, 80, 50, 90, 70, 45, 85].map((h, i) => (
                    <div key={i} className="flex-grow bg-indigo-50 rounded-t-lg group-hover:bg-indigo-600 transition-all" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
              {/* ... other overview widgets ... */}
              <div className="col-span-12 md:col-span-4 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Fleet Size</h3>
                <div className="flex items-baseline space-x-2 mb-8">
                  <span className="text-4xl font-black tracking-tighter">{fleet.length > 0 ? fleet.length : 12} Trucks</span>
                  <span className="text-xs font-black text-indigo-500">Active</span>
                </div>
                <div className="flex space-x-1.5 h-16 items-end">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={`flex-1 rounded-full ${i < (fleet.length > 0 ? fleet.length : 12) ? 'bg-[#6366F1]' : 'bg-slate-100'}`} style={{ height: `${Math.random() * 60 + 40}%` }}></div>
                  ))}
                </div>
              </div>
              {/* ... rest of overview ... */}
              <div className="col-span-12 md:col-span-4 bg-[#6366F1] p-10 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black leading-tight mb-4">Market Discovery</h3>
                  <p className="text-indigo-100 text-sm font-medium mb-8">Discover new high-value freight manifests globally.</p>
                  <button onClick={() => navigate('/')} className="w-full py-4 bg-white text-[#6366F1] rounded-2xl font-black text-sm uppercase tracking-widest">
                    Find Loads
                  </button>
                </div>
                <Globe size={200} className="absolute right-[-60px] top-[-60px] opacity-[0.05]" />
              </div>
            </div>

            {/* New Widgets Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Your Listings Widget */}
              <div className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-slate-900">Your Listings</h3>
                  <button onClick={() => setActiveMenu('Availability')} className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {[
                    { id: 1, route: 'Lilongwe, Blantyre, Mzuzu', capacity: '180T', status: 'Active' },
                    { id: 2, route: 'Blantyre, Zomba, Mangochi', capacity: '120T', status: 'Active' }
                  ].map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{listing.route}</h4>
                        <p className="text-xs font-bold text-slate-400 mt-1">{listing.capacity} Capacity</p>
                      </div>
                      <span className="px-3 py-1.5 bg-green-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                        {listing.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Job Requests Widget */}
              <div className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-slate-900">Top Job Requests</h3>
                  <button onClick={() => { setActiveMenu('Board'); setJobsTab('requests'); }} className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {[
                    { id: 1, shipper: 'AgriCorp Malawi', route: 'Lilongwe → Blantyre', cargo: 'Fertilizer (25T)', status: 'New' },
                    { id: 2, shipper: 'FreshProduce Co', route: 'Blantyre → Lilongwe', cargo: 'Fresh Produce (12T)', status: 'Urgent' }
                  ].map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 cursor-pointer">
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-black text-slate-900">{job.route}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${job.status === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {job.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400">{job.shipper} • {job.cargo}</p>
                      </div>
                      <button className="ml-4 p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Fleet':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">My Fleet</h3>
                <p className="text-slate-500 font-medium mt-1 text-sm">Manage your vehicle roster and availability.</p>
              </div>
              <button
                onClick={() => setIsAddVehicleOpen(true)}
                className="bg-[#6366F1] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Plus size={18} /> Add Vehicle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fleet.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all group">
                  <div className="h-56 overflow-hidden relative">
                    <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg ${vehicle.status === 'Available' ? 'bg-green-500 text-white' :
                        vehicle.status === 'In Transit' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
                        }`}>
                        {vehicle.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-xl font-black text-slate-900">{vehicle.make} {vehicle.model}</h4>
                        <p className="text-sm font-bold text-slate-400 mt-1">{vehicle.plate}</p>
                      </div>
                      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <Truck size={20} />
                      </div>
                    </div>

                    <div className="flex gap-4 mb-8">
                      <div className="px-4 py-2 bg-slate-50 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Box size={14} /> {vehicle.capacity}
                      </div>
                      <div className="px-4 py-2 bg-slate-50 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Activity size={14} /> {vehicle.type}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-slate-50">
                      <button className="flex-1 py-3 bg-[#6366F1] text-white rounded-xl font-black text-[11px] uppercase tracking-widest">
                        Manage
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="p-3 border-2 border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Placeholder */}
              <button
                onClick={() => setIsAddVehicleOpen(true)}
                className="min-h-[400px] border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-[#6366F1] hover:text-[#6366F1] hover:bg-indigo-50/10 transition-all"
              >
                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                  <Plus size={32} />
                </div>
                <span className="font-black uppercase tracking-widest text-sm">Add New Truck</span>
              </button>
            </div>
          </div>
        );

      case 'Drivers':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Driver Management</h3>
                <p className="text-slate-500 font-medium mt-1 text-sm">Monitor and manage your driver roster.</p>
              </div>
              <button
                className="bg-[#6366F1] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Plus size={18} /> Add Driver
              </button>
            </div>

            {/* Driver Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Total Drivers</h4>
                  <Users className="text-blue-600" size={20} />
                </div>
                <p className="text-3xl font-black text-slate-900">{drivers.length}</p>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Available Now</h4>
                  <ShieldCheck className="text-green-600" size={20} />
                </div>
                <p className="text-3xl font-black text-slate-900">{drivers.filter(d => d.status === 'Available').length}</p>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Total Trips</h4>
                  <Activity className="text-indigo-600" size={20} />
                </div>
                <p className="text-3xl font-black text-slate-900">{drivers.reduce((sum, d) => sum + d.trips, 0)}</p>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">On Job</h4>
                  <Activity className="text-orange-600" size={20} />
                </div>
                <p className="text-3xl font-black text-slate-900">{drivers.filter(d => d.status === 'On Job').length}</p>
              </div>
            </div>

            {/* Driver Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {drivers.map((driver) => (
                <div key={driver.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all group">
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={driver.image}
                        alt={driver.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-slate-100"
                      />
                      <div className="flex-grow">
                        <h4 className="text-lg font-black text-slate-900">{driver.name}</h4>
                        <p className="text-xs font-bold text-slate-400 mt-1">{driver.phone}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${driver.status === 'Available' ? 'bg-green-500 text-white' :
                        driver.status === 'On Job' ? 'bg-orange-500 text-white' : 'bg-slate-300 text-slate-600'
                        }`}>
                        {driver.status}
                      </span>
                    </div>

                    {driver.currentJob && (
                      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                        <p className="text-xs font-black uppercase tracking-widest text-orange-600 mb-1">Current Assignment</p>
                        <p className="text-sm font-bold text-slate-900">{driver.currentJob}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-slate-50 rounded-2xl">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Trips</p>
                        <p className="text-xl font-black text-slate-900">{driver.trips}</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-2xl">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                        <p className="text-xs font-black text-slate-900">{driver.status}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        disabled={driver.status !== 'Available'}
                        className={`flex-grow py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${driver.status === 'Available'
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                      >
                        Assign Job
                      </button>
                      <button className="px-4 py-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Driver Placeholder */}
              <button
                className="min-h-[350px] border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-[#6366F1] hover:text-[#6366F1] hover:bg-indigo-50/10 transition-all"
              >
                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                  <Plus size={32} />
                </div>
                <span className="font-black uppercase tracking-widest text-sm">Add New Driver</span>
              </button>
            </div>
          </div>
        );

      case 'Availability':
        const companyPostings = [
          { id: 'CP-001', status: 'Active', fleetSize: '12 Trucks', capacity: '180T Total', routes: 'Lilongwe, Blantyre, Mzuzu', rate: 'MWK 15/km', posted: '2 days ago' },
          { id: 'CP-002', status: 'Active', fleetSize: '8 Trucks', capacity: '120T Total', routes: 'Blantyre, Zomba, Mangochi', rate: 'MWK 18/km', posted: '5 days ago' },
        ];

        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Post Availability</h3>
                <p className="text-slate-500 font-medium mt-1 text-sm">Advertise your fleet and services to attract shippers.</p>
              </div>
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2 hover:scale-105 transition-all">
                <Plus size={18} />
                New Posting
              </button>
            </div>

            {/* Active Postings */}
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Your Active Postings</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {companyPostings.map((posting) => (
                  <div key={posting.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h5 className="text-xl font-black text-slate-900">{user.companyName || 'KwikLine Transport'}</h5>
                        <p className="text-xs font-bold text-slate-400 mt-1">Listed {posting.posted}</p>
                      </div>
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500 text-white">
                        {posting.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <Truck className="text-indigo-600" size={16} />
                        <span className="text-sm font-bold text-slate-900">{posting.fleetSize}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Box className="text-blue-600" size={16} />
                        <span className="text-sm font-bold text-slate-900">Capacity: {posting.capacity}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="text-green-600" size={16} />
                        <span className="text-sm font-bold text-slate-900">{posting.routes}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="text-green-600" size={16} />
                        <span className="text-sm font-black text-green-600">{posting.rate}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-grow py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition-all">
                        Edit Posting
                      </button>
                      <button className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all">
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Create New Posting Placeholder */}
                <button className="min-h-[320px] border-4 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/10 transition-all">
                  <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                    <Megaphone size={32} />
                  </div>
                  <span className="font-black uppercase tracking-widest text-sm">Create New Post</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'Jobs':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">My Jobs</h3>
                <p className="text-slate-500 font-medium mt-1 text-sm">Manage confirmed jobs and assign drivers.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:border-indigo-600 transition-colors">
                  All ({acceptedJobs.length})
                </button>
                <button className="px-6 py-3 bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-700 transition-colors">
                  Unassigned ({acceptedJobs.filter(j => !j.assignedDriver).length})
                </button>
              </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {acceptedJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-black text-slate-900">{job.route}</h4>
                      <p className="text-xs font-bold text-slate-400 mt-1">{job.shipper}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${!job.assignedDriver ? 'bg-orange-500 text-white animate-pulse shadow-lg shadow-orange-100' : 'bg-green-500 text-white'
                      }`}>
                      {job.status}
                    </span>
                  </div>

                  {job.assignedDriver && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-xs font-black uppercase tracking-widest text-green-600 mb-1">Assigned Driver</p>
                      <p className="text-sm font-bold text-slate-900">{job.assignedDriver}</p>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Box className="text-slate-400" size={16} />
                      <span className="font-bold text-slate-900">{job.cargo}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <DollarSign className="text-green-600" size={16} />
                      <span className="font-black text-green-600">{job.price}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="text-orange-600" size={16} />
                      <span className="font-bold text-slate-600">Deadline: {job.deadline}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!job.assignedDriver ? (
                      <button className="flex-grow py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100">
                        <UserCheck size={14} />
                        Assign Driver
                      </button>
                    ) : (
                      <button className="flex-grow py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition-all">
                        View Details
                      </button>
                    )}
                    <button className="px-4 py-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Board':
        const marketplaceJobs = [
          { id: 'MJ-501', shipper: 'Export Co Ltd', from: 'Blantyre', to: 'Mozambique Border', cargo: 'General Cargo (22T)', budget: 'Open Bid', bids: 8, deadline: '5 days' },
          { id: 'MJ-502', shipper: 'Mining Corp', from: 'Lilongwe', to: 'Kasungu', cargo: 'Mining Equipment (30T)', budget: 'MWK 680,000', bids: 12, deadline: '7 days' },
          { id: 'MJ-503', shipper: 'RetailChain MW', from: 'Mzuzu', to: 'Rumphi', cargo: 'Consumer Goods (15T)', budget: 'Open Bid', bids: 5, deadline: '3 days' },
          { id: 'MJ-504', shipper: 'ConstructCo', from: 'Zomba', to: 'Mangochi', cargo: 'Building Materials (20T)', budget: 'MWK 420,000', bids: 7, deadline: '4 days' },
          { id: 'MJ-505', shipper: 'AgriExport MW', from: 'Lilongwe', to: 'Blantyre', cargo: 'Agricultural Products (16T)', budget: 'Open Bid', bids: 9, deadline: '4 days' },
          { id: 'MJ-506', shipper: 'TechDist Ltd', from: 'Blantyre', to: 'Lilongwe', cargo: 'Electronics (10T)', budget: 'MWK 290,000', bids: 6, deadline: '3 days' },
        ];

        const filteredMarketplaceJobs = marketplaceJobs.filter(job => {
          const matchesFrom = fromLocation === 'All' || job.from === fromLocation;
          const matchesTo = toLocation === 'All' || job.to === toLocation;
          return matchesFrom && matchesTo;
        });

        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Jobs Proposal</h3>
                <p className="text-slate-500 font-medium mt-1 text-sm">
                  {jobsTab === 'requests' ? 'Review incoming job proposals from shippers' : 'Browse and bid on marketplace jobs'}
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4">
              <button
                onClick={() => setJobsTab('requests')}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${jobsTab === 'requests' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-600'
                  }`}
              >
                Customer Requests ({jobProposals.length})
              </button>
              <button
                onClick={() => setJobsTab('bids')}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${jobsTab === 'bids' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-600'
                  }`}
              >
                Marketplace ({marketplaceJobs.length})
              </button>
              <button
                onClick={() => setJobsTab('proposed')}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${jobsTab === 'proposed' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-600'
                  }`}
              >
                My Proposals (2)
              </button>
            </div>

            {jobsTab === 'requests' ? (
              // Customer Requests Tab}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobProposals.map((job) => (
                  <div key={job.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-black text-slate-900">{job.route}</h4>
                        <p className="text-xs font-bold text-slate-400 mt-1">{job.shipper}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${job.status === 'Urgent' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <Box className="text-slate-400" size={16} />
                        <span className="font-bold text-slate-900">{job.cargo}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <DollarSign className="text-green-600" size={16} />
                        <span className="font-black text-green-600">{job.price}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="text-orange-600" size={16} />
                        <span className="font-bold text-slate-600">Deadline: {job.deadline}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptJob(job)}
                        className="flex-grow py-3 bg-green-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                      >
                        <UserCheck size={14} />
                        Accept Job
                      </button>
                      <button className="px-4 py-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobsTab === 'proposed' ? (
              // My Proposals Tab
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  { id: 'P-9902', route: 'Lilongwe → Bt', cargo: '50kg Bag', quote: 'MWK 420,000', status: 'Pending Approval', date: '10m ago' },
                  { id: 'P-9905', route: 'Blantyre → Mwanza', cargo: 'Cement (15T)', quote: 'MWK 380,000', status: 'In Review', date: '2h ago' },
                ].map((prop) => (
                  <div key={prop.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-lg font-black text-slate-900">{prop.route}</h4>
                        <p className="text-xs font-bold text-slate-400 mt-1">{prop.cargo}</p>
                      </div>
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                        {prop.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Quote</p>
                        <p className="text-xl font-black text-indigo-600 tracking-tight">{prop.quote}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sent</p>
                        <p className="text-xs font-bold text-slate-900">{prop.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Marketplace Bids Tab
              <div className="space-y-6">
                {/* Location Filters */}
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="text-sm font-bold text-slate-600">Filter by Route:</span>
                  <div className="flex gap-3">
                    <select
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer hover:border-indigo-600 transition-colors"
                    >
                      <option value="All">From: All</option>
                      <option value="Lilongwe">Lilongwe</option>
                      <option value="Blantyre">Blantyre</option>
                      <option value="Mzuzu">Mzuzu</option>
                      <option value="Zomba">Zomba</option>
                    </select>
                    <select
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer hover:border-indigo-600 transition-colors"
                    >
                      <option value="All">To: All</option>
                      <option value="Blantyre">Blantyre</option>
                      <option value="Lilongwe">Lilongwe</option>
                      <option value="Kasungu">Kasungu</option>
                      <option value="Mzuzu">Mzuzu</option>
                      <option value="Rumphi">Rumphi</option>
                      <option value="Zomba">Zomba</option>
                      <option value="Mangochi">Mangochi</option>
                      <option value="Mozambique Border">Mozambique Border</option>
                    </select>
                  </div>
                  <span className="text-xs text-slate-400">({filteredMarketplaceJobs.length} jobs found)</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredMarketplaceJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-black text-slate-900">{job.from} → {job.to}</h4>
                          <p className="text-xs font-bold text-slate-400 mt-1">{job.shipper}</p>
                        </div>
                        <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-500 text-white">
                          {job.bids} Bids
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm">
                          <Box className="text-slate-400" size={16} />
                          <span className="font-bold text-slate-900">{job.cargo}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <DollarSign className={job.budget === 'Open Bid' ? 'text-amber-600' : 'text-green-600'} size={16} />
                          <span className={`font-black ${job.budget === 'Open Bid' ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded' : 'text-green-600'}`}>
                            {job.budget === 'Open Bid' ? 'Open for Bidding' : `Budget: ${job.budget}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="text-orange-600" size={16} />
                          <span className="font-bold text-slate-600">Deadline: {job.deadline}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className={`flex-grow py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${job.budget === 'Open Bid' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-green-600 hover:bg-green-700 shadow-green-100'}`}>
                          <Briefcase size={14} />
                          {job.budget === 'Open Bid' ? 'Submit Bid' : 'Accept Job'}
                        </button>
                        <button className="px-4 py-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'Report':
        const lGraphData = [35, 55, 45, 85, 65, 95, 75, 100, 90, 70, 85, 98];
        const lPoints = lGraphData.map((val, i) => ({
          x: (i / (lGraphData.length - 1)) * 100,
          y: 100 - val
        }));
        const lPathData = `M ${lPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
        const lAreaPathData = `${lPathData} L 100 100 L 0 100 Z`;

        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Fleet Performance Analytics</h3>
                <p className="text-slate-500 font-medium mt-2 text-lg">Optimizing your fleet efficiency and revenue streams.</p>
              </div>
              <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-[24px] border border-white shadow-xl flex gap-1">
                {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(t => (
                  <button key={t} className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${t === 'Monthly' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'text-slate-400 hover:text-slate-900 hover:bg-white/80'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[56px] text-white shadow-2xl shadow-blue-200 transition-all hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all"></div>
                <div className="relative z-10">
                  <div className="h-16 w-16 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-8">
                    <DollarSign size={32} />
                  </div>
                  <p className="text-[11px] font-black text-blue-100 uppercase tracking-widest mb-2 opacity-80 decoration-blue-400/50 underline-offset-4 underline">Total Fleet Revenue</p>
                  <h4 className="text-5xl font-black tracking-tight mb-4">MWK 12.8M</h4>
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-100 bg-white/10 w-fit px-4 py-1.5 rounded-full">
                    <TrendingUp size={16} />
                    <span>+22% this quarter</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-xl transition-all hover:-translate-y-2 group">
                <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Truck size={32} />
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Fleet Utilization</p>
                <h4 className="text-5xl font-black text-slate-900 tracking-tight mb-4">88.5%</h4>
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 w-fit px-4 py-1.5 rounded-full">
                  <Activity size={16} />
                  <span>Areas Visited</span>
                </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[56px] text-white shadow-2xl transition-all hover:-translate-y-2 group">
                <div className="relative z-10">
                  <div className="h-16 w-16 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-all">
                    <Award size={32} className="text-indigo-400" />
                  </div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Requests</p>
                  <h4 className="text-5xl font-black tracking-tight mb-4">1,842</h4>
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-400 bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/10">
                    <span>Performance Tracking</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 xl:col-span-8 bg-slate-900 p-12 rounded-[64px] shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h4 className="text-2xl font-black text-white tracking-tight">Inflows & outflows</h4>
                  </div>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <MoreHorizontal size={24} />
                  </button>
                </div>

                {/* Graph Container with Grid Background */}
                <div className="relative mb-8">
                  {/* Grid Background Pattern */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(71, 85, 105, 0.15) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(71, 85, 105, 0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 40px'
                  }}></div>

                  {/* SVG Graph */}
                  <div className="relative h-64 w-full">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                      <defs>
                        <linearGradient id="fleetDarkGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      {/* Filled gradient area */}
                      <path d={lAreaPathData} fill="url(#fleetDarkGradient)" />
                      {/* Dotted line overlay */}
                      <path
                        d={lPathData}
                        fill="none"
                        stroke="rgba(148, 163, 184, 0.8)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    {/* Date Labels */}
                    <div className="absolute -bottom-8 w-full flex justify-between px-2">
                      {['3 Jul', '7 Jul', '11 Jul', '15 Jul', '19 Jul', '23 Jul', '27 Jul', '31 Jul'].map((date, i) => (
                        <span key={i} className="text-[10px] font-medium text-slate-500">{date}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Time Period Filters */}
                <div className="flex items-center gap-3 mt-16 pt-6 border-t border-slate-800">
                  <button className="px-6 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
                    Max
                  </button>
                  <button className="px-6 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors">
                    12 months
                  </button>
                  <button className="px-6 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors">
                    30 days
                  </button>
                  <button className="px-6 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors">
                    7 days
                  </button>
                  <button className="px-6 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors">
                    24 hours
                  </button>
                  <div className="ml-auto flex items-center gap-2 text-slate-400">
                    <Filter size={16} />
                    <span className="text-xs font-bold">Filters</span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 xl:col-span-4 bg-indigo-600 p-12 rounded-[64px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  <h4 className="text-3xl font-black mb-8 leading-tight">Inspiring Success</h4>
                  <p className="text-indigo-100 font-medium text-lg leading-relaxed mb-10">"Your fleet has expanded from 3 to 12 vehicles in just 6 months. That's a 300% growth in logistics capacity!"</p>
                  <div className="bg-white/10 backdrop-blur-lg p-8 rounded-[40px] border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-xs font-black uppercase tracking-widest">Live Insight</span>
                    </div>
                    <p className="font-bold text-sm">Tanker routes towards Beira are currently 20% more profitable than Flatbed routes.</p>
                  </div>
                </div>
                <Activity className="absolute bottom-[-40px] right-[-40px] h-64 w-64 text-white/5 -rotate-12" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-[#F8F9FB] min-h-screen text-slate-900 overflow-hidden font-['Inter']">
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 shrink-0 h-screen">
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

      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto p-6 md:p-10 lg:p-14 pt-16 relative">
        {renderContent()}

        {/* Add Vehicle Modal */}
        {isAddVehicleOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddVehicleOpen(false)}></div>
            <div className="bg-white rounded-[40px] p-10 w-full max-w-2xl relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Add New Vehicle</h3>
                <button onClick={() => setIsAddVehicleOpen(false)} className="p-2 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-8">
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
                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-2 gap-4">
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
      </main>

      {/* Assistant Widget integration */}
      <ChatWidget user={user} />
    </div>
  );
};

export default LogisticsOwnerDashboard;
