import React from 'react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 font-bold text-xl text-white tracking-tight hover:opacity-90 transition-opacity">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-sky-500/20">
            P
          </span>
          <span>Portfolio</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-300">
          <a href="#home" className="hover:text-sky-400 transition-colors">Home</a>
          <a href="#about" className="hover:text-sky-400 transition-colors">About</a>
          <a href="#skills" className="hover:text-sky-400 transition-colors">Skills</a>
          <a href="#projects" className="hover:text-sky-400 transition-colors">Projects</a>
          <a href="#experience" className="hover:text-sky-400 transition-colors">Experience</a>
          <a href="#blog" className="hover:text-sky-400 transition-colors">Blog</a>
          <a href="#contact" className="hover:text-sky-400 transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="px-4 py-2 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-all hover:text-white"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </header>
  );
}
