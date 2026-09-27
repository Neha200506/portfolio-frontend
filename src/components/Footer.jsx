import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/50 py-8 text-slate-400 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {currentYear} Developer Portfolio. All rights reserved.</p>
        <p className="text-xs text-slate-500">Built with React, Vite & Tailwind CSS</p>
      </div>
    </footer>
  );
}
