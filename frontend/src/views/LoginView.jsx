import React, { useState } from 'react';
import { Lock, User, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';
import { authService } from '../services/api';

export default function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-3xl shadow-2xl mb-4 backdrop-blur-xl">
            <Logo className="w-20 h-20" showText={false} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
            Torbalı Piri Reis MTAL
          </h1>
          <p className="text-cyan-400 font-semibold text-sm mt-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Bilişim Teknolojileri Ödev ve Takip Portalı
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-100">Sisteme Giriş Yap</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Öğretmen veya öğrenci hesabınızla oturum açın.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-2.5 text-red-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınız"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
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
        <p className="text-center text-xs text-slate-500 mt-6">
          Torbalı Piri Reis MTAL © {new Date().getFullYear()} Bilişim Teknolojileri Alanı
        </p>
      </div>
    </div>
  );
}
