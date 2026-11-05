import React, { useState, useEffect } from 'react';
import { LogOut, GraduationCap, ShieldCheck, KeyRound, Crown, Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import NotificationCenter from './NotificationCenter';
import { authService } from '../services/api';
import ChangePasswordModal from './ChangePasswordModal';
import { toggleTheme, getTheme } from '../utils/theme';

export default function Navbar({ user }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    const handleThemeChange = (e) => {
      setTheme(e.detail || getTheme());
    };
    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  const handleLogout = () => {
    authService.logout();
  };

  const isMaster = user?.username?.toLowerCase() === 'pirireis';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-shrink">
            <Logo className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            <a
              href="/vr"
              target="_blank"
              rel="noopener noreferrer"
              title="İzmir Torbalı BİLSEM VR Duyu & Dil Atölyesi (Meta Quest 3)"
              className="px-2.5 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800 rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <span className="text-sm">🥽</span>
              <span className="hidden sm:inline">VR Atölye</span>
            </a>

            <a
              href="/vr2"
              target="_blank"
              rel="noopener noreferrer"
              title="Sayı Adası Macerası - Çocuklar İçin Somut VR Matematik"
              className="px-2.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800 rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <span className="text-sm">🏝️</span>
              <span className="hidden sm:inline">Sayı Adası VR</span>
            </a>

            <a
              href="/vr3"
              target="_blank"
              rel="noopener noreferrer"
              title="Neşeli Piyano Adası - Çocuklar İçin VR Müzik ve Enstrüman Atölyesi (Meta Quest 3)"
              className="px-2.5 py-1.5 text-xs font-medium text-pink-600 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 dark:hover:bg-pink-900/60 border border-pink-200/80 dark:border-pink-800 rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <span className="text-sm">🎹</span>
              <span className="hidden sm:inline">Piyano VR</span>
            </a>

            {user && (
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                {/* Notification Center */}
              <NotificationCenter user={user} />

              {/* Theme Toggle Button */}
              <button
                onClick={handleToggleTheme}
                title={theme === 'dark' ? "Aydınlık Mod" : "Karanlık Mod"}
                className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition flex items-center justify-center border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-zinc-600" />
                )}
              </button>

              {/* User Profile Badge */}
              <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-full py-1 px-1.5 sm:px-3">
                <div 
                  className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-medium text-xs shrink-0" 
                  title={user.full_name}
                >
                  {user.role === 'teacher' ? (
                    isMaster ? <Crown className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600" /> : <ShieldCheck className="w-3.5 h-3.5" />
                  ) : (
                    <GraduationCap className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight flex items-center gap-1.5 truncate max-w-[130px]">
                    {user.full_name}
                    {isMaster && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded font-medium">
                        Master
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight truncate max-w-[130px]">
                    {user.role === 'teacher' ? (isMaster ? 'Master Öğretmen' : 'Öğretmen') : `Öğrenci • No: ${user.student_number || user.username}`}
                  </span>
                </div>
              </div>

              {/* Password Change Button */}
              <button
                onClick={() => setShowPasswordModal(true)}
                title="Şifre Değiştir"
                className="p-2 sm:px-2.5 sm:py-1.5 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition flex items-center gap-1.5 text-xs font-medium"
              >
                <KeyRound className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span className="hidden sm:inline">Şifre Değiştir</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Çıkış Yap"
                className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
}
