import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      {/* Background ambient subtle glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full filter blur-[128px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[128px]"></div>
      </div>

      <Navbar />

      <main className="flex-1 relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}
