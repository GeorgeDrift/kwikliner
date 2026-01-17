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
}

const OverviewTab: React.FC<OverviewTabProps> = ({
    user,
    fleet,
    jobProposals,
    setActiveMenu,
    setJobsTab,
    navigate,
    wallet
}) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
                {/* Wallet Balance Widget */}
                <div
                    onClick={() => setActiveMenu('Wallet')}
                    className="col-span-1 md:col-span-4 bg-white p-5 rounded-[24px] border border-slate-50 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md transition-all"
                >
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Wallet Balance</h3>
                    <div className="flex items-end space-x-3 mb-6">
                        <span className="text-2xl font-black tracking-tighter">{wallet?.currency || 'MWK'} {wallet?.balance?.toLocaleString() || '0.00'}</span>
                        <span className="text-[9px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-md">See Details</span>
                    </div>
                    <div className="h-16 w-full flex items-end space-x-1">
                        {[40, 60, 30, 80, 50, 90, 70, 45, 85].map((h, i) => (
                            <div key={i} className="flex-grow bg-indigo-50 rounded-t-md group-hover:bg-indigo-600 transition-all" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>

                {/* Fleet Size Widget */}
                <div className="col-span-12 md:col-span-4 bg-white p-5 rounded-[24px] border border-slate-50 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Fleet Size</h3>
                    <div className="flex items-baseline space-x-2 mb-6">
                        <span className="text-2xl font-black tracking-tighter">{fleet.length > 0 ? fleet.length : 12} Trucks</span>
                        <span className="text-[10px] font-black text-indigo-500">Active</span>
                    </div>
                    <div className="flex space-x-1 h-12 items-end">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className={`flex-1 rounded-full ${i < (fleet.length > 0 ? fleet.length : 12) ? 'bg-[#6366F1]' : 'bg-slate-100'}`} style={{ height: `${Math.random() * 60 + 40}%` }}></div>
                        ))}
                    </div>
                </div>

                {/* Market Discovery Widget */}
                <div className="col-span-1 md:col-span-4 bg-[#6366F1] p-5 text-white shadow-2xl relative overflow-hidden group rounded-[24px]">
                    <div className="relative z-10">
                        <h3 className="text-lg font-black leading-tight mb-2">Market Discovery</h3>
                        <p className="text-indigo-100 text-xs font-medium mb-4">Discover new high-value freight manifests globally.</p>
                        <button onClick={() => navigate('/')} className="w-full py-3 bg-white text-[#6366F1] rounded-xl font-black text-[10px] uppercase tracking-widest">
                            Find Loads
                        </button>
                    </div>
                    <Globe size={120} className="absolute right-[-30px] top-[-30px] opacity-[0.05]" />
                </div>
            </div>

            {/* New Widgets Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Your Listings Widget */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-900">Your Listings</h3>
                        <button onClick={() => setActiveMenu('Availability')} className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { id: 1, route: 'Lilongwe, Blantyre, Mzuzu', capacity: '180T', status: 'Active' },
                            { id: 2, route: 'Blantyre, Zomba, Mangochi', capacity: '120T', status: 'Active' }
                        ].map((listing) => (
                            <div key={listing.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <h4 className="text-sm font-black text-slate-900">{listing.route}</h4>
                                    <p className="text-xs font-bold text-slate-400 mt-1">{listing.capacity} Capacity</p>
                                </div>
                                <span className="px-3 py-1.5 bg-green-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {listing.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Job Requests Widget */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-900">Top Job Requests</h3>
                        <button onClick={() => { setActiveMenu('Board'); setJobsTab('requests'); }} className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {(jobProposals.length > 0 ? jobProposals.slice(0, 2) : [
                            { id: 1, shipper: 'AgriCorp Malawi', route: 'Lilongwe → Blantyre', cargo: 'Fertilizer (25T)', status: 'New' },
                            { id: 2, shipper: 'FreshProduce Co', route: 'Blantyre → Lilongwe', cargo: 'Fresh Produce (12T)', status: 'Urgent' }
                        ]).map((job) => (
                            <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 cursor-pointer">
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-black text-slate-900">{job.route}</h4>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${job.status === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400">{job.shipper} • {job.cargo}</p>
                                </div>
                                <button className="ml-4 p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
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
