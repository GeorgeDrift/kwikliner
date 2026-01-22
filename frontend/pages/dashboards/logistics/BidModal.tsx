import React from 'react';
import { X, Gavel } from 'lucide-react';

interface BidModalProps {
    isOpen: boolean;
    onClose: () => void;
    biddingLoad: any;
    bidAmount: string;
    setBidAmount: (amount: string) => void;
    handleSubmitBid: () => void;
}

const BidModal: React.FC<BidModalProps> = ({
    isOpen,
    onClose,
    biddingLoad,
    bidAmount,
    setBidAmount,
    handleSubmitBid
}) => {
    if (!isOpen || !biddingLoad) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-[40px] p-10 w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Submit Your Bid</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">For: {biddingLoad.cargo || biddingLoad.name}</p>
                    </div>
                    <button onClick={onClose} className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</span>
                            <span className="text-sm font-bold text-slate-900">{biddingLoad.route || biddingLoad.location}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight</span>
                            <span className="text-sm font-bold text-slate-900">{biddingLoad.weight || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Bid Amount (MWK)</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300">MWK</span>
                            <input
                                type="number"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                placeholder="e.g. 450000"
                                className="w-full bg-slate-50 rounded-[28px] pl-16 pr-6 py-6 font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 border border-transparent text-xl transition-all"
                                autoFocus
                            />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 ml-2 italic">Standard range for this route: MWK 350k - 500k</p>
                    </div>

                    <button
                        onClick={handleSubmitBid}
                        disabled={!bidAmount}
                        className="w-full py-6 bg-blue-600 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                    >
                        <Gavel size={18} /> Send Bid to Shipper
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BidModal;
