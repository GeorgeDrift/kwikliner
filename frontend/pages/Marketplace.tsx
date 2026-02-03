import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Truck, Package, ArrowRight, ShoppingCart,
    Briefcase, HardHat, Gavel, Loader2, MapPin, Filter, Star, LayoutGrid
} from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';
import { mapMarketData } from '../services/marketUtils';

interface MarketplaceProps {
    user: User | null;
}

type TabType = 'all' | 'freight' | 'hardware' | 'logistics';

const Marketplace: React.FC<MarketplaceProps> = ({ user }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [marketFilter, setMarketFilter] = useState('All');
    const [allData, setAllData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                const data = await api.getPublicMarketplaceAll();
                console.log("Marketplace Data loaded:", data);
                setAllData(data || []);
            } catch (err) {
                console.error("Marketplace: Error loading data", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMarketData();
    }, []);

    // Map public data to unified format
    const marketItems = useMemo(() => mapMarketData(allData), [allData]);

    const categories = ['All', 'Hardware', 'Cargo', 'Transport/Logistics', 'Spares', 'Agri', 'Tech', 'Safety'];

    const getItemsByCategory = (category: string) => {
        return marketItems.filter(i => {
            const matchesSearch = i.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                i.details?.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchesSearch) return false;

            if (category === 'All') return true;
            if (category === 'Hardware') return i.cat === 'Hardware' || i.cat === 'Hardware Store';
            return i.cat === category;
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-32 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Marketplace</h3>
                        <p className="text-slate-500 font-medium mt-1">Browse the global marketplace. Cargo, Hardware, and Logistics.</p>
                        {!user && (
                            <div className="mt-4 flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Want to buy or bid?</span>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-100"
                                >
                                    Log In Now
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="relative flex-grow max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input
                            className="bg-white border border-slate-100 rounded-xl pl-12 pr-6 py-4 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus-within:ring-blue-600 outline-none w-full shadow-lg shadow-slate-100"
                            placeholder="Search Marketplace..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-4 items-center overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setMarketFilter(cat)}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${marketFilter === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-600'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Marketplace Grid */}
                <div className="space-y-16">
                    {marketFilter === 'All' ? (
                        <>
                            {/* Hardware Store Section */}
                            {getItemsByCategory('Hardware').length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                                            <ShoppingCart size={18} />
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Hardware Store</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {getItemsByCategory('Hardware').map((item, idx) => <MarketCard key={idx} item={item} navigate={navigate} />)}
                                    </div>
                                </div>
                            )}

                            {/* Logistics Section */}
                            {getItemsByCategory('Transport/Logistics').length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                        <div className="p-2 bg-emerald-500 rounded-lg text-white">
                                            <Truck size={18} />
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Logistics Units</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {getItemsByCategory('Transport/Logistics').map((item, idx) => <MarketCard key={idx} item={item} navigate={navigate} />)}
                                    </div>
                                </div>
                            )}

                            {/* Cargo Section */}
                            {getItemsByCategory('Cargo').length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                        <div className="p-2 bg-amber-500 rounded-lg text-white">
                                            <Package size={18} />
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Available Loads</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {getItemsByCategory('Cargo').map((item, idx) => <MarketCard key={idx} item={item} navigate={navigate} />)}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {getItemsByCategory(marketFilter).map((item, idx) => <MarketCard key={idx} item={item} navigate={navigate} />)}
                        </div>
                    )}

                    {marketItems.length === 0 && !isLoading && (
                        <div className="col-span-full py-40 text-center bg-white rounded-[40px] border border-dashed border-slate-200 shadow-sm">
                            <div className="max-w-xs mx-auto">
                                <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <ShoppingCart className="text-slate-300" size={32} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">Marketplace Empty</h3>
                                <p className="text-slate-500 text-sm font-medium mb-8">We couldn't find any active items in the marketplace right now.</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100"
                                >
                                    Refresh Marketplace
                                </button>
                            </div>
                        </div>
                    )}

                    {marketItems.length > 0 && getItemsByCategory(marketFilter).length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No items found matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MarketCard: React.FC<{ item: any, navigate: any }> = ({ item, navigate }) => (
    <div className="bg-white rounded-[32px] p-4 border border-slate-50 shadow-sm hover:shadow-2xl transition-all group">
        <div className="h-48 rounded-[24px] overflow-hidden mb-4 relative bg-slate-100">
            <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
            <div className={`absolute top-3 left-3 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.cat === 'Transport/Logistics' ? 'bg-emerald-500/90 text-white' :
                item.cat === 'Cargo' ? 'bg-amber-500/90 text-white' :
                    'bg-white/90 text-blue-600'
                }`}>
                {item.cat}
            </div>
        </div>
        <div className="px-2 pb-2">
            <h4 className="font-black text-slate-900 text-sm line-clamp-1 mb-1">{item.name}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5 line-clamp-1">
                <MapPin size={10} /> {item.location} • {item.provider}
            </p>
            <p className="text-xs text-slate-500 mb-2 line-clamp-2">{item.details}</p>

            <div className="flex flex-wrap items-center gap-2 mb-3">
                {item.quantity && (
                    <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <Package size={10} /> {item.quantity}
                    </div>
                )}
                {item.weight && (
                    <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <Truck size={10} /> {item.weight}
                    </div>
                )}
            </div>

            <p className="text-xl font-black text-blue-600 mb-4">{item.priceStr}</p>

            <button
                onClick={() => navigate('/register')}
                className="w-full py-3 bg-blue-600 text-white hover:bg-black rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-50 transition-all"
            >
                {item.cat === 'Cargo' ? <Gavel size={12} /> : item.cat === 'Transport/Logistics' ? <Truck size={12} /> : <ShoppingCart size={12} />}
                {item.cat === 'Cargo' ? 'Bid on Load' : item.cat === 'Transport/Logistics' ? 'Hire Transporter' : 'Add to Cart'}
            </button>
        </div>
    </div>
);

export default Marketplace;
