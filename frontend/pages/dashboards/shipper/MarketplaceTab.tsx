import React from 'react';
import { Star, Truck, MapPin, ChevronDown, Zap, Clock, Shield, Box, MessageSquare } from 'lucide-react';

// Reusing VehicleSlider or similar if needed, or passing it as prop
// For now, let's assume it's passed or local if it's small

interface MarketplaceTabProps {
    hireDriverTab: 'requests' | 'find';
    setHireDriverTab: (tab: 'requests' | 'find') => void;
    availableBids: any[];
    handleAcceptBid: (driver: string, amount: string, bidId?: string) => void;
    locationFilter: string;
    setLocationFilter: (loc: string) => void;
    marketItems: any[];
    hiringUrgency: Record<string, string>;
    setHiringUrgency: (urgency: any) => void;
    handleDirectHire: (driverName: string, driverId?: string) => void;
    VehicleSlider: React.FC<{ images: string[] }>;
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
    VehicleSlider
}) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Hire Verified Drivers</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">Direct access to active haulers ready to move.</p>
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
                            Find Drivers
                        </button>
                    </div>
                </div>
            </div>

            {hireDriverTab === 'requests' ? (
                <div className="grid grid-cols-1 gap-6">
                    {availableBids.map((bid, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className="h-16 w-16 rounded-[20px] bg-slate-50 dark:bg-slate-700 border-2 border-white dark:border-slate-600 shadow-md overflow-hidden relative shrink-0">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bid.driver}`} alt="pfp" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-none">{bid.driver}</h4>
                                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">Bid Received</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500">
                                        <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-current" /> {bid.rating}</span>
                                        <span className="flex items-center gap-1"><Truck size={12} /> {bid.truck}</span>
                                        <span>• {bid.jobs} trips</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Bid Amount</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-slate-100">{bid.amount}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="h-12 w-12 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                                        <span>×</span>
                                    </button>
                                    <button onClick={() => handleAcceptBid(bid.driver, bid.amount, bid.id, bid.loadId)} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all">
                                        Accept Bid
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {availableBids.length === 0 && (
                        <div className="text-center py-20 text-slate-400">
                            <p className="text-sm font-bold">No active driver requests found.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                    <div className="flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-4">
                        <div className="relative">
                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="appearance-none bg-white dark:bg-slate-800 px-10 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-all shadow-sm cursor-pointer text-slate-900 dark:text-slate-100"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {marketItems.filter(i => i.cat === 'Transport/Logistics' && (locationFilter === 'All' || i.location === locationFilter)).map((driver, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between">
                                <div>
                                    <div className="h-40 w-full rounded-[28px] bg-slate-50 dark:bg-slate-900 border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden relative mb-4">
                                        {driver.images ? <VehicleSlider images={driver.images} /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.provider}`} className="w-full h-full object-cover" alt="pfp" />}
                                        <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 border-2 border-white dark:border-slate-700 rounded-full z-20"></div>
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-none">{driver.provider}</h4>
                                    <p className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-2 mb-8 bg-blue-50 dark:bg-blue-900/20 w-fit px-3 py-1 rounded-lg">{driver.name}</p>
                                    <div className="space-y-3 mb-10 text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-3"><MapPin size={16} /><span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{driver.location} Hub</span></div>
                                        {driver.capacity && <div className="flex items-center gap-3"><Box size={16} /><span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Cap: {driver.capacity}</span></div>}
                                        <div className="flex items-center gap-3"><Shield size={16} className="text-green-500 dark:text-green-400" /><span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Service: {driver.priceStr}</span></div>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Shipment Urgency</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'urgent', label: 'Urgent', icon: Zap, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700' },
                                            { id: 'standard', label: 'Standard', icon: Truck, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' },
                                            { id: 'flexible', label: 'Flexible', icon: Clock, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700' }
                                        ].map((level) => (
                                            <button
                                                key={level.id}
                                                onClick={() => setHiringUrgency({ ...hiringUrgency, [idx]: level.id })}
                                                className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all shadow-sm dark:shadow-none ${(hiringUrgency[idx] || 'standard') === level.id ? `${level.color} ring-1 ring-blue-200 dark:ring-blue-800` : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                            >
                                                <level.icon size={16} className="mb-1" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{level.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 border-t border-slate-50 dark:border-slate-800 pt-8">
                                    <button
                                        onClick={() => handleDirectHire(driver.provider, driver.driverId)}
                                        className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl dark:shadow-none transition-all hover:scale-[1.02] active:scale-95 touch-manipulation ${(hiringUrgency[idx] || 'standard') === 'urgent' ? 'bg-amber-500 hover:bg-amber-600' : (hiringUrgency[idx] || 'standard') === 'flexible' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    >
                                        Hire • {(hiringUrgency[idx] || 'standard')}
                                    </button>
                                    <button className="h-14 w-14 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-900 transition-all"><MessageSquare size={20} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketplaceTab;
