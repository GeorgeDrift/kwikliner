import React from 'react';
import { MapPin, Package, DollarSign, CheckCircle2, Gavel, Clock, X } from 'lucide-react';

interface BrowseJobsTabProps {
    jobs: any[];
    marketItems: any[];
    jobsSubTab: string;
    setJobsSubTab: (tab: 'Market' | 'Requests' | 'Proposed' | 'Rejected') => void;
    jobsLocationFilter: string;
    setJobsLocationFilter: (filter: string) => void;
    handleAcceptJob: (id: string) => void;
    setSelectedJob: (job: any) => void;
    setIsBidModalOpen: (open: boolean) => void;
}

const BrowseJobsTab: React.FC<BrowseJobsTabProps> = ({
    jobs,
    marketItems,
    jobsSubTab,
    setJobsSubTab,
    jobsLocationFilter,
    setJobsLocationFilter,
    handleAcceptJob,
    setSelectedJob,
    setIsBidModalOpen
}) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Job Marketplace</h3>
            <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                <div className="p-4 sm:p-8 border-b border-slate-50 dark:border-slate-700 flex flex-wrap items-center justify-between gap-6 bg-slate-50/30 dark:bg-slate-900/10">
                    <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide">
                        <button onClick={() => setJobsSubTab('Market')} className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Market' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700'}`}>Marketplace</button>
                        <button onClick={() => setJobsSubTab('Proposed')} className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Proposed' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700'}`}>My Proposals</button>
                        <button onClick={() => setJobsSubTab('Requests')} className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Requests' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700'}`}>Direct Requests ({jobs.filter(j => j.type === 'Requests').length})</button>
                        <button onClick={() => setJobsSubTab('Rejected')} className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Rejected' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700'}`}>Rejected</button>
                    </div>

                    {jobsSubTab === 'Market' && (
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors">
                            <MapPin size={14} className="text-slate-400 ml-2" />
                            {['All', 'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba'].map(loc => (
                                <button
                                    key={loc}
                                    onClick={() => setJobsLocationFilter(loc)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${jobsLocationFilter === loc ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    {loc}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* If Marketplace, show synchronized Cargo from marketItems, else use jobs state */}
                    {(jobsSubTab === 'Market' ?
                        marketItems.filter(i => i.cat === 'Cargo' && (jobsLocationFilter === 'All' || i.location.includes(jobsLocationFilter))) :
                        jobs.filter(j => j.type === jobsSubTab && (jobsLocationFilter === 'All' || j.route.includes(jobsLocationFilter)))
                    ).map((job: any) => (
                        <div key={job.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group">
                            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 truncate">{job.name || job.route}</h4>
                            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-6">{job.provider || job.shipper}</p>
                            <div className="space-y-3 mb-10">
                                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    <Package size={16} /> {job.details || job.cargo}
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    <MapPin size={16} /> {job.location}
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    <DollarSign size={16} />
                                    <span className={job.priceStr === 'Open to Bids' ? 'text-amber-600 dark:text-amber-400 font-black px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 rounded-lg' : 'font-black text-slate-900 dark:text-white'}>
                                        {job.priceStr || job.price}
                                    </span>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between mb-6">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.date || 'New Load'}</span>
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">{job.weight || (job.bids ? `${job.bids} Bids` : 'Available')}</span>
                            </div>
                            {jobsSubTab === 'Market' ? (
                                <div className="space-y-2">
                                    {job.pricingType === 'Direct' || (job.priceStr && job.priceStr !== 'Open to Bids') ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => handleAcceptJob(job.id)}
                                                className="py-4 bg-blue-600 text-white hover:bg-blue-700 rounded-[20px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95"
                                            >
                                                Accept <CheckCircle2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedJob(job); setIsBidModalOpen(true); }}
                                                className="py-4 bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-[20px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                            >
                                                Negotiate <Gavel size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { setSelectedJob(job); setIsBidModalOpen(true); }}
                                            className="w-full py-4 bg-amber-500 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-amber-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95 hover:bg-amber-600"
                                        >
                                            Propose Price <Gavel size={16} />
                                        </button>
                                    )}
                                </div>
                            ) : jobsSubTab === 'Requests' ? (
                                <button
                                    onClick={() => handleAcceptJob(job.id)}
                                    className="w-full py-4 bg-purple-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-purple-100 dark:shadow-none animate-pulse"
                                >
                                    <CheckCircle2 size={16} /> Accept Direct Request
                                </button>
                            ) : jobsSubTab === 'Proposed' ? (

                                <div className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-700">
                                    Pending Shipper <Clock size={16} />
                                </div>
                            ) : jobsSubTab === 'Rejected' ? (
                                <div className="w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/30">
                                    Load Rejected <X size={16} />
                                </div>
                            ) : job.type === 'Accepted' ? (
                                <div className="w-full py-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-green-100 dark:border-green-900/30">
                                    Trip Approved <CheckCircle2 size={16} />
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAcceptJob(job.id)}
                                        className="flex-1 py-4 bg-blue-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        Accept
                                    </button>
                                    <button className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 rounded-[20px] font-black text-xs uppercase tracking-widest">Chat</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrowseJobsTab;
