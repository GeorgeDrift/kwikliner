import React from 'react';
import { Box, DollarSign, Clock, UserCheck, MoreHorizontal, Briefcase } from 'lucide-react';
import { api } from '../../../services/api';

interface BoardTabProps {
    jobsTab: 'requests' | 'bids' | 'proposed';
    setJobsTab: (tab: 'requests' | 'bids' | 'proposed') => void;
    jobProposals: any[];
    handleAcceptJob: (job: any) => Promise<void>;
    fromLocation: string;
    setFromLocation: (loc: string) => void;
    toLocation: string;
    setToLocation: (loc: string) => void;
}

const BoardTab: React.FC<BoardTabProps> = ({
    jobsTab,
    setJobsTab,
    jobProposals,
    handleAcceptJob,
    fromLocation,
    setFromLocation,
    toLocation,
    setToLocation
}) => {
    const marketplaceJobs = jobProposals.filter(j => j.status === 'New' || j.status === 'Bidding Open' || j.status === 'Finding Driver');

    const filteredMarketplaceJobs = marketplaceJobs.filter(job => {
        const matchesFrom = fromLocation === 'All' || (job.origin || "").toLowerCase().includes(fromLocation.toLowerCase());
        const matchesTo = toLocation === 'All' || (job.destination || "").toLowerCase().includes(toLocation.toLowerCase());
        return matchesFrom && matchesTo;
    });

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Jobs Proposal</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">
                        {jobsTab === 'requests' ? 'Review incoming job proposals from shippers' : 'Browse and bid on marketplace jobs'}
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide p-1">
                <button
                    onClick={() => setJobsTab('requests')}
                    className={`px-6 sm:px-8 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsTab === 'requests' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-400'
                        }`}
                >
                    Customer Requests ({jobProposals.length})
                </button>
                <button
                    onClick={() => setJobsTab('bids')}
                    className={`px-6 sm:px-8 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsTab === 'bids' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-400'
                        }`}
                >
                    Marketplace ({marketplaceJobs.length})
                </button>
                <button
                    onClick={() => setJobsTab('proposed')}
                    className={`px-6 sm:px-8 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsTab === 'proposed' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-400'
                        }`}
                >
                    My Proposals (2)
                </button>
            </div>

            {jobsTab === 'requests' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {jobProposals.map((job) => (
                        <div key={job.id} className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all p-6 sm:p-8">
                            <div className="flex items-start justify-between mb-4 gap-4">
                                <div>
                                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">{job.route}</h4>
                                    <p className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">{job.shipper}</p>
                                </div>
                                <span className={`px-3 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shrink-0 ${job.status === 'Urgent' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                                    }`}>
                                    {job.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm">
                                    <Box className="text-slate-400 dark:text-slate-500" size={16} />
                                    <span className="font-bold text-slate-900 dark:text-slate-100">{job.cargo}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <DollarSign className="text-green-600 dark:text-green-400" size={16} />
                                    <span className="font-black text-green-600 dark:text-green-400">{job.price}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock className="text-orange-600 dark:text-orange-400" size={16} />
                                    <span className="font-bold text-slate-600 dark:text-slate-400">Deadline: {job.deadline}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={async () => {
                                        await api.approveHireRequest(job.id);
                                        handleAcceptJob(job);
                                    }}
                                    className="flex-grow py-3 bg-green-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <UserCheck size={14} />
                                    Approve & Assign
                                </button>
                                <button className="px-4 py-3 bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-all">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : jobsTab === 'proposed' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[
                        { id: 'P-9902', route: 'Lilongwe → Bt', cargo: '50kg Bag', quote: 'MWK 420,000', status: 'Pending Approval', date: '10m ago' },
                        { id: 'P-9905', route: 'Blantyre → Mwanza', cargo: 'Cement (15T)', quote: 'MWK 380,000', status: 'In Review', date: '2h ago' },
                    ].map((prop) => (
                        <div key={prop.id} className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm p-6 sm:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">{prop.route}</h4>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">{prop.cargo}</p>
                                </div>
                                <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
                                    {prop.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-700">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Your Quote</p>
                                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">{prop.quote}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Sent</p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{prop.date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Location Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Filter by Route:</span>
                        <div className="flex flex-wrap gap-3">
                            <select
                                value={fromLocation}
                                onChange={(e) => setFromLocation(e.target.value)}
                                className="flex-1 sm:flex-none px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer hover:border-indigo-600 dark:hover:border-indigo-400 transition-colors shrink-1 text-slate-900 dark:text-slate-100"
                            >
                                <option value="All" className="dark:bg-slate-800">From: All</option>
                                <option value="Lilongwe" className="dark:bg-slate-800">Lilongwe</option>
                                <option value="Blantyre" className="dark:bg-slate-800">Blantyre</option>
                                <option value="Mzuzu" className="dark:bg-slate-800">Mzuzu</option>
                                <option value="Zomba" className="dark:bg-slate-800">Zomba</option>
                            </select>
                            <select
                                value={toLocation}
                                onChange={(e) => setToLocation(e.target.value)}
                                className="flex-1 sm:flex-none px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer hover:border-indigo-600 dark:hover:border-indigo-400 transition-colors shrink-1 text-slate-900 dark:text-slate-100"
                            >
                                <option value="All" className="dark:bg-slate-800">To: All</option>
                                <option value="Blantyre" className="dark:bg-slate-800">Blantyre</option>
                                <option value="Lilongwe" className="dark:bg-slate-800">Lilongwe</option>
                                <option value="Kasungu" className="dark:bg-slate-800">Kasungu</option>
                                <option value="Mzuzu" className="dark:bg-slate-800">Mzuzu</option>
                                <option value="Rumphi" className="dark:bg-slate-800">Rumphi</option>
                                <option value="Zomba" className="dark:bg-slate-800">Zomba</option>
                                <option value="Mangochi" className="dark:bg-slate-800">Mangochi</option>
                                <option value="Mozambique Border" className="dark:bg-slate-800">Mozambique Border</option>
                            </select>
                        </div>
                        <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500">({filteredMarketplaceJobs.length} jobs found)</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredMarketplaceJobs.map((job) => (
                            <div key={job.id} className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all p-6 sm:p-8">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">{job.origin} → {job.destination}</h4>
                                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">{job.shipper || job.shipperId}</p>
                                    </div>
                                    <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-500 text-white">
                                        {job.bids} Bids
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Box className="text-slate-400 dark:text-slate-500" size={16} />
                                        <span className="font-bold text-slate-900 dark:text-slate-100">{job.cargo}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <DollarSign className={job.price === 'Open to Bids' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'} size={16} />
                                        <span className={`font-black ${job.price === 'Open to Bids' ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded' : 'text-green-600 dark:text-green-400'}`}>
                                            {job.price === 'Open to Bids' ? 'Open for Bidding' : `Budget: ${job.price}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="text-orange-600 dark:text-orange-400" size={16} />
                                        <span className="font-bold text-slate-600 dark:text-slate-400">Deadline: {job.deadline}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAcceptJob(job)}
                                        className={`flex-grow py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${job.price === 'Open to Bids' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-green-600 hover:bg-green-700 shadow-green-100'}`}
                                    >
                                        <Briefcase size={14} />
                                        {job.price === 'Open to Bids' ? 'Submit Bid' : 'Accept Job'}
                                    </button>
                                    <button className="px-4 py-3 bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-all">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardTab;
