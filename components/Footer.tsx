/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import ArticleLinks from './ArticleLinks';
import GalleryPreview from './GalleryPreview';

interface FooterProps {
  onShowDialog: (
    dialog: 'about' | 'privacy' | 'terms' | 'contact' | 'gallery' | 'howitworks'
  ) => void;
  onShowArticle: (slug: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onShowDialog, onShowArticle }) => {
  return (
    <footer className="w-full bg-slate-900/80 border-t border-slate-800 shrink-0">
      <div className="max-w-screen-xl mx-auto p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <GalleryPreview onViewAll={() => onShowDialog('gallery')} />
          </div>
          <div className="md:col-span-1">
            <ArticleLinks onShowArticle={onShowArticle} />
          </div>
          <div className="md:col-span-1">
            <h3 className="flex items-center gap-3 text-lg font-semibold text-white mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onShowDialog('about')}
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                  About RoastyPit
                </button>
              </li>
              <li>
                <button
                  onClick={() => onShowDialog('howitworks')}
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onShowDialog('contact')}
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2025 Gilnetwork. All Rights Reserved.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <button
              onClick={() => onShowDialog('privacy')}
              className="hover:text-orange-400 transition-colors">
              Privacy Policy
            </button>
            <button
              onClick={() => onShowDialog('terms')}
              className="hover:text-orange-400 transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
