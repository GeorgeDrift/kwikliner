import React from 'react';
import { Package, DollarSign, CheckCircle2, Navigation } from 'lucide-react';
import { api } from '../../../services/api';

interface MyTripsTabProps {
    jobs: any[];
    handleAcceptJob: (id: string) => void;
    loadData?: () => Promise<void>;
}

const MyTripsTab: React.FC<MyTripsTabProps> = ({ jobs, handleAcceptJob, loadData }) => {
    const [subTab, setSubTab] = React.useState<'Active' | 'History'>('Active');

    React.useEffect(() => {
        const hasActive = jobs.some(j => j.type === 'Active');
        const hasHistory = jobs.some(j => j.type === 'History');
        if (!hasActive && hasHistory) {
            setSubTab('History');
        }
    }, [jobs]);

    const filteredJobs = jobs.filter(j => j.type === subTab);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">My Trips</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">Manage your accepted and active trips.</p>
                </div>
                <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <button
                        onClick={() => setSubTab('Active')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'Active' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Active ({jobs.filter(j => j.type === 'Active').length})
                    </button>
                    <button
                        onClick={() => setSubTab('History')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'History' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        History ({jobs.filter(j => j.type === 'History').length})
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden p-4 sm:p-8 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <div key={job.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group">
                                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{job.route}</h4>
                                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-6">{job.shipper}</p>
                                <div className="space-y-3 mb-10">
                                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-medium"><Package size={16} /> {job.cargo}</div>
                                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-medium"><DollarSign size={16} /> {job.price}</div>
                                    <div className="text-[11px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg inline-block">{job.status}</div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {job.status === 'Waiting for Driver Commitment' && (
                                        <button
                                            onClick={() => handleAcceptJob(job.id)}
                                            className="w-full py-4 bg-orange-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-100 dark:shadow-none animate-pulse"
                                        >
                                            <CheckCircle2 size={16} /> Commit to Trip
                                        </button>
                                    )}

                                    {job.status === 'Pending Deposit' && (
                                        <button
                                            onClick={async (e) => {
                                                const btn = e.currentTarget;
                                                btn.disabled = true;
                                                const originalText = btn.innerHTML;
                                                btn.innerText = 'Triggering...';
                                                try {
                                                    await api.triggerDepositReminder(job.id);
                                                    alert("Deposit reminder sent to shipper!");
                                                } finally {
                                                    btn.disabled = false;
                                                    btn.innerHTML = originalText;
                                                }
                                            }}
                                            className="w-full py-4 bg-amber-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-100 dark:shadow-none hover:scale-105 transition-all"
                                        >
                                            <DollarSign size={16} /> Trigger Deposit
                                        </button>
                                    )}

                                    {job.status === 'Ready for Pickup' && (
                                        <div className="w-full py-4 bg-green-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-100 dark:shadow-none">
                                            Active Trip <Navigation size={16} />
                                        </div>
                                    )}

                                    {job.status === 'Active (Waiting Delivery)' && (
                                        <button
                                            onClick={async () => {
                                                await api.updateTripxStatus(job.id, 'In Transit');
                                                loadData?.();
                                            }}
                                            className="w-full py-4 bg-indigo-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-105 transition-all"
                                        >
                                            Start Trip <Navigation size={16} />
                                        </button>
                                    )}

                                    {job.status === 'In Transit' && (
                                        <button
                                            onClick={async () => {
                                                await api.updateTripxStatus(job.id, 'Delivered');
                                                loadData?.();
                                                alert("Trip marked as Delivered! Shipper will be notified.");
                                            }}
                                            className="w-full py-4 bg-blue-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100 dark:shadow-none hover:scale-105 transition-all"
                                        >
                                            Confirm Delivery <CheckCircle2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Navigation className="text-slate-200 dark:text-slate-700" size={32} />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white">
                                {subTab === 'Active' ? 'No active trips yet' : 'No trip history found'}
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                                {subTab === 'Active' ? 'Go to Browse Jobs to find your next load.' : 'Completed trips will appear here.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTripsTab;
