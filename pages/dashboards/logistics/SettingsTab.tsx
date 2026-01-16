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
        </div>
    );
};

export default SettingsTab;
