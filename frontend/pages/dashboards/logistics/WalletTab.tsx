import React from 'react';
import { ArrowRight, TrendingUp, DollarSign, Briefcase, CreditCard, PieChart } from 'lucide-react';

interface WalletTabProps {
    wallet: any;
    transactions: any[];
}

const WalletTab: React.FC<WalletTabProps> = ({ wallet, transactions }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Fleet Wallet</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">Manage logistics earnings and payouts.</p>
                </div>
                <button className="w-full sm:w-auto px-8 py-4 bg-[#6366F1] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3">
                    <ArrowRight size={18} /> Payout to Bank
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 dark:bg-slate-800 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group border border-slate-800 dark:border-slate-700">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/20 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                        <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mb-4">Net Balance</p>
                        <h4 className="text-4xl font-black tracking-tighter mb-10">
                            {wallet?.currency || 'MWK'} {wallet?.balance?.toLocaleString() || '0.00'}
                        </h4>
                        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Fleet Lifetime Revenue</p>
                                <p className="text-sm font-black text-indigo-400">MWK 12.8M</p>
                            </div>
                            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <TrendingUp size={18} className="text-emerald-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6 transition-colors">
                        <h5 className="text-[11px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Commission Settings</h5>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-[#6366F1] shadow-sm">
                                    <PieChart size={24} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-[#6366F1] uppercase tracking-widest">KwikLiner Fee</p>
                                    <p className="text-lg font-black text-indigo-900 dark:text-indigo-100">5% Flat</p>
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 mt-4 leading-relaxed">The 5% commission is automatically deducted from all gross earnings. Your wallet balance reflects your net earnings.</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-[48px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col transition-colors">
                    <div className="p-8 sm:p-10 border-b border-slate-50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Transaction History</h4>
                    </div>
                    <div className="flex-grow overflow-y-auto max-h-[600px] scrollbar-hide">
                        {transactions.length > 0 ? (
                            transactions.map((tx: any) => (
                                <div key={tx.id} className="p-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-6">
                                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm border ${tx.type === 'Sale' || tx.type.includes('Earned') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50' :
                                            tx.type === 'Withdrawal' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50' :
                                                'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50'
                                            }`}>
                                            {tx.type === 'Sale' || tx.type.includes('Earned') ? <DollarSign size={24} /> :
                                                tx.type === 'Withdrawal' ? <ArrowRight size={24} /> :
                                                    <Briefcase size={24} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 dark:text-white mb-1">{tx.type} • {tx.id.substring(0, 8)}</p>
                                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                {new Date(tx.created_at).toLocaleDateString()} • {tx.method || 'Internal Wallet'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-black ${tx.type === 'Withdrawal' ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                            {tx.type === 'Withdrawal' ? '-' : '+'}{wallet?.currency || 'MWK'} {parseFloat(tx.net_amount).toLocaleString()}
                                        </p>
                                        <div className="flex items-center justify-end gap-1.5 mt-1">
                                            <div className={`h-1.5 w-1.5 rounded-full ${tx.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{tx.status}</p>
                                        </div>
                                        {tx.commission_amount > 0 && (
                                            <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 mt-1 uppercase italic">Inc. 5% Fee: {wallet?.currency} {parseFloat(tx.commission_amount).toLocaleString()}</p>
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
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Your earning history will appear here once you complete trips.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletTab;
