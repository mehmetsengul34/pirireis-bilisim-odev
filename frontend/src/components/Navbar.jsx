import React, { useState } from 'react';
import { LogOut, GraduationCap, ShieldCheck, KeyRound, Crown } from 'lucide-react';
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
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo className="w-9 h-9" />

          {user && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 rounded-full py-1 px-3">
                <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center font-medium text-xs">
                  {user.role === 'teacher' ? (
                    isMaster ? <Crown className="w-3.5 h-3.5 text-amber-300" /> : <ShieldCheck className="w-3.5 h-3.5" />
                  ) : (
                    <GraduationCap className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-zinc-900 leading-tight flex items-center gap-1.5">
                    {user.full_name}
                    {isMaster && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-zinc-200 text-zinc-800 rounded font-medium">
                        Master
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-zinc-500 leading-tight">
                    {user.role === 'teacher' ? (isMaster ? 'Master Öğretmen' : 'Öğretmen') : `Öğrenci • No: ${user.student_number || user.username}`}
                  </span>
                </div>
              </div>

              {/* Password Change Button */}
              <button
                onClick={() => setShowPasswordModal(true)}
                title="Şifre Değiştir"
                className="px-2.5 py-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition flex items-center gap-1.5 text-xs font-medium"
              >
                <KeyRound className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden sm:inline">Şifre Değiştir</span>
              </button>

              <button
                onClick={handleLogout}
                title="Çıkış Yap"
                className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
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
