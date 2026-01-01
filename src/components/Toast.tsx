'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast Context (untuk global usage)
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Individual Toast Component
interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

function Toast({ id, type, message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-400 flex-shrink-0" />,
    error: <XCircle size={20} className="text-red-400 flex-shrink-0" />,
    warning: <AlertCircle size={20} className="text-yellow-400 flex-shrink-0" />,
    info: <Info size={20} className="text-blue-400 flex-shrink-0" />,
  };

  const colors = {
    success: 'from-green-500/20 to-green-600/10 border-green-500/30 bg-gradient-to-r',
    error: 'from-red-500/20 to-red-600/10 border-red-500/30 bg-gradient-to-r',
    warning: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 bg-gradient-to-r',
    info: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 bg-gradient-to-r',
  };

  return (
    <div
      className={`${colors[type]} backdrop-blur-sm rounded-xl p-4 shadow-xl animate-slide-down max-w-sm border flex items-start gap-3 group hover:scale-105 transition-transform`}
      role="alert"
    >
      {icons[type]}
      <p className="text-sm text-white flex-1 leading-relaxed">{message}</p>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white transition-colors p-1 opacity-0 group-hover:opacity-100 flex-shrink-0"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-24 right-4 z-[60] space-y-2 pointer-events-none md:pointer-events-auto">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        </div>
      ))}
    </div>
  );
}

// Hook untuk menggunakan Toast (use di mana saja)
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    type: ToastType,
    message: string,
    duration: number = 3000
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (message: string) => addToast('success', message);
  const error = (message: string) => addToast('error', message);
  const warning = (message: string) => addToast('warning', message);
  const info = (message: string) => addToast('info', message);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}

// Example usage dalam component:
/*
export default function ExampleComponent() {
  const { toasts, removeToast, success, error, warning, info } = useToast();

  const handleAction = () => {
    try {
      // Do something
      success('Action berhasil!');
    } catch (err) {
      error('Terjadi kesalahan!');
    }
  };

  return (
    <div>
      <button onClick={handleAction}>Click me</button>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
*/