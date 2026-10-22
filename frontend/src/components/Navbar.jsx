import React, { useState } from 'react';
import { LogOut, User, GraduationCap, ShieldCheck, KeyRound, Crown } from 'lucide-react';
import Logo from './Logo';
import { authService } from '../services/api';
import ChangePasswordModal from './ChangePasswordModal';

export default function Navbar({ user }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = () => {
    authService.logout();
  };

  const isMaster = user?.username?.toLowerCase() === 'pirireis';

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo className="w-10 h-10" />

          {user && (
            <div className="flex items-center gap-2.5 sm:gap-4">
              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/60 rounded-full py-1.5 px-3.5 shadow-sm">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  user.role === 'teacher' 
                    ? isMaster
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-400'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {user.role === 'teacher' ? (
                    isMaster ? <Crown className="w-4 h-4 text-amber-300" /> : <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <GraduationCap className="w-4 h-4" />
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-100 leading-tight flex items-center gap-1.5">
                    {user.full_name}
                    {isMaster && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md font-bold">
                        Master
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 leading-tight">
                    {user.role === 'teacher' ? (isMaster ? 'Master Öğretmen' : 'Bilişim Öğretmeni') : `Öğrenci (No: ${user.student_number || user.username})`}
                  </span>
                </div>
              </div>

              {/* Password Change Button */}
              <button
                onClick={() => setShowPasswordModal(true)}
                title="Şifre Değiştir"
                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition border border-transparent hover:border-cyan-500/20 flex items-center gap-1.5 text-xs font-semibold"
              >
                <KeyRound className="w-4 h-4" />
                <span className="hidden sm:inline">Şifre Değiştir</span>
              </button>

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

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
