import React from 'react';
import { Truck, X } from 'lucide-react';
import { BRANDS } from '../../../constants/branding';

interface MenuItem {
    id: string;
    icon: React.ReactNode;
    label: string;
    badge?: number;
}

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeMenu: string;
    setActiveMenu: (menu: string) => void;
    menuSections: Record<string, MenuItem[]>;
    user: any;
    navigate: (path: string) => void;
    onLogout: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
    isOpen,
    onClose,
    activeMenu,
    setActiveMenu,
    menuSections,
    user,
    navigate,
    onLogout
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] md:hidden">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 flex flex-col p-8 animate-in slide-in-from-left duration-300 shadow-2xl">
                <div className="flex items-center justify-between mb-10 shrink-0">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 flex items-center h-12">
                        <img src={BRANDS.LOGO_KWIKLINER_WIDE} alt="KwikLiner" className="h-7 w-auto object-contain" />
                    </div>
                    <button onClick={onClose} className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-grow space-y-10 overflow-y-auto pr-2 scrollbar-hide">
                    {Object.entries(menuSections).map(([title, items]: [string, MenuItem[]]) => (
                        <div key={title}>
                            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.25em] mb-6 px-4">{title}</p>
                            <div className="space-y-2">
                                {items.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            if (item.id === 'Logout') {
                                                onLogout();
                                                navigate('/');
                                            }
                                            else {
                                                setActiveMenu(item.id);
                                                onClose();
                                            }
                                        }}
                                        className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all group ${activeMenu === item.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-center space-x-5">
                                            <span className={activeMenu === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 transition-colors'}>{item.icon}</span>
                                            <span className="text-sm font-black tracking-tight">{item.label}</span>
                                        </div>
                                        {item.badge && <span className={`${activeMenu === item.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white'} text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm`}>{item.badge}</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-slate-50 mt-8 shrink-0">
                    <div className="bg-slate-50 p-6 rounded-[32px] flex items-center gap-4 border border-slate-100 overflow-hidden">
                        <div className="h-12 w-12 rounded-full bg-white shadow-sm overflow-hidden shrink-0">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="pfp" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Shipper</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default MobileSidebar;
