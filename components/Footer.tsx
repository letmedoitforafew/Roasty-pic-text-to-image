/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import ArticleLinks from './ArticleLinks';

interface FooterProps {
  onShowDialog: (
    dialog: 'about' | 'privacy' | 'terms' | 'contact' | 'gallery' | 'howitworks',
  ) => void;
  onShowArticle: (
    slug:
      | 'art-of-the-roast'
      | 'hilarious-prompts'
      | 'top-5-viral'
      | 'ai-in-comedy'
      | 'behind-the-scenes',
  ) => void;
}

const Footer: React.FC<FooterProps> = ({onShowDialog, onShowArticle}) => {
  return (
    <footer className="w-full bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 shrink-0">
      <div className="w-full max-w-screen-xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-slate-400 text-xs tracking-widest uppercase mb-3">
              Latest Articles
            </h3>
            <ArticleLinks onShowArticle={onShowArticle} />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-400 text-xs tracking-widest uppercase mb-3">
                RoastyPit
              </h3>
              <ul className="space-y-1.5 text-sm">
                <li><button onClick={() => onShowDialog('gallery')} className="text-slate-300 hover:text-orange-400 transition-colors">Gallery</button></li>
                <li><button onClick={() => onShowDialog('howitworks')} className="text-slate-300 hover:text-orange-400 transition-colors">How It Works</button></li>
                <li><button onClick={() => onShowDialog('about')} className="text-slate-300 hover:text-orange-400 transition-colors">About</button></li>
                <li><button onClick={() => onShowDialog('contact')} className="text-slate-300 hover:text-orange-400 transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-400 text-xs tracking-widest uppercase mb-3">
                Legal
              </h3>
              <ul className="space-y-1.5 text-sm">
                <li><button onClick={() => onShowDialog('privacy')} className="text-slate-300 hover:text-orange-400 transition-colors">Privacy</button></li>
                <li><button onClick={() => onShowDialog('terms')} className="text-slate-300 hover:text-orange-400 transition-colors">Terms</button></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-700/50 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} RoastyPit. All Rights Reserved. A Google Veo Demo.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;