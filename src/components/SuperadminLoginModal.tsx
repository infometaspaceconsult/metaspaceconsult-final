import React, { useState } from 'react';
import { Lock, X, KeyRound, User, AlertCircle } from 'lucide-react';

interface SuperadminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const SuperadminLoginModal: React.FC<SuperadminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.token);
        onClose();
      } else {
        setError(data.error || 'Invalid superadmin credentials.');
      }
    } catch (err) {
      // Fallback local check
      if (username === 'admin' && password === 'metaspace2026!') {
        onLoginSuccess('fallback_admin_token');
        onClose();
      } else {
        setError('Incorrect username or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#141B77] text-white rounded-xl mx-auto flex items-center justify-center shadow-md mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#141B77]">Superadmin Gateway</h3>
          <p className="text-xs text-slate-500 mt-1">
            Protected area regulated by username & password authentication.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Superadmin username"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#141B77]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Superadmin password"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#141B77]"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-[11px] text-slate-600">
            <span className="font-semibold block text-[#141B77]">Default Admin Credentials:</span>
            <span>Username: <b>admin</b> | Password: <b>metaspace2026!</b></span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#141B77] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-md"
          >
            {loading ? 'Authenticating...' : 'Access Superadmin Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};
