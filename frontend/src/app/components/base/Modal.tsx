'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { GhostButton } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

const getSizeClasses = (size: string) => {
  switch (size) {
    case 'sm':
      return 'max-w-md';
    case 'md':
      return 'max-w-lg';
    case 'lg':
      return 'max-w-2xl';
    case 'xl':
      return 'max-w-4xl';
    case 'full':
      return 'max-w-full mx-4';
    default:
      return 'max-w-lg';
  }
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
}) => {
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-200"
        onClick={handleOverlayClick}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative bg-white rounded-xl shadow-xl
            w-full ${getSizeClasses(size)}
            transform transition-all duration-200 ease-out
            ${className}
          `}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4">
              {title && (
                <h2 className="text-lg font-medium text-gray-700">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <GhostButton
                  onClick={onClose}
                  leftIcon={<X className="w-4 h-4" />}
                  size="sm"
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Fechar modal"
                >
                  Fechar
                </GhostButton>
              )}
            </div>
          )}

          <div className="px-6 pb-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ModalFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`
      flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-100
      ${className}
    `}>
      {children}
    </div>
  );
};

export const ModalBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};
