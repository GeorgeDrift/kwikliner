
import React, { useState, useRef } from 'react';
import { X, ImageIcon, Plus } from 'lucide-react';

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    handleAddVehicle: (e: React.FormEvent, images: string[]) => void;
    newVehicle: any;
    setNewVehicle: (vehicle: any) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, index: number) => Promise<string | null>;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
    isOpen,
    onClose,
    handleAddVehicle,
    newVehicle,
    setNewVehicle,
    handleImageUpload
}) => {
    const [images, setImages] = useState<string[]>(['', '', '']);
    const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen) return null;

    const onFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        setIsUploading(true);
        const base64 = await handleImageUpload(e, index);
        if (base64) {
            const newImgs = [...images];
            newImgs[index] = base64;
            setImages(newImgs);
        }
        setIsUploading(false);
    };

    const removeImage = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newImgs = [...images];
        newImgs[index] = '';
        setImages(newImgs);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const filteredImages = images.filter(img => img !== '');
        handleAddVehicle(e, filteredImages);
        setImages(['', '', '']); // Reset
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-800 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 w-full max-w-3xl relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Add New Vehicle</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Add a truck to your managed fleet roster.</p>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                        <X size={20} className="sm:size-[24px]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    {/* Multi-Image Gallery */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Vehicle Photos (Up to 3)</label>
                            {isUploading && <span className="text-[9px] font-black text-blue-600 animate-pulse uppercase tracking-widest">Processing...</span>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[0, 1, 2].map((idx) => (
                                <div
                                    key={idx}
                                    onClick={() => fileInputRefs[idx].current?.click()}
                                    className="group relative aspect-video bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 transition-all overflow-hidden"
                                >
                                    {images[idx] ? (
                                        <>
                                            <img src={images[idx]} className="absolute inset-0 w-full h-full object-cover" alt="vehicle" />
                                            <button
                                                type="button"
                                                onClick={(e) => removeImage(idx, e)}
                                                className="absolute top-2 right-2 h-7 w-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <ImageIcon size={20} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Photo {idx + 1}</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRefs[idx]}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => onFileChange(idx, e)}
                                    />
                                    {!images[idx] && (
                                        <div className="absolute top-2 right-2 h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus size={14} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Manufacturer</label>
                            <input
                                required
                                value={newVehicle.make}
                                onChange={e => setNewVehicle({ ...newVehicle, make: e.target.value })}
                                placeholder="e.g. Toyota"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1] dark:text-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Model</label>
                            <input
                                required
                                value={newVehicle.model}
                                onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })}
                                placeholder="e.g. Hilux"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1] dark:text-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Location</label>
                            <input
                                required
                                value={newVehicle.location}
                                onChange={e => setNewVehicle({ ...newVehicle, location: e.target.value })}
                                placeholder="e.g. Lilongwe"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1] dark:text-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">License Plate</label>
                            <input
                                required
                                value={newVehicle.plate}
                                onChange={e => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                                placeholder="e.g. MC 9928"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1] dark:text-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Operating Range</label>
                            <input
                                required
                                value={newVehicle.operating_range}
                                onChange={e => setNewVehicle({ ...newVehicle, operating_range: e.target.value })}
                                placeholder="e.g. Across the country"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1] dark:text-white transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Capacity</label>
                                <input
                                    required
                                    value={newVehicle.capacity}
                                    onChange={e => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                                    placeholder="e.g. 30T"
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1] dark:text-white transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Type</label>
                                <select
                                    value={newVehicle.type}
                                    onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value })}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1] dark:text-white transition-all appearance-none"
                                >
                                    <option value="Flatbed">Flatbed</option>
                                    <option value="Tanker">Tanker</option>
                                    <option value="Box Body">Box Body</option>
                                    <option value="Refrigerated">Refrigerated</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 dark:border-slate-700">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${isUploading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:scale-[1.02] active:scale-95 shadow-indigo-100'}`}
                        >
                            {isUploading ? 'Uploading Photos...' : 'Add to Fleet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVehicleModal;
