
import React, { useState } from 'react';
import { X, CheckCircle2, MessageSquare, DollarSign, Calculator } from 'lucide-react';

interface DirectRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: any;
    onAccept: () => void;
    onNegotiate: (amount: string) => void;
}

const DirectRequestModal: React.FC<DirectRequestModalProps> = ({
    isOpen,
    onClose,
    job,
    onAccept,
    onNegotiate
}) => {
    const [mode, setMode] = useState<'view' | 'negotiate'>('view');
    const [counterOffer, setCounterOffer] = useState('');

    if (!isOpen || !job) return null;

    const handleNegotiateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (counterOffer) {
            onNegotiate(counterOffer);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">

                {/* Header */}
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-blue-600">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-xl font-black text-white tracking-tight">Direct Hire Request</h4>
                        </div>
                        <p className="text-blue-100 font-medium text-xs">Shipper specifically requested you for this job</p>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"><X size={20} /></button>
                </div>

                <div className="p-8 space-y-6">

                    {/* Job Details Card */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Cargo</span>
                            <span className="text-sm font-black text-slate-900">{job.cargo}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Route</span>
                            <span className="text-sm font-black text-slate-900">{job.route}</span>
                        </div>
                        <div className="border-t border-slate-200 my-2"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Offered Price</span>
                            <span className="text-lg font-black text-blue-600">MWK {job.price?.toLocaleString()}</span>
                        </div>
                    </div>

                    {mode === 'view' ? (
                        <div className="space-y-3">
                            <button
                                onClick={onAccept}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={18} /> Accept Offer
                            </button>

                            <button
                                onClick={() => setMode('negotiate')}
                                className="w-full py-4 bg-white text-slate-500 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                            >
                                <Calculator size={18} /> Negotiate Price
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleNegotiateSubmit} className="space-y-4 animate-in slide-in-from-bottom-4 fade-in">
                            <div>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Your Counter Offer</label>
                                <div className="flex items-center gap-3 bg-white border-2 border-blue-600 rounded-2xl px-4 py-3 shadow-lg shadow-blue-50 ring-4 ring-blue-50">
                                    <span className="font-black text-slate-300">MWK</span>
                                    <input
                                        type="number"
                                        autoFocus
                                        value={counterOffer}
                                        onChange={e => setCounterOffer(e.target.value)}
                                        className="w-full font-black text-xl text-slate-900 outline-none placeholder:text-slate-200"
                                        placeholder={job.price?.toString()}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setMode('view')} className="flex-1 py-4 text-slate-400 font-bold text-xs uppercase hover:text-slate-600">Cancel</button>
                                <button type="submit" className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] shadow-xl">
                                    Submit Offer
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-[10px] text-center text-slate-300 font-bold uppercase tracking-widest">
                        {mode === 'view' ? "Ready to start?" : "Shipper will review your offer"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DirectRequestModal;
