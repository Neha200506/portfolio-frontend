import React from 'react';
import { Button } from '../components/Button';

export function Home() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          Available for new opportunities
        </div>

        {/* Hero Header & Name/Title Area */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">Alex Morgan</span>
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-slate-300">
            Full-Stack Developer & UI/UX Enthusiast
          </p>
        </div>

        {/* Short Introduction */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
          I build modern, performant, and scalable web applications with intuitive design systems. Passionate about crafting high-quality digital experiences from concept to production.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button variant="primary" size="lg" onClick={() => alert('View Projects clicked!')}>
            View My Work
            <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Button>

          <Button variant="secondary" size="lg" onClick={() => alert('Contact clicked!')}>
            Get In Touch
          </Button>

          <Button variant="outline" size="lg" onClick={() => alert('Download Resume clicked!')}>
            <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Resume
          </Button>
        </div>

        {/* Quick Tech Stack Highlight (Placeholder) */}
        <div className="pt-12 border-t border-slate-800/60 max-w-lg mx-auto">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">Core Stack</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-slate-400">
            <span className="hover:text-sky-400 transition-colors">React</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-sky-400 transition-colors">Vite</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-sky-400 transition-colors">Tailwind CSS</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-sky-400 transition-colors">JavaScript</span>
          </div>
        </div>

      </div>
    </section>
  );
}
