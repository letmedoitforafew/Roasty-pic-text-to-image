/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const articleLinks = [
  {slug: 'art-of-the-roast', title: 'The Art of the Roast'},
  {slug: 'hilarious-prompts', title: 'How to Write Hilarious AI Prompts'},
  {slug: 'top-5-viral', title: 'Top 5 Viral Videos'},
  {slug: 'ai-in-comedy', title: 'AI in Comedy: The Future of Funny'},
  {
    slug: 'behind-the-scenes',
    title: 'Behind the Scenes: How RoastyPit Works',
  },
] as const;

type ArticleSlug = (typeof articleLinks)[number]['slug'];

interface ArticleLinksProps {
  onShowArticle: (slug: ArticleSlug) => void;
}

const ArticleLinks: React.FC<ArticleLinksProps> = ({onShowArticle}) => {
  return (
    <ul className="space-y-2">
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
