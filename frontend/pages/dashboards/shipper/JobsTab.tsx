import React, { useMemo } from 'react';
import { Clock, CheckCircle2, AlertCircle, MapPin, Truck, ChevronRight } from 'lucide-react';

interface JobsTabProps {
    shipments: any[];
    onAction?: (jobId: string, action: string) => void;
}

const JobsTab: React.FC<JobsTabProps> = ({ shipments, onAction }) => {
    // Filter for direct hire jobs (those with an assigned_driver_id)
    const directJobs = useMemo(() => {
        return shipments.filter(s => s.assigned_driver_id !== null);
    }, [shipments]);

    const stats = useMemo(() => {
        return {
            pending: directJobs.filter(j => j.status === 'Finding Driver').length,
            active: directJobs.filter(j => ['Waiting for Driver Commitment', 'Pending Deposit', 'Active', 'In Transit'].includes(j.status)).length,
            completed: directJobs.filter(j => j.status === 'Completed').length
        };
    }, [directJobs]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Finding Driver':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'Completed':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'Rejected':
            case 'Cancelled':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Direct Service Jobs</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">Track and manage your direct hire requests and service bookings.</p>
                </div>

                <div className="flex gap-3">
                    <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pending</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">{stats.pending}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">{stats.active}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {directJobs.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[32px] p-20 text-center space-y-4">
                        <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <Truck size={40} />
                        </div>
                        <h4 className="text-xl font-black text-slate-400 uppercase tracking-tighter">No Direct Jobs Yet</h4>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">When you hire a driver directly from the marketplace, those requests will appear here.</p>
                    </div>
                ) : (
                    directJobs.map((job) => (
                        <div key={job.id} className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-slate-50 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-grow space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(job.status)}`}>
                                                    {job.status}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400 font-mono">{job.id}</span>
                                            </div>
                                            <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{job.cargo || 'General Shipment'}</h4>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">MWK {parseFloat(job.price || '0').toLocaleString()}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Direct Offer</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <MapPin size={12} className="text-blue-500" /> Route
                                            </p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{job.route}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Truck size={12} className="text-emerald-500" /> Assigned Driver
                                            </p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{job.driver_name || 'Verification Pending'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Clock size={12} className="text-amber-500" /> Date
                                            </p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{job.pickup_date ? new Date(job.pickup_date).toLocaleDateString() : 'ASAP'}</p>
                                        </div>
                                    </div>

                                    {job.details && (
                                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Instructions</p>
                                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">"{job.details}"</p>
                                        </div>
                                    )}
                                </div>

                                <div className="lg:w-48 flex lg:flex-col justify-center gap-3">
                                    {job.status === 'Finding Driver' && (
                                        <button className="flex-grow py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                            Cancel Request
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onAction && onAction(job.id, 'view')}
                                        className="flex-grow py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                                    >
                                        View Details <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobsTab;
