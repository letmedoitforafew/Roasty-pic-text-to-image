/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import AdPlaceholder from './AdPlaceholder';
import ArticleLinks from './ArticleLinks';
import GalleryPreview from './GalleryPreview';

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
      <div className="w-full max-w-screen-xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-slate-400 text-sm tracking-widest uppercase mb-4">
              Latest Articles
            </h3>
            <ArticleLinks onShowArticle={onShowArticle} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-400 text-sm tracking-widest uppercase mb-4">
              Community Gallery
            </h3>
            <GalleryPreview onShowGallery={() => onShowDialog('gallery')} />
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-slate-400 text-sm tracking-widest uppercase mb-4">
              Advertisement
            </h3>
            <AdPlaceholder label="Footer Leaderboard Ad" width={728} height={90} />
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} RoastyPit. All Rights Reserved. A
            Google Veo Demo.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button
              onClick={() => onShowDialog('about')}
              className="hover:text-orange-400 transition-colors">
              About
            </button>
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
            <button
              onClick={() => onShowDialog('contact')}
              className="hover:text-orange-400 transition-colors">
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
