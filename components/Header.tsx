/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { DialogType } from '../types';
import { MenuIcon, RoastyPitLogoIcon } from './icons';

interface HeaderProps {
    onLogoClick: () => void;
    onShowBlog: () => void;
    onShowDialog: (dialog: DialogType) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, onShowBlog, onShowDialog }) => {
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
    
    const handleMenuClick = (action: () => void) => {
        action();
        setIsMenuOpen(false);
    }

    return (
        <header className="py-4 px-4 sm:px-8 relative z-20 shrink-0 flex justify-between items-center border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
            <button onClick={onLogoClick} className="flex items-center gap-3 group" aria-label="Go to homepage">
                <RoastyPitLogoIcon className="w-10 h-10 text-orange-400 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#f97316]" />
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text text-transparent">
                    RoastyPit
                </h1>
            </button>
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
                            <li><button onClick={() => handleMenuClick(onShowBlog)} className="w-full text-left px-4 py-2 text-slate-300 hover:bg-orange-600/50 hover:text-white">Blog</button></li>
                            <li><button onClick={() => handleMenuClick(() => onShowDialog('gallery'))} className="w-full text-left px-4 py-2 text-slate-300 hover:bg-orange-600/50 hover:text-white">Gallery</button></li>
                            <li><button onClick={() => handleMenuClick(() => onShowDialog('howitworks'))} className="w-full text-left px-4 py-2 text-slate-300 hover:bg-orange-600/50 hover:text-white">How It Works</button></li>
                            <li><button onClick={() => handleMenuClick(() => onShowDialog('about'))} className="w-full text-left px-4 py-2 text-slate-300 hover:bg-orange-600/50 hover:text-white">About</button></li>
                            <li><button onClick={() => handleMenuClick(() => onShowDialog('contact'))} className="w-full text-left px-4 py-2 text-slate-300 hover:bg-orange-600/50 hover:text-white">Contact</button></li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
