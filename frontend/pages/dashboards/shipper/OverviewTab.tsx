import React, { useMemo } from 'react';
import { Package, DollarSign, Activity, ClipboardList, CheckCircle2, CreditCard, Zap, Truck, Clock, Info, MoreHorizontal } from 'lucide-react';

interface OverviewTabProps {
    shipmentsData: any;
    stats: {
        totalShipments: number;
        activeShipments: number;
        totalSpend: number;
        growth: number;
    };
    user: any;
    setIsPostModalOpen: (open: boolean) => void;
    handleDebugDriverConfirm: (id?: string) => void;
    handlePayDeposit: (id: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
    shipmentsData,
    stats,
    user,
    setIsPostModalOpen,
    handleDebugDriverConfirm,
    handlePayDeposit
}) => {
    const totalShipments = stats.totalShipments;
    const totalSpend = stats.totalSpend;

    // Filter for truly active shipments (those with a driver assigned)
    const trulyActiveShipments = useMemo(() =>
        shipmentsData.Active.filter((s: any) =>
            (s.driver_id || s.assigned_driver_id) &&
            ['Waiting for Driver Commitment', 'Pending Deposit', 'Active (Waiting Delivery)', 'In Transit', 'Ready for Pickup', 'Approved / Waiting Pick up'].includes(s.status)
        ),
        [shipmentsData.Active]);

    const activeCount = trulyActiveShipments.length;
    const growthVal = stats.growth;

    const inventoryMix = useMemo(() => {
        const allLoads = [...shipmentsData.Active, ...shipmentsData.Completed, ...shipmentsData.History];
        const totals: Record<string, number> = {};
        let grandTotal = 0;
        allLoads.forEach(load => {
            const match = load.cargo.match(/^([^(]+)\s*\((\d+)T\)$/);
            if (match) {
                const category = match[1].trim();
                const weight = parseInt(match[2], 10);
                totals[category] = (totals[category] || 0) + weight;
                grandTotal += weight;
            }
        });
        const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500', 'bg-rose-500'];
        return Object.entries(totals).map(([label, weight], index) => ({
            label, val: `${weight} Tons`, pct: Math.round((weight / grandTotal) * 100), color: colors[index % colors.length]
        })).sort((a, b) => b.pct - a.pct);
    }, [shipmentsData]);

    const activeShipment = trulyActiveShipments[0];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:border-blue-100 dark:hover:border-blue-500 transition-all">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Shipments</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalShipments}</h3>
                    </div>
                    <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Package size={20} />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:border-emerald-100 dark:hover:border-emerald-500 transition-all">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Spend</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">MWK {(totalSpend / 1000000).toFixed(1)}M</h3>
                    </div>
                    <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <DollarSign size={20} />
                    </div>
                </div>
                <div className="bg-slate-900 dark:bg-slate-950 p-5 rounded-[24px] shadow-lg flex items-center justify-between group relative overflow-hidden border border-slate-800 dark:border-slate-800">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Active Now</p>
                        <h3 className="text-2xl font-black text-white">{activeCount}</h3>
                    </div>
                    <div className="h-10 w-10 bg-white/10 dark:bg-white/5 text-white rounded-xl flex items-center justify-center backdrop-blur-sm relative z-10">
                        <Activity size={20} />
                    </div>
                    <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                        <Activity size={60} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Shipment Progress</h3>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-2 uppercase tracking-widest">
                                Shipment ID: {activeShipment?.id || 'N/A'}
                            </p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl border flex items-center gap-4 ${activeShipment?.depositStatus === 'Pending' ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800' : (activeShipment ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-100 dark:border-slate-700')}`}>
                            <div>
                                <p className={`text-[9px] font-black uppercase tracking-widest ${activeShipment?.depositStatus === 'Pending' ? 'text-amber-600 dark:text-amber-400' : (activeShipment ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500')}`}>Escrow Amount</p>
                                <span className={`text-xl font-black tracking-tighter ${activeShipment?.depositStatus === 'Pending' ? 'text-amber-700 dark:text-amber-300' : (activeShipment ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400')}`}>{activeShipment?.price || 'MWK 0'}</span>
                            </div>
                            <div className={`h-8 w-px ${activeShipment?.depositStatus === 'Pending' ? 'bg-amber-200 dark:bg-amber-800' : (activeShipment ? 'bg-emerald-200 dark:bg-emerald-800' : 'bg-slate-200 dark:bg-slate-700')}`}></div>
                            <div>
                                <p className={`text-[9px] font-black uppercase tracking-widest ${activeShipment?.depositStatus === 'Pending' ? 'text-amber-600 dark:text-amber-400' : (activeShipment ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500')}`}>Payment</p>
                                <span className={`text-[10px] font-black uppercase ${activeShipment?.depositStatus === 'Pending' ? 'text-amber-900 dark:text-amber-200' : (activeShipment ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-500 dark:text-slate-400')}`}>{activeShipment?.depositStatus === 'Pending' ? 'Pending (50%)' : (activeShipment ? 'Secured' : 'No Data')}</span>
                            </div>
                        </div>
                    </div>
                    {activeShipment ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[20px] p-5 border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-transparent dark:border-slate-700">
                                            <ClipboardList size={24} />
                                        </div>
                                        <h4 className="font-black text-slate-900 dark:text-white">Current Milestone</h4>
                                    </div>

                                    {activeShipment?.status === 'Waiting for Driver Commitment' ? (
                                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center animate-in fade-in zoom-in-95">
                                            <div className="h-12 w-12 rounded-full border-4 border-slate-100 dark:border-slate-700 border-t-purple-600 animate-spin mb-4"></div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Waiting for Handshake</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">Notification sent to {activeShipment?.assignedDriver}. They must commit to the job before it starts.</p>
                                            {activeShipment?.pickupType === 'Shop Pickup' && (
                                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-800 mb-4 w-full">
                                                    <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1">Remote Shop Pickup</p>
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{activeShipment?.orderRef}</p>
                                                </div>
                                            )}
                                            <button onClick={() => activeShipment && handleDebugDriverConfirm(activeShipment.id)} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-slate-600">
                                                Debug: Force Confirm
                                            </button>
                                        </div>
                                    ) : activeShipment?.status === 'Pending Deposit' ? (
                                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-amber-100 dark:border-amber-800 animate-in fade-in zoom-in-95">
                                            <div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-400">
                                                <CreditCard size={20} />
                                                <span className="text-sm font-black uppercase tracking-wider">Action Required</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                                Driver <span className="text-slate-900 dark:text-white font-black">{activeShipment?.assignedDriver}</span> has concurred with the trip. Please pay the deposit to activate and secure the truck.
                                            </p>
                                            <button onClick={() => handlePayDeposit(activeShipment.id)} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-amber-100 dark:shadow-none transition-all">
                                                Pay 50% Deposit
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                                        <CheckCircle2 size={16} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-emerald-900 dark:text-emerald-100">Active Shipment</p>
                                                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Ready for Transit</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 mb-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Route</span>
                                                        <span className="text-xs font-black text-slate-900 dark:text-white">{activeShipment?.route}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Cargo</span>
                                                        <span className="text-xs font-black text-slate-900 dark:text-white">{activeShipment?.cargo || 'General Cargo'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Weight</span>
                                                        <span className="text-xs font-black text-slate-900 dark:text-white">{activeShipment?.weight || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="h-px bg-emerald-200 dark:bg-emerald-800 my-4"></div>
                                                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900">
                                                    <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">Assigned Driver</p>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeShipment?.assignedDriver}`} alt="Driver" className="h-full w-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 dark:text-white">{activeShipment?.assignedDriver || 'Not Assigned'}</p>
                                                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Verified Driver</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Current Status</span>
                                                    <span className="px-3 py-1.5 bg-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                                                        {activeShipment?.status === 'In Transit' ? 'In Transit' : 'Ready for Pickup'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-10 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                    <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Last Update</span>
                                    <span className="text-xs font-black text-slate-900 dark:text-white">Just Now</span>
                                </div>
                            </div>
                            <div className="space-y-8 py-4">
                                <div className="flex items-start gap-6 relative">
                                    <div className="absolute left-[7px] top-6 bottom-[-32px] w-[2px] bg-slate-100 dark:bg-slate-700"></div>
                                    <div className="h-4 w-4 rounded-full border-4 border-white dark:border-slate-800 bg-blue-600 mt-1 relative z-10 shadow-sm"></div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Origin</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{activeShipment?.route?.split(' → ')[0] || 'Unknown'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6 relative">
                                    <div className="h-4 w-4 rounded-full border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 mt-1 relative z-10 shadow-sm"></div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Next Check-in</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white mt-1">Manual Update Required</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6">
                                    <div className="h-4 w-4 rounded-full border-4 border-white dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mt-1 relative z-10"></div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Destination</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{activeShipment?.route?.split(' → ')[1] || 'Unknown'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/30 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-700">
                            <div className="h-20 w-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700 mb-4 shadow-sm">
                                <Truck size={40} />
                            </div>
                            <h4 className="text-lg font-black text-slate-400 dark:text-slate-500">No Active Shipments</h4>
                            <p className="text-sm font-bold text-slate-300 dark:text-slate-600 mt-1">Your current progress will appear here.</p>
                            <button
                                onClick={() => setIsPostModalOpen(true)}
                                className="mt-6 px-6 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95"
                            >
                                Post Your First Load
                            </button>
                        </div>
                    )}
                </div>
                <div className="col-span-12 lg:col-span-4 space-y-4">
                    <div className="bg-slate-900 p-5 rounded-[24px] text-white shadow-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black leading-tight mb-2 text-white">Move Goods?</h3>
                            <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">List your cargo manifest to receive driver quotes.</p>
                            <div className="flex gap-2">
                                <button onClick={() => setIsPostModalOpen(true)} className="flex-1 py-3 bg-blue-600 text-white rounded-[16px] font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20 dark:shadow-none">
                                    Post Load
                                </button>
                                <button className="flex-1 py-3 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-[16px] font-black text-[11px] uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-slate-700 transition-all">
                                    Hire Truck
                                </button>
                            </div>
                        </div>
                        <Package size={150} className="absolute right-[-30px] bottom-[-30px] opacity-[0.05]" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Freight Mix Analytics</h3>
                        <div className="space-y-4">
                            {inventoryMix.length > 0 ? inventoryMix.map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">
                                        <span>{item.label}</span>
                                        <span className="text-slate-900 dark:text-slate-200">{item.val}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-xs font-bold text-slate-400 text-center py-4">No manifest data found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-[20px] border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                    <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                        <Activity className="text-blue-600 dark:text-blue-400" size={18} />
                    </div>
                    <div>
                        <h5 className="text-sm font-black text-slate-900 dark:text-white">Growth</h5>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-medium leading-tight">Shipment volume is {growthVal >= 0 ? 'up' : 'down'} <span className="text-blue-600 dark:text-blue-400 font-black">{Math.abs(growthVal)}%</span>.</p>
                    </div>
                </div>
                <div className="bg-blue-600 p-4 rounded-[20px] text-white flex items-center gap-4 shadow-lg shadow-blue-100">
                    <div className="h-10 w-10 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center shrink-0">
                        <Info className="text-white" size={18} />
                    </div>
                    <div>
                        <h5 className="text-sm font-black">Pro Tip</h5>
                        <p className="text-blue-100 text-[10px] font-medium leading-tight opacity-90">Booking in advance saves <span className="text-white font-black underline">15%</span>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
