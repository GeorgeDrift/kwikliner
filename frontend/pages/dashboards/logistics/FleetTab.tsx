import React from 'react';
import { Plus, Truck, Box, Activity, Trash2 } from 'lucide-react';

interface FleetTabProps {
    fleet: any[];
    setIsAddVehicleOpen: (open: boolean) => void;
    handleDeleteVehicle: (id: string) => void;
}

const FleetTab: React.FC<FleetTabProps> = ({
    fleet,
    setIsAddVehicleOpen,
    handleDeleteVehicle
}) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">My Fleet</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Manage your vehicle roster and availability.</p>
                </div>
                <button
                    onClick={() => setIsAddVehicleOpen(true)}
                    className="w-full sm:w-auto bg-[#6366F1] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 hover:scale-105 transition-all"
                >
                    <Plus size={18} /> Add Vehicle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {fleet.map((vehicle) => (
                    <div key={vehicle.id} className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-2xl transition-all group">
                        <div className="h-56 overflow-hidden relative">
                            <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 left-4">
                                <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg ${vehicle.status === 'Available' ? 'bg-green-500 text-white' :
                                    vehicle.status === 'In Transit' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
                                    }`}>
                                    {vehicle.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white">{vehicle.make} {vehicle.model}</h4>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-0.5">{vehicle.plate}</p>
                                </div>
                                <div className="h-8 w-8 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500">
                                    <Truck size={16} />
                                </div>
                            </div>

                            <div className="flex gap-3 mb-6">
                                <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                    <Box size={12} /> {vehicle.capacity}
                                </div>
                                <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                    <Activity size={12} /> {vehicle.type}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-50 dark:border-slate-700">
                                <button className="flex-1 py-2 bg-[#6366F1] text-white rounded-lg font-black text-[10px] uppercase tracking-widest">
                                    Manage
                                </button>
                                <button
                                    onClick={() => handleDeleteVehicle(vehicle.id)}
                                    className="p-2 border border-red-100 dark:border-red-900/30 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder */}
                <button
                    onClick={() => setIsAddVehicleOpen(true)}
                    className="min-h-[400px] border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[40px] flex flex-col items-center justify-center gap-4 text-slate-300 dark:text-slate-700 hover:border-[#6366F1] dark:hover:border-[#6366F1] hover:text-[#6366F1] dark:hover:text-[#6366F1] hover:bg-indigo-50/10 dark:hover:bg-indigo-900/5 transition-all"
                >
                    <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                        <Plus size={32} />
                    </div>
                    <span className="font-black uppercase tracking-widest text-sm">Add New Truck</span>
                </button>
            </div>
        </div>
    );
};

export default FleetTab;
