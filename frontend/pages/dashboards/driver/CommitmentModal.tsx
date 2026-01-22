import React from 'react';
import { Award, X, CheckCircle2 } from 'lucide-react';

interface CommitmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    commitmentJob: any;
    handleDriverCommit: (decision: 'COMMIT' | 'DECLINE') => void;
    declineReason: string;
    setDeclineReason: (reason: string) => void;
}

const CommitmentModal: React.FC<CommitmentModalProps> = ({
    isOpen,
    onClose,
    commitmentJob,
    handleDriverCommit,
    setDeclineReason
}) => {
    if (!isOpen || !commitmentJob) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg rounded-[32px] sm:rounded-[48px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                <div className="p-6 sm:p-10 border-b border-slate-50 flex justify-between items-center bg-purple-600 text-white">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Award size={20} className="text-purple-200" />
                            <h4 className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic">You Won the Bid!</h4>
                        </div>
                        <p className="text-purple-100 font-medium text-[11px] sm:text-sm">Please confirm your commitment to {commitmentJob.id}</p>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-sm"><X size={20} /></button>
                </div>

                <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                    <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">Route</span>
                            <span className="text-xs sm:text-sm font-black text-slate-900">{commitmentJob.route}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">Negotiated Price</span>
                            <span className="text-base sm:text-lg font-black text-blue-600">MWK {commitmentJob.price}</span>
                        </div>
                        {commitmentJob.pickupType === 'Shop Pickup' && (
                            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                                <span className="text-[10px] sm:text-[11px] font-black text-purple-600 uppercase tracking-widest">Special: Shop Pickup</span>
                                <span className="text-xs sm:text-sm font-bold text-slate-500 italic">Pay on Delivery</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleDriverCommit('COMMIT')}
                            className="py-4 sm:py-5 bg-blue-600 text-white rounded-2xl sm:rounded-[24px] font-black text-[11px] sm:text-xs uppercase tracking-[0.15em] shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={16} /> Confirm Commitment
                        </button>
                        <button
                            onClick={() => {
                                const reason = prompt("Please provide a reason for declining:");
                                if (reason) {
                                    setDeclineReason(reason);
                                    handleDriverCommit('DECLINE');
                                }
                            }}
                            className="py-4 sm:py-5 bg-white text-slate-400 border border-slate-200 rounded-2xl sm:rounded-[24px] font-black text-[11px] sm:text-xs uppercase tracking-[0.15em] hover:bg-slate-50 hover:text-red-500 transition-all"
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
