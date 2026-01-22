import React from 'react';
import { ArrowRight, TrendingUp, DollarSign, Briefcase, CreditCard } from 'lucide-react';

interface WalletTabProps {
    wallet: any;
    transactions: any[];
    onWithdraw: () => void;
}

const WalletTab: React.FC<WalletTabProps> = ({ wallet, transactions, onWithdraw }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">My Wallet</h3>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage your earnings and payouts.</p>
                </div>
                <button
                    onClick={onWithdraw}
                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3 hover:scale-105 transition-all active:scale-95"
                >
                    <ArrowRight size={18} /> Withdraw Funds
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 dark:bg-black p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Available Balance</p>
                        <h4 className="text-4xl font-black tracking-tighter mb-10">
                            {wallet?.currency || 'MWK'} {wallet?.balance?.toLocaleString() || '0.00'}
                        </h4>
                        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Earned</p>
                                <p className="text-sm font-black">MWK {transactions.filter(tx => tx.type !== 'Withdrawal').reduce((acc, tx) => acc + parseFloat(tx.net_amount || 0), 0).toLocaleString()}</p>
                            </div>
                            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <TrendingUp size={18} className="text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden h-full flex flex-col transition-colors">
                        <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
                            <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Transaction History</h4>
                        </div>
                        <div className="flex-grow overflow-y-auto max-h-[600px] scrollbar-hide">
                            {transactions.length > 0 ? (
                                transactions.map((tx: any) => (
                                    <div key={tx.id} className="p-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-6">
                                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm border ${tx.type === 'Sale' || tx.type.includes('Earned') ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' :
                                                tx.type === 'Withdrawal' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800' :
                                                    'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800'
                                                }`}>
                                                {tx.type === 'Sale' || tx.type.includes('Earned') ? <DollarSign size={24} /> :
                                                    tx.type === 'Withdrawal' ? <ArrowRight size={24} /> :
                                                        <Briefcase size={24} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white mb-1">{tx.type} • {tx.id.substring(0, 8)}</p>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {new Date(tx.created_at).toLocaleDateString()} • {tx.method || 'Internal Wallet'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-black ${tx.type === 'Withdrawal' ? 'text-red-500' : 'text-emerald-600'}`}>
                                                {tx.type === 'Withdrawal' ? '-' : '+'}{wallet?.currency || 'MWK'} {parseFloat(tx.net_amount).toLocaleString()}
                                            </p>
                                            <div className="flex items-center justify-end gap-1.5 mt-1">
                                                <div className={`h-1.5 w-1.5 rounded-full ${tx.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tx.status}</p>
                                            </div>
                                            {tx.commission_amount > 0 && (
                                                <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase italic">Inc. 5% Fee: {wallet?.currency} {parseFloat(tx.commission_amount).toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-20 text-center">
                                    <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CreditCard className="text-slate-200 dark:text-slate-700" size={32} />
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white">No transactions yet</h4>
                                    <p className="text-slate-500 text-sm mt-2">Your earning history will appear here once you complete trips.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletTab;
