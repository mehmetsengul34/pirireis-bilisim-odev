import React from 'react';
import { LogOut, User, GraduationCap, ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import { authService } from '../services/api';

export default function Navbar({ user }) {
  const handleLogout = () => {
    authService.logout();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo className="w-10 h-10" />

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/60 rounded-full py-1.5 px-3.5 shadow-sm">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                user.role === 'teacher' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}>
                {user.role === 'teacher' ? <ShieldCheck className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-100 leading-tight">
                  {user.full_name}
                </span>
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 leading-tight">
                  {user.role === 'teacher' ? 'Bilişim Öğretmeni' : `Öğrenci (No: ${user.student_number || user.username})`}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Çıkış Yap"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
