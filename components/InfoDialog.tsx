/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface InfoPageProps {
  title: string;
  children: React.ReactNode;
}

const InfoPage: React.FC<InfoPageProps> = ({ title, children }) => {
  return (
    <main className="w-full max-w-4xl mx-auto flex-grow p-8">
        <div className="bg-slate-800/50 p-8 md:p-12 rounded-2xl border border-slate-700/80">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">{title}</h2>
            <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-orange-400 max-w-full">
                {children}
            </div>
        </div>
    </main>
  );
};

export default InfoPage;
