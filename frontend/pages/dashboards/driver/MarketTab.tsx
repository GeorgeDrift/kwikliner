import React from 'react';
import { Search, MapPin, User as UserIcon, CheckCircle2, Gavel } from 'lucide-react';
import VehicleSlider from './VehicleSlider';

interface MarketTabProps {
    marketFilter: string;
    setMarketFilter: (filter: string) => void;
    marketItems: any[];
    handleAcceptJob: (id: string) => void;
    setSelectedJob: (job: any) => void;
    setIsBidModalOpen: (open: boolean) => void;
}

const MarketTab: React.FC<MarketTabProps> = ({
    marketFilter,
    setMarketFilter,
    marketItems,
    handleAcceptJob,
    setSelectedJob,
    setIsBidModalOpen
}) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Kwik Shop</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">Browse shipper loads, logistics services, and equipment.</p>
                </div>
                <div className="relative flex-grow max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-12 pr-6 py-3 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus-within:ring-blue-600 outline-none w-full shadow-sm text-slate-900 dark:text-white transition-colors" placeholder="Search Marketplace..." />
                </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
                {['All', 'Cargo', 'Transport/Logistics', 'Equipment'].map(cat => (
                    <button key={cat} onClick={() => setMarketFilter(cat)} className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${marketFilter === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {marketItems.filter(i => marketFilter === 'All' || i.cat === marketFilter).map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 rounded-[32px] p-4 border border-slate-50 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all group">
                        <div className="h-48 rounded-[24px] overflow-hidden mb-4 relative bg-slate-100 dark:bg-slate-900">
                            {item.cat === 'Transport/Logistics' && item.images ? (
                                <VehicleSlider images={item.images} />
                            ) : (
                                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
                            )}
                            <div className={`absolute top-3 left-3 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest ${item.cat === 'Transport/Logistics' ? 'bg-emerald-500/90 text-white' :
                                item.cat === 'Cargo' ? 'bg-amber-500/90 text-white' :
                                    'bg-white/90 text-blue-600'
                                }`}>
                                {item.cat}
                            </div>
                        </div>
                        <div className="px-2">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">{item.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5 line-clamp-1">
                                <UserIcon size={10} /> {item.provider} • <MapPin size={10} /> {item.location}
                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">{item.details}</p>

                            {item.cat === 'Cargo' && item.weight && (
                                <p className="text-xs font-black text-amber-600 mb-3">Weight: {item.weight}</p>
                            )}

                            <p className="text-lg font-black text-blue-600 mb-2">{item.priceStr}</p>

                            {item.cat === 'Cargo' && item.pricingType && (
                                <div className={`mb-4 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.pricingType === 'Direct' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                    }`}>
                                    {item.pricingType} Price
                                </div>
                            )}

                            {item.cat === 'Cargo' ? (
                                <div className="space-y-2">
                                    {item.pricingType === 'Direct' ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={() => handleAcceptJob(item.id)} className="py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-blue-100 dark:shadow-none transition-all">
                                                Accept <CheckCircle2 size={12} />
                                            </button>
                                            <button onClick={() => { setSelectedJob(item); setIsBidModalOpen(true); }} className="py-3 bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all">
                                                Negotiate <Gavel size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => { setSelectedJob(item); setIsBidModalOpen(true); }} className="w-full py-3 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-100 dark:shadow-none transition-all">
                                            <Gavel size={14} /> Bid on Load
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <button className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100 dark:shadow-none transition-all">
                                    <Search size={14} /> View Details
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketTab;
