import React from 'react';
import { X, AlertTriangle, AlertCircle, Trash2 } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger'
}) => {
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: 'bg-red-500',
            text: 'text-red-600',
            border: 'border-red-100',
            hover: 'hover:bg-red-600',
            icon: <Trash2 className="text-red-500" size={24} />,
            lightBg: 'bg-red-50'
        },
        warning: {
            bg: 'bg-amber-500',
            text: 'text-amber-600',
            border: 'border-amber-100',
            hover: 'hover:bg-amber-600',
            icon: <AlertTriangle className="text-amber-500" size={24} />,
            lightBg: 'bg-amber-50'
        },
        info: {
            bg: 'bg-blue-500',
            text: 'text-blue-600',
            border: 'border-blue-100',
            hover: 'hover:bg-blue-600',
            icon: <AlertCircle className="text-blue-500" size={24} />,
            lightBg: 'bg-blue-50'
        }
    };

    const config = colors[type];

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-white dark:bg-slate-800 w-full max-w-sm rounded-[40px] shadow-2xl border border-white dark:border-slate-700 p-8 pt-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`p-5 ${config.lightBg} dark:bg-slate-900/50 rounded-[28px] mb-6`}>
                        {config.icon}
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-3 capitalize">
                        {title}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed mb-8 px-2 lowercase first-letter:capitalize">
                        {message}
                    </p>

                    <div className="flex gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 px-6 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-800"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-4 px-6 ${config.bg} text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
