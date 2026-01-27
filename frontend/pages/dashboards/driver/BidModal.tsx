import React, { FormEvent } from 'react';
import { X, Send } from 'lucide-react';

interface BidModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedJob: any;
    bidAmount: string;
    setBidAmount: (amount: string) => void;
    handleSubmitBid: (e: FormEvent) => void;
}

const BidModal: React.FC<BidModalProps> = ({
    isOpen,
    onClose,
    selectedJob,
    bidAmount,
    setBidAmount,
    handleSubmitBid
}) => {
    if (!isOpen || !selectedJob) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg rounded-[32px] sm:rounded-[48px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                <div className="p-6 sm:p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div>
                        <h4 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">Submit Proposal</h4>
                        <p className="text-slate-500 font-medium mt-1 text-[11px] sm:text-sm">Propose your price for {selectedJob.id}</p>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmitBid} className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                    {/* Job Details & Image */}
                    <div className="flex gap-4 sm:gap-6 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                        {/* Image */}
                        <div className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                            {(selectedJob.img || (selectedJob.images && selectedJob.images[0])) ? (
                                <img
                                    src={selectedJob.img || selectedJob.images[0]}
                                    alt="Cargo"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center text-slate-300">
                                    <span className="text-[10px] uppercase font-black">No Image</span>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex-grow space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo</p>
                                    <p className="text-sm font-black text-slate-900 leading-tight">{selectedJob.cargo || selectedJob.name}</p>
                                </div>
                                {selectedJob.weight && (
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight</p>
                                        <p className="text-sm font-black text-slate-900">{selectedJob.weight}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</p>
                                <p className="text-xs font-bold text-slate-700">{selectedJob.route || selectedJob.location}</p>
                            </div>

                            {selectedJob.details && (
                                <div className="pt-2 border-t border-slate-200/50 mt-2">
                                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{selectedJob.details}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Your Price Proposal</label>
                        <div className="bg-slate-50 rounded-[20px] sm:rounded-[24px] px-5 sm:px-6 py-4 sm:py-5 border-2 border-slate-100 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition-all flex items-center gap-4">
                            <span className="text-base sm:text-lg font-black text-slate-400">MWK</span>
                            <input
                                type="number"
                                required
                                className="bg-transparent w-full text-xl sm:text-2xl font-black text-slate-900 outline-none placeholder:text-slate-200"
                                placeholder="Enter amount"
                                value={bidAmount}
                                onChange={e => setBidAmount(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">Shipper will review your quote and rating</p>
                    </div>

                    <button type="submit" className="w-full py-3 sm:py-3 bg-blue-600 text-white rounded-2xl sm:rounded-3xl font-black uppercase tracking-widest text-xs sm:text-sm shadow-2xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                        Send Proposal <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BidModal;
