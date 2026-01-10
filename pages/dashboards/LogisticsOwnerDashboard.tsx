
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { 
  LayoutGrid, Truck, Box, MessageSquare, Activity, FileText, 
  Globe, UserCheck, Settings, LogOut, ChevronDown, Search, 
  Bell, Plus, ArrowRight, Gavel, DollarSign, Clock, ShieldCheck,
  Briefcase, Users, PieChart, BarChart3, Trash2, X, Upload, 
  Image as ImageIcon, MapPin, MoreHorizontal
} from 'lucide-react';
import ChatWidget from '../../components/ChatWidget';
import { api } from '../../services/api';

interface LogisticsOwnerDashboardProps { user: User; }

const LogisticsOwnerDashboard: React.FC<LogisticsOwnerDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  // Fleet State (Fetched from API)
  const [fleet, setFleet] = useState<any[]>([]);

  useEffect(() => {
    loadFleet();
  }, []);

  const loadFleet = async () => {
    const data = await api.getFleet(user.id);
    setFleet(data);
  };

  const [newVehicle, setNewVehicle] = useState({
    make: '', model: '', plate: '', capacity: '', type: 'Flatbed'
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const menuSections = {
    MAIN_MENU: [
      { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Fleet Overview' },
      { id: 'Fleet', icon: <Truck size={20} />, label: 'My Fleet' },
      { id: 'Drivers', icon: <Users size={20} />, label: 'Drivers' },
      { id: 'Board', icon: <Gavel size={20} />, label: 'Bidding Board' },
      { id: 'Message', icon: <MessageSquare size={20} />, label: 'Bids Inbox', badge: 4 },
    ],
    OPERATIONS: [
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
          <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-500">
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
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Fleet Capacity</h3>
               <div className="flex items-baseline space-x-2 mb-8">
                  <span className="text-4xl font-black tracking-tighter">84%</span>
                  <span className="text-xs font-black text-indigo-500">Utilization</span>
               </div>
               <div className="flex space-x-1.5 h-16 items-end">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={`flex-1 rounded-full ${i < 17 ? 'bg-[#6366F1]' : 'bg-slate-100'}`} style={{ height: `${Math.random() * 60 + 40}%` }}></div>
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
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                        vehicle.status === 'Available' ? 'bg-green-500 text-white' : 
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
                      <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                         <Box size={14} /> {vehicle.capacity}
                      </div>
                      <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                         <Activity size={14} /> {vehicle.type}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-slate-50">
                      <button className="flex-1 py-3 bg-[#6366F1] text-white rounded-xl font-black text-[10px] uppercase tracking-widest">
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
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">{title.replace('_', ' ')}</p>
              <div className="space-y-1">
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => item.id === 'Logout' ? navigate('/') : setActiveMenu(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                      activeMenu === item.id 
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
                    {item.badge && <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto p-8 pt-16 relative">
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
                          <span className="text-[10px] font-black uppercase tracking-widest">Upload Photo</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                  
                  <div className="w-full md:w-2/3 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Make</label>
                        <input 
                          required
                          value={newVehicle.make}
                          onChange={e => setNewVehicle({...newVehicle, make: e.target.value})}
                          placeholder="e.g. Volvo" 
                          className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Model</label>
                        <input 
                          required
                          value={newVehicle.model}
                          onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                          placeholder="e.g. FH16" 
                          className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">License Plate</label>
                      <input 
                        required
                        value={newVehicle.plate}
                        onChange={e => setNewVehicle({...newVehicle, plate: e.target.value})}
                        placeholder="e.g. MC 9928" 
                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                        <input 
                          required
                          value={newVehicle.capacity}
                          onChange={e => setNewVehicle({...newVehicle, capacity: e.target.value})}
                          placeholder="e.g. 30T" 
                          className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                        <select 
                          value={newVehicle.type}
                          onChange={e => setNewVehicle({...newVehicle, type: e.target.value})}
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
    