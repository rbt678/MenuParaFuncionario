import { useState, useCallback, useRef } from 'react';
import { ToastConfig, ShowToastFn } from '../types';

interface UseToastsReturn {
  toasts: ToastConfig[];
  showToast: ShowToastFn;
  dismissToast: (id: number) => void;
}

const useToasts = (): UseToastsReturn => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);
  const toastIdCounterRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastConfig['type'] = 'info') => {
    toastIdCounterRef.current += 1;
    const newToast: ToastConfig = { id: toastIdCounterRef.current, message, type };
    setToasts(prevToasts => [...prevToasts, newToast]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
};

export default useToasts;
