import { Toaster, toast } from 'react-hot-toast';
import './Toast.css';

export const Toast = {
  success: (message) => {
    toast.success(message, {
      className: 'toast-success',
      iconTheme: {
        primary: 'var(--toast-icon-success-color)',
        secondary: 'var(--toast-icon-success-bg)'
      }
    });
  },

  error: (message) => {
    toast.error(message, {
      className: 'toast-error',
      iconTheme: {
        primary: 'var(--toast-icon-error-color)',
        secondary: 'var(--toast-icon-error-bg)'
      }
    });
  },

  info: (message) => {
    toast(message, {
      icon: 'ℹ️',
      className: 'toast-info'
    });
  }
};

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName="toast-container"
      toastOptions={{
        duration: 3000,
        className: 'toast'
      }}
    />
  );
}