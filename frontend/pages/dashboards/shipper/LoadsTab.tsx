import React from 'react';
import { Plus, Gavel } from 'lucide-react';

interface LoadsTabProps {
    shipmentsData: any;
    setIsPostModalOpen: (open: boolean) => void;
    setSelectedLoadForBids: (load: any) => void;
    setIsBidsModalOpen: (open: boolean) => void;
}

const LoadsTab: React.FC<LoadsTabProps> = ({
    shipmentsData,
    setIsPostModalOpen,
    setSelectedLoadForBids,
    setIsBidsModalOpen
}) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Load Postings</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">Post new jobs and manage active bidding processes.</p>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
                    <div className="flex gap-4">
                        <button className="px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none">Bidding Active</button>
                        <button className="px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 border border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">Drafts</button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsPostModalOpen(true)} className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-100 dark:shadow-none flex items-center gap-3 hover:scale-105 transition-all">
                            <Plus size={16} /> Post New Shipment
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 dark:border-slate-700">
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Load ID</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Route</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Cargo</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Price/Budget</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pickup Date</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipmentsData.Active.filter((s: any) =>
                                s.status === 'Bidding Open' ||
                                s.status === 'Finding Driver' ||
                                s.status === 'Waiting for Driver Commitment' ||
                                s.status === 'Pending Deposit'
                            ).sort((a: any, b: any) => {
                                const dateA = new Date(a.pickup_date || a.created_at || 0).getTime();
                                const dateB = new Date(b.pickup_date || b.created_at || 0).getTime();
                                return dateB - dateA;
                            }).map((row: any, i: number) => {
                                const pickupDate = row.pickup_date ? new Date(row.pickup_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : 'N/A';
                                return (
                                <tr key={i} className="border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all cursor-pointer">
                                    <td className="px-8 py-6 text-sm font-black text-slate-900 dark:text-white">{row.id}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-700 dark:text-slate-300">{row.route}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">{row.cargo}</td>
                                    <td className="px-8 py-6 text-sm font-black text-blue-600 dark:text-blue-400">{row.price}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-600 dark:text-slate-400">{pickupDate}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest ${row.color}`}>{row.status}</span>
                                        {row.bids > 0 && row.status === 'Bidding Open' && (
                                            <span className="ml-2 bg-amber-500 text-white px-2 py-1 rounded-md text-[9px] font-black">{row.bids} BIDS</span>
                                        )}
                                        {row.status === 'Waiting for Driver Commitment' && (
                                            <span className="ml-2 bg-purple-500 text-white px-2 py-1 rounded-md text-[9px] font-black uppercase">Handshake</span>
                                        )}
                                        {row.status === 'Pending Deposit' && (
                                            <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-md text-[9px] font-black uppercase">Commitment Recieved</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={() => { setSelectedLoadForBids(row); setIsBidsModalOpen(true); }}
                                            className="px-4 py-2 bg-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-100 dark:shadow-none flex items-center gap-2 hover:bg-amber-600 transition-all"
                                        >
                                            <Gavel size={14} /> View Bids
                                        </button>
                                    </td>
                                </tr>
                            );
                            })}
                            {shipmentsData.Active.filter((s: any) =>
                                s.status === 'Bidding Open' ||
                                s.status === 'Finding Driver' ||
                                s.status === 'Waiting for Driver Commitment' ||
                                s.status === 'Pending Deposit'
                            ).length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-20 text-center text-slate-400 font-bold">No active load postings.</td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LoadsTab;
