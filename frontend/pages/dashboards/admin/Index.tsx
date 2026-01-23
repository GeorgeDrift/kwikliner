import React, { useState } from 'react';
import {
    Users, DollarSign, Activity, Search,
    ArrowUpRight, Ban, CheckCircle, Settings,
    LayoutDashboard, PieChart, Menu, LogOut, X, ChevronRight
} from 'lucide-react';
import { User } from '../../../types';

interface AdminDashboardProps {
    user: User;
    onLogout: () => void;
    mobileMenuAction?: number;
}

// Mock Data (Same as before)
const MOCK_USERS = [
    { id: '1', name: 'John Shipper', role: 'SHIPPER', status: 'ACTIVE', earnings: 0 },
    { id: '2', name: 'Musa Driver', role: 'DRIVER', status: 'ACTIVE', earnings: 450000 },
    { id: '3', name: 'Fleet Dynamics', role: 'LOGISTICS_OWNER', status: 'ACTIVE', earnings: 1250000 },
    { id: '4', name: 'Bad Actor', role: 'DRIVER', status: 'SUSPENDED', earnings: 12000 },
    { id: '5', name: 'KwikSpares', role: 'HARDWARE_OWNER', status: 'ACTIVE', earnings: 89000 },
    { id: '6', name: 'Speedy Construction', role: 'SHIPPER', status: 'ACTIVE', earnings: 0 },
    { id: '7', name: 'City Logistics', role: 'LOGISTICS_OWNER', status: 'ACTIVE', earnings: 3200000 },
];

const MOCK_TRANSACTIONS = [
    { id: 't1', date: '2024-05-20', type: 'COMMISSION', amount: 5000, from: 'Musa Driver', status: 'COMPLETED' },
    { id: 't2', date: '2024-05-20', type: 'COMMISSION', amount: 12000, from: 'Fleet Dynamics', status: 'COMPLETED' },
    { id: 't3', date: '2024-05-19', type: 'COMMISSION', amount: 4500, from: 'Musa Driver', status: 'COMPLETED' },
    { id: 't4', date: '2024-05-18', type: 'COMMISSION', amount: 3000, from: 'John Shipper', status: 'PENDING' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [commissionRate, setCommissionRate] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

    React.useEffect(() => {
        fetchDashboardData();
    }, []);

    React.useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab, searchTerm]);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/stats');
            const data = await response.json();
            setStats(data.overview);
            setRecentTransactions(data.recentTransactions);
            // Also setting initial users for the "Recent Signups" view if needed, 
            // but the API returns recentUsers separate from the overview stats
            // We might want to store recentUsers separately or in stats
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users?search=${searchTerm}`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const toggleUserStatus = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
                method: 'PUT',
            });
            if (response.ok) {
                // Refresh users list
                fetchUsers();
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const MenuItems = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { id: 'users', label: 'User Management', icon: <Users size={20} /> },
        { id: 'finance', label: 'Finance & Earnings', icon: <DollarSign size={20} /> },
        { id: 'analytics', label: 'System Health', icon: <Activity size={20} /> },
    ];

    const renderSidebar = () => (
        <div className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-2xl`}>
            <div className="p-6 flex items-center justify-between border-b border-white/10">
                <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-xs">A</div>
                    {isSidebarOpen && <span className="font-black text-lg tracking-tight">Admin<span className="text-blue-500">Portal</span></span>}
                </div>
                {isSidebarOpen && (
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                )}
            </div>

            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                {MenuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center p-3 rounded-xl transition-all group ${activeTab === item.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                            : 'text-slate-400 hover:bg-white/10 hover:text-white'
                            } ${!isSidebarOpen ? 'justify-center' : 'gap-4'}`}
                    >
                        <div className={activeTab === item.id ? 'animate-pulse' : ''}>{item.icon}</div>
                        {isSidebarOpen && <span className="text-sm font-bold">{item.label}</span>}
                        {isSidebarOpen && activeTab === item.id && <ChevronRight size={16} className="ml-auto opacity-50" />}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10 bg-black/20">
                <button
                    onClick={onLogout}
                    className={`w-full flex items-center p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all ${!isSidebarOpen ? 'justify-center' : 'gap-4'}`}
                >
                    <LogOut size={20} />
                    {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">Logout</span>}
                </button>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading && !stats) {
            return <div className="p-10 text-center font-bold text-slate-400">Loading Dashboard...</div>;
        }

        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Users</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</h3>
                                    <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Users size={20} /></div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Revenue</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-3xl font-black text-slate-900">MWK {(stats?.totalRevenue || 0).toLocaleString()}</h3>
                                    <div className="bg-green-50 p-2 rounded-xl text-green-600"><DollarSign size={20} /></div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">System Load</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-3xl font-black text-slate-900">{stats?.systemLoad || 0}%</h3>
                                    <div className="bg-purple-50 p-2 rounded-xl text-purple-600"><Activity size={20} /></div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Pending Alerts</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-3xl font-black text-slate-900">{stats?.pendingAlerts || 0}</h3>
                                    <div className="bg-red-50 p-2 rounded-xl text-red-600"><Ban size={20} /></div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity or Chart Placeholder */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                                <h4 className="text-lg font-black text-slate-900 mb-6">Platform Growth</h4>
                                <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                                    [Growth Chart Area]
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                                <h4 className="text-lg font-black text-slate-900 mb-6">Recent Signups</h4>
                                <div className="space-y-4">
                                    {/* MOCK DATA for display purposes, could be fetched from stats.recentUsers */}
                                    {users.slice(0, 4).map(u => (
                                        <div key={u.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-xs text-slate-600">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{u.role}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-green-600 uppercase bg-green-50 px-2 py-1 rounded-md">New</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'users':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <h3 className="text-xl font-black text-slate-900">User Management</h3>
                                <div className="flex items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-full md:w-auto">
                                    <Search size={18} className="text-slate-400 mr-2" />
                                    <input
                                        placeholder="Search users..."
                                        className="bg-transparent font-bold text-sm outline-none text-slate-700 w-full"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                            <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                            <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Earnings</th>
                                            <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="p-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold">ID: #{u.id}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-lg ${u.role === 'DRIVER' ? 'bg-blue-100 text-blue-700' :
                                                        u.role === 'SHIPPER' ? 'bg-orange-100 text-orange-700' :
                                                            u.role === 'LOGISTICS_OWNER' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                                                        }`}>
                                                        {u.role ? u.role.replace('_', ' ') : 'USER'}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-black text-slate-700 text-sm">MWK {(u.earnings || 0).toLocaleString()}</td>
                                                <td className="p-4">
                                                    {u.status === 'APPROVED' || u.status === 'ACTIVE' ? (
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-red-500" /> Suspended
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => toggleUserStatus(u.id)}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all ${u.status === 'APPROVED' || u.status === 'ACTIVE'
                                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                            }`}
                                                    >
                                                        {u.status === 'APPROVED' || u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'finance':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {/* Commission Banner */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-[32px] overflow-hidden relative shadow-xl">
                            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <h3 className="text-2xl font-black mb-2">Platform Commission</h3>
                                    <p className="text-slate-400 font-medium text-sm max-w-md">Adjust the percentage deducted from every completed transaction on the platform. Changes apply immediately to new bookings.</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-5xl font-black text-blue-400">{commissionRate}%</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Rate</div>
                                    </div>
                                    <div className="h-12 w-[1px] bg-white/20"></div>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="range"
                                            min="0" max="30"
                                            value={commissionRate}
                                            onChange={(e) => setCommissionRate(Number(e.target.value))}
                                            className="w-40 md:w-56 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                            <span>0%</span>
                                            <span>Target: 15%</span>
                                            <span>30%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-black text-slate-900 mb-6">Recent Transactions</h3>
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date / Time</th>
                                        <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Initiator</th>
                                        <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                        <th className="p-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                        <th className="p-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentTransactions.map(t => (
                                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 text-sm font-bold text-slate-500">{t.date}</td>
                                            <td className="p-4 text-sm font-bold text-slate-900">{t.from}</td>
                                            <td className="p-4 text-xs font-black uppercase text-slate-400">{t.type}</td>
                                            <td className="p-4 text-sm font-black text-green-600 text-right">+ MWK {(t.amount || 0).toLocaleString()}</td>
                                            <td className="p-4 text-right">
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${t.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return <div className="text-center p-10 font-bold text-slate-400">Coming Soon</div>;
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            {renderSidebar()}

            {/* Main Content Area */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-4 md:p-8 h-screen overflow-y-auto`}>
                <div className="max-w-7xl mx-auto pb-20">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                {MenuItems.find(m => m.id === activeTab)?.label}
                            </h1>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>

                        {/* Header Right Actions */}
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
                                <Settings size={18} />
                            </div>
                            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                                <div className="text-right hidden md:block">
                                    <div className="text-sm font-black text-slate-900">{user.name}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Administrator</div>
                                </div>
                                <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs">
                                    AD
                                </div>
                            </div>
                        </div>
                    </div>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
