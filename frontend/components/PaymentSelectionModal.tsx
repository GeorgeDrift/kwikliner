import React, { useState } from 'react';
import { api } from '../services/api';

interface PaymentSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPayment: (paymentType: 'online' | 'physical' | 'later', details?: { phoneNumber: string, providerRefId: string }) => void | Promise<void>;
    amount: number;
    rideDetails: {
        type: 'share' | 'hire';
        origin: string;
        destination: string;
        driverName: string;
    };
}

const PaymentSelectionModal: React.FC<PaymentSelectionModalProps> = ({
    isOpen,
    onClose,
    onSelectPayment,
    amount,
    rideDetails
}) => {
    const [selectedMethod, setSelectedMethod] = useState<'online' | 'physical' | 'later' | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedOperator, setSelectedOperator] = useState('');
    const [operators, setOperators] = useState<any[]>([]);
    const [loadingOps, setLoadingOps] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setLoadingOps(true);
            api.getPaymentOperators()
                .then(data => setOperators(Array.isArray(data) ? data : []))
                .finally(() => setLoadingOps(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (selectedMethod) {
            if (selectedMethod === 'online') {
                if (!phoneNumber || !selectedOperator) {
                    alert('Please enter your phone number and select an operator.');
                    return;
                }
                await onSelectPayment(selectedMethod, { phoneNumber, providerRefId: selectedOperator });
            } else {
                await onSelectPayment(selectedMethod);
            }
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-8 rounded-t-[32px]">
                    <h2 className="text-2xl font-black tracking-tighter">Select Payment Method</h2>
                    <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1">Choose how you want to pay</p>
                </div>

                <div className="p-8">
                    {/* Trip Details */}
                    <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Route</span>
                            <span className="text-sm font-black text-slate-900">
                                {rideDetails.origin} → {rideDetails.destination}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Driver</span>
                            <span className="text-sm font-black text-slate-900">{rideDetails.driverName}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Total Amount</span>
                            <span className="text-2xl font-black text-indigo-600 tracking-tighter">
                                MWK {amount.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Payment Options */}
                    <div className="space-y-4 mb-8">
                        {/* Online Payment */}
                        <div className="space-y-3">
                            <button
                                onClick={() => setSelectedMethod('online')}
                                className={`w-full p-5 rounded-2xl border-2 transition-all ${selectedMethod === 'online'
                                    ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100'
                                    : 'border-slate-100 bg-white hover:border-indigo-200'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'online' ? 'border-indigo-600' : 'border-slate-300'
                                        }`}>
                                        {selectedMethod === 'online' && (
                                            <div className="w-3 h-3 rounded-full bg-indigo-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-black text-slate-900 text-sm">Pay Online</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Airtel Money, Mpamba, or Bank</div>
                                    </div>
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </button>

                            {selectedMethod === 'online' && (
                                <div className="p-6 bg-white border-2 border-indigo-100 rounded-[24px] space-y-5 animate-in slide-in-from-top-4 duration-300">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block px-1">Choose Operator</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {operators.map(op => (
                                                <button
                                                    key={op.id || op.ref_id}
                                                    onClick={() => setSelectedOperator(op.id || op.ref_id)}
                                                    className={`p-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedOperator === (op.id || op.ref_id)
                                                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                                        : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-indigo-200'
                                                        }`}
                                                >
                                                    {op.name}
                                                </button>
                                            ))}
                                            {operators.length === 0 && !loadingOps && (
                                                <div className="col-span-2 text-center text-[10px] text-slate-400 font-black uppercase tracking-widest p-4 bg-slate-50 rounded-xl">
                                                    No operators found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block px-1">Phone Number</label>
                                        <input
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="e.g. 0991234567"
                                            className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-black focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Physical Payment */}
                        <button
                            onClick={() => setSelectedMethod('physical')}
                            className={`w-full p-5 rounded-2xl border-2 transition-all ${selectedMethod === 'physical'
                                ? 'border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-100'
                                : 'border-slate-100 bg-white hover:border-emerald-200'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'physical' ? 'border-emerald-600' : 'border-slate-300'
                                    }`}>
                                    {selectedMethod === 'physical' && (
                                        <div className="w-3 h-3 rounded-full bg-emerald-600" />
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-black text-slate-900 text-sm">Pay with Cash</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pay driver directly at pickup</div>
                                </div>
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </button>

                        {/* Pay Later Option (for rideshare) */}
                        {rideDetails.type === 'share' && (
                            <button
                                onClick={() => setSelectedMethod('later')}
                                className={`w-full p-5 rounded-2xl border-2 transition-all ${selectedMethod === 'later'
                                    ? 'border-amber-600 bg-amber-50 shadow-lg shadow-amber-100'
                                    : 'border-slate-100 bg-white hover:border-amber-200'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'later' ? 'border-amber-600' : 'border-slate-300'
                                        }`}>
                                        {selectedMethod === 'later' && (
                                            <div className="w-3 h-3 rounded-full bg-amber-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-black text-slate-900 text-sm">Pay Later</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pay after trip completion</div>
                                    </div>
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </button>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition font-black uppercase tracking-widest text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedMethod}
                            className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition font-black uppercase tracking-widest text-xs disabled:bg-slate-200 disabled:cursor-not-allowed shadow-xl shadow-indigo-100"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSelectionModal;
