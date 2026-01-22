
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, Vehicle } from '../types';
import {
  ArrowLeft, Save, CreditCard, Landmark, Smartphone, User as UserIcon,
  ShieldCheck, CheckCircle2, Plus, Trash2, Truck, FileText, PlusCircle, X,
  ChevronRight, ImageIcon, Info, Award, Globe
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/ToastContext';

interface SettingsProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdate }) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email || '',
    phone: user.phone,
    primaryPayoutMethod: user.primaryPayoutMethod || 'MOBILE_MONEY',
  });

  const [licenses, setLicenses] = useState<string[]>(user.licenses || []);
  const [newLicenseInput, setNewLicenseInput] = useState('');

  const [paymentAccounts, setPaymentAccounts] = useState<Required<User>['paymentAccounts']>(user.paymentAccounts || [
    { id: '1', type: 'BANK', name: 'Standard Bank', description: 'Personal Account **** 4756', isPrimary: user.primaryPayoutMethod === 'BANK' },
    { id: '2', type: 'MOBILE_MONEY', name: 'Airtel Money', description: '+265 999 123 456', isPrimary: user.primaryPayoutMethod === 'MOBILE_MONEY' }
  ]);

  const [fleet, setFleet] = useState<Vehicle[]>([
    { id: 'v1', make: 'Volvo', model: 'FH16', plate: 'MC 9928', capacity: '30T', type: 'FLATBED', status: 'Available', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400' }
  ]);

  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [newVehicle, setNewVehicle] = useState({
    make: '', model: '', plate: '', capacity: '', type: 'FLATBED' as Vehicle['type']
  });
  const [selectedVehicleImage, setSelectedVehicleImage] = useState<string | null>(null);

  const [newAccount, setNewAccount] = useState<{
    type: 'BANK' | 'MOBILE_MONEY';
    name: string;
    description: string;
  }>({
    type: 'BANK', name: '', description: ''
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      const updatedUser: User = {
        ...user,
        ...formData,
        licenses,
        paymentAccounts
      };
      onUpdate(updatedUser);
      setIsSaving(false);
      addToast("All changes have been synchronized successfully.", "success");
    }, 800);
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicle: Vehicle = {
      ...newVehicle,
      id: Math.random().toString(36).substr(2, 9),
      image: selectedVehicleImage || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400',
      status: 'Available'
    };
    setFleet([...fleet, vehicle]);
    setIsAddVehicleOpen(false);
    setNewVehicle({ make: '', model: '', plate: '', capacity: '', type: 'FLATBED' });
    setSelectedVehicleImage(null);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const account = {
      id: Math.random().toString(36).substr(2, 9),
      ...newAccount,
      isPrimary: false
    };
    setPaymentAccounts([...paymentAccounts, account]);
    setIsAddAccountOpen(false);
    setNewAccount({ type: 'BANK', name: '', description: '' });
  };

  const removeVehicle = (id: string) => {
    setFleet(fleet.filter(v => v.id !== id));
  };

  const removeAccount = (id: string) => {
    setPaymentAccounts(paymentAccounts.filter(a => a.id !== id));
  };

  const setPrimaryAccount = (id: string) => {
    setPaymentAccounts(paymentAccounts.map(a => ({
      ...a,
      isPrimary: a.id === id
    })));
    const account = paymentAccounts.find(a => a.id === id);
    if (account) {
      setFormData({ ...formData, primaryPayoutMethod: account.type });
    }
  };

  const addLicense = () => {
    if (newLicenseInput.trim()) {
      setLicenses([...licenses, newLicenseInput]);
      setNewLicenseInput('');
    }
  };

  const removeLicense = (idx: number) => {
    setLicenses(licenses.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen bg-[#F8F9FB] dark:bg-slate-900 transition-colors duration-200">
      <div className="flex justify-between items-start mb-16">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-slate-400 dark:text-slate-500 font-bold text-sm hover:text-blue-600 dark:hover:text-blue-400 mb-6 group transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">Command Center</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-2">Manage your professional credentials, fleet, and financials.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-12 py-5 rounded-[32px] font-black shadow-2xl hover:bg-blue-700 transition-all flex items-center space-x-3 active:scale-95 sticky top-12 z-20"
        >
          {isSaving ? <div className="h-6 w-6 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : <Save size={24} />}
          <span>{isSaving ? 'Synchronizing...' : 'Save All Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Left Column: Profile & Licenses */}
        <div className="col-span-12 lg:col-span-7 space-y-10">
          {/* Profile Section */}
          <section className="bg-white dark:bg-slate-800 p-12 rounded-[56px] border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
            <div className="flex items-center space-x-6 mb-12">
              <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-lg shadow-blue-100 dark:shadow-none">
                <UserIcon size={28} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Personal Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Legal Full Name</label>
                <input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-6 bg-slate-50 dark:bg-slate-900/50 dark:text-white rounded-[28px] font-black outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Contact Phone</label>
                <input
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-6 bg-slate-50 dark:bg-slate-900/50 dark:text-white rounded-[28px] font-black outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-6 bg-slate-50 dark:bg-slate-900/50 dark:text-white rounded-[28px] font-black outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
                />
              </div>
            </div>
          </section>

          {/* Licenses Section */}
          <section className="bg-white dark:bg-slate-800 p-12 rounded-[56px] border border-slate-100 dark:border-slate-700 shadow-xl">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center space-x-6">
                <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                  <Award size={28} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Driver Qualifications</h2>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              {licenses.map((license, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                      <FileText size={20} />
                    </div>
                    <span className="font-black text-slate-700 dark:text-slate-300">{license}</span>
                  </div>
                  <button onClick={() => removeLicense(idx)} className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <div className="relative flex-grow">
                <FileText className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={20} />
                <input
                  placeholder="Enter new license or permit name..."
                  value={newLicenseInput}
                  onChange={e => setNewLicenseInput(e.target.value)}
                  className="w-full pl-16 pr-6 py-6 bg-slate-50 dark:bg-slate-900/50 dark:text-white rounded-[28px] font-black outline-none border-2 border-transparent focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />
              </div>
              <button
                onClick={addLicense}
                className="bg-indigo-600 text-white p-6 rounded-[28px] font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center aspect-square"
              >
                <Plus size={28} />
              </button>
            </div>
          </section>

          {/* Fleet Management (Driver only) */}
          {user.role === UserRole.DRIVER && (
            <section className="bg-white dark:bg-slate-800 p-12 rounded-[56px] border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden relative">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center space-x-6">
                  <div className="bg-emerald-600 p-4 rounded-3xl text-white shadow-lg shadow-emerald-100 dark:shadow-none">
                    <Truck size={28} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Fleet</h2>
                </div>
                <button
                  onClick={() => setIsAddVehicleOpen(true)}
                  className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                >
                  <PlusCircle size={18} className="inline mr-2" /> Add Vehicle
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fleet.map((vehicle) => (
                  <div key={vehicle.id} className="group bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border border-slate-100 dark:border-slate-700 overflow-hidden hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all">
                    <div className="h-40 overflow-hidden relative">
                      <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                        {vehicle.status}
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white text-lg">{vehicle.make} {vehicle.model}</h4>
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{vehicle.plate}</p>
                        </div>
                        <button onClick={() => removeVehicle(vehicle.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase border border-slate-100 dark:border-slate-700">{vehicle.capacity}</span>
                        <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase border border-slate-100 dark:border-slate-700">{vehicle.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Financials & Payouts */}
        <div className="col-span-12 lg:col-span-5 space-y-10">
          <section className="bg-slate-900 dark:bg-slate-800 p-12 rounded-[56px] text-white shadow-2xl relative overflow-hidden transition-colors">
            <div className="relative z-10">
              <div className="flex items-center space-x-6 mb-12">
                <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-xl shadow-blue-500/20">
                  <CreditCard size={28} />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Payout Methods</h2>
              </div>

              <p className="text-slate-400 dark:text-slate-500 font-medium mb-10 leading-relaxed">Choose your primary account and manage alternative payout destinations.</p>

              <div className="space-y-4 mb-12">
                {paymentAccounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => setPrimaryAccount(account.id)}
                    className={`w-full flex items-center justify-between p-8 rounded-[40px] border-2 transition-all ${account.id === paymentAccounts.find(a => a.isPrimary)?.id ? 'bg-blue-600 border-white shadow-2xl' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${account.id === paymentAccounts.find(a => a.isPrimary)?.id ? 'bg-white text-blue-600' : 'bg-white/10 dark:bg-white/5 text-white'}`}>
                        {account.type === 'BANK' ? <Landmark size={28} /> : <Smartphone size={28} />}
                      </div>
                      <div className="text-left">
                        <p className={`font-black uppercase tracking-widest text-xs ${account.id === paymentAccounts.find(a => a.isPrimary)?.id ? 'text-blue-100' : 'text-slate-400'}`}>{account.name}</p>
                        <p className="font-bold text-lg leading-none mt-1">{account.description}</p>
                      </div>
                    </div>
                    {account.isPrimary ? <CheckCircle2 size={24} className="text-white" /> : (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeAccount(account.id); }}
                        className="text-white/30 hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddAccountOpen(true)}
                className="w-full py-6 rounded-[32px] border-2 border-dashed border-white/20 text-white/60 font-black uppercase tracking-widest hover:border-white hover:text-white hover:bg-white/5 transition-all text-sm flex items-center justify-center gap-3"
              >
                <Plus size={20} /> Add New Layout Account
              </button>
            </div>
            <ShieldCheck className="absolute right-[-60px] top-[-60px] h-80 w-80 opacity-5 dark:opacity-[0.02]" />
          </section>

          <section className="bg-white dark:bg-slate-800 p-12 rounded-[56px] border border-slate-100 dark:border-slate-700 shadow-xl">
            <div className="flex items-start gap-6 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[40px] border border-blue-100 dark:border-blue-900/30">
              <div className="h-14 w-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 dark:text-white">Enterprise Grade Security</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  KwikLiner employs end-to-end 256-bit AES encryption for all financial data. Your account information is never stored as plain text on our servers.
                </p>
                <button className="flex items-center text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest hover:underline">
                  Review Security Protocols <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsAddVehicleOpen(false)}></div>
          <div className="bg-white dark:bg-slate-800 rounded-[56px] p-12 w-full max-w-3xl relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide border border-white/10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Add To Fleet</h3>
              <button onClick={() => setIsAddVehicleOpen(false)} className="h-12 w-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-10">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-1/3">
                  <label className="block w-full aspect-square rounded-[40px] border-4 border-dashed border-slate-100 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 relative overflow-hidden group">
                    {selectedVehicleImage ? (
                      <img src={selectedVehicleImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="h-16 w-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <ImageIcon size={32} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-center">Identity Image</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSelectedVehicleImage(URL.createObjectURL(file));
                    }} />
                  </label>
                  <p className="text-[10px] text-center font-bold text-slate-400 dark:text-slate-500 mt-4 uppercase tracking-widest">Clear Side Profile Recommended</p>
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Vehicle Make</label>
                      <input required value={newVehicle.make} onChange={e => setNewVehicle({ ...newVehicle, make: e.target.value })} placeholder="e.g. Scania" className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 dark:text-white rounded-2xl font-black outline-none border-2 border-transparent focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Model Name</label>
                      <input required value={newVehicle.model} onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })} placeholder="e.g. R500" className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 dark:text-white rounded-2xl font-black outline-none border-2 border-transparent focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">License Plate</label>
                    <input required value={newVehicle.plate} onChange={e => setNewVehicle({ ...newVehicle, plate: e.target.value })} placeholder="e.g. BP 1234" className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 dark:text-white rounded-2xl font-black outline-none border-2 border-transparent focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Capacity</label>
                      <input required value={newVehicle.capacity} onChange={e => setNewVehicle({ ...newVehicle, capacity: e.target.value })} placeholder="e.g. 28T" className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 dark:text-white rounded-2xl font-black outline-none border-2 border-transparent focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Body Type</label>
                      <select value={newVehicle.type} onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value as any })} className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 dark:text-white rounded-2xl font-black outline-none border-2 border-transparent focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 transition-all">
                        <option value="FLATBED">Flatbed</option>
                        <option value="TANKER">Tanker</option>
                        <option value="BOX_BODY">Box Body</option>
                        <option value="REFRIGERATED">Refrigerated</option>
                        <option value="TRUCK">General Truck</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-6 bg-emerald-600 text-white rounded-[32px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all">
                Add Vehicle To Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {isAddAccountOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsAddAccountOpen(false)}></div>
          <div className="bg-white dark:bg-slate-800 rounded-[56px] p-12 w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl border border-white/10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">New Account</h3>
              <button onClick={() => setIsAddAccountOpen(false)} className="h-12 w-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setNewAccount({ ...newAccount, type: 'BANK' })}
                    className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${newAccount.type === 'BANK' ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'bg-slate-50 dark:bg-slate-900/50 border-transparent text-slate-500 hover:bg-white dark:hover:bg-slate-900 hover:border-blue-100 dark:hover:border-blue-900/30'}`}
                  >
                    <Landmark size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Bank</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAccount({ ...newAccount, type: 'MOBILE_MONEY' })}
                    className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${newAccount.type === 'MOBILE_MONEY' ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'bg-slate-50 dark:bg-slate-900/50 border-transparent text-slate-500 hover:bg-white dark:hover:bg-slate-900 hover:border-blue-100 dark:hover:border-blue-900/30'}`}
                  >
                    <Smartphone size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Mobile</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{newAccount.type === 'BANK' ? 'Bank Name' : 'Provider (MoMo)'}</label>
                <input required value={newAccount.name} onChange={e => setNewAccount({ ...newAccount, name: e.target.value })} placeholder={newAccount.type === 'BANK' ? 'e.g. Standard Bank' : 'e.g. Airtel Money'} className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 dark:text-white rounded-2xl font-black outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{newAccount.type === 'BANK' ? 'Account Number' : 'Phone Number'}</label>
                <input required value={newAccount.description} onChange={e => setNewAccount({ ...newAccount, description: e.target.value })} placeholder={newAccount.type === 'BANK' ? '**** **** 1234' : '+265 999 000 000'} className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 dark:text-white rounded-2xl font-black outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700" />
              </div>
              <button type="submit" className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black uppercase tracking-widest shadow-2xl shadow-blue-200 mt-4">
                Connect Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
