import React from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <Check aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};
