import React from 'react';
import { MoreHorizontal, Star } from 'lucide-react';

interface ShipmentsTabProps {
    loadsSubTab: string;
    setLoadsSubTab: (tab: 'Active' | 'History' | 'Rejected' | 'Completed') => void;
    shipmentsData: any;
}

const ShipmentsTab: React.FC<ShipmentsTabProps> = ({
    loadsSubTab,
    setLoadsSubTab,
    shipmentsData
}) => {
    const currentData = loadsSubTab === 'Active'
        ? shipmentsData.Active.filter((s: any) =>
            ['In Transit', 'Approved / Waiting Pick up', 'Waiting for Driver Commitment', 'Pending Deposit', 'Active (Waiting Delivery)', 'Ready for Pickup', 'Handshake'].includes(s.status)
        )
        : (shipmentsData[loadsSubTab] || []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">My Shipments</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">Track shipments that are in progress or completed.</p>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
                    <div className="flex gap-4">
                        {['Accepted', 'Rejected', 'Completed', 'History'].map(t => (
                            <button
                                key={t}
                                onClick={() => setLoadsSubTab((t === 'Accepted' ? 'Active' : t) as 'Active' | 'History' | 'Rejected' | 'Completed')}
                                className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest cursor-pointer transition-all ${((loadsSubTab === 'Active' && t === 'Accepted') || loadsSubTab === t) ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 border border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 dark:border-slate-700">
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Shipment ID</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Route Details</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Cargo Type</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Price Paid</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Current Status</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((row: any, i: number) => (
                                <tr key={i} className="border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all cursor-pointer">
                                    <td className="px-8 py-6 text-sm font-black text-slate-900 dark:text-white">{row.id}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-700 dark:text-slate-300">{row.route}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">{row.cargo}</td>
                                    <td className="px-8 py-6 text-sm font-black text-blue-600 dark:text-blue-400">{row.price}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest ${row.color}`}>{row.status}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            {row.status === 'Pending Deposit' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); (window as any).handlePayDeposit?.(row.id); }}
                                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:scale-105 transition-all"
                                                >
                                                    Pay Deposit
                                                </button>
                                            )}
                                            {(row.status === 'Completed' || row.status === 'Delivered') && !row.driver_rating && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); (window as any).handleOpenRating?.(row.id); }}
                                                    className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-100 hover:scale-105 transition-all flex items-center gap-2"
                                                >
                                                    <Star size={12} fill="currentColor" />
                                                    Rate Driver
                                                </button>
                                            )}
                                            {row.driver_rating && (
                                                <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
                                                    <Star size={14} className="text-amber-500 fill-amber-500" />
                                                    <span className="text-xs font-black text-amber-700">{row.driver_rating}</span>
                                                </div>
                                            )}
                                            <button className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {currentData.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold">No shipments found in this category.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShipmentsTab;
