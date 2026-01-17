import React from 'react';
import { DollarSign, TrendingUp, Truck, Activity, Award, MoreHorizontal, Filter } from 'lucide-react';

const ReportTab: React.FC = () => {
    const lGraphData = [35, 55, 45, 85, 65, 95, 75, 100, 90, 70, 85, 98];
    const lPoints = lGraphData.map((val, i) => ({
        x: (i / (lGraphData.length - 1)) * 100,
        y: 100 - val
    }));
    const lPathData = `M ${lPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
    const lAreaPathData = `${lPathData} L 100 100 L 0 100 Z`;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 pb-4">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter">Fleet Performance</h3>
                    <p className="text-slate-500 font-medium mt-1 text-xs sm:text-base">Optimizing your fleet efficiency and revenue streams.</p>
                </div>
                <div className="bg-white/50 backdrop-blur-md p-1 rounded-2xl border border-white shadow-lg flex flex-wrap gap-1">
                    {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(t => (
                        <button key={t} className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${t === 'Monthly' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:text-slate-900 hover:bg-white/80'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] text-white shadow-xl shadow-blue-100 transition-all hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all"></div>
                    <div className="relative z-10">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                            <DollarSign size={20} className="sm:size-6" />
                        </div>
                        <p className="text-[9px] sm:text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1 opacity-80 underline underline-offset-4 decoration-blue-400/50">Total Revenue</p>
                        <h4 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">MWK 12.8M</h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-100 bg-white/10 w-fit px-3 py-1 rounded-full">
                            <TrendingUp size={12} />
                            <span>+22% this quarter</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-slate-100 shadow-lg transition-all hover:-translate-y-1 group">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                        <Truck size={20} className="sm:size-6" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Utilization</p>
                    <h4 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">88.5%</h4>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full">
                        <Activity size={12} />
                        <span>Areas Visited</span>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] text-white shadow-xl transition-all hover:-translate-y-1 group">
                    <div className="relative z-10">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-white/20 transition-all">
                            <Award size={20} className="sm:size-6 text-indigo-400" />
                        </div>
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Requests</p>
                        <h4 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">1,842</h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 bg-white/5 w-fit px-3 py-1 rounded-full border border-white/10">
                            <span>Performance Tracking</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 xl:col-span-8 bg-slate-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[48px] shadow-xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h4 className="text-lg font-black text-white tracking-tight">Inflows & outflows</h4>
                        </div>
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `
                linear-gradient(to right, rgba(71, 85, 105, 0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(71, 85, 105, 0.15) 1px, transparent 1px)
              `,
                            backgroundSize: '60px 40px'
                        }}></div>

                        <div className="relative h-40 sm:h-52 w-full">
                            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" width="100%" height="100%">
                                <defs>
                                    <linearGradient id="fleetDarkGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.05" />
                                    </linearGradient>
                                </defs>
                                <path d={lAreaPathData} fill="url(#fleetDarkGradient)" />
                                <path
                                    d={lPathData}
                                    fill="none"
                                    stroke="rgba(148, 163, 184, 0.8)"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>

                            <div className="absolute -bottom-6 w-full flex justify-between px-2">
                                {['3 Jul', '7 Jul', '11 Jul', '15 Jul', '19 Jul', '23 Jul', '27 Jul', '31 Jul'].map((date, i) => (
                                    <span key={i} className="text-[8px] sm:text-[10px] font-medium text-slate-500 whitespace-nowrap">{date}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-12 pt-4 border-t border-slate-800">
                        <button className="px-3 sm:px-4 py-1.5 bg-white text-slate-900 rounded-lg text-[9px] sm:text-[10px] font-bold hover:bg-slate-100 transition-colors">
                            Max
                        </button>
                        <button className="px-3 sm:px-4 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-[9px] sm:text-[10px] font-bold transition-colors">
                            12 months
                        </button>
                        <button className="px-3 sm:px-4 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-[9px] sm:text-[10px] font-bold transition-colors">
                            30 days
                        </button>
                        <button className="px-3 sm:px-4 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-[9px] sm:text-[10px] font-bold transition-colors">
                            7 days
                        </button>
                        <div className="ml-auto flex items-center gap-2 text-slate-400">
                            <Filter size={14} />
                            <span className="text-[10px] font-bold">Filters</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 xl:col-span-4 bg-indigo-600 p-6 sm:p-8 rounded-[32px] sm:rounded-[48px] text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <h4 className="text-xl sm:text-2xl font-black mb-4 leading-tight italic">Fleet Growth</h4>
                        <p className="text-indigo-100 font-medium text-sm sm:text-base leading-relaxed mb-6">"Your fleet has expanded from 3 to 12 vehicles in just 6 months. That's a 300% growth in capacity!"</p>
                        <div className="bg-white/10 backdrop-blur-lg p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Live Insight</span>
                            </div>
                            <p className="font-bold text-[11px] sm:text-xs">Tanker routes towards Beira are currently 20% more profitable than Flatbed routes.</p>
                        </div>
                    </div>
                    <Activity className="absolute bottom-[-30px] right-[-30px] h-48 w-48 text-white/5 -rotate-12" />
                </div>
            </div>
        </div>
    );
};

export default ReportTab;
