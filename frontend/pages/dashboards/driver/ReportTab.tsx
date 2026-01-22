import React from 'react';
import { DollarSign, Navigation, Star, Award, MoreHorizontal, Filter, TrendingUp, Info } from 'lucide-react';

interface ReportTabProps {
    activeQuarter: string;
    setActiveQuarter: (quarter: string) => void;
    transactions: any[];
}

const ReportTab: React.FC<ReportTabProps> = ({ activeQuarter, setActiveQuarter, transactions }) => {
    // Group transactions by month to derive analytics
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    const getQuarterData = (q: string) => {
        const qMonths = q === 'Q1' ? [0, 1, 2] : q === 'Q2' ? [3, 4, 5] : q === 'Q3' ? [6, 7, 8] : [9, 10, 11];
        const qTrans = transactions.filter(t => {
            const d = new Date(t.created_at);
            return d.getFullYear() === currentYear && qMonths.includes(d.getMonth());
        });

        const totalEarnings = qTrans.filter(t => t.type !== 'Withdrawal').reduce((acc, t) => acc + parseFloat(t.net_amount || 0), 0);
        const tripsCount = qTrans.filter(t => t.type === 'Trip' || t.type.includes('Earned')).length;

        // Group by month for graph
        const monthTotals = qMonths.map(mIdx => {
            const mTrans = qTrans.filter(t => new Date(t.created_at).getMonth() === mIdx);
            return mTrans.reduce((acc, t) => acc + parseFloat(t.net_amount || 0), 0);
        });

        const max = Math.max(...monthTotals, 1);

        return {
            earnings: `MWK ${(totalEarnings / 1000).toFixed(1)}K`,
            earningsChange: totalEarnings > 0 ? '+New' : '0%',
            trips: `${tripsCount} Trips`,
            tripsChange: tripsCount > 0 ? '+New' : 'None',
            rating: '5.0',
            ratingLabel: 'Great',
            graph: {
                current: monthTotals.map(v => (v / max) * 100),
                labels: qMonths.map(m => months[m])
            }
        };
    };

    const activeStats = getQuarterData(activeQuarter);
    const activeData = activeStats.graph;
    const minVal = Math.min(...activeData.current);
    const maxVal = Math.max(...activeData.current);
    const range = maxVal - minVal || 1;

    const createPoints = (data: number[]) => data.map((val, i) => ({
        x: (i / (data.length - 1)) * 100,
        y: 100 - (((val - minVal) / range) * 80 + 10)
    }));

    const getSmoothPath = (points: { x: number; y: number }[]) => {
        if (points.length === 0) return '';
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = i > 0 ? points[i - 1] : points[0];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = i !== points.length - 2 ? points[i + 2] : p2;
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return d;
    };

    const aPoints = createPoints(activeData.current);
    const aPathData = getSmoothPath(aPoints);
    const aAreaPathData = `${aPathData} L 100 100 L 0 100 Z`;

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 mb-4">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter">Performance Analytics</h3>
                    <p className="text-slate-500 font-medium text-xs">Track your earnings, trips, and driver rating.</p>
                </div>
                <div className="bg-white/50 backdrop-blur-md p-0.5 rounded-xl border border-white shadow-sm flex gap-1">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveQuarter(t)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeQuarter === t ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-400 hover:text-slate-900 hover:bg-white/80'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm transition-all hover:border-blue-200 group flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <DollarSign size={16} />
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Earnings</p>
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{activeStats.earnings}</h4>
                    <span className="text-[10px] font-bold text-blue-600">{activeStats.earningsChange} vs last {activeQuarter === 'Q1' ? 'Year' : 'Quarter'}</span>
                </div>

                <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm transition-all hover:border-emerald-200 group flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Navigation size={16} />
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trips Completed</p>
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{activeStats.trips}</h4>
                    <span className="text-[10px] font-bold text-emerald-600">{activeStats.tripsChange} efficiency</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-[24px] text-white shadow-lg group overflow-hidden relative flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-6 -mt-6 blur-lg"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                                <Star size={16} className="text-amber-400" fill="currentColor" />
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Driver Rating</p>
                        </div>
                        <h4 className="text-2xl font-black tracking-tight">{activeStats.rating}</h4>
                        <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                            {activeStats.ratingLabel} <Award size={10} />
                        </span>
                    </div>
                </div>
            </div>

            <div className="col-span-12 xl:col-span-8 bg-slate-900 p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[320px] sm:h-[340px]">
                <div className="flex justify-between items-center mb-4 sm:mb-2 text-white">
                    <div>
                        <h4 className="text-sm font-black tracking-tight">Earnings Trend (MWK)</h4>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>

                {/* Graph Container with Grid Background */}
                <div className="relative flex-grow min-h-[160px] w-full mt-4 mb-2">
                    {/* Grid Background Pattern */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{
                        backgroundImage: `
                               linear-gradient(to right, rgba(71, 85, 105, 0.1) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(71, 85, 105, 0.1) 1px, transparent 1px)
                           `,
                        backgroundSize: '40px 30px'
                    }}></div>

                    <div className="relative h-full w-full">
                        {/* High-end Area Chart */}
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" width="100%" height="100%">
                            <defs>
                                <linearGradient id="driverGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Main Area Fill */}
                            <path d={aAreaPathData} fill="url(#driverGradient)" />

                            {/* Main Line Stroke */}
                            <path
                                d={aPathData}
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="3"
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                            />

                            {/* Interactive Points */}
                            {aPoints.map((p, i) => (
                                <circle
                                    key={i}
                                    cx={p.x}
                                    cy={p.y}
                                    r="2.5"
                                    className="fill-blue-600 stroke-white stroke-[1px] hover:r-4 transition-all"
                                    vectorEffect="non-scaling-stroke"
                                />
                            ))}
                        </svg>
                    </div>
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-between items-center px-2 mt-2">
                    {activeData.labels.map((label, i) => (
                        <span key={i} className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
                    ))}
                </div>

                {/* Bottom Info Bar */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                        <span className="text-[10px] font-bold text-slate-300">Revenue Flow</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
                        <Filter size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Options</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-100 flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                        <TrendingUp className="text-blue-600" size={18} />
                    </div>
                    <div>
                        <h5 className="text-sm font-black text-slate-900">Performance</h5>
                        <p className="text-slate-500 text-[10px] font-medium leading-tight">Earnings up <span className="text-blue-600 font-black">24%</span>.</p>
                    </div>
                </div>
                <div className="bg-blue-600 p-4 rounded-[24px] text-white flex items-center gap-4 shadow-lg shadow-blue-100">
                    <div className="h-10 w-10 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center shrink-0">
                        <Info className="text-white" size={18} />
                    </div>
                    <div>
                        <h5 className="text-sm font-black">Pro Tip</h5>
                        <p className="text-blue-100 text-[10px] font-medium leading-tight opacity-90">Accepting return trips increases revenue by <span className="text-white font-black underline">30%</span>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportTab;
