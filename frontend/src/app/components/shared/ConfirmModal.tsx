'use client';

import React from 'react';
import { Modal, ModalBody, ModalFooter } from '../base/Modal';
import { SecondaryButton, AlertButton } from '../base/Button';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <ModalBody>
        <div className="flex items-start space-x-3">
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <SecondaryButton onClick={onClose} disabled={loading}>
          {cancelText}
        </SecondaryButton>
        <AlertButton 
          onClick={onConfirm}
          loading={loading}
          className={'danger'}
        >
          {confirmText}
        </AlertButton>
      </ModalFooter>
    </Modal>
  );
};
