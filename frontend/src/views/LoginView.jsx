import React, { useState } from 'react';
import { Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header Branding */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center p-2 mb-4 shadow-sm">
            <Logo className="w-10 h-10" showText={false} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            Torbalı Piri Reis MTAL
          </h1>
          <p className="text-zinc-500 font-normal text-xs mt-1">
            Bilişim Teknolojileri Ödev ve Takip Portalı
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-7 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-zinc-900">Giriş Yap</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Hesap bilgileriniz ile oturum açın
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınız"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Oturum Aç</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-zinc-400 mt-6">
          Torbalı Piri Reis MTAL © {new Date().getFullYear()} Bilişim Teknolojileri
        </p>
      </div>
    </div>
  );
}
