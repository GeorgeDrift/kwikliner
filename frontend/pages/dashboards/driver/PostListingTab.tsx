import React, { useState, useRef } from 'react';
import { ImageIcon, Plus, Zap, MapPin, Globe, Truck, X, Trash2 } from 'lucide-react';
import { fileToBase64 } from '../../../services/fileUtils';
import VehicleSlider from '../../../components/VehicleSlider';
import { useToast } from '../../../components/ToastContext';
import ConfirmModal from '../../../components/ConfirmModal';

interface PostListingTabProps {
    handlePostAvailability: (data: any) => void;
    myListings?: any[];
    handleDeleteListing?: (id: string) => void;
}
const PostListingTab: React.FC<PostListingTabProps> = ({ handlePostAvailability, myListings = [], handleDeleteListing }) => {
    const { addToast } = useToast();
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        manufacturer: '',
        model: '',
        vehicleType: '',
        capacity: '',
        price: '',
        location: '',
        operatingRange: '',
        images: ['', '', ''] as string[]
    });

    const handleSubmit = () => {
        handlePostAvailability(formData);
    };

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

    return (
        <div className="max-w-[1920px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="text-center">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Broadcast Availability</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-sm sm:text-base">Let shippers find you by posting your vehicle details and range.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-12 rounded-[40px] sm:rounded-[48px] border border-slate-100 dark:border-slate-700 shadow-2xl dark:shadow-none space-y-8 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Manufacturer (e.g. Toyota)</label>
                        <input
                            value={formData.manufacturer}
                            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 border border-transparent dark:border-slate-700 transition-all"
                            placeholder="e.g. Toyota"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Model (e.g. Hilux)</label>
                        <input
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 border border-transparent dark:border-slate-700 transition-all"
                            placeholder="e.g. Hilux"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Vehicle Type</label>
                        <input
                            value={formData.vehicleType}
                            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 border border-transparent dark:border-slate-700 transition-all"
                            placeholder="e.g. 15-Ton Truck"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Vehicle Location</label>
                        <input
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 border border-transparent dark:border-slate-700 transition-all"
                            placeholder="e.g. Lilongwe, Area 47"
                        />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Operating Range</label>
                        <input
                            value={formData.operatingRange}
                            onChange={(e) => setFormData({ ...formData, operatingRange: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 border border-transparent dark:border-slate-700 transition-all"
                            placeholder="e.g. From Mzuzu to the whole country"
                        />
                    </div>
                    <div className="space-y-3 md:col-span-1">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Free Capacity (Tons)</label>
                        <input
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 border border-transparent dark:border-slate-700 transition-all"
                            placeholder="e.g. 15"
                        />
                    </div>
                    <div className="space-y-3 md:col-span-1">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Base Price (Trip)</label>
                        <input
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 border border-transparent dark:border-slate-700 transition-all"
                            placeholder="e.g. MWK 350,000"
                        />
                    </div>

                    {/* Vehicle Image Gallery Selection */}
                    <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-50 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Vehicle Image Gallery (3 Images Required)</label>
                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">Gallery Preview</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[0, 1, 2].map((idx) => (
                                <div
                                    key={idx}
                                    onClick={() => triggerFileInput(idx)}
                                    className="group relative aspect-video bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/10 dark:hover:bg-blue-900/10 transition-all overflow-hidden"
                                >
                                    {formData.images[idx] ? (
                                        <>
                                            <img src={formData.images[idx]} className="absolute inset-0 w-full h-full object-cover" alt="vehicle" />
                                            <button
                                                onClick={(e) => removeImage(idx, e)}
                                                className="absolute top-2 right-2 h-8 w-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                                            <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                <ImageIcon size={20} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Image {idx + 1}</span>
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
                                        <div className="absolute top-2 right-2 h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus size={14} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={handleSubmit} className="w-full py-5 sm:py-6 bg-blue-600 text-white rounded-[24px] sm:rounded-[32px] font-black uppercase tracking-widest shadow-2xl shadow-blue-100 dark:shadow-none text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-95">
                    <Zap size={18} fill="currentColor" /> Publish Availability
                </button>
            </div>

            {/* Active Listings Section */}
            {myListings.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Active Platform Listings</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myListings.map((listing) => (
                            <div key={listing.id} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                                <div className="h-28 w-28 rounded-2xl bg-slate-50 dark:bg-slate-900 overflow-hidden shrink-0 relative">
                                    {(listing.images && listing.images.length > 0 && listing.images.some((i: string) => i !== '')) ? (
                                        <VehicleSlider images={listing.images.filter((i: string) => i !== '')} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Truck size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h5 className="font-black text-slate-900 dark:text-white truncate">{listing.manufacturer} {listing.model}</h5>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{listing.vehicle_type} • {listing.capacity}</p>
                                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 mt-2 uppercase">{listing.location || listing.route}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setItemToDelete(listing.id);
                                        setIsDeleteConfirmOpen(true);
                                    }}
                                    className="ml-auto p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all active:scale-95"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <ConfirmModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={async () => {
                    if (itemToDelete && handleDeleteListing) {
                        await handleDeleteListing(itemToDelete);
                        addToast('Listing removed successfully', 'success');
                    }
                }}
                title="Remove Listing"
                message="Are you sure you want to remove this listing? It will no longer be visible to shippers."
                confirmText="Remove Now"
                type="danger"
            />
        </div>
    );
};

export default PostListingTab;
