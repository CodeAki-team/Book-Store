'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type NotificationType = 'success' | 'info' | 'error';

type Notification = {
  message: string;
  type: NotificationType;
};

type NotificationContextType = {
  notify: (message: string, type?: NotificationType) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const notify = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && (
        <div
          className={`fixed top-[100px] right-5 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-semibold transition-all duration-300
            ${notification.type === 'success' ? 'bg-green-600' : ''}
            ${notification.type === 'error' ? 'bg-red-600' : ''}
            ${notification.type === 'info' ? 'bg-blue-600' : ''}
          `}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
