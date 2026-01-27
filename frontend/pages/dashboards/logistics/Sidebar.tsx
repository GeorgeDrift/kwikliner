import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../components/ThemeContext';
import { BRANDS } from '../../../constants/branding';

interface SidebarProps {
    activeMenu: string;
    setActiveMenu: (menu: string) => void;
    menuSections: any;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu, menuSections, onLogout }) => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col p-6 shrink-0 h-[calc(100vh-64px)] sticky top-16 transition-colors duration-200">
            <div className="flex items-center justify-between mb-10 px-2 group/logo shrink-0">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center h-16 w-44">
                    <img src={BRANDS.LOGO_KWIKLINER_WIDE} alt="KwikLiner" className="max-h-full max-w-full object-contain" />
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700"
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
            </div>
            <div className="flex-grow space-y-8 overflow-y-auto pr-2 scrollbar-hide">
                {Object.entries(menuSections).map(([title, items]: [string, any]) => (
                    <div key={title}>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">{title.replace('_', ' ')}</p>
                        <div className="space-y-1">
                            {items.map((item: any) => (
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
                                        ? 'bg-[#6366F1]/5 dark:bg-[#6366F1]/10 text-[#6366F1]'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className={activeMenu === item.id ? 'text-[#6366F1]' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm font-semibold">{item.label}</span>
                                    </div>
                                    {item.badge && <span className="bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside >
    );
};

export default Sidebar;
