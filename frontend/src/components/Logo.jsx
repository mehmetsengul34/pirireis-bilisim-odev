import React from 'react';

export default function Logo({ className = "w-10 h-10", showText = true, subtitle = "Bilişim Teknolojileri Alanı" }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex-shrink-0 flex items-center justify-center ${className}`}>
        <img 
          src="/logo.png" 
          alt="Torbalı Piri Reis MTAL Bilişim" 
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm tracking-tight leading-snug">
            Torbalı Piri Reis MTAL
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-none mt-0.5">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}
