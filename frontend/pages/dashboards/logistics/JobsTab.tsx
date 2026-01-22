import React from 'react';
import { Box, DollarSign, Clock, UserCheck, MoreHorizontal } from 'lucide-react';

interface JobsTabProps {
    acceptedJobs: any[];
    handleAcceptJob: (job: any) => void;
}

const JobsTab: React.FC<JobsTabProps> = ({ acceptedJobs, handleAcceptJob }) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">My Jobs</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">Manage confirmed jobs and assign drivers.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:border-indigo-600 dark:hover:border-indigo-400 transition-colors text-slate-700 dark:text-slate-300">
                        All ({acceptedJobs.length})
                    </button>
                    <button className="px-6 py-3 bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-700 transition-colors shadow-lg shadow-orange-100 dark:shadow-none">
                        Unassigned ({acceptedJobs.filter(j => !j.assignedDriver).length})
                    </button>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {acceptedJobs.map((job) => (
                    <div key={job.id} className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all p-8">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h4 className="text-lg font-black text-slate-900 dark:text-white">{job.route}</h4>
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">{job.shipper}</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${!job.assignedDriver ? 'bg-orange-500 text-white animate-pulse shadow-lg shadow-orange-100' : 'bg-green-500 text-white'
                                }`}>
                                {job.status}
                            </span>
                        </div>

                        {job.assignedDriver && (
                            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl">
                                <p className="text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-400 mb-1">Assigned Driver</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{job.assignedDriver}</p>
                            </div>
                        )}

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm">
                                <Box className="text-slate-400 dark:text-slate-500" size={16} />
                                <span className="font-bold text-slate-900 dark:text-white">{job.cargo}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <DollarSign className="text-green-600 dark:text-green-400" size={16} />
                                <span className="font-black text-green-600 dark:text-green-400">{job.price}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="text-orange-600 dark:text-orange-400" size={16} />
                                <span className="font-bold text-slate-600 dark:text-slate-400">Deadline: {job.deadline}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {job.status === 'Waiting for Driver Commitment' ? (
                                <button
                                    onClick={() => handleAcceptJob(job)}
                                    className="flex-grow py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-100 animate-pulse"
                                >
                                    <UserCheck size={14} />
                                    Commit to Trip
                                </button>
                            ) : !job.assignedDriver ? (
                                <button className="flex-grow py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100">
                                    <UserCheck size={14} />
                                    Assign Driver
                                </button>
                            ) : (
                                <button className="flex-grow py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition-all">
                                    View Details
                                </button>
                            )}
                            <button className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-slate-700">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobsTab;
