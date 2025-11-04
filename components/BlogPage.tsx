/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ArticleSlug } from '../types';
import { articleLinks } from './ArticleLinks';
import { XMarkIcon } from './icons';

interface BlogPageProps {
  onClose: () => void;
  onSelectArticle: (slug: ArticleSlug) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onClose, onSelectArticle }) => {
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
      aria-labelledby="blog-page-title"
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl max-w-2xl w-full flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 border-b border-slate-700 shrink-0">
          <h2 id="blog-page-title" className="text-2xl font-bold text-white">RoastyPit Blog</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-8 overflow-y-auto">
          <p className="text-slate-400 mb-8">
            Explore our articles to master the art of the roast, write hilarious AI prompts, and learn more about the future of AI in comedy.
          </p>
          <ul className="space-y-4">
            {articleLinks.map((article) => (
              <li key={article.slug}>
                <button 
                  onClick={() => onSelectArticle(article.slug)}
                  className="w-full text-left p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600 transition-all"
                >
                  <h3 className="text-lg font-semibold text-orange-400">{article.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">Read article &rarr;</p>
                </button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
};

export default BlogPage;
