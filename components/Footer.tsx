/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface FooterProps {
  onShowDialog: (dialog: 'about' | 'privacy' | 'terms') => void;
}

const Footer: React.FC<FooterProps> = ({ onShowDialog }) => {
  return (
    <footer className="w-full text-center p-4 bg-slate-900/50 border-t border-slate-800 shrink-0">
      <div className="flex flex-col items-center gap-2">
        <div className="flex justify-center items-center gap-6 text-sm text-slate-400">
          <button onClick={() => onShowDialog('about')} className="hover:text-orange-400 transition-colors">About</button>
          <span className="text-slate-600">|</span>
          <button onClick={() => onShowDialog('privacy')} className="hover:text-orange-400 transition-colors">Privacy Policy</button>
          <span className="text-slate-600">|</span>
          <button onClick={() => onShowDialog('terms')} className="hover:text-orange-400 transition-colors">Terms of Service</button>
        </div>
        <div className="text-xs text-slate-500 mt-2">
          <p className="mt-1">© 2025 Gilnetwork. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;