
import React, { useState } from 'react';
import { User } from '../types';
import { ArrowLeft, Save, CreditCard, Landmark, Smartphone, User as UserIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SettingsProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email || '',
    phone: user.phone,
    bankName: user.bankName || '',
    accountNumber: user.accountNumber || '',
    swiftCode: user.swiftCode || '',
    mobileMoneyNumber: user.mobileMoneyNumber || '',
    primaryPayoutMethod: user.primaryPayoutMethod || 'MOBILE_MONEY',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      const updatedUser: User = {
        ...user,
        ...formData
      };
      onUpdate(updatedUser);
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-slate-400 font-bold text-sm hover:text-blue-600 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight text-6xl">Account Settings</h1>
          <p className="text-slate-500 font-medium text-xl mt-2">Manage your profile and payment methods</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-10 py-5 rounded-[28px] font-black shadow-2xl hover:bg-blue-700 transition-all flex items-center space-x-3 active:scale-95"
        >
          {isSaving ? <div className="h-6 w-6 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : <Save size={24} />}
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="space-y-12">
        {/* Payout Preference Selector */}
        <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                 <CreditCard className="text-blue-400" /> Payout Preference
              </h2>
              <p className="text-slate-400 text-sm font-medium mb-8">Choose how you want to receive your earnings from KwikLiner.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button 
                   onClick={() => setFormData({...formData, primaryPayoutMethod: 'BANK'})}
                   className={`flex items-center justify-between p-6 rounded-[32px] border-2 transition-all ${formData.primaryPayoutMethod === 'BANK' ? 'bg-blue-600 border-white shadow-xl' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                 >
                    <div className="flex items-center gap-4">
                       <Landmark size={24} />
                       <span className="font-black uppercase tracking-widest text-sm">Bank Transfer</span>
                    </div>
                    {formData.primaryPayoutMethod === 'BANK' && <CheckCircle2 size={20} />}
                 </button>

                 <button 
                   onClick={() => setFormData({...formData, primaryPayoutMethod: 'MOBILE_MONEY'})}
                   className={`flex items-center justify-between p-6 rounded-[32px] border-2 transition-all ${formData.primaryPayoutMethod === 'MOBILE_MONEY' ? 'bg-blue-600 border-white shadow-xl' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                 >
                    <div className="flex items-center gap-4">
                       <Smartphone size={24} />
                       <span className="font-black uppercase tracking-widest text-sm">Mobile Money</span>
                    </div>
                    {formData.primaryPayoutMethod === 'MOBILE_MONEY' && <CheckCircle2 size={20} />}
                 </button>
              </div>
           </div>
           <ShieldCheck className="absolute right-[-40px] top-[-40px] h-64 w-64 opacity-10" />
        </div>

        {/* Profile Section */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <UserIcon size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Personal Profile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
              <input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-6 bg-slate-50 rounded-[28px] font-black outline-none border-2 border-transparent focus:border-blue-600 transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
              <input 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full p-6 bg-slate-50 rounded-[28px] font-black outline-none border-2 border-transparent focus:border-blue-600 transition-all"
              />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full p-6 bg-slate-50 rounded-[28px] font-black outline-none border-2 border-transparent focus:border-blue-600 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Banking Section */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <Landmark size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bank Account Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bank Name</label>
              <input 
                value={formData.bankName} 
                onChange={e => setFormData({...formData, bankName: e.target.value})}
                placeholder="e.g. Standard Bank"
                className="w-full p-6 bg-slate-50 rounded-[28px] font-black outline-none border-2 border-transparent focus:border-blue-600 transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
              <input 
                value={formData.accountNumber} 
                onChange={e => setFormData({...formData, accountNumber: e.target.value})}
                placeholder="e.g. 1029384756"
                className="w-full p-6 bg-slate-50 rounded-[28px] font-black outline-none border-2 border-transparent focus:border-blue-600 transition-all"
              />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SWIFT / BIC Code (Optional)</label>
              <input 
                value={formData.swiftCode} 
                onChange={e => setFormData({...formData, swiftCode: e.target.value})}
                className="w-full p-6 bg-slate-50 rounded-[28px] font-black outline-none border-2 border-transparent focus:border-blue-600 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Mobile Money Section */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <Smartphone size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Mobile Money Payout</h2>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">MoMo Phone Number</label>
            <input 
              value={formData.mobileMoneyNumber} 
              onChange={e => setFormData({...formData, mobileMoneyNumber: e.target.value})}
              placeholder="e.g. +265 999 123 456"
              className="w-full p-6 bg-slate-50 rounded-[28px] font-black outline-none border-2 border-transparent focus:border-blue-600 transition-all"
            />
          </div>
          <div className="mt-8 p-8 bg-slate-50 rounded-[32px] flex items-start space-x-4 border border-slate-100">
            <ShieldCheck className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              KwikLiner uses bank-level encryption to secure your financial information. Your primary payout method will be used for all automatic transfers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
