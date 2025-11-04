/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { articleLinks } from './ArticleLinks';

const BlogPage: React.FC = () => {
  return (
    <main className="w-full max-w-2xl mx-auto flex-grow p-8">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full flex flex-col">
            <header className="p-6 border-b border-slate-700 shrink-0 text-center">
                <h2 className="text-2xl font-bold text-white">RoastyPit Blog</h2>
            </header>
            <div className="p-8">
                <p className="text-slate-400 mb-8 text-center">
                    Explore our articles to master the art of the roast, write hilarious AI prompts, and learn more about the future of AI in comedy.
                </p>
                <ul className="space-y-4">
                    {articleLinks.map((article) => (
                    <li key={article.slug}>
                        <a 
                        href={`#article/${article.slug}`}
                        className="block w-full text-left p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600 transition-all"
                        >
                        <h3 className="text-lg font-semibold text-orange-400">{article.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">Read article &rarr;</p>
                        </a>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    </main>
  );
};

export default BlogPage;
