import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-emerald-600" style={{ color: '#059669' }} />;
      case 'error':
        return <AlertCircle size={18} className="text-rose-600" style={{ color: '#e11d48' }} />;
      case 'warning':
        return <AlertTriangle size={18} className="text-amber-600" style={{ color: '#d97706' }} />;
      default:
        return <Info size={18} className="text-blue-600" style={{ color: '#2563eb' }} />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type}`}>
          {getIcon(toast.type)}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ background: 'transparent', color: '#94a3b8', display: 'flex', padding: 2 }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
