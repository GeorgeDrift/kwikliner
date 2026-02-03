import React, { useState, useRef, useEffect } from 'react';
import { X, ImageIcon, Plus, Zap, Truck, Box, MapPin, Globe } from 'lucide-react';
import { fileToBase64 } from '../../../services/fileUtils';
import { useToast } from '../../../components/ToastContext';

interface PostAvailabilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onSuccess: () => void;
    postVehicleAvailability: (data: any) => Promise<any>;
    initialData?: any;
    fleet?: any[];
}

const PostAvailabilityModal: React.FC<PostAvailabilityModalProps> = ({ isOpen, onClose, user, onSuccess, postVehicleAvailability, initialData, fleet = [] }) => {
    const { addToast } = useToast();
    const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const [isUploading, setIsUploading] = useState(false);
    const defaultFormData = {
        manufacturer: '',
        model: '',
        vehicleType: '',
        capacity: '',
        price: '',
        location: '',
        images: ['', '', ''] as string[]
    };
    const [formData, setFormData] = useState(defaultFormData);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    ...defaultFormData,
                    manufacturer: initialData.make || initialData.manufacturer || '',
                    model: initialData.model || '',
                    vehicleType: initialData.type || initialData.vehicleType || initialData.vehicle_type || '',
                    capacity: initialData.capacity || '',
                    price: initialData.price || '',
                    location: initialData.location || '',
                    images: Array.isArray(initialData.images) && initialData.images.length > 0
                        ? (initialData.images.length >= 3 ? initialData.images.slice(0, 3) : [...initialData.images, ...new Array(3 - initialData.images.length).fill('')])
                        : (initialData.img ? [initialData.img, '', ''] : (initialData.image ? [initialData.image, '', ''] : ['', '', '']))
                });
            } else {
                setFormData(defaultFormData);
            }
        } else {
            setFormData(defaultFormData);
        }
    }, [isOpen, initialData]);

    const [selectedFleetId, setSelectedFleetId] = useState<string | null>(null);

    const handleSelectFromFleet = (vehicle: any) => {
        setFormData({
            ...formData,
            manufacturer: vehicle.make,
            model: vehicle.model,
            vehicleType: vehicle.type,
            capacity: vehicle.capacity,
            location: vehicle.location || '',
            images: Array.isArray(vehicle.images) && vehicle.images.length > 0
                ? (vehicle.images.length >= 3 ? vehicle.images.slice(0, 3) : [...vehicle.images, ...new Array(3 - vehicle.images.length).fill('')])
                : (vehicle.image ? [vehicle.image, '', ''] : ['', '', ''])
        });
        setSelectedFleetId(vehicle.id);
        addToast(`Imported ${vehicle.make} ${vehicle.model} from fleet`, 'success');
    };

    if (!isOpen) return null;

    const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                setIsUploading(true);
                const base64 = await fileToBase64(file);
                const newImages = [...formData.images];
                newImages[index] = base64;
                setFormData({ ...formData, images: newImages });
            } catch (error) {
                console.error('Image upload failed:', error);
                addToast('Failed to process image.', 'error');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const triggerFileInput = (index: number) => {
        fileInputRefs[index].current?.click();
    };

    const removeImage = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newImages = [...formData.images];
        newImages[index] = '';
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const postData = {
                driverName: user.name,
                vehicleType: formData.vehicleType,
                capacity: formData.capacity,
                price: formData.price,
                location: formData.location,
                manufacturer: formData.manufacturer,
                model: formData.model,
                images: formData.images.filter(img => img !== ''),
                fleetId: (initialData && initialData.id) ? initialData.id : selectedFleetId
            };
            await postVehicleAvailability(postData);
            addToast('Listing published successfully!', 'success');
            onSuccess();
            onClose();
        } catch (error) {
            addToast('Failed to publish listing.', 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-800 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 w-full max-w-3xl relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Post Vehicle Availability</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Fill in the details to attract shippers.</p>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {fleet.length > 0 && !initialData && (
                        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[32px] border border-indigo-100 dark:border-indigo-800/50">
                            <label className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest ml-1 mb-4 block">Quick Select From Your Fleet</label>
                            <div className="flex flex-wrap gap-2">
                                {fleet.map((v: any) => (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => handleSelectFromFleet(v)}
                                        className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold border border-indigo-100 dark:border-indigo-800 hover:border-indigo-600 transition-all flex items-center gap-2"
                                    >
                                        <Truck size={14} className="text-indigo-600" />
                                        {v.make} {v.model}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Manufacturer</label>
                            <input
                                required
                                value={formData.manufacturer}
                                onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                                placeholder="e.g. Scania"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Model</label>
                            <input
                                required
                                value={formData.model}
                                onChange={e => setFormData({ ...formData, model: e.target.value })}
                                placeholder="e.g. R500"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Vehicle Type</label>
                            <input
                                required
                                value={formData.vehicleType}
                                onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                                placeholder="e.g. 28-Ton Flatbed"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Capacity</label>
                            <input
                                required
                                value={formData.capacity}
                                onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                placeholder="e.g. 28 Tons"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Location</label>
                            <input
                                required
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Blantyre"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Base Price</label>
                            <input
                                required
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                placeholder="e.g. MWK 750,000"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all dark:text-white"
                            />
                        </div>

                    </div>

                    {/* Image Gallery */}
                    <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Gallery (3 Images)</label>
                            {isUploading && <span className="text-[10px] font-black text-indigo-600 animate-pulse uppercase tracking-widest">Processing...</span>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[0, 1, 2].map((idx) => (
                                <div
                                    key={idx}
                                    onClick={() => triggerFileInput(idx)}
                                    className="group relative aspect-video bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-600 transition-all overflow-hidden"
                                >
                                    {formData.images[idx] ? (
                                        <>
                                            <img src={formData.images[idx]} className="absolute inset-0 w-full h-full object-cover" alt="vehicle" />
                                            <button
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
                                        onChange={(e) => handleFileChange(idx, e)}
                                    />
                                    {!formData.images[idx] && (
                                        <div className="absolute top-2 right-2 h-6 w-6 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus size={14} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading}
                        className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all flex items-center justify-center gap-3 ${isUploading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:scale-[1.02] active:scale-95 shadow-indigo-100'}`}
                    >
                        <Zap size={18} fill="currentColor" /> {isUploading ? 'Uploading...' : 'Publish Availability'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostAvailabilityModal;
