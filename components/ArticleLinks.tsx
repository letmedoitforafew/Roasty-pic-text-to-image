/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { NewspaperIcon } from './icons';

const articles = [
    { slug: 'art-of-the-roast', title: "The Art of the Roast", implemented: true },
    { slug: 'hilarious-prompts', title: "How to Write Hilarious AI Prompts", implemented: true },
    { slug: 'top-5-viral', title: "Top 5 Viral Videos Made with RoastyPit", implemented: true },
    { slug: 'ai-in-comedy', title: "AI in Comedy: The Future of Funny", implemented: true },
    { slug: 'behind-the-scenes', title: "Behind the Scenes: How RoastyPit Works", implemented: true },
];

interface ArticleLinksProps {
    onShowArticle: (slug: string) => void;
}

const ArticleLinks: React.FC<ArticleLinksProps> = ({ onShowArticle }) => {
  return (
    <div className="w-full">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-white mb-4">
        <NewspaperIcon className="w-5 h-5 text-orange-400" />
        Latest Articles
      </h3>
      <ul className="space-y-2">
        {articles.map((article) => (
          <li key={article.slug}>
            {article.implemented ? (
               <button
                onClick={() => onShowArticle(article.slug)}
                className="text-slate-400 hover:text-orange-400 hover:underline transition-colors text-sm text-left"
               >
                {article.title}
               </button>
            ) : (
                <span className="text-slate-600 text-sm cursor-not-allowed"
                >
                 {article.title} <em className="text-slate-500 text-xs">(Coming Soon)</em>
                </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleLinks;