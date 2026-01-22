import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void | Promise<void>;
    shipmentId: string;
}

const RatingModal: React.FC<RatingModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    shipmentId
}) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }
        setIsSubmitting(true);
        try {
            await onSubmit(rating, comment);
            onClose();
        } catch (error) {
            console.error("Failed to submit rating", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[250] p-4">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-black tracking-tighter">Rate Your Driver</h2>
                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mt-1">Shipment {shipmentId}</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Stars */}
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">How was the service?</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="p-2 transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Star
                                        size={40}
                                        className={`${star <= (hover || rating)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-slate-200 fill-slate-200'
                                            } transition-colors duration-200`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-slate-900 font-black text-lg">
                            {rating === 5 && "Excellent! 🌟"}
                            {rating === 4 && "Great! 👍"}
                            {rating === 3 && "Good 🙂"}
                            {rating === 2 && "Fair 😐"}
                            {rating === 1 && "Poor 😞"}
                            {rating === 0 && "Select Stars"}
                        </p>
                    </div>

                    {/* Comment */}
                    <div className="space-y-3">
                        <label className="text-slate-400 text-[11px] font-black uppercase tracking-widest block px-1">Any feedback? (Optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us about the driver's performance, punctuality, and handling of cargo..."
                            className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-medium focus:border-blue-600 focus:bg-white transition-all outline-none min-h-[120px] resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition font-black uppercase tracking-widest text-[10px]"
                        >
                            Later
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0 || isSubmitting}
                            className="flex-2 px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-black uppercase tracking-widest text-[10px] disabled:bg-slate-200 disabled:cursor-not-allowed shadow-xl shadow-blue-100 flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Submit Feedback"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
