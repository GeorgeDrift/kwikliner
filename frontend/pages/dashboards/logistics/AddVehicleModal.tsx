import React from 'react';
import { X, ImageIcon } from 'lucide-react';

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    handleAddVehicle: (e: React.FormEvent) => void;
    newVehicle: any;
    setNewVehicle: (vehicle: any) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedImage: string | null;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
    isOpen,
    onClose,
    handleAddVehicle,
    newVehicle,
    setNewVehicle,
    handleImageUpload,
    selectedImage
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 w-full max-w-2xl relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Add New Vehicle</h3>
                    <button onClick={onClose} className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                        <X size={20} className="sm:size-[24px]" />
                    </button>
                </div>

                <form onSubmit={handleAddVehicle} className="space-y-6 sm:space-y-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/3">
                            <label className="block w-full aspect-square rounded-[32px] border-4 border-dashed border-slate-200 hover:border-[#6366F1] hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-400 group relative overflow-hidden">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                                ) : (
                                    <>
                                        <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-[#6366F1] transition-colors">
                                            <ImageIcon size={24} />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Upload Photo</span>
                                    </>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>

                        <div className="w-full md:w-2/3 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Make</label>
                                    <input
                                        required
                                        value={newVehicle.make}
                                        onChange={e => setNewVehicle({ ...newVehicle, make: e.target.value })}
                                        placeholder="e.g. Volvo"
                                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Model</label>
                                    <input
                                        required
                                        value={newVehicle.model}
                                        onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })}
                                        placeholder="e.g. FH16"
                                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">License Plate</label>
                                <input
                                    required
                                    value={newVehicle.plate}
                                    onChange={e => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                                    placeholder="e.g. MC 9928"
                                    className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                                    <input
                                        required
                                        value={newVehicle.capacity}
                                        onChange={e => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                                        placeholder="e.g. 30T"
                                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                                    <select
                                        value={newVehicle.type}
                                        onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value })}
                                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]"
                                    >
                                        <option value="Flatbed">Flatbed</option>
                                        <option value="Tanker">Tanker</option>
                                        <option value="Box Body">Box Body</option>
                                        <option value="Refrigerated">Refrigerated</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50">
                        <button type="submit" className="w-full py-5 bg-[#6366F1] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all">
                            Add to Fleet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVehicleModal;
