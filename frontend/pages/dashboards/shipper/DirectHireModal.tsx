import React, { useState } from 'react';
import { X, Truck, MapPin, Package, CreditCard, Calendar } from 'lucide-react';

interface DirectHireModalProps {
    isOpen: boolean;
    onClose: () => void;
    driver: {
        id: string;
        name: string;
        vehicleType: string;
        priceStr?: string;
    } | null;
    onSubmit: (details: any) => void;
}

const DirectHireModal: React.FC<DirectHireModalProps> = ({ isOpen, onClose, driver, onSubmit }) => {
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        cargo: '',
        weight: '',
        price: '',
        pickupDate: ''
    });

    if (!isOpen || !driver) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, driverId: driver.id, driverName: driver.name });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Hire {driver.name}</h3>
                        <p className="text-sm text-slate-500 font-bold flex items-center gap-2 mt-1">
                            <Truck size={14} /> {driver.vehicleType}
                        </p>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Origin</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="text"
                                    placeholder="City, Location"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-medium"
                                    value={formData.origin}
                                    onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Destination</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="text"
                                    placeholder="City, Location"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-medium"
                                    value={formData.destination}
                                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Cargo Purpose</label>
                            <div className="relative">
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Transporting Maize"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-medium"
                                    value={formData.cargo}
                                    onChange={e => setFormData({ ...formData, cargo: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Weight (Tons)</label>
                            <input
                                required
                                type="number"
                                placeholder="0.0"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-medium"
                                value={formData.weight}
                                onChange={e => setFormData({ ...formData, weight: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Shipment Details & Instructions</label>
                        <textarea
                            placeholder="Describe specific requirements, loading instructions, or cargo details..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-medium min-h-[100px] resize-none"
                            value={(formData as any).details || ''}
                            onChange={e => setFormData({ ...formData, details: e.target.value } as any)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Offer Price (MWK)</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-medium"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Pickup Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="date"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:font-medium"
                                    value={formData.pickupDate}
                                    onChange={e => setFormData({ ...formData, pickupDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all">
                        Send Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DirectHireModal;
