import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../components/ThemeContext';

interface MenuItem {
    id: string;
    icon: React.ReactNode;
    label: string;
    badge?: number;
}

interface SidebarProps {
    activeMenu: string;
    setActiveMenu: (menu: string) => void;
    menuSections: Record<string, MenuItem[]>;
    user: any;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu, menuSections, user, onLogout }) => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col p-6 shrink-0 h-screen sticky top-0 overflow-hidden transition-colors duration-200">
            <div className="flex items-center justify-between mb-10 shrink-0 px-2">
                <div className="flex items-center justify-center">
                    <div className="bg-blue-600 p-2.5 rounded-[16px] shadow-lg shadow-blue-100 dark:shadow-none">
                        <Truck className="text-white" size={24} />
                    </div>
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500 transition-colors"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>

            <div className="flex-grow space-y-8 overflow-y-auto pr-2 scrollbar-hide">
                {Object.entries(menuSections).map(([title, items]: [string, MenuItem[]]) => (
                    <div key={title}>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">{title.replace('_', ' ')}</p>
                        <div className="space-y-1">
                            {items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (item.id === 'Logout') {
                                            onLogout();
                                            navigate('/');
                                        } else {
                                            setActiveMenu(item.id);
                                        }
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${activeMenu === item.id
                                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 dark:shadow-none'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className={activeMenu === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'}>{item.icon}</span>
                                        <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                                    </div>
                                    {item.badge && <span className={`${activeMenu === item.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white'} text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm`}>{item.badge}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="pt-10 border-t border-slate-50 dark:border-slate-800 mt-10 shrink-0">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[32px] flex items-center gap-4 border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="h-12 w-12 rounded-full bg-white dark:bg-slate-700 shadow-sm overflow-hidden shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="pfp" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Verified Driver</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
