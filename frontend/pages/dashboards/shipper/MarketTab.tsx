import React from 'react';
import { Search, ShoppingCart, Truck, Package } from 'lucide-react';

interface MarketTabProps {
    setIsCartOpen: (open: boolean) => void;
    cart: any[];
    marketFilter: string;
    setMarketFilter: (filter: string) => void;
    marketItems: any[];
    addToCart: (item: any) => void;
    handleBookService: (item: any) => void;
    hiringUrgency: Record<string, string>;
    setHiringUrgency: (urgency: any) => void;
    handleDirectHire: (driverName: string, driverId?: string) => void;
    handleAcceptJob?: (job: any) => void;
    VehicleSlider: React.FC<{ images: string[] }>;
}

const MarketTab: React.FC<MarketTabProps> = ({
    setIsCartOpen,
    cart,
    marketFilter,
    setMarketFilter,
    marketItems,
    addToCart,
    handleBookService,
    hiringUrgency,
    setHiringUrgency,
    handleDirectHire,
    handleAcceptJob,
    VehicleSlider
}) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 relative">
            <div className="fixed bottom-32 right-8 z-[60]">
                <button onClick={() => setIsCartOpen(true)} className="h-20 w-20 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center relative hover:scale-110 active:scale-95 transition-all">
                    <ShoppingCart size={32} />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black h-8 w-8 rounded-full flex items-center justify-center border-4 border-white">
                            {cart.reduce((a, b) => a + b.quantity, 0)}
                        </span>
                    )}
                </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Kwik Shop</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">Browse the global marketplace. Shop hardware, spares, and gear.</p>
                </div>
                <div className="relative flex-grow max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500" size={16} />
                    <input className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-12 pr-6 py-3 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus-within:ring-blue-600 outline-none w-full shadow-sm text-slate-900 dark:text-slate-100" placeholder="Search Marketplace..." />
                </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
                {['All', 'Cargo', 'Transport/Logistics', 'Equipment'].map(cat => (
                    <button key={cat} onClick={() => setMarketFilter(cat)} className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${marketFilter === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {marketItems.filter(i => {
                    return marketFilter === 'All' || i.cat === marketFilter;
                }).map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 rounded-[24px] p-3 border border-slate-50 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                        <div className="h-32 rounded-xl overflow-hidden mb-3 relative bg-slate-100 dark:bg-slate-900">
                            {item.cat === 'Transport/Logistics' && item.images ? (
                                <VehicleSlider images={item.images} />
                            ) : (
                                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
                            )}
                            <div className={`absolute top-2 left-2 backdrop-blur-md px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${item.cat === 'Transport/Logistics' ? 'bg-emerald-500/90 text-white' : item.cat === 'Cargo' ? 'bg-amber-500/90 text-white' : 'bg-white/90 text-blue-600'}`}>
                                {item.cat}
                            </div>
                        </div>
                        <div className="px-1 pb-1">
                            <h4 className="font-black text-slate-900 dark:text-slate-100 text-[13px] leading-tight line-clamp-1 mb-1">{item.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1">{item.provider}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 line-clamp-2 leading-tight">{item.details}</p>
                            <p className="text-base font-black text-blue-600 dark:text-blue-400 mb-3">{item.priceStr}</p>

                            {item.cat === 'Equipment' ? (
                                <button onClick={() => addToCart(item)} className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md shadow-blue-100 transition-all">
                                    <ShoppingCart size={12} /> Add
                                </button>
                            ) : item.cat === 'Cargo' ? (
                                <button
                                    onClick={() => handleAcceptJob && handleAcceptJob(item)}
                                    className={`w-full py-2 text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-md transition-all hover:scale-[1.02] active:scale-95 touch-manipulation ${item.priceStr === 'Open to Bids' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                                >
                                    {item.priceStr === 'Open to Bids' ? 'Bid' : 'Accept'}
                                </button>
                            ) : item.cat === 'Transport/Logistics' ? (
                                <button
                                    onClick={() => handleDirectHire(item.provider, item.driverId)}
                                    className={`w-full py-2 text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-md transition-all hover:scale-[1.02] active:scale-95 touch-manipulation ${(hiringUrgency[idx] || 'standard') === 'urgent' ? 'bg-amber-500 hover:bg-amber-600' : (hiringUrgency[idx] || 'standard') === 'flexible' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    Hire
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleBookService(item)}
                                    className="w-full py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md shadow-emerald-100 transition-all"
                                >
                                    <Truck size={12} /> Book
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
