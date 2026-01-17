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
    handleDirectHire: (driverName: string) => void;
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
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Kwik Shop</h3>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Browse the global marketplace. Shop hardware, spares, and gear.</p>
                </div>
                <div className="relative flex-grow max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input className="bg-white border border-slate-100 rounded-xl pl-12 pr-6 py-3 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus-within:ring-blue-600 outline-none w-full shadow-sm" placeholder="Search Marketplace..." />
                </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
                {['All', 'Cargo', 'Transport/Logistics', 'Equipment'].map(cat => (
                    <button key={cat} onClick={() => setMarketFilter(cat)} className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${marketFilter === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-600'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {marketItems.filter(i => {
                    return marketFilter === 'All' || i.cat === marketFilter;
                }).map((item, idx) => (
                    <div key={idx} className="bg-white rounded-[32px] p-4 border border-slate-50 shadow-sm hover:shadow-2xl transition-all group">
                        <div className="h-48 rounded-[24px] overflow-hidden mb-4 relative bg-slate-100">
                            {item.cat === 'Transport/Logistics' && item.images ? (
                                <VehicleSlider images={item.images} />
                            ) : (
                                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
                            )}
                            <div className={`absolute top-3 left-3 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest ${item.cat === 'Transport/Logistics' ? 'bg-emerald-500/90 text-white' : item.cat === 'Cargo' ? 'bg-amber-500/90 text-white' : 'bg-white/90 text-blue-600'}`}>
                                {item.cat}
                            </div>
                        </div>
                        <div className="px-2 pb-2">
                            <h4 className="font-black text-slate-900 text-sm line-clamp-1 mb-1">{item.name}</h4>
                            <p className="text-xs font-bold text-slate-400 mb-2">{item.provider}</p>
                            <p className="text-xs text-slate-500 mb-2 line-clamp-2">{item.details}</p>
                            <p className="text-lg font-black text-blue-600 mb-4">{item.priceStr}</p>

                            {item.cat === 'Equipment' ? (
                                <button onClick={() => addToCart(item)} className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all">
                                    <ShoppingCart size={14} /> Add to Cart
                                </button>
                            ) : item.cat === 'Cargo' ? (
                                <button
                                    onClick={() => handleAcceptJob && handleAcceptJob(item)}
                                    className={`w-full py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] active:scale-95 touch-manipulation ${item.priceStr === 'Open to Bids' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                                >
                                    {item.priceStr === 'Open to Bids' ? 'Submit Bid' : 'Accept Job'}
                                </button>
                            ) : item.cat === 'Transport/Logistics' ? ( // Assuming 'Transport/Logistics' items are for hiring
                                <button
                                    onClick={() => handleDirectHire(item.provider)} // Changed from driver.provider to item.provider
                                    className={`w-full py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] active:scale-95 touch-manipulation ${(hiringUrgency[idx] || 'standard') === 'urgent' ? 'bg-amber-500 hover:bg-amber-600' : (hiringUrgency[idx] || 'standard') === 'flexible' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    Hire • {(hiringUrgency[idx] || 'standard')}
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleBookService(item)}
                                    className="w-full py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all"
                                >
                                    <Truck size={14} /> Book Service
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
