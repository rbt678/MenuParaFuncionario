
import React, { useEffect } from 'react';
import { ToastConfig } from '../types';
import { theme } from '../styles/theme';

interface ToastProps extends ToastConfig {
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  let bgColor = `bg-[${theme.colors.info}]`; // Default to info
  let textColor = `text-[${theme.colors.infoText}]`;

  if (type === 'success') {
    bgColor = `bg-[${theme.colors.success}]`;
    textColor = `text-[${theme.colors.successText}]`;
  }
  if (type === 'error') {
    bgColor = `bg-[${theme.colors.error}]`;
    textColor = `text-[${theme.colors.errorText}]`;
  }

  return (
    <div 
      className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg z-[2000] transition-all duration-300 ease-out opacity-0 animate-fadeInOut ${bgColor} ${textColor}`}
      role="alert"
    >
      {message}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }
        .animate-fadeInOut {
          animation: fadeInOut 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastConfig[];
  onDismiss: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[2000] flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
