import React, { useState } from 'react';
import { Plus, Truck, Box, MapPin, DollarSign, X, Megaphone, Globe } from 'lucide-react';
import { User } from '../../../types';
import { api } from '../../../services/api';
import PostAvailabilityModal from './PostAvailabilityModal';
import VehicleSlider from '../../../components/VehicleSlider';

interface AvailabilityTabProps {
    user: User;
    listings: any[];
    onRefresh?: () => Promise<void>;
}

const AvailabilityTab: React.FC<AvailabilityTabProps> = ({ user, listings, onRefresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSuccess = async () => {
        // Socket will automatically broadcast the update to all clients
        // Also refresh the listings state for this component
        console.log('Vehicle listing posted successfully');
        if (onRefresh) {
            await onRefresh();
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Broadcast Fleet</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Advertise your vehicles to attract professional shippers.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 hover:scale-105 transition-all"
                >
                    <Plus size={18} />
                    New Posting
                </button>
            </div>

            {/* Active Postings */}
            <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600 mb-8 ml-1">Your Live Fleet Listings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map((posting) => {
                        const hasImages = posting.images && posting.images.length > 0 && posting.images.some((img: string) => img !== '');
                        return (
                            <div key={posting.id} className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-50 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all p-5 group flex flex-col justify-between">
                                <div>
                                    <div className="h-52 w-full rounded-[32px] bg-slate-50 dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-inner overflow-hidden relative mb-6">
                                        {hasImages ? (
                                            <VehicleSlider images={posting.images.filter((img: string) => img !== '')} />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 dark:text-slate-800">
                                                <Truck size={64} strokeWidth={1} />
                                                <p className="text-[10px] font-black uppercase tracking-widest mt-2">No Gallery</p>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg z-10">
                                            Live Listing
                                        </div>
                                    </div>

                                    <div className="px-2">
                                        <h5 className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight mb-2 truncate">
                                            {(posting.manufacturer && posting.model) ? `${posting.manufacturer} ${posting.model}` : (posting.vehicle_type || 'Transport Unit')}
                                        </h5>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Listed {new Date(posting.created_at).toLocaleDateString()}</p>

                                        <div className="space-y-3.5 mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                    <Truck size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{posting.vehicle_type || 'Fleet Vehicle'}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                    <Box size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{posting.capacity} Tons Cap.</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                    <MapPin size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{posting.location || posting.route}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                                                    <DollarSign size={16} />
                                                </div>
                                                <span className="text-lg font-black text-slate-900 dark:text-white">MWK {posting.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-6 border-t border-slate-50 dark:border-slate-700/50">
                                    <button className="flex-grow py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                        Edit Details
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to remove this listing from Kwik Shop?')) {
                                                await api.deleteVehicleListing(posting.id);
                                                if (onRefresh) await onRefresh();
                                            }
                                        }}
                                        className="px-5 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-[20px] hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-95"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {listings.length === 0 && (
                        <div className="col-span-full py-32 bg-white dark:bg-slate-800 rounded-[48px] border-2 border-dashed border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center">
                            <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-200 dark:text-slate-700 mb-6">
                                <Megaphone size={40} />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">No active postings</h4>
                            <p className="text-slate-400 dark:text-slate-500 font-medium max-w-xs mx-auto mt-2">Publish your first vehicle availability to start getting hired directly.</p>
                            <button onClick={() => setIsModalOpen(true)} className="mt-8 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] hover:underline">Create Posting Now</button>
                        </div>
                    )}
                </div>
            </div>

            <PostAvailabilityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={user}
                onSuccess={handleSuccess}
                postVehicleAvailability={api.postVehicleAvailability}
            />
        </div>
    );
};

export default AvailabilityTab;
