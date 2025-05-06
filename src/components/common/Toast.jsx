import { Toaster, toast } from 'react-hot-toast';

export const Toast = {
  success: (message) => {
    toast.success(message, {
      style: {
        background: '#10B981',
        color: '#FFFFFF'
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#10B981'
      }
    });
  },

  error: (message) => {
    toast.error(message, {
      style: {
        background: '#EF4444',
        color: '#FFFFFF'
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#EF4444'
      }
    });
  },

  info: (message) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#FFFFFF'
      }
    });
  }
};

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 20,
        right: 20,
        padding: '4px'
      }}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#FFFFFF',
          color: '#1F2937',
          padding: '12px 16px',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }
      }}
    />
  );
}