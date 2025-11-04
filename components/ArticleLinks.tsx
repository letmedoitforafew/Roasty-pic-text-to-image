/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ArticleSlug } from '../types';

export const articleLinks: {slug: ArticleSlug; title: string}[] = [
  {slug: 'art-of-the-roast', title: 'The Art of the Roast'},
  {slug: 'hilarious-prompts', title: 'How to Write Hilarious AI Prompts'},
  {slug: 'top-5-viral', title: 'Top 5 Viral Videos'},
  {slug: 'ai-in-comedy', title: 'AI in Comedy: The Future of Funny'},
  {
    slug: 'behind-the-scenes',
    title: 'Behind the Scenes: How RoastyPit Works',
  },
] as const;

interface ArticleLinksProps {
  onShowArticle: (slug: ArticleSlug) => void;
}

const ArticleLinks: React.FC<ArticleLinksProps> = ({onShowArticle}) => {
  return (
    <ul className="space-y-1.5 text-sm">
      {articleLinks.map((link) => (
        <li key={link.slug}>
          <button
            onClick={() => onShowArticle(link.slug)}
            className="text-slate-300 hover:text-orange-400 transition-colors text-left">
            {link.title}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ArticleLinks;
