import { Plus, Truck, Box, Activity, Trash2, Globe, Edit } from 'lucide-react';
import VehicleSlider from '../../../components/VehicleSlider';

interface FleetTabProps {
    fleet: any[];
    setIsAddVehicleOpen: (open: boolean) => void;
    handleDeleteVehicle: (id: string) => void;
    onPostVehicle: (vehicle: any) => void;
    onEditVehicle: (vehicle: any) => void;
}

const FleetTab: React.FC<FleetTabProps> = ({
    fleet,
    setIsAddVehicleOpen,
    handleDeleteVehicle,
    onPostVehicle,
    onEditVehicle
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
                {Array.isArray(fleet) && fleet.map((vehicle) => {
                    const validImages = Array.isArray(vehicle.images) ? vehicle.images.filter((img: any) => typeof img === 'string' && img.trim() !== '') : [];
                    return (
                        <div key={vehicle.id} className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-2xl transition-all group">
                            <div className="h-56 overflow-hidden relative bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                                {validImages.length > 0 ? (
                                    <VehicleSlider images={validImages} />
                                ) : (vehicle.image || vehicle.img) ? (
                                    <img src={vehicle.image || vehicle.img} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 dark:text-slate-800">
                                        <Truck size={64} strokeWidth={1} />
                                        <p className="text-[10px] font-black uppercase tracking-widest mt-2">No Photo</p>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 z-10">
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
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-slate-50 dark:border-slate-700">
                                    <button onClick={() => onPostVehicle(vehicle)} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-black text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                        <Globe size={14} /> Post to Market
                                    </button>
                                    <button
                                        onClick={() => onEditVehicle(vehicle)}
                                        className="p-2 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <Edit size={16} />
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
                    );
                })}

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
