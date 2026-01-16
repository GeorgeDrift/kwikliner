import React from 'react';
import { Award } from 'lucide-react';

interface SettingsTabProps {
    user: any;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ user }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm transition-all">
                <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-6">Account Settings</h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                            <div className="bg-slate-50 rounded-2xl px-6 py-4 border border-slate-100 flex items-center gap-4 text-slate-900 font-bold">{user.name}</div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Role</label>
                            <div className="bg-blue-50 rounded-2xl px-6 py-4 border border-blue-100 flex items-center justify-between">
                                <span className="text-blue-600 font-black uppercase tracking-widest text-xs">Shipper</span>
                                <Award size={18} className="text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="p-8 bg-blue-600 rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-100">
                        <div className="text-center md:text-left">
                            <h4 className="text-xl font-black tracking-tight mb-2">Upgrade to Enterprise</h4>
                            <p className="text-blue-100 text-sm font-medium">Get 0% service fees and dedicated support.</p>
                        </div>
                        <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all w-full md:w-auto">Learn More</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
