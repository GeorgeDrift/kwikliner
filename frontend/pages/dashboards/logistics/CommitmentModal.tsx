import React from 'react';
import { X, Award } from 'lucide-react';

interface CommitmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    commitmentJob: any;
    handleLogisticsCommit: (decision: 'COMMIT' | 'DECLINE') => void;
    setDeclineReason: (reason: string) => void;
}

const CommitmentModal: React.FC<CommitmentModalProps> = ({
    isOpen,
    onClose,
    commitmentJob,
    handleLogisticsCommit,
    setDeclineReason
}) => {
    if (!isOpen || !commitmentJob) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-purple-600 text-white">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Award size={20} className="text-purple-200" />
                            <h4 className="text-lg font-black tracking-tight uppercase">Bid Won!</h4>
                        </div>
                        <p className="text-purple-100 font-medium text-xs">Confirm your fleet's commitment to {commitmentJob.id}</p>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</span>
                            <span className="text-xs font-black text-slate-900">{commitmentJob.route}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Negotiated Price</span>
                            <span className="text-base font-black text-blue-600">MWK {commitmentJob.price}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleLogisticsCommit('COMMIT')}
                            className="py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Commit Fleet
                        </button>
                        <button
                            onClick={() => {
                                const reason = prompt("Reason for declining:");
                                if (reason) {
                                    setDeclineReason(reason);
                                    handleLogisticsCommit('DECLINE');
                                }
                            }}
                            className="py-4 bg-white text-slate-400 border border-slate-200 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:text-red-500 transition-all"
                        >
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommitmentModal;
