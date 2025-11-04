/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ArrowLeftIcon, RoastyPitLogoIcon } from './icons';

interface ArticlePageProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ title, onClose, children }) => {
  const emojiMatch = title.match(/^(\p{Emoji})/u);
  const emoji = emojiMatch ? emojiMatch[1] : null;
  const articleTitle = emoji ? title.substring(emoji.length).trim() : title;

  return (
    <div className="h-screen text-gray-200 flex flex-col overflow-hidden">
      <header className="py-4 px-8 relative z-10 shrink-0 flex justify-between items-center border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <button onClick={onClose} className="flex items-center gap-4 group" aria-label="Go to homepage">
          <RoastyPitLogoIcon className="w-10 h-10 text-orange-400 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#f97316]" />
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text text-transparent">
            RoastyPit
          </h1>
        </button>
        <div className="hidden md:block">
            <img src="https://placehold.co/728x90/1e293b/fb923c?text=Unleash+Your+Inner+Comedian+with+RoastyPit+AI" alt="Advertisement banner for RoastyPit AI video generator" width="728" height="90" className="rounded-lg" />
        </div>
        <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            aria-label="Back to generator"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Generator</span>
          </button>
      </header>

      <div className="w-full max-w-screen-xl mx-auto flex-grow flex p-4 overflow-hidden">
        <main className="w-full h-full overflow-y-auto pr-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
        </main>
      </div>
    </div>
  );
};

export default ArticlePage;