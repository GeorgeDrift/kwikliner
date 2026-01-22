
import React, { useState } from 'react';
import { X, CheckCircle2, DollarSign, CreditCard, Building } from 'lucide-react';
import { api } from '../../../services/api';

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletBalance: number;
    onWithdraw: (amount: number, method: string, details: any) => Promise<void>;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
    isOpen,
    onClose,
    walletBalance,
    onWithdraw
}) => {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'bank' | 'mobile'>('mobile');
    const [accountDetails, setAccountDetails] = useState({
        number: '',
        name: '',
        bank_code: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [banks, setBanks] = useState<any[]>([
        { "uuid": "82310dd1-ec9b-4fe7-a32c-2f262ef08681", "name": "National Bank of Malawi" },
        { "uuid": "87e62436-0553-4fb5-a76d-f27d28420c5b", "name": "Ecobank Malawi Limited" },
        { "uuid": "b064172a-8a1b-4f7f-aad7-81b036c46c57", "name": "FDH Bank Limited" },
        { "uuid": "e7447c2c-c147-4907-b194-e087fe8d8585", "name": "Standard Bank Limited" },
        { "uuid": "236760c9-3045-4a01-990e-497b28d115bb", "name": "Centenary Bank" },
        { "uuid": "968ac588-3b1f-4d89-81ff-a3d43a599003", "name": "First Capital Limited" },
        { "uuid": "c759d7b6-ae5c-4a95-814a-79171271897a", "name": "CDH Investment Bank" },
        { "uuid": "86007bf5-1b04-49ba-84c1-9758bbf5c996", "name": "NBS Bank Limited" }
    ]);

    React.useEffect(() => {
        if (isOpen && method === 'bank') {
            // Attempt to refresh from API, but we have defaults now
            api.getSupportedBanks().then(data => {
                if (data && data.length > 0) setBanks(data);
            }).catch(console.error);
        }
    }, [isOpen, method]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0 || val > walletBalance) {
            alert('Invalid amount');
            return;
        }

        if (method === 'bank' && !accountDetails.bank_code) {
            alert("Please select a bank");
            return;
        }

        setIsSubmitting(true);
        try {
            await onWithdraw(val, method === 'mobile' ? 'Mobile Money' : 'Bank', accountDetails);
            onClose();
        } catch (e) {
            alert('Withdrawal failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-transparent dark:border-slate-800">

                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white">
                    <div>
                        <h4 className="text-xl font-black tracking-tight">Withdraw Funds</h4>
                        <p className="text-slate-400 font-medium text-xs">Available: MWK {walletBalance.toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    <div>
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Amount to Withdraw</label>
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
                            <span className="font-black text-slate-300">MWK</span>
                            <input
                                type="number"
                                required
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="w-full font-black text-xl text-slate-900 dark:text-white outline-none bg-transparent placeholder:text-slate-200 dark:placeholder:text-slate-700"
                                placeholder="0.00"
                                max={walletBalance}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Payout Method</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setMethod('mobile')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'mobile' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'}`}
                            >
                                <CreditCard size={24} />
                                <span className="text-[10px] font-black uppercase">Mobile Money</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMethod('bank')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'bank' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'}`}
                            >
                                <Building size={24} />
                                <span className="text-[10px] font-black uppercase">Bank Transfer</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {method === 'bank' && (
                            <div className="relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block pl-1">Select Bank</label>
                                <select
                                    required
                                    value={accountDetails.bank_code}
                                    onChange={e => setAccountDetails({ ...accountDetails, bank_code: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-blue-600 transition-all appearance-none text-slate-900 cursor-pointer"
                                >
                                    <option value="">Choose a Bank...</option>
                                    {banks.map(b => (
                                        <option key={b.uuid} value={b.uuid}>{b.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-[60%] -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                            </div>
                        )}

                        {method === 'mobile' && (
                            <div className="grid grid-cols-2 gap-3 mb-2">
                                <button type="button" onClick={() => setAccountDetails({ ...accountDetails, bank_code: 'airtel' })} className={`p-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${accountDetails.bank_code === 'airtel' ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                                    Airtel Money
                                </button>
                                <button type="button" onClick={() => setAccountDetails({ ...accountDetails, bank_code: 'tnm' })} className={`p-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${accountDetails.bank_code === 'tnm' ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                                    TNM Mpamba
                                </button>
                            </div>
                        )}

                        <input
                            type="text"
                            required
                            placeholder={method === 'mobile' ? "Phone Number (e.g., 265...)" : "Account Number"}
                            value={accountDetails.number}
                            onChange={e => setAccountDetails({ ...accountDetails, number: e.target.value })}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:border-blue-600 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                        <input
                            type="text"
                            required
                            placeholder="Account/Name Holder"
                            value={accountDetails.name}
                            onChange={e => setAccountDetails({ ...accountDetails, name: e.target.value })}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:border-blue-600 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Processing...' : 'Confirm Withdrawal'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WithdrawalModal;
