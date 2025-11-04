/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface ArticlePageProps {
  title: string;
  children: React.ReactNode;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ title, children }) => {
  const emojiMatch = title.match(/^(\p{Emoji})/u);
  const emoji = emojiMatch ? emojiMatch[1] : null;
  const articleTitle = emoji ? title.substring(emoji.length).trim() : title;

  return (
    <div className="w-full max-w-screen-xl mx-auto flex p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            <div className="lg:col-span-2">
                <article className="bg-slate-800/50 p-8 md:p-12 rounded-2xl border border-slate-700/80">
                    <h2 id="article-page-title" className="text-3xl md:text-4xl font-bold text-white mb-8">
                        {emoji && <span role="img" aria-hidden="true" className="mr-3">{emoji}</span>}
                        {articleTitle}
                    </h2>
                    <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-orange-400 prose-strong:text-white max-w-full">
                        {children}
                    </div>
                </article>
            </div>
            <aside className="lg:col-span-1">
                <div className="sticky top-4 space-y-6">
                    <h3 className="font-semibold text-slate-400 text-sm tracking-widest uppercase">Advertisement</h3>
                    <img src="https://placehold.co/300x600/1e293b/f97316?text=Go+Viral.+AI-Powered+Roasts.+Try+RoastyPit+Today." alt="Vertical skyscraper advertisement for RoastyPit" width="300" height="600" className="rounded-lg mx-auto" />
                    <img src="https://placehold.co/300x250/1e293b/ea580c?text=Create+Funny+Videos+in+Seconds" alt="Square advertisement for creating funny videos" width="300" height="250" className="rounded-lg mx-auto" />
                </div>
            </aside>
        </div>
    </div>
  );
};

export default ArticlePage;
