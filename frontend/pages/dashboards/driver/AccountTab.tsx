import React from 'react';
import { Pencil, Save, ImageIcon, ShieldCheck, X, PlusCircle, Landmark, Smartphone } from 'lucide-react';

interface AccountTabProps {
    isEditingAccount: boolean;
    setIsEditingAccount: (editing: boolean) => void;
    profileData: any;
    setProfileData: (data: any) => void;
    removeLicense: (index: number) => void;
    addLicense: () => void;
    newLicenseInput: string;
    setNewLicenseInput: (input: string) => void;
}

const AccountTab: React.FC<AccountTabProps> = ({
    isEditingAccount,
    setIsEditingAccount,
    profileData,
    setProfileData,
    removeLicense,
    addLicense,
    newLicenseInput,
    setNewLicenseInput
}) => {
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
                            {profileData.licenses.map((license: string, idx: number) => (
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
};

export default AccountTab;
