import React from 'react';
import { FileText, Truck, ShieldCheck, DollarSign } from 'lucide-react';

const AccountTab: React.FC = () => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Compliance Hub</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Manage your business credentials and permits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { title: 'Business License', status: 'Verified', expiry: 'Dec 2026', icon: <FileText className="text-green-600" /> },
                    { title: 'Carrier Permit', status: 'Verified', expiry: 'Jan 2027', icon: <Truck className="text-indigo-600" /> },
                    { title: 'Goods in Transit Insurance', status: 'Expiring Soon', expiry: 'Mar 2026', icon: <ShieldCheck className="text-amber-600" /> },
                    { title: 'Tax Clearance', status: 'Verified', expiry: 'Jul 2026', icon: <DollarSign className="text-blue-600" /> },
                ].map((doc, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-6 transition-colors">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center shrink-0">
                            {doc.icon}
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{doc.title}</h4>
                                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${doc.status === 'Verified' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>{doc.status}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Expires: {doc.expiry}</p>
                            <button className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#6366F1] dark:text-[#818cf8] hover:underline">Update Document</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AccountTab;
