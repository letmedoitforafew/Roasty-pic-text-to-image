/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import ArticleLinks from './ArticleLinks';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 shrink-0">
      <div className="w-full max-w-screen-xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-slate-400 text-xs tracking-widest uppercase mb-3">
              Latest Articles
            </h3>
            <ArticleLinks />
          </div>
          <div>
              <h3 className="font-semibold text-slate-400 text-xs tracking-widest uppercase mb-3">
                RoastyPit
              </h3>
              <ul className="space-y-1.5 text-sm">
                <li><a href="#gallery" className="text-slate-300 hover:text-orange-400 transition-colors">Gallery</a></li>
                <li><a href="#howitworks" className="text-slate-300 hover:text-orange-400 transition-colors">How It Works</a></li>
                <li><a href="#about" className="text-slate-300 hover:text-orange-400 transition-colors">About</a></li>
                <li><a href="#contact" className="text-slate-300 hover:text-orange-400 transition-colors">Contact</a></li>
              </ul>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2 sm:gap-4">
          <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} RoastyPit A Gilnetwork Product. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-orange-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
