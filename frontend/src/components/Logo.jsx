import React from 'react';

export default function Logo({ className = "w-12 h-12", showText = true, subtitle = "Bilişim Teknolojileri Alanı" }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex-shrink-0 ${className}`}>
        {/* Glow behind logo */}
        <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full pointer-events-none"></div>
        <img 
          src="/logo.svg" 
          alt="Torbalı Piri Reis MTAL Bilişim" 
          className="relative w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-amber-300 text-base tracking-wide uppercase font-sans">
              Torbalı Piri Reis MTAL
            </span>
          </div>
          <span className="text-xs font-semibold tracking-wider text-cyan-400/90 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}
