import React from 'react';

const SettingsTab: React.FC = () => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">Settings</h3>
                <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">System and profile configurations.</p>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                {[
                    { label: 'Push Notifications', desc: 'Alerts for new job proposals', toggle: true },
                    { label: 'Email Reports', desc: 'Weekly fleet performance analytics', toggle: true },
                    { label: 'Public Profile', desc: 'Show fleet stats to verified shippers', toggle: true },
                    { label: 'Dark Mode', desc: 'Switch dashboard interface theme', toggle: false },
                ].map((setting, i) => (
                    <div key={i} className="p-6 sm:p-8 flex items-center justify-between">
                        <div>
                            <p className="text-sm sm:text-base font-black text-slate-900">{setting.label}</p>
                            <p className="text-xs sm:text-sm font-medium text-slate-400">{setting.desc}</p>
                        </div>
                        <button className={`w-12 h-6 rounded-full transition-all relative ${setting.toggle ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${setting.toggle ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50 pb-4">Security</h4>
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                    <button className="w-full flex items-center justify-between p-6 sm:p-8 hover:bg-slate-50 transition-all text-left group">
                        <div>
                            <p className="text-sm sm:text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">Change Password</p>
                            <p className="text-xs sm:text-sm font-medium text-slate-400">Last changed 2mo ago</p>
                        </div>
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-6 sm:p-8 hover:bg-red-50 transition-all text-left group">
                        <div>
                            <p className="text-sm sm:text-base font-black text-red-600">Delete Account</p>
                            <p className="text-xs sm:text-sm font-medium text-red-300 group-hover:text-red-400">Permanent action</p>
                        </div>
                        <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-red-300 group-hover:bg-white group-hover:text-red-500 transition-all">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
