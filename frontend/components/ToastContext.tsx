import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
}

interface ToastContextType {
    addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 pointer-events-none w-full max-w-md px-4">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-top-full duration-300 pointer-events-auto border ${toast.type === 'success' ? 'bg-white/90 border-green-200 text-green-800' :
                            toast.type === 'error' ? 'bg-white/90 border-red-200 text-red-800' :
                                'bg-white/90 border-blue-200 text-blue-800'
                            }`}
                    >
                        <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-green-100 text-green-600' :
                            toast.type === 'error' ? 'bg-red-100 text-red-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>
                            {toast.type === 'success' ? <CheckCircle2 size={20} /> :
                                toast.type === 'error' ? <AlertCircle size={20} /> :
                                    <Info size={20} />}
                        </div>
                        <p className="flex-grow font-bold text-sm">{toast.message}</p>
                        <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
