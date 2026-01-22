import React from 'react';
import { ChevronDown, Search, Bell, Box, TrendingUp, Truck, Plus, ChevronRight, DollarSign } from 'lucide-react';
import { Vehicle } from '../../../types';

interface OverviewTabProps {
    profileData: any;
    wallet: any;
    revenueCycle: 'H1' | 'H2';
    setRevenueCycle: (cycle: 'H1' | 'H2') => void;
    activeRevenueData: any[];
    totalCapacity: number;
    fleet: Vehicle[];
    setActiveMenu: (menu: string) => void;
    topTrips: any[];
    jobsCount: number;
    totalOrders: number;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
    profileData,
    wallet,
    revenueCycle,
    setRevenueCycle,
    activeRevenueData,
    totalCapacity,
    fleet,
    setActiveMenu,
    topTrips,
    jobsCount,
    totalOrders
}) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 sm:mb-10">
                <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight text-[28px] sm:text-[40px] whitespace-nowrap">Shipment Track</h2>
                    <div className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shrink-0 text-slate-900 dark:text-white">
                        Status <ChevronDown size={12} />
                    </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors"><Search size={18} /></button>
                        <button className="text-slate-400 hover:text-blue-600 transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                    <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs font-black text-slate-900 dark:text-white leading-none">{profileData.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1">Driver Profile</p>
                        </div>
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`} alt="pfp" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total History</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{totalOrders}</h3>
                        </div>
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                            <Box size={20} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-green-500 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp size={10} /> +30%
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">vs last month</span>
                    </div>
                    <div className="h-12 w-full flex items-end gap-1.5 pt-1">
                        {[30, 45, 25, 60, 40, 70, 35, 80, 55, 90, 45, 65].map((h, i) => (
                            <div key={i} className={`flex-1 ${i === 8 ? 'bg-blue-600' : 'bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40'} rounded-t-sm sm:rounded-t-md transition-all`} style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>
                <div
                    onClick={() => setActiveMenu('Wallet')}
                    className="col-span-1 md:col-span-1 lg:col-span-4 bg-slate-900 p-5 rounded-[24px] text-white shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all cursor-pointer"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="relative z-10 flex justify-between items-start mb-2">
                        <div>
                            <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Wallet Balance</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-white">{wallet?.currency || 'MWK'} {wallet?.balance?.toLocaleString() || '0.00'}</h3>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="bg-white/10 p-1 rounded-lg flex gap-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setRevenueCycle('H1'); }}
                                    className={`px-2 py-1 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all ${revenueCycle === 'H1' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    H1
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setRevenueCycle('H2'); }}
                                    className={`px-2 py-1 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all ${revenueCycle === 'H2' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    H2
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 h-12 w-full flex items-end gap-1.5 sm:gap-2 pt-1">
                        {activeRevenueData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 relative group/bar">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white/10 px-1.5 py-0.5 rounded text-[8px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                    {d.amt}
                                </div>
                                <div className={`w-full ${i === activeRevenueData.length - 1 ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-white/10'} rounded-t-md transition-all hover:bg-white/20`} style={{ height: `${d.value}%` }}></div>
                                <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-tighter">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Fleet Capacity</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{totalCapacity}T</h3>
                        </div>
                        <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                            <Truck size={20} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] sm:text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 rounded-full">
                            Vehicles: {fleet.length} Registered
                        </span>
                    </div>
                    <div className="h-12 w-full flex items-end justify-between pt-1">
                        {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
                            <div key={i} className={`w-4 sm:w-6 rounded-lg ${i === 3 ? 'bg-indigo-600' : 'bg-indigo-50 dark:bg-indigo-900/20 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40'} transition-all`} style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>

                <div
                    onClick={() => setActiveMenu('BrowseJobs')}
                    className="col-span-1 md:col-span-2 lg:col-span-12 bg-blue-600 p-5 rounded-[24px] text-white shadow-2xl relative overflow-hidden group hover:scale-[1.01] transition-all cursor-pointer"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                            <div className="h-12 w-12 sm:h-16 sm:w-16 bg-white/20 backdrop-blur-md rounded-[16px] sm:rounded-[20px] flex items-center justify-center text-white shrink-0 group-hover:rotate-12 transition-transform">
                                <Plus size={24} className="sm:size-[32px]" />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-3xl font-black tracking-tighter mb-1">{jobsCount} New Job Requests</h3>
                                <p className="text-blue-100 font-bold text-[10px] sm:text-base opacity-80">Shippers are looking for your capacity. Act now to earn more.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 bg-white text-blue-600 px-5 sm:px-6 py-3 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest shadow-xl group-hover:translate-x-2 transition-transform w-full sm:w-auto justify-center">
                            Explore Jobs <ChevronRight size={16} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="col-span-1 md:col-span-1 lg:col-span-6 bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[10px] sm:text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Top 5 Highest Paying Trips</h3>
                        <TrendingUp size={16} className="text-blue-500" />
                    </div>
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                        {topTrips.map((trip, idx) => (
                            <div key={idx} className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 sm:gap-5 group hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all cursor-pointer">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-blue-600 group-hover:scale-110 transition-transform shrink-0">
                                    <DollarSign size={20} />
                                </div>
                                <div className="min-w-0 flex-grow">
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight truncate">{trip.route}</h4>
                                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 sm:py-1 rounded-lg shrink-0">{trip.price}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 sm:mt-2 uppercase tracking-wider truncate">{trip.shipper} • {trip.cargo}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-1 md:col-span-1 lg:col-span-6 bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-center items-center text-center">
                    <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600" className="w-36 h-24 sm:w-48 sm:h-32 object-contain rounded-2xl mb-6" alt="Truck" />
                    <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Current Assigned Fleet</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{fleet[0]?.plate || 'No vehicle'} • {fleet[0]?.capacity || '0T'} {fleet[0]?.type}</p>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
