import React from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';

interface SettingsTabProps {
    user: any;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ user }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="text-left">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Account Settings</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Configure your shipper preferences and security.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-[40px] sm:rounded-[48px] border border-slate-100 dark:border-slate-700 shadow-2xl space-y-12 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] border-b border-slate-50 dark:border-slate-700 pb-4">Preferences</h4>
                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                            <div>
                                <p className="font-black text-slate-900 dark:text-white text-sm">Bid Notifications</p>
                                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Updates on your loads</p>
                            </div>
                            <div className="h-6 w-12 bg-blue-600 rounded-full flex items-center px-1">
                                <div className="h-4 w-4 bg-white dark:bg-slate-100 rounded-full ml-auto shadow-sm"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                            <div>
                                <p className="font-black text-slate-900 dark:text-white text-sm">Delivery Alerts</p>
                                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Real-time status tracking</p>
                            </div>
                            <div className="h-6 w-12 bg-blue-600 rounded-full flex items-center px-1">
                                <div className="h-4 w-4 bg-white dark:bg-slate-100 rounded-full ml-auto shadow-sm"></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] border-b border-slate-50 dark:border-slate-700 pb-4">Security</h4>
                        <button className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                            <div className="text-left">
                                <p className="font-black text-slate-900 dark:text-white text-sm">Change Password</p>
                                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Last changed 5mo ago</p>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
                        </button>
                        <button className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-red-600">
                            <div className="text-left">
                                <p className="font-black text-sm">Delete Account</p>
                                <p className="text-[11px] font-bold text-red-300 uppercase tracking-wider mt-1">Permanent action</p>
                            </div>
                            <AlertCircle size={18} className="text-red-300" />
                        </button>
                    </div>
                </div>

                <div className="bg-blue-600 p-8 sm:p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
                        <div className="text-center md:text-left">
                            <h4 className="text-2xl font-black tracking-tight mb-2 italic">Premium Shipper</h4>
                            <p className="text-blue-100 font-bold opacity-80 text-sm">Get priority support and lower fees.</p>
                        </div>
                        <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl group-hover:scale-105 transition-all">Upgrade Now</button>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
