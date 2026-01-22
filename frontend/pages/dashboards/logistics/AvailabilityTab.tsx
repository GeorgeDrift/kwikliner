import React from 'react';
import { Plus, Truck, Box, MapPin, DollarSign, X, Megaphone } from 'lucide-react';
import { User } from '../../../types';
import { api } from '../../../services/api';

interface AvailabilityTabProps {
    user: User;
    listings: any[];
}

const AvailabilityTab: React.FC<AvailabilityTabProps> = ({ user, listings }) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Post Availability</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Advertise your fleet and services to attract shippers.</p>
                </div>
                <button
                    onClick={() => {
                        const dummyData = { driverName: user.name, vehicleType: 'Fleet Offering', capacity: 'Mixed', route: 'Lilongwe, Blantyre, Mzuzu', price: 'Negotiable', location: 'Nationwide' };
                        api.postVehicleAvailability(dummyData).then(() => alert('Availability Posted! Shippers can now see your fleet.'));
                    }}
                    className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 hover:scale-105 transition-all"
                >
                    <Plus size={18} />
                    New Posting
                </button>
            </div>

            {/* Active Postings */}
            <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">Your Active Postings</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {listings.map((posting) => (
                        <div key={posting.id} className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h5 className="text-xl font-black text-slate-900 dark:text-white">{user.companyName || 'KwikLine Transport'}</h5>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">Listed {new Date(posting.created_at).toLocaleDateString()}</p>
                                </div>
                                <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500 text-white">
                                    Active
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <Truck className="text-indigo-600 dark:text-indigo-400" size={16} />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{posting.vehicle_type}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Box className="text-blue-600 dark:text-blue-400" size={16} />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">Capacity: {posting.capacity}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-green-600 dark:text-green-400" size={16} />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{posting.route}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign className="text-green-600 dark:text-green-400" size={16} />
                                    <span className="text-sm font-black text-green-600 dark:text-green-400">MWK {posting.price}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-grow py-3 bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-100 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-slate-700">
                                    Edit Posting
                                </button>
                                <button className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all border border-transparent dark:border-red-900/50">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {listings.length === 0 && (
                        <div className="col-span-1 lg:col-span-2 py-20 bg-white dark:bg-slate-800 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-700 text-center text-slate-400 dark:text-slate-500 font-bold">
                            No active postings found. Start by creating one!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvailabilityTab;
