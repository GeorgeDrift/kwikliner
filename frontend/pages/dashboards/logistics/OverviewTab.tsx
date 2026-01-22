import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';
import { User } from '../../../types';

interface OverviewTabProps {
    user: User;
    fleet: any[];
    jobProposals: any[];
    setActiveMenu: (menu: string) => void;
    setJobsTab: (tab: 'requests' | 'bids' | 'proposed') => void;
    navigate: (path: string) => void;
    wallet: any;
    stats: any;
    listings: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({
    user,
    fleet,
    jobProposals,
    setActiveMenu,
    setJobsTab,
    navigate,
    wallet,
    stats,
    listings
}) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
                {/* Wallet Balance Widget */}
                <div
                    onClick={() => setActiveMenu('Wallet')}
                    className="col-span-1 md:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-50 dark:border-slate-700 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md transition-all"
                >
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Wallet Balance</h3>
                    <div className="flex items-end space-x-3 mb-6">
                        <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-slate-100">{stats.wallet?.currency || 'MWK'} {stats.wallet?.balance?.toLocaleString() || '0.00'}</span>
                        <span className="text-[9px] font-black text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-md">See Details</span>
                    </div>
                    <div className="h-16 w-full flex items-end space-x-1">
                        {[40, 60, 30, 80, 50, 90, 70, 45, 85].map((h, i) => (
                            <div key={i} className="flex-grow bg-indigo-50 dark:bg-indigo-500/10 rounded-t-md group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 transition-all" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>

                {/* Fleet Size Widget */}
                <div className="col-span-12 md:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-50 dark:border-slate-700 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Fleet Size</h3>
                    <div className="flex items-baseline space-x-2 mb-6">
                        <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-slate-100">{stats.fleetSize} Trucks</span>
                        <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400">Active</span>
                    </div>
                    <div className="flex space-x-1 h-12 items-end">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className={`flex-1 rounded-full ${i < stats.fleetSize ? 'bg-[#6366F1]' : 'bg-slate-100 dark:bg-slate-700'}`} style={{ height: `${Math.random() * 60 + 40}%` }}></div>
                        ))}
                    </div>
                </div>

                {/* Market Discovery Widget */}
                <div className="col-span-1 md:col-span-4 bg-[#6366F1] dark:bg-indigo-600 p-5 text-white shadow-2xl relative overflow-hidden group rounded-[24px]">
                    <div className="relative z-10">
                        <h3 className="text-lg font-black leading-tight mb-2">Market Discovery</h3>
                        <p className="text-indigo-100 dark:text-indigo-200 text-xs font-medium mb-4">Discover new high-value freight manifests globally.</p>
                        <button onClick={() => navigate('/')} className="w-full py-3 bg-white dark:bg-slate-100 text-[#6366F1] dark:text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white transition-all shadow-lg dark:shadow-none">
                            Find Loads
                        </button>
                    </div>
                    <Globe size={120} className="absolute right-[-30px] top-[-30px] opacity-[0.05]" />
                </div>
            </div>

            {/* New Widgets Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Your Listings Widget */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-slate-50 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Your Listings</h3>
                        <button onClick={() => setActiveMenu('Availability')} className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {listings.length > 0 ? listings.slice(0, 2).map((listing: any) => (
                            <div key={listing.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl transition-all">
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">{listing.route}</h4>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">{listing.capacity} Capacity</p>
                                </div>
                                <span className="px-3 py-1.5 bg-green-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Active
                                </span>
                            </div>
                        )) : (
                            <div className="py-10 text-center text-slate-400 text-sm font-medium">No active listings.</div>
                        )}
                    </div>
                </div>

                {/* Top Job Requests Widget */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-slate-50 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Top Job Requests</h3>
                        <button onClick={() => { setActiveMenu('Board'); setJobsTab('requests'); }} className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {(jobProposals.length > 0 ? jobProposals.slice(0, 2) : []).map((job: any) => (
                            <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl group hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer">
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">{job.route}</h4>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${job.status === 'Urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500">{job.shipper} • {job.cargo}</p>
                                </div>
                                <button className="ml-4 p-2 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all">
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
