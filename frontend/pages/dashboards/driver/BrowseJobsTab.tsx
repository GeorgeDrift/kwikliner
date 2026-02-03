
import React from 'react';
import { MapPin, Package, DollarSign, CheckCircle2, Gavel, Clock, X, Filter, ChevronDown } from 'lucide-react';
import VehicleSlider from '../../../components/VehicleSlider';

interface BrowseJobsTabProps {
    jobs: any[];
    marketItems: any[];
    myListings: any[];
    jobsSubTab: string;
    setJobsSubTab: (tab: 'Market' | 'Requests' | 'Proposed' | 'Rejected' | 'Listings') => void;
    jobsLocationFilter: string;
    setJobsLocationFilter: (filter: string) => void;
    handleAcceptJob: (id: string) => void;
    setSelectedJob: (job: any) => void;
    setIsBidModalOpen: (open: boolean) => void;
}

const BrowseJobsTab: React.FC<BrowseJobsTabProps> = ({
    jobs = [],
    marketItems = [],
    myListings = [],
    jobsSubTab,
    setJobsSubTab,
    jobsLocationFilter,
    setJobsLocationFilter,
    handleAcceptJob,
    setSelectedJob,
    setIsBidModalOpen
}) => {
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = React.useState(false);
    const locations = ['All', 'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba'];

    const displayedItems = React.useMemo(() => {
        if (jobsSubTab === 'Market') {
            return (marketItems || []).filter(i =>
                (i.cat === 'Cargo' || i.type === 'Cargo') && (
                    jobsLocationFilter === 'All' ||
                    (i.location || '').toLowerCase().includes(jobsLocationFilter.toLowerCase())
                ));
        }
        if (jobsSubTab === 'Listings') {
            return (myListings || []).filter(l => (
                jobsLocationFilter === 'All' ||
                (l.location || l.route || '').toLowerCase().includes(jobsLocationFilter.toLowerCase())
            ));
        }
        return (jobs || []).filter(j => j.type === jobsSubTab && (
            jobsLocationFilter === 'All' ||
            (j.route || j.location || '').toLowerCase().includes(jobsLocationFilter.toLowerCase())
        ));
    }, [jobsSubTab, marketItems, myListings, jobs, jobsLocationFilter]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Job Marketplace</h3>
            <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                <div className="p-4 sm:p-8 border-b border-slate-50 dark:border-slate-700 flex flex-wrap items-center justify-between gap-6 bg-slate-50/30 dark:bg-slate-900/10">
                    <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide">
                        <button onClick={() => setJobsSubTab('Market')} className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Market' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700'}`}>Marketplace</button>
                        <button onClick={() => setJobsSubTab('Proposed')} className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Proposed' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700'}`}>My Proposals</button>
                        <button onClick={() => setJobsSubTab('Listings')} className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Listings' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700'}`}>My Listings ({myListings?.length || 0})</button>
                        <button onClick={() => setJobsSubTab('Requests')} className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Requests' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700'}`}>Direct Requests ({jobs?.filter(j => j.type === 'Requests')?.length || 0})</button>
                        <button onClick={() => setJobsSubTab('Rejected')} className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${jobsSubTab === 'Rejected' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700'}`}>Rejected</button>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                            className="flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-blue-500 transition-all text-slate-600 dark:text-slate-400"
                        >
                            <Filter size={16} className={jobsLocationFilter !== 'All' ? 'text-blue-600' : ''} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {jobsLocationFilter === 'All' ? 'Filter Location' : `Location: ${jobsLocationFilter}`}
                            </span>
                            <ChevronDown size={14} className={`transition-transform duration-300 ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isLocationDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsLocationDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-2xl py-3 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-700 mb-2">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Location</p>
                                    </div>
                                    {locations.map(loc => (
                                        <button
                                            key={loc}
                                            onClick={() => {
                                                setJobsLocationFilter(loc);
                                                setIsLocationDropdownOpen(false);
                                            }}
                                            className={`w-full px-6 py-3 text-left text-xs font-bold transition-all flex items-center justify-between group ${jobsLocationFilter === loc ? 'text-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-blue-600'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <MapPin size={14} className={jobsLocationFilter === loc ? 'text-blue-600' : 'text-slate-300 dark:text-slate-600 group-hover:text-blue-400'} />
                                                {loc}
                                            </div>
                                            {jobsLocationFilter === loc && <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="p-4">
                    {displayedItems.length === 0 ? (
                        <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/40 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                            <div className="max-w-xs mx-auto">
                                <Package className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
                                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">No {jobsSubTab === 'Market' ? 'Market Loads' : jobsSubTab} Found</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">We couldn't find any items in this category matching your location.</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 dark:shadow-none transition-all hover:bg-black"
                                >
                                    Refresh Data
                                </button>
                                {jobsSubTab === 'Market' && marketItems.length > 0 && (
                                    <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-2xl text-left border border-slate-100 dark:border-slate-700">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Available Categories:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.from(new Set(marketItems.map(i => i.cat || i.type))).map(cat => (
                                                <span key={cat} className="px-2 py-1 bg-slate-50 dark:bg-slate-900 rounded text-[9px] font-bold text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">{cat}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {displayedItems.map((job: any) => {
                                const hasImages = (job.images && job.images.length > 0 && job.images.some((img: string) => img !== '')) || (job.img && job.img !== '');
                                const displayImages = (job.images && job.images.length > 0) ? job.images.filter((img: string) => img !== '') : (job.img ? [job.img] : []);

                                return (
                                    <div key={job.id} className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col justify-between">
                                        <div>
                                            <div className="h-28 -mx-4 -mt-4 mb-4 overflow-hidden bg-slate-50 dark:bg-slate-950 relative">
                                                {hasImages ? (
                                                    <VehicleSlider images={displayImages} />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 dark:text-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                                        <Package size={28} strokeWidth={1} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest mt-1">{job.cat || job.type || 'Cargo'}</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white shadow-sm z-10">
                                                    {job.cat || job.type || 'Cargo'}
                                                </div>
                                            </div>

                                            <h4 className="text-base font-black text-slate-900 dark:text-white mb-1 truncate">{job.name || job.route}</h4>
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3 truncate">{job.provider || job.shipper || 'Verified Shipper'}</p>
                                            <div className="space-y-2 mb-5">
                                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium truncate">
                                                    <Package size={14} className="shrink-0" /> {job.details || job.cargo}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium truncate">
                                                    <MapPin size={14} className="shrink-0" /> {job.location || job.route}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                                                    <DollarSign size={14} className="shrink-0" />
                                                    <span className={job.priceStr === 'Open to Bids' ? 'text-amber-600 dark:text-amber-400 font-black px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 rounded-md text-[10px]' : 'font-black text-slate-900 dark:text-white'}>
                                                        {job.has_bid ? `MWK ${parseFloat((job.my_bid_amount || 0).toString()).toLocaleString()}` : (job.priceStr || job.price)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between mb-4">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{job.date || 'New Load'}</span>
                                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">{job.weight || (job.bids ? `${job.bids} Bids` : 'Available')}</span>
                                            </div>
                                        </div>

                                        {jobsSubTab === 'Market' ? (
                                            <div className="space-y-2">
                                                {job.pricingType === 'Direct' || (job.priceStr && job.priceStr !== 'Open to Bids') ? (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            onClick={() => handleAcceptJob(job.id)}
                                                            className="py-3.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-blue-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95"
                                                        >
                                                            Accept <CheckCircle2 size={13} />
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedJob(job); setIsBidModalOpen(true); }}
                                                            className="py-3.5 bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                                        >
                                                            Bid <Gavel size={13} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => { setSelectedJob(job); setIsBidModalOpen(true); }}
                                                        className="w-full py-4 bg-amber-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95 hover:bg-amber-600"
                                                    >
                                                        Propose Price <Gavel size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        ) : jobsSubTab === 'Requests' ? (
                                            <button
                                                onClick={() => handleAcceptJob(job.id)}
                                                className="w-full py-3.5 bg-purple-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-purple-100 dark:shadow-none animate-pulse"
                                            >
                                                <CheckCircle2 size={14} /> Accept Request
                                            </button>
                                        ) : jobsSubTab === 'Listings' ? (
                                            <div className="w-full py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-900/30">
                                                Active Listing <CheckCircle2 size={14} />
                                            </div>
                                        ) : jobsSubTab === 'Proposed' ? (
                                            <div className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-700">
                                                Pending Shipper <Clock size={14} />
                                            </div>
                                        ) : jobsSubTab === 'Rejected' ? (
                                            <div className="w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/30">
                                                Rejected <X size={14} />
                                            </div>
                                        ) : job.type === 'Accepted' ? (
                                            <div className="w-full py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 border border-green-100 dark:border-green-900/30">
                                                Approved <CheckCircle2 size={14} />
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAcceptJob(job.id)}
                                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all"
                                                >
                                                    Accept
                                                </button>
                                                <button className="flex-1 py-3 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest">Chat</button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrowseJobsTab;
