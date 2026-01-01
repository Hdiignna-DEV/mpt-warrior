'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ type, message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-400" />,
    error: <XCircle size={20} className="text-red-400" />,
    warning: <AlertCircle size={20} className="text-yellow-400" />,
    info: <Info size={20} className="text-blue-400" />,
  };

  const colors = {
    success: 'from-green-500/20 to-green-600/10 border-green-500/30',
    error: 'from-red-500/20 to-red-600/10 border-red-500/30',
    warning: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
    info: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  };

  return (
    <div className={`fixed top-20 right-4 z-[60] bg-gradient-to-r ${colors[type]} border backdrop-blur-sm rounded-xl p-4 shadow-xl animate-slide-down max-w-sm`}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <p className="text-sm text-white flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

// Toast Container Component
export function ToastContainer({ toasts, removeToast }: { toasts: Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>; removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-20 right-4 z-[60] space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

// Hook untuk menggunakan Toast
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>>([]);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev: Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev: Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>) => prev.filter((t: { id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}

// Usage Example:
// const { toasts, addToast, removeToast } = useToast();
// addToast('success', 'Trade berhasil ditambahkan!');
// <ToastContainer toasts={toasts} removeToast={removeToast} />