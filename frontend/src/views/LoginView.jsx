import React, { useState, useEffect } from 'react';
import { Lock, User, ArrowRight, AlertCircle, Sun, Moon } from 'lucide-react';
import Logo from '../components/Logo';
import { authService } from '../services/api';
import { toggleTheme, getTheme } from '../utils/theme';

export default function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!username || !password) {
      setError('Lütfen kullanıcı adı ve şifrenizi giriniz.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await authService.login(username, password);
      if (onLoginSuccess) onLoginSuccess(data.user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Giriş yapılamadı. Bilgilerinizi kontrol ediniz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex flex-col justify-center items-center px-4 py-12 relative transition-colors duration-200">
      {/* Theme Toggle Button (Top Right) */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleToggleTheme}
          title={theme === 'dark' ? "Aydınlık Mod" : "Karanlık Mod"}
          className="p-2.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm transition"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-600" />
          )}
        </button>
      </div>

      <div className="w-full max-w-sm">
        {/* Header Branding */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center p-2 mb-4 shadow-sm">
            <Logo className="w-10 h-10" showText={false} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-red-600 dark:text-red-500">
            Torbalı Piri Reis Ticaret MTAL
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-normal text-xs mt-1">
            Bilişim Teknolojileri Ödev ve Takip Portalı
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-7 shadow-sm transition-colors duration-200">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Giriş Yap</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Hesap bilgileriniz ile oturum açın
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınız"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white font-medium rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 dark:border-zinc-900/30 border-t-white dark:border-t-zinc-900 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
            © 2026 <span className="text-red-600 dark:text-red-500 font-semibold">Torbalı Piri Reis Ticaret MTAL</span> • Bilişim Alanı
          </p>
        </div>
      </div>
    </div>
  );
}
