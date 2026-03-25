import React, { useState, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none max-w-md w-full sm:w-auto">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div 
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            layout
                            className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border shadow-2xl ${
                                toast.type === 'success' ? 'border-emerald-500/30' :
                                toast.type === 'error' ? 'border-rose-500/30' : 'border-indigo-500/30'
                            }`}
                        >
                            <div className={`${
                                toast.type === 'success' ? 'text-emerald-400' :
                                toast.type === 'error' ? 'text-rose-400' : 'text-indigo-400'
                            }`}>
                                {toast.type === 'success' && <CheckCircle size={22} />}
                                {toast.type === 'error' && <AlertCircle size={22} />}
                                {toast.type === 'info' && <Info size={22} />}
                            </div>
                            <p className="text-sm font-bold text-slate-100 flex-1 leading-tight">{toast.message}</p>
                            <button 
                                onClick={() => removeToast(toast.id)}
                                className="p-1 text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
