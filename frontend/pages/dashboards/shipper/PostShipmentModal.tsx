import React from 'react';
import { X, MapPin, Package, Box, Tag, Info, Calendar, Image as ImageIcon } from 'lucide-react';

interface NewShipment {
    origin: string;
    destination: string;
    cargo: string;
    weight: string;
    price: string;
    priceOption: 'fixed' | 'open';
    pickupType: 'Standard' | 'Shop Pickup';
    orderRef: string;
    paymentTiming: 'Deposit' | 'Full on Delivery';
    pickupDate: string;
    images: string[];
    quantity: string;
}

interface PostShipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    newShipment: NewShipment;
    setNewShipment: (shipment: NewShipment) => void;
    handlePostShipment: (e: React.FormEvent) => void;
}

const PostShipmentModal: React.FC<PostShipmentModalProps> = ({
    isOpen,
    onClose,
    newShipment,
    setNewShipment,
    handlePostShipment
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 my-8">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Post New Shipment</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1">Drivers will bid on your request.</p>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shrink-0">
                        <X size={16} />
                    </button>
                </div>
                <form onSubmit={handlePostShipment} className="p-6 sm:p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Origin City</label>
                            <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3">
                                <MapPin size={16} className="text-slate-400" />
                                <input
                                    className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                    placeholder="e.g. Lilongwe"
                                    value={newShipment.origin}
                                    onChange={e => setNewShipment({ ...newShipment, origin: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Destination</label>
                            <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3">
                                <MapPin size={16} className="text-slate-400" />
                                <input
                                    className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                    placeholder="e.g. Blantyre"
                                    value={newShipment.destination}
                                    onChange={e => setNewShipment({ ...newShipment, destination: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Preferred Pickup Date</label>
                        <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3">
                            <Calendar size={16} className="text-slate-400" />
                            <input
                                type="date"
                                className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none"
                                value={newShipment.pickupDate}
                                onChange={e => setNewShipment({ ...newShipment, pickupDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Cargo Details</label>
                        <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3">
                            <Package size={16} className="text-slate-400" />
                            <input
                                list="cargo-options"
                                className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                placeholder="What are you shipping? (e.g. Fertilizer)"
                                value={newShipment.cargo}
                                onChange={e => setNewShipment({ ...newShipment, cargo: e.target.value })}
                            />
                            <datalist id="cargo-options">
                                <option value="Maize" />
                                <option value="Fertilizer" />
                                <option value="Cement" />
                                <option value="Grain" />
                                <option value="Fish" />
                                <option value="Tobacco" />
                                <option value="Soya" />
                                <option value="Sugar" />
                                <option value="General Cargo" />
                            </datalist>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Quantity / Amount</label>
                            <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3">
                                <Tag size={16} className="text-slate-400" />
                                <input
                                    className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                    placeholder="e.g. 40 Bags"
                                    value={newShipment.quantity}
                                    onChange={e => setNewShipment({ ...newShipment, quantity: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Weight (Tons) - optional</label>
                            <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3">
                                <Box size={16} className="text-slate-400" />
                                <input
                                    type="number"
                                    className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                    placeholder="e.g. 30"
                                    value={newShipment.weight}
                                    onChange={e => setNewShipment({ ...newShipment, weight: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Pickup Type</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setNewShipment({ ...newShipment, pickupType: 'Standard' })}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newShipment.pickupType === 'Standard' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                                >
                                    Standard
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewShipment({ ...newShipment, pickupType: 'Shop Pickup', priceOption: 'open', paymentTiming: 'Full on Delivery' })}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newShipment.pickupType === 'Shop Pickup' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                                >
                                    Shop Pickup
                                </button>
                            </div>
                        </div>

                        {newShipment.pickupType === 'Shop Pickup' && (
                            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Order Reference / Shop Name</label>
                                <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3">
                                    <Tag size={16} className="text-slate-400" />
                                    <input
                                        className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                        placeholder="e.g. Shoprite Mzuzu - Order #12345"
                                        value={newShipment.orderRef}
                                        onChange={e => setNewShipment({ ...newShipment, orderRef: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Pricing Model</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    type="button"
                                    disabled={newShipment.pickupType === 'Shop Pickup'}
                                    onClick={() => setNewShipment({ ...newShipment, priceOption: 'fixed' })}
                                    className={`w-full sm:flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newShipment.priceOption === 'fixed'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                        : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
                                        } ${newShipment.pickupType === 'Shop Pickup' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Fixed Price
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewShipment({ ...newShipment, priceOption: 'open' })}
                                    className={`w-full sm:flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newShipment.priceOption === 'open'
                                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-100'
                                        : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
                                        }`}
                                >
                                    Open Bid
                                </button>
                            </div>

                            {newShipment.priceOption === 'fixed' && (
                                <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <span className="text-xs font-black text-slate-400">MWK</span>
                                    <input
                                        type="number"
                                        className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                                        placeholder="Enter your offer"
                                        value={newShipment.price}
                                        onChange={e => setNewShipment({ ...newShipment, price: e.target.value })}
                                    />
                                </div>
                            )}
                            {newShipment.priceOption === 'open' && (
                                <div className="bg-amber-50/50 rounded-2xl px-4 py-3 border border-amber-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <Info size={16} className="text-amber-500" />
                                    <span className="text-[10px] font-bold text-amber-600/80">Drivers will submit their best offers for this trip.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo Images (Max 3)</label>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{newShipment.images.length}/3</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {newShipment.images.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                                    <img src={img} className="w-full h-full object-cover" alt={`Cargo ${idx + 1}`} />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = [...newShipment.images];
                                            updated.splice(idx, 1);
                                            setNewShipment({ ...newShipment, images: updated });
                                        }}
                                        className="absolute top-2 right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}

                            {newShipment.images.length < 3 && (
                                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-blue-500 gap-2">
                                    <ImageIcon size={24} />
                                    <span className="text-[9px] font-black uppercase tracking-tight">Add Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setNewShipment({
                                                        ...newShipment,
                                                        images: [...newShipment.images, reader.result as string]
                                                    });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 sticky bottom-0 bg-white">
                        <button 
                            type="submit" 
                            onClick={(e) => {
                                e.preventDefault();
                                handlePostShipment(e as any);
                            }}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all">
                            Post For Bidding
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostShipmentModal;
