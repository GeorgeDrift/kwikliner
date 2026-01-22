
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Truck, Filter, Calendar, Package, ArrowRight,
  ShieldCheck, Star, ShoppingCart, Wrench, Warehouse, HardHat,
  Briefcase, Fuel, Info, ChevronRight, Gavel
} from 'lucide-react';
import { User, UserRole } from '../types';

interface HomeProps {
  user: User | null;
  onLogin?: (user: User) => void;
}

const Home: React.FC<HomeProps> = ({ user, onLogin }) => {
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

  const logisticsServices = [
    { name: 'Warehousing (Lilongwe)', icon: <Warehouse />, desc: '5,000 sqm dry storage space', image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=400' },
    { name: 'Forklift Rental', icon: <HardHat />, desc: '3-Ton to 10-Ton available', image: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=400' },
    { name: 'Filling Station Partners', icon: <Fuel />, desc: 'Exclusive KwikFuel discounts', image: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&q=80&w=400' },
    { name: 'Logistics Jobs Board', icon: <Briefcase />, desc: 'Browse latest vacancies', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 min-h-screen transition-colors duration-200">
      {/* Hero / Marketplace Header */}
      <section className="bg-blue-600 dark:bg-blue-800 pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/20 dark:bg-blue-400/10 skew-x-12 transform translate-x-1/2"></div>
        <div className="max-w-[1920px] mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white mb-6 tracking-tight">
            The Smart Way to <br /> <span className="text-blue-400">Move Freight.</span>
          </h1>
          <p className="text-blue-100 text-xl mb-12 max-w-3xl mx-auto font-medium">
            Africa's unified platform for freight, vehicle tools, warehouses, and logistics talent.
          </p>

          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-3 rounded-[32px] shadow-2xl flex flex-col md:flex-row gap-2 border border-blue-50 dark:border-slate-700">
            <div className="flex-grow flex items-center px-6 py-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700">
              <Search className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4" />
              <input
                type="text"
                placeholder="Search freight, tools, or services..."
                className="w-full bg-transparent outline-none text-slate-800 dark:text-slate-100 font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 dark:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 dark:shadow-none text-lg">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Load Marketplace Section */}
      <section className="max-w-[1920px] mx-auto px-4 -mt-16 mb-20 relative z-20">
        <div className="flex items-center justify-between mb-8 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
            <Truck className="mr-3 text-blue-600 dark:text-blue-400" /> Live Freight Marketplace
          </h2>
          <button onClick={() => navigate('/register')} className="text-blue-600 dark:text-blue-400 font-black flex items-center text-sm hover:underline uppercase tracking-widest">
            Browse Loads <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {featuredLoads.map((load) => (
            <div key={load.id} className="bg-white dark:bg-slate-800 rounded-[40px] overflow-hidden shadow-xl border border-slate-50 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all group hover:-translate-y-2">
              <div className="h-56 overflow-hidden relative">
                <img src={load.image} alt={load.cargo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg">
                  {load.id}
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-black text-xl text-slate-900 dark:text-white mb-2">{load.route}</h3>
                <div className="flex flex-wrap gap-4 mb-6">
                  <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 flex items-center bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl"><Package className="h-3 w-3 mr-2 text-blue-500" /> {load.cargo}</span>
                  <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 flex items-center bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl"><Gavel className="h-3 w-3 mr-2 text-blue-500" /> {load.weight}</span>
                </div>
                <div className="pt-6 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Estimated Price</p>
                    <span className="text-blue-700 dark:text-blue-400 font-black text-2xl">{load.price}</span>
                  </div>
                  <button
                    onClick={() => navigate('/register')}
                    className="h-14 w-14 bg-blue-600 dark:bg-blue-700 text-white flex items-center justify-center rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 hover:rotate-90 transition-all shadow-xl shadow-blue-100 dark:shadow-none"
                  >
                    <ArrowRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools & Equipment Section */}
      <section className="bg-slate-50 dark:bg-slate-950 py-24 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-[1920px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center">
                <ShoppingCart className="mr-3 text-blue-600 dark:text-blue-400" /> Tools & Spares Market
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Verified hardware owners list high-quality equipment for your fleet.</p>
            </div>
            <button onClick={() => navigate('/register')} className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-8 py-3 rounded-2xl font-black text-sm hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
              Visit Spares Shop
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {toolsAndEquipment.map((tool, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-[40px] p-3 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all cursor-pointer group flex flex-col">
                <div className="h-64 rounded-[32px] overflow-hidden mb-6 relative">
                  <img src={tool.image} alt={tool.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest shadow-sm">
                    {tool.category}
                  </div>
                </div>
                <div className="px-5 pb-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-xl text-slate-900 dark:text-white mb-2">{tool.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">{tool.description}</p>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-slate-50 dark:border-slate-700">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{tool.price}</span>
                    <button onClick={() => navigate('/register')} className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-xl font-black text-sm shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 dark:hover:bg-blue-600 transition-all flex items-center">
                      Buy Now <ShoppingCart className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Grid */}
      <section className="bg-slate-900 py-32 px-4 relative overflow-hidden">
        <div className="max-w-[1920px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Become a Marketplace Partner</h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto">Select the role that fits your business model and join Africa's open logistics network.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: UserRole.SHIPPER, title: 'Shipper', icon: <Package />, desc: 'Book loads instantly.' },
              { role: UserRole.DRIVER, title: 'Independent Driver', icon: <Truck />, desc: 'Find work, earn more.' },
              { role: UserRole.LOGISTICS_OWNER, title: 'Fleet Owner', icon: <Briefcase />, desc: 'Manage your logistics biz.' },
              { role: UserRole.HARDWARE_OWNER, title: 'Hardware Shop', icon: <ShoppingCart />, desc: 'Sell tools & spares.' },
            ].map((box, i) => (
              <div
                key={i}
                onClick={() => navigate('/register', { state: { role: box.role } })}
                className="bg-white/5 border border-white/10 p-10 rounded-[32px] hover:bg-blue-600 hover:border-blue-500 transition-all cursor-pointer group"
              >
                <div className="bg-white/10 p-4 rounded-2xl w-fit mb-6 text-white group-hover:bg-white group-hover:text-blue-600 transition-all">
                  {/* Fix: Type assertion to React.ReactElement<any> ensures className property is valid for cloning */}
                  {React.cloneElement(box.icon as React.ReactElement<any>, { className: 'h-8 w-8' })}
                </div>
                <h3 className="text-xl font-black text-white mb-2">{box.title}</h3>
                <p className="text-slate-400 group-hover:text-blue-100 text-sm font-medium transition-all">{box.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
