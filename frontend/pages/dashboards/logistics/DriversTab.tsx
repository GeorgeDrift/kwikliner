import React from 'react';
import { Plus, Users, ShieldCheck, Activity, MoreHorizontal } from 'lucide-react';

interface DriversTabProps {
    drivers: any[];
}

const DriversTab: React.FC<DriversTabProps> = ({ drivers }) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Driver Management</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Monitor and manage your driver roster.</p>
                </div>
                <button
                    className="w-full sm:w-auto bg-[#6366F1] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 hover:scale-105 transition-all"
                >
                    <Plus size={18} /> Add Driver
                </button>
            </div>

            {/* Driver Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Drivers</h4>
                        <Users className="text-blue-600 dark:text-blue-400 hidden sm:block" size={20} />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{drivers.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Available</h4>
                        <ShieldCheck className="text-green-600 dark:text-green-400 hidden sm:block" size={20} />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{drivers.filter(d => d.status === 'Available').length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Trips</h4>
                        <Activity className="text-indigo-600 dark:text-indigo-400 hidden sm:block" size={20} />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{drivers.reduce((sum, d) => sum + d.trips, 0)}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">On Job</h4>
                        <Activity className="text-orange-600 dark:text-orange-400 hidden sm:block" size={20} />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{drivers.filter(d => d.status === 'On Job').length}</p>
                </div>
            </div>

            {/* Driver Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {drivers.map((driver) => (
                    <div key={driver.id} className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-2xl transition-all group">
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={driver.image}
                                    alt={driver.name}
                                    className="w-16 h-16 rounded-full object-cover border-4 border-slate-100 dark:border-slate-700"
                                />
                                <div className="flex-grow">
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white">{driver.name}</h4>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">{driver.phone}</p>
                                </div>
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${driver.status === 'Available' ? 'bg-green-500 text-white' :
                                    driver.status === 'On Job' ? 'bg-orange-500 text-white' : 'bg-slate-300 text-slate-600'
                                    }`}>
                                    {driver.status}
                                </span>
                            </div>

                            {driver.currentJob && (
                                <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                                    <p className="text-xs font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-1">Current Assignment</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{driver.currentJob}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Trips</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">{driver.trips}</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Status</p>
                                    <p className="text-xs font-black text-slate-900 dark:text-white">{driver.status}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    disabled={driver.status !== 'Available'}
                                    className={`flex-grow py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${driver.status === 'Available'
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                        }`}
                                >
                                    Assign Job
                                </button>
                                <button className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all border border-transparent dark:border-slate-700">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Driver Placeholder */}
                <button
                    className="min-h-[350px] border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[40px] flex flex-col items-center justify-center gap-4 text-slate-300 dark:text-slate-700 hover:border-[#6366F1] dark:hover:border-[#6366F1] hover:text-[#6366F1] dark:hover:text-[#6366F1] hover:bg-indigo-50/10 dark:hover:bg-indigo-900/5 transition-all"
                >
                    <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                        <Plus size={32} />
                    </div>
                    <span className="font-black uppercase tracking-widest text-sm">Add New Driver</span>
                </button>
            </div>
        </div>
    );
};

export default DriversTab;
