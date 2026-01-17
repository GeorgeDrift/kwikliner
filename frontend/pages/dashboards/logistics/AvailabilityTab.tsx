import React from 'react';
import { Plus, Truck, Box, MapPin, DollarSign, X, Megaphone } from 'lucide-react';
import { User } from '../../../types';
import { api } from '../../../services/api';

interface AvailabilityTabProps {
    user: User;
}

const AvailabilityTab: React.FC<AvailabilityTabProps> = ({ user }) => {
    const companyPostings = [
        { id: 'CP-001', status: 'Active', fleetSize: '12 Trucks', capacity: '180T Total', routes: 'Lilongwe, Blantyre, Mzuzu', rate: 'MWK 15/km', posted: '2 days ago' },
        { id: 'CP-002', status: 'Active', fleetSize: '8 Trucks', capacity: '120T Total', routes: 'Blantyre, Zomba, Mangochi', rate: 'MWK 18/km', posted: '5 days ago' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">Post Availability</h3>
                    <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">Advertise your fleet and services to attract shippers.</p>
                </div>
                <button
                    onClick={() => {
                        const dummyData = { fleetSize: '5 Trucks', capacity: '100T', routes: 'Anywhere', rate: 'Negotiable' };
                        api.postVehicleAvailability(dummyData).then(() => alert('Availability Posted! Shippers can now see your fleet.'));
                    }}
                    className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:scale-105 transition-all"
                >
                    <Plus size={18} />
                    New Posting
                </button>
            </div>

            {/* Active Postings */}
            <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Your Active Postings</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {companyPostings.map((posting) => (
                        <div key={posting.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h5 className="text-xl font-black text-slate-900">{user.companyName || 'KwikLine Transport'}</h5>
                                    <p className="text-xs font-bold text-slate-400 mt-1">Listed {posting.posted}</p>
                                </div>
                                <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500 text-white">
                                    {posting.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <Truck className="text-indigo-600" size={16} />
                                    <span className="text-sm font-bold text-slate-900">{posting.fleetSize}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Box className="text-blue-600" size={16} />
                                    <span className="text-sm font-bold text-slate-900">Capacity: {posting.capacity}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-green-600" size={16} />
                                    <span className="text-sm font-bold text-slate-900">{posting.routes}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign className="text-green-600" size={16} />
                                    <span className="text-sm font-black text-green-600">{posting.rate}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-grow py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition-all">
                                    Edit Posting
                                </button>
                                <button className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Create New Posting Placeholder */}
                    <button className="min-h-[320px] border-4 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/10 transition-all">
                        <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                            <Megaphone size={32} />
                        </div>
                        <span className="font-black uppercase tracking-widest text-sm">Create New Post</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvailabilityTab;
