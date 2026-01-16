import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface ShipmentsTabProps {
    loadsSubTab: string;
    setLoadsSubTab: (tab: string) => void;
    shipmentsData: any;
}

const ShipmentsTab: React.FC<ShipmentsTabProps> = ({
    loadsSubTab,
    setLoadsSubTab,
    shipmentsData
}) => {
    const currentData = loadsSubTab === 'Active'
        ? shipmentsData.Active.filter((s: any) => s.status === 'In Transit' || s.status === 'Approved / Waiting Pick up')
        : (shipmentsData[loadsSubTab] || []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">My Shipments</h3>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Track shipments that are in progress or completed.</p>
                </div>
            </div>
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-wrap gap-4 items-center justify-between bg-slate-50/30">
                    <div className="flex gap-4">
                        {['Accepted', 'Rejected', 'Completed', 'History'].map(t => (
                            <button
                                key={t}
                                onClick={() => setLoadsSubTab(t === 'Accepted' ? 'Active' : t)}
                                className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest cursor-pointer transition-all ${((loadsSubTab === 'Active' && t === 'Accepted') || loadsSubTab === t) ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Shipment ID</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Route Details</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Cargo Type</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Price Paid</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((row: any, i: number) => (
                                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer">
                                    <td className="px-8 py-6 text-sm font-black text-slate-900">{row.id}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-700">{row.route}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-500">{row.cargo}</td>
                                    <td className="px-8 py-6 text-sm font-black text-blue-600">{row.price}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest ${row.color}`}>{row.status}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                                            <MoreHorizontal size={18} />
                                        </button>
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
