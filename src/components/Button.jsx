import React from 'react';

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 border border-sky-400/20',
    secondary: 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700/80 hover:border-slate-600',
    outline: 'border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
