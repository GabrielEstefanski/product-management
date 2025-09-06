import { toast, ToastOptions } from 'react-hot-toast';

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#fff',
    color: '#374151',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
};

const successOptions: ToastOptions = {
  ...defaultOptions,
  icon: '✅',
  style: {
    ...defaultOptions.style,
    border: '1px solid #10b981',
    background: '#f0fdf4',
    color: '#065f46',
  },
};

const errorOptions: ToastOptions = {
  ...defaultOptions,
  icon: '❌',
  style: {
    ...defaultOptions.style,
    border: '1px solid #ef4444',
    background: '#fef2f2',
    color: '#991b1b',
  },
};

const warningOptions: ToastOptions = {
  ...defaultOptions,
  icon: '⚠️',
  style: {
    ...defaultOptions.style,
    border: '1px solid #f59e0b',
    background: '#fffbeb',
    color: '#92400e',
  },
};

const infoOptions: ToastOptions = {
  ...defaultOptions,
  icon: 'ℹ️',
  style: {
    ...defaultOptions.style,
    border: '1px solid #3b82f6',
    background: '#eff6ff',
    color: '#1e40af',
  },
};

export const useToast = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    return toast.success(message, { ...successOptions, ...options });
  };

  const showError = (message: string, options?: ToastOptions) => {
    return toast.error(message, { ...errorOptions, ...options });
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    return toast(message, { ...warningOptions, ...options });
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    return toast(message, { ...infoOptions, ...options });
  };

  const showLoading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, { ...defaultOptions, ...options });
  };

  const dismiss = (toastId: string) => {
    toast.dismiss(toastId);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismiss,
    dismissAll,
  };
};
