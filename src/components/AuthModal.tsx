import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Loader2, Pizza } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = mode === 'login' ? await signIn(email, password) : await signUp(email, password);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setEmail('');
    setPassword('');
    onClose();
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-11 font-sans text-sm text-cream placeholder-white/30 outline-none transition-colors focus:border-amber/50 focus:bg-white/[0.07]';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[111] flex items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-coal/95 backdrop-blur-2xl"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ember/20 blur-3xl" />

              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-ember/40 hover:text-ember"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="p-7">
                {/* logo */}
                <div className="mb-6 flex flex-col items-center text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-ember to-amber text-2xl shadow-[0_8px_30px_-8px_rgba(255,77,0,0.5)]">
                    <Pizza className="h-7 w-7 text-cream" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-cream">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h3>
                  <p className="mt-1 font-sans text-sm text-white/40">
                    {mode === 'login' ? 'Sign in to start ordering' : 'Join Pizza Town to order online'}
                  </p>
                </div>

                {/* tab switcher */}
                <div className="mb-6 flex rounded-full border border-white/10 bg-white/5 p-1">
                  <button
                    onClick={() => { setMode('login'); setError(''); }}
                    className={`flex-1 rounded-full py-2 font-sans text-xs font-semibold transition-colors ${
                      mode === 'login' ? 'bg-ember text-cream' : 'text-white/40 hover:text-cream'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setMode('signup'); setError(''); }}
                    className={`flex-1 rounded-full py-2 font-sans text-xs font-semibold transition-colors ${
                      mode === 'signup' ? 'bg-ember text-cream' : 'text-white/40 hover:text-cream'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {mode === 'signup' && (
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input className={inputClass} placeholder="Full name (optional)" />
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <input
                      className={inputClass}
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <input
                      className={inputClass}
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  {error && (
                    <p className="rounded-xl border border-ember/20 bg-ember/10 px-4 py-2.5 font-sans text-xs text-ember">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ember to-amber px-6 py-3.5 font-sans text-sm font-bold text-cream shadow-[0_8px_30px_-8px_rgba(255,77,0,0.6)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      mode === 'login' ? 'Sign In' : 'Create Account'
                    )}
                  </button>
                </form>

                <p className="mt-5 text-center font-sans text-xs text-white/40">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button onClick={switchMode} className="font-semibold text-amber transition-colors hover:text-ember">
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
