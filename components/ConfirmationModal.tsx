import React from 'react';
import Loader from './Loader';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, isConfirming, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity" 
      aria-modal="true" 
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4">{title}</h2>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isConfirming}
            className="px-5 py-2 rounded-md font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 disabled:opacity-50 transition-colors"
            aria-label="Cancelar"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-5 py-2 w-28 flex items-center justify-center rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors shadow-sm"
            aria-label="Confirmar eliminación"
          >
            {isConfirming ? <Loader /> : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;