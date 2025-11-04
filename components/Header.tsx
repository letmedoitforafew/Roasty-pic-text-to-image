/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { MenuIcon, RoastyPitLogoIcon } from './icons';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    return (
        <header className="py-4 px-4 sm:px-8 relative z-20 shrink-0 flex justify-between items-center border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
            <a href="#home" className="flex items-center gap-3 group" aria-label="Go to homepage">
                <RoastyPitLogoIcon className="w-10 h-10 text-orange-400 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#f97316]" />
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text text-transparent">
                    RoastyPit
                </h1>
            </a>
            <div className="relative" ref={menuRef}>
                <button 
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className="p-2 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    aria-label="Open navigation menu"
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen}
                >
                    <MenuIcon className="w-6 h-6" />
                </button>
                {isMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden animate-fade-in-fast">
                        <ul className="py-1">
                            <li><a href="#blog" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-4 py-2 text-slate-300 hover:bg-orange-600/50 hover:text-white">Blog</a></li>
                            <li><a href="#gallery" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-4 py-2 text-slate-300 hover:bg-orange-600/50 hover:text-white">Gallery</a></li>
                            <li><a href="#howitworks" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-4 py-2 text-slate-300 hover:bg-orange-600/50 hover:text-white">How It Works</a></li>
                            <li><a href="#about" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-4 py-2 text-slate-300 hover:bg-orange-600/50 hover:text-white">About</a></li>
                            <li><a href="#contact" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-4 py-2 text-slate-300 hover:bg-orange-600/50 hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;