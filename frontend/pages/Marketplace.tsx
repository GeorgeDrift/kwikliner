
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, MapPin, Truck, Filter, Calendar, Package, ArrowRight,
    ShieldCheck, Star, ShoppingCart, Wrench, Warehouse, HardHat,
    Briefcase, Fuel, Info, ChevronRight, Gavel
} from 'lucide-react';
import { User, UserRole } from '../types';

interface MarketplaceProps {
    user: User | null;
}

const Marketplace: React.FC<MarketplaceProps> = ({ user }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const featuredLoads = [
        {
            id: 'L-552',
            route: 'Lilongwe → Blantyre',
            cargo: 'Fertilizer',
            weight: '20 Tons',
            vehicle: 'Flatbed',
            price: 'MWK 450,000',
            posted: '2h ago',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 'L-553',
            route: 'Lusaka → Harare',
            cargo: 'Mining Equip',
            weight: '15 Tons',
            vehicle: 'Lowbed',
            price: 'USD 1,200',
            posted: '5h ago',
            image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 'L-554',
            route: 'Beira → Mutare',
            cargo: 'Fuel Tanker',
            weight: '35k Litres',
            vehicle: 'Tanker',
            price: 'USD 850',
            posted: '1d ago',
            image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 'L-555',
            route: 'Nairobi → Mombasa',
            cargo: 'Coffee Beans',
            weight: '18 Tons',
            vehicle: 'Box Body',
            price: 'USD 1,100',
            posted: '3h ago',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 'L-556',
            route: 'Johannesburg → Gaborone',
            cargo: 'Electronics',
            weight: '5 Tons',
            vehicle: 'Medium Truck',
            price: 'ZAR 25,000',
            posted: '10m ago',
            image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 'L-557',
            route: 'Dar es Salaam → Kigali',
            cargo: 'Cement Bags',
            weight: '25 Tons',
            vehicle: 'Trailer',
            price: 'USD 2,400',
            posted: '6h ago',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400'
        },
    ];

    const toolsAndEquipment = [
        {
            name: 'High-Performance GPS Tracker',
            category: 'Tools',
            price: 'MWK 45,000',
            image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=400',
            description: 'Long battery life with regional coverage.'
        },
        {
            name: 'Heavy-Duty 20-Ton Hydraulic Jack',
            category: 'Hardware',
            price: 'MWK 85,000',
            image: 'https://images.unsplash.com/photo-1635773103130-1845943f6067?auto=format&fit=crop&q=80&w=400',
            description: 'Essential for heavy-duty truck maintenance.'
        },
        {
            name: 'Truck Spare Parts Kit (Universal)',
            category: 'Spares',
            price: 'MWK 120,000',
            image: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=400',
            description: 'Standard filters, belts and light bulbs.'
        },
        {
            name: 'Industrial Wheel Nut Wrench',
            category: 'Tools',
            price: 'MWK 32,000',
            image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615ad?auto=format&fit=crop&q=80&w=400',
            description: 'High-torque manual wrench for truck hubs.'
        },
        {
            name: 'Engine Diagnostic Scanner V3',
            category: 'Electronics',
            price: 'MWK 155,000',
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400',
            description: 'Universal OBD2 scanner for all major truck models.'
        },
        {
            name: 'Reinforced Cargo Support Straps',
            category: 'Hardware',
            price: 'MWK 18,500',
            image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=400',
            description: '5-ton capacity ratcheting tie-down straps.'
        },
        {
            name: 'Emergency Roadside Flare Kit',
            category: 'Safety',
            price: 'MWK 25,000',
            image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
            description: 'Highly visible reflective signs and LED flares.'
        },
        {
            name: 'Heavy-Duty Air Compressor',
            category: 'Tools',
            price: 'MWK 95,000',
            image: 'https://images.unsplash.com/photo-1581092162384-8987c1794ed9?auto=format&fit=crop&q=80&w=400',
            description: 'Portable high-pressure compressor for tire inflation.'
        },
        {
            name: 'Professional Tool Chest (120pcs)',
            category: 'Hardware',
            price: 'MWK 210,000',
            image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&q=80&w=400',
            description: 'Complete set of wrenches, sockets, and screwdrivers.'
        },
    ];

    return (
        <div className="flex flex-col bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
            {/* Search Header */}
            <section className="bg-blue-600 dark:bg-blue-800 pt-20 pb-20 px-4 relative overflow-hidden">
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Logistics Marketplace</h1>
                    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-3 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 border border-blue-50 dark:border-slate-700">
                        <div className="flex-grow flex items-center px-6 py-4">
                            <Search className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4" />
                            <input
                                type="text"
                                placeholder="Search freight, tools, or spares..."
                                className="w-full bg-transparent outline-none text-slate-800 dark:text-slate-100 font-bold placeholder:text-slate-400 text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="bg-blue-600 dark:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all">
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Live Freight */}
            <section className="max-w-[1920px] mx-auto px-4 py-16">
                <div className="flex items-center justify-between mb-10 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
                        <Truck className="mr-3 text-blue-600" /> Live Freight Marketplace
                    </h2>
                    <div className="flex gap-4">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> 42 New Loads
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {featuredLoads.map((load) => (
                        <div key={load.id} className="bg-white dark:bg-slate-800 rounded-[28px] overflow-hidden shadow-md border border-slate-50 dark:border-slate-700 hover:border-blue-300 transition-all group hover:-translate-y-1">
                            <div className="h-40 overflow-hidden relative">
                                <img src={load.image} alt={load.cargo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em]">
                                    {load.id}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-black text-sm text-slate-900 dark:text-white mb-2 leading-tight line-clamp-1">{load.route}</h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 flex items-center bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg"><Package className="h-2.5 w-2.5 mr-1.5" /> {load.cargo}</span>
                                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 flex items-center bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg"><Gavel className="h-2.5 w-2.5 mr-1.5 text-blue-500" /> {load.weight}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Offer</p>
                                        <span className="text-blue-700 dark:text-blue-400 font-black text-base">{load.price}</span>
                                    </div>
                                    <button onClick={() => navigate('/register')} className="h-10 w-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all shadow-md shadow-blue-100 dark:shadow-none">
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tools & Hardware */}
            <section className="bg-white dark:bg-slate-950 py-24 transition-colors">
                <div className="max-w-[1920px] mx-auto px-4">
                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center">
                            <ShoppingCart className="mr-3 text-blue-600" /> Tools & Spares Market
                        </h2>
                        <p className="text-slate-500 font-medium mt-2">Buy directly from verified hardware shops.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        {toolsAndEquipment.map((tool, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-[28px] p-2.5 shadow-md border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group flex flex-col">
                                <div className="h-44 rounded-[22px] overflow-hidden mb-4 relative bg-slate-50 dark:bg-slate-950">
                                    <img src={tool.image} alt={tool.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[8px] font-black text-blue-600 uppercase tracking-widest">
                                        {tool.category}
                                    </div>
                                </div>
                                <div className="px-3 pb-3 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-black text-[13px] text-slate-900 dark:text-white mb-1.5 line-clamp-1 leading-tight">{tool.name}</h4>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-tight mb-4 line-clamp-2">{tool.description}</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-sm font-black text-blue-600 dark:text-blue-400">{tool.price}</span>
                                        <button onClick={() => navigate('/register')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center shadow-sm">
                                            Buy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Marketplace;
