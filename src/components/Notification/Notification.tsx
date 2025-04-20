// src/components/Notification.tsx

import React from 'react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    const bgColor =
        type === 'success'
            ? 'bg-green-500'
            : type === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500';

    return (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg ${bgColor} text-white`}>
            <div className="flex items-center justify-between">
                <p>{message}</p>
                <button
                    onClick={onClose}
                    className="ml-4 text-xl font-semibold"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default Notification;
