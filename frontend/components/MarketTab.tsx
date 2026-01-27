import React from 'react';
import { Search, ShoppingCart, Truck, Package, Gavel, CheckCircle2, User as UserIcon, MapPin, Edit } from 'lucide-react';
import VehicleSlider from './VehicleSlider';

export interface MarketItem {
    id: string;
    name: string;
    cat: string;
    type: string;
    price: number;
    priceStr: string;
    img: string;
    images?: string[];
    location: string;
    provider: string;
    details: string;
    ownerId?: string;
    weight?: string;
    pricingType?: 'Direct' | 'Bid' | string;
    driverId?: string;
    stock?: number;
    quantity?: string | number;
}

interface MarketTabProps {
    setIsCartOpen: (open: boolean) => void;
    cart: any[];
    marketFilter: string;
    setMarketFilter: (filter: string) => void;
    marketItems: MarketItem[];
    addToCart: (item: any) => void;
    handleBookService?: (item: any) => void;
    hiringUrgency?: Record<string, string>;
    setHiringUrgency?: (urgency: any) => void;
    handleDirectHire?: (driverName: string, driverId?: string) => void;
    handleAcceptJob?: (job: any) => void;
    setSelectedJob?: (job: any) => void;
    setIsBidModalOpen?: (open: boolean) => void;
    userId?: string;
    productFilter?: 'All' | 'Mine';
    setProductFilter?: (filter: 'All' | 'Mine') => void;
    inventoryCount?: number;
    onEditItem?: (item: any) => void;
    categories?: string[];
}

const MarketTab: React.FC<MarketTabProps> = ({
    setIsCartOpen,
    cart,
    marketFilter,
    setMarketFilter,
    marketItems,
    addToCart,
    handleBookService,
    hiringUrgency = {},
    setHiringUrgency,
    handleDirectHire,
    handleAcceptJob,
    setSelectedJob,
    setIsBidModalOpen,
    userId,
    productFilter,
    setProductFilter,
    inventoryCount,
    onEditItem,
    categories = ['All', 'Cargo', 'Transport/Logistics', 'Hardware', 'Spares', 'Agri', 'Tech', 'Safety']
}) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 relative">
            {/* Cart Trigger */}
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

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Kwik Shop</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">Browse the global marketplace. Cargo, Hardware, and Logistics.</p>
                </div>
                <div className="relative flex-grow max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500" size={16} />
                    <input className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-12 pr-6 py-3 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus-within:ring-blue-600 outline-none w-full shadow-sm text-slate-900 dark:text-slate-100" placeholder="Search Marketplace..." />
                </div>
            </div>

            {/* Product Filter Tabs (Mine/All) - For Hardware Owners */}
            {productFilter && setProductFilter && (
                <div className="flex flex-wrap gap-4 items-center">
                    <button
                        onClick={() => setProductFilter('All')}
                        className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${productFilter === 'All' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 hover:border-indigo-600'}`}
                    >
                        All Products
                    </button>
                    <button
                        onClick={() => setProductFilter('Mine')}
                        className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${productFilter === 'Mine' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 hover:border-indigo-600'}`}
                    >
                        My Products {inventoryCount !== undefined ? `(${inventoryCount})` : ''}
                    </button>
                </div>
            )}

            {/* Category Filters */}
            <div className="flex flex-wrap gap-4 items-center overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setMarketFilter(cat)} className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${marketFilter === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Marketplace Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {marketItems.filter(i => {
                    const matchesCategory = marketFilter === 'All' || i.cat === marketFilter;
                    const matchesOwnership = productFilter === 'Mine' ? i.ownerId === userId : true;
                    return matchesCategory && matchesOwnership;
                }).map((item, idx) => {
                    const isMine = userId && item.ownerId === userId;
                    return (
                        <div key={idx} className="bg-white dark:bg-slate-800 rounded-[32px] p-4 border border-slate-50 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all group">
                            <div className="h-48 rounded-[24px] overflow-hidden mb-4 relative bg-slate-100 dark:bg-slate-900">
                                {(item.cat === 'Transport/Logistics' || item.cat === 'Cargo') && item.images && item.images.length > 0 ? (
                                    <VehicleSlider images={item.images} />
                                ) : item.img ? (
                                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 text-slate-300 dark:text-slate-700">
                                        {item.cat === 'Cargo' ? <Package size={48} strokeWidth={1} /> : <ShoppingCart size={48} strokeWidth={1} />}
                                        <p className="text-[10px] font-black uppercase tracking-widest mt-2">{item.cat === 'Cargo' ? 'Shipment' : 'Product'}</p>
                                    </div>
                                )}
                                <div className={`absolute top-3 left-3 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest ${item.cat === 'Transport/Logistics' ? 'bg-emerald-500/90 text-white' : item.cat === 'Cargo' ? 'bg-amber-500/90 text-white' : 'bg-white/90 text-blue-600'}`}>
                                    {item.cat}
                                </div>
                                {isMine && (
                                    <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                        Your Product
                                    </div>
                                )}
                            </div>
                            <div className="px-2 pb-2">
                                <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm line-clamp-1 mb-1">{item.name}</h4>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                                    <UserIcon size={10} /> {item.provider} • <MapPin size={10} /> {item.location}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">{item.details}</p>
                                {item.cat === 'Cargo' && (
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        {item.quantity && (
                                            <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                <Package size={12} />
                                                {item.quantity} {typeof item.quantity === 'number' || !String(item.quantity).match(/[a-zA-Z]/) ? 'Quant.' : ''}
                                            </div>
                                        )}
                                        {item.weight && (
                                            <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                <Truck size={12} />
                                                {item.weight} {typeof item.weight === 'number' || !String(item.weight).match(/[a-zA-Z]/) ? 'KGS' : ''}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!isMine && (
                                    <p className="text-lg font-black text-blue-600 dark:text-blue-400 mb-4">
                                        {item.cat === 'Cargo' ? item.priceStr : `MWK ${Number(item.price).toLocaleString()}`}
                                    </p>
                                )}
                                {isMine && item.cat === 'Cargo' && (
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-widest">
                                        Your Listing
                                    </p>
                                )}

                                {isMine ? (
                                    <button
                                        onClick={() => onEditItem && onEditItem(item)}
                                        className="w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Edit size={12} /> Edit Listing
                                    </button>
                                ) : item.cat === 'Cargo' ? (
                                    <button
                                        onClick={() => handleAcceptJob && handleAcceptJob(item)}
                                        className={`w-full py-1.5 text-white rounded-lg font-black text-[10px] uppercase tracking-wider shadow-md transition-all hover:scale-[1.02] active:scale-95 touch-manipulation flex items-center justify-center gap-2 ${item.priceStr === 'Open to Bids' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                                    >
                                        <Gavel size={12} /> {item.priceStr === 'Open to Bids' ? 'Submit Bid' : 'Accept Job'}
                                    </button>
                                ) : item.cat === 'Transport/Logistics' ? (
                                    <button
                                        onClick={() => handleDirectHire && handleDirectHire(item.provider, item.driverId)}
                                        className={`w-full py-2.5 text-white rounded-lg font-black text-[10px] uppercase tracking-wider shadow-md transition-all hover:scale-[1.02] active:scale-95 touch-manipulation ${(hiringUrgency[idx] || 'standard') === 'urgent' ? 'bg-amber-500 hover:bg-amber-600' : (hiringUrgency[idx] || 'standard') === 'flexible' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    >
                                        Hire • {(hiringUrgency[idx] || 'standard')}
                                    </button>
                                ) : item.cat === 'Services' ? (
                                    <button
                                        onClick={() => handleBookService && handleBookService(item)}
                                        className="w-full py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                                    >
                                        <Truck size={12} /> Book Service
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="w-full py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                                    >
                                        <ShoppingCart size={12} /> Add to Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MarketTab;
