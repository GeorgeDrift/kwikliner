
import React from 'react';
import { Star, Truck, MapPin, ChevronDown, Zap, Clock, Shield, Box, MessageSquare, X, CheckCircle2, Globe, Package } from 'lucide-react';
import VehicleSlider from '../../../components/VehicleSlider';

interface MarketplaceTabProps {
    hireDriverTab: 'requests' | 'find';
    setHireDriverTab: (tab: 'requests' | 'find') => void;
    availableBids: any[];
    handleAcceptBid: (driver: string, amount: string, bidId?: string, loadId?: string) => void;
    locationFilter: string;
    setLocationFilter: (loc: string) => void;
    marketItems: any[];
    hiringUrgency: Record<string, string>;
    setHiringUrgency: (urgency: any) => void;
    handleDirectHire: (driverName: string, driverId?: string) => void;
    marketFilter: string;
    setMarketFilter: (filter: string) => void;
    categories?: string[];
}

const MarketplaceTab: React.FC<MarketplaceTabProps> = ({
    hireDriverTab,
    setHireDriverTab,
    availableBids,
    handleAcceptBid,
    locationFilter,
    setLocationFilter,
    marketItems,
    hiringUrgency,
    setHiringUrgency,
    handleDirectHire,
    marketFilter,
    setMarketFilter,
    categories = ['All', 'Transport/Logistics', 'Cargo', 'Hardware', 'Spares', 'Agri', 'Tech', 'Safety']
}) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Marketplace</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">Browse categories or hire verified drivers directly.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <button
                            onClick={() => setHireDriverTab('requests')}
                            className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${hireDriverTab === 'requests' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            Driver Requests
                        </button>
                        <button
                            onClick={() => setHireDriverTab('find')}
                            className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${hireDriverTab === 'find' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            Global Market
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Filters */}
            {hireDriverTab === 'find' && (
                <div className="flex flex-wrap gap-4 items-center overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setMarketFilter(cat)}
                            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${marketFilter === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {hireDriverTab === 'requests' ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {availableBids.map((bid, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 dark:bg-blue-900/10 blur-3xl -z-0"></div>

                                <div className="flex items-center gap-5 w-full md:w-auto relative z-10">
                                    <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-700 border-2 border-white dark:border-slate-600 shadow-lg overflow-hidden relative shrink-0">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bid.driver}`} alt="pfp" className="w-full h-full object-cover" />
                                        <div className="absolute bottom-1 right-1 h-3 w-3 bg-green-500 border border-white dark:border-slate-600 rounded-full"></div>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h4 className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tight truncate">{bid.driver}</h4>
                                            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shadow-sm">Bid Received</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                            <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-current" /> {bid.rating}</span>
                                            <span className="flex items-center gap-1"><Truck size={12} /> {bid.truck}</span>
                                            <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[8px] uppercase">{bid.loadId}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto justify-between md:justify-end relative z-10 border-t md:border-t-0 border-slate-50 dark:border-slate-700 pt-4 md:pt-0">
                                    <div className="text-center md:text-right shrink-0">
                                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Proposed Price</p>
                                        <p className="text-xl font-black text-blue-600 dark:text-blue-400 italic tracking-tighter leading-none">{bid.amount}</p>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <button className="h-12 w-12 rounded-xl border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-100 transition-all shrink-0">
                                            <X size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleAcceptBid(bid.driver, bid.amount, bid.id, bid.loadId)}
                                            className="flex-1 sm:flex-none px-6 py-3.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all hover:bg-blue-700 flex items-center justify-center gap-2"
                                        >
                                            Accept Request <CheckCircle2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {availableBids.length === 0 && (
                        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Waiting for drivers to bid on your loads...</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-4">
                        <div className="relative">
                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="appearance-none bg-white dark:bg-slate-800 px-10 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-all shadow-sm cursor-pointer text-slate-900 dark:text-slate-100 w-full sm:w-56"
                            >
                                <option value="All" className="dark:bg-slate-800">All Locations</option>
                                <option value="Lilongwe" className="dark:bg-slate-800">Lilongwe</option>
                                <option value="Blantyre" className="dark:bg-slate-800">Blantyre</option>
                                <option value="Mzuzu" className="dark:bg-slate-800">Mzuzu</option>
                                <option value="Zomba" className="dark:bg-slate-800">Zomba</option>
                            </select>
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={14} />
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" size={14} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {marketItems.filter(i => {
                            const matchesLocation = locationFilter === 'All' || i.location === locationFilter;
                            const matchesCategory = marketFilter === 'All' || i.cat === marketFilter;
                            return matchesLocation && matchesCategory;
                        }).map((item, idx) => {
                            const hasImages = item.images && item.images.length > 0 && item.images.some((img: string) => img !== '');
                            const isFleet = item.cat === 'Transport/Logistics';
                            return (
                                <div key={idx} className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between">
                                    <div>
                                        <div className="h-28 w-full rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden relative mb-3">
                                            {hasImages ? (
                                                <VehicleSlider images={item.images.filter((img: string) => img !== '')} />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 dark:text-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                                    {item.cat === 'Cargo' ? <Package size={32} strokeWidth={1} /> : <Truck size={32} strokeWidth={1} />}
                                                    <p className="text-[8px] font-black uppercase tracking-widest mt-1">{item.cat === 'Cargo' ? 'Shipment' : 'No Gallery'}</p>
                                                </div>
                                            )}
                                            <div className="absolute bottom-1.5 right-1.5 h-3.5 w-3.5 bg-green-500 border-2 border-white dark:border-slate-700 rounded-full z-20"></div>
                                        </div>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
                                            {item.metadata?.manufacturer && item.metadata?.model
                                                ? `${item.metadata.manufacturer} ${item.metadata.model}`
                                                : item.name || item.provider}
                                        </h4>
                                        <p className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1 mb-3 bg-blue-50 dark:bg-blue-900/20 w-fit px-1.5 py-0.5 rounded-md">
                                            {item.cat}
                                        </p>
                                        <div className="space-y-1.5 mb-4 text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={12} className="shrink-0" />
                                                <span className="text-[9px] font-bold uppercase tracking-tight truncate">
                                                    {item.metadata?.location || item.location}
                                                </span>
                                            </div>
                                            {(item.metadata?.operating_range || item.operatingRange) && (
                                                <div className="flex items-center gap-1.5">
                                                    <Globe size={12} className="text-blue-500 shrink-0" />
                                                    <span className="text-[9px] font-bold uppercase tracking-tight truncate">
                                                        {item.metadata?.operating_range || item.operatingRange}
                                                    </span>
                                                </div>
                                            )}
                                            {(item.capacity || item.metadata?.capacity) && (
                                                <div className="flex items-center gap-1.5">
                                                    <Box size={12} className="shrink-0" />
                                                    <span className="text-[9px] font-bold uppercase tracking-tight truncate">
                                                        Cap: {item.capacity || item.metadata?.capacity}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <Shield size={12} className="text-green-500 dark:text-green-400 shrink-0" />
                                                <span className="text-[9px] font-black uppercase tracking-tight truncate">
                                                    {item.priceStr || `MWK ${item.price?.toLocaleString()}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="grid grid-cols-3 gap-1">
                                            {[
                                                { id: 'urgent', label: 'Urgent', icon: Zap, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700' },
                                                { id: 'standard', label: 'Std', icon: Truck, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' },
                                                { id: 'flexible', label: 'Flex', icon: Clock, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700' }
                                            ].map((level) => (
                                                <button
                                                    key={level.id}
                                                    onClick={() => setHiringUrgency({ ...hiringUrgency, [idx]: level.id })}
                                                    className={`flex flex-col items-center justify-center py-1.5 rounded-lg border transition-all ${(hiringUrgency[idx] || 'standard') === level.id ? `${level.color} ring-1 ring-blue-200 dark:ring-blue-800` : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                                >
                                                    <level.icon size={10} className="mb-0.5" />
                                                    <span className="text-[7px] font-black uppercase tracking-widest">{level.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 border-t border-slate-50 dark:border-slate-800 pt-4">
                                        <button
                                            onClick={() => handleDirectHire(item.provider, item.driverId)}
                                            className={`flex-1 py-2 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-md dark:shadow-none transition-all hover:scale-[1.02] active:scale-95 touch-manipulation ${(hiringUrgency[idx] || 'standard') === 'urgent' ? 'bg-amber-500 hover:bg-amber-600' : (hiringUrgency[idx] || 'standard') === 'flexible' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                        >
                                            {isFleet ? 'Hire Unit' : 'Details'}
                                        </button>
                                        <button className="h-8 w-8 border border-slate-100 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-900 transition-all"><MessageSquare size={14} /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketplaceTab;
