
import React from 'react';
import { Truck, MapPin, Box, Shield, Globe, Trash2, Edit3, Plus } from 'lucide-react';
import VehicleSlider from '../../../components/VehicleSlider';

interface MyVehiclesTabProps {
    myListings: any[];
    setActiveMenu: (menu: string) => void;
}

const MyVehiclesTab: React.FC<MyVehiclesTabProps> = ({ myListings, setActiveMenu }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">My Vehicle Postings</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">All vehicles you have listed on the KwikLiner marketplace.</p>
                </div>
                <button
                    onClick={() => setActiveMenu('PostListing')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none"
                >
                    <Plus size={18} /> List New Vehicle
                </button>
            </div>

            {myListings.length === 0 ? (
                <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-700">
                    <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-200 dark:text-slate-800 mx-auto mb-6">
                        <Truck size={40} />
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">You haven't posted any vehicles yet.</p>
                    <button
                        onClick={() => setActiveMenu('PostListing')}
                        className="mt-6 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
                    >
                        Create your first listing now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {myListings.map((vehicle, idx) => {
                        const hasImages = vehicle.images && vehicle.images.length > 0 && vehicle.images.some((img: string) => img !== '');
                        return (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between">
                                <div>
                                    <div className="h-40 w-full rounded-2xl bg-slate-100 dark:bg-slate-900 border-2 border-white dark:border-slate-700 shadow-lg overflow-hidden relative mb-5">
                                        {hasImages ? (
                                            <VehicleSlider images={vehicle.images.filter((img: string) => img !== '')} />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                                                <Truck size={48} strokeWidth={1} />
                                                <p className="text-[10px] font-black uppercase tracking-widest mt-2">No Image</p>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg z-10">
                                            Active
                                        </div>
                                    </div>

                                    <h4 className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight truncate mb-2">
                                        {vehicle.manufacturer} {vehicle.model}
                                    </h4>
                                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 bg-blue-50 dark:bg-blue-900/20 w-fit px-2 py-0.5 rounded-md">
                                        {vehicle.vehicle_type || 'Truck'}
                                    </p>

                                    <div className="space-y-2.5 mb-8 text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-2.5">
                                            <MapPin size={16} className="text-slate-400" />
                                            <span className="text-xs font-bold uppercase tracking-widest truncate">{vehicle.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Globe size={16} className="text-blue-500" />
                                            <span className="text-xs font-bold uppercase tracking-widest truncate">{vehicle.operating_range || 'Nationwide'}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Box size={16} className="text-slate-400" />
                                            <span className="text-xs font-bold uppercase tracking-widest truncate">Cap: {vehicle.capacity}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Shield size={16} className="text-green-500" />
                                            <span className="text-xs font-bold uppercase tracking-widest truncate">{vehicle.price}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 border-t border-slate-50 dark:border-slate-700 pt-6">
                                    <button className="flex-1 py-3.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all hover:bg-slate-800 flex items-center justify-center gap-2">
                                        <Edit3 size={14} /> Edit
                                    </button>
                                    <button className="h-12 w-12 border-2 border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyVehiclesTab;
