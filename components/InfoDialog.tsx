/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { XMarkIcon } from './icons';

interface InfoDialogProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const InfoDialog: React.FC<InfoDialogProps> = ({ title, onClose, children }) => {
  // Handle keydown for accessibility
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-dialog-title"
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl max-w-2xl w-full flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <header className="flex items-center justify-between p-6 border-b border-slate-700 shrink-0">
          <h2 id="info-dialog-title" className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto text-gray-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default InfoDialog;
