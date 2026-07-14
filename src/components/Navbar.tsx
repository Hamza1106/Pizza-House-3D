import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, LogIn, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Popular', href: '#popular' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Visit', href: '#location' },
];

interface NavbarProps {
  onAuthClick: () => void;
}

export function Navbar({ onAuthClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
          {/* logo */}
          <a href="#hero" className="flex items-center gap-2">  
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-ember to-amber text-lg">
              🍕
            </div>
            <div className="leading-none">
              <p className="font-display text-sm font-bold tracking-tight text-cream">PIZZA HOUSE</p>
              <p className="font-sans text-[8px] uppercase tracking-[0.3em] text-white/40">Sukkur</p>
            </div>
          </a>

          {/* desktop links */}
          <div className={`hidden items-center gap-1 rounded-full border border-white/10 px-2 py-1.5 backdrop-blur-xl transition-all duration-500 md:flex ${scrolled ? 'bg-coal/60' : 'bg-white/5'}`}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-1.5 font-sans text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-cream"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* auth button */}
          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ember/20">
                  <User className="h-3.5 w-3.5 text-amber" />
                </div>
                <span className="max-w-[120px] truncate font-sans text-xs text-cream">{user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="rounded-full border border-white/10 px-4 py-2 font-sans text-xs font-medium text-white/60 transition-colors hover:border-ember/40 hover:text-ember"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="hidden items-center gap-2 rounded-full bg-ember px-5 py-2.5 font-sans text-xs font-semibold text-cream shadow-[0_4px_20px_-4px_rgba(255,77,0,0.6)] transition-transform hover:scale-105 md:flex"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </button>
          )}

          {/* mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cream md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-coal/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl font-bold text-cream"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {l.label}
              </motion.a>
            ))}
            {user ? (
              <motion.div
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.08 }}
              >
                <span className="font-sans text-sm text-white/50">{user.email}</span>
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 font-sans text-sm font-semibold text-cream"
                >
                  Sign Out
                </button>
              </motion.div>
            ) : (
              <motion.button
                onClick={() => { setOpen(false); onAuthClick(); }}
                className="mt-4 flex items-center gap-2 rounded-full bg-ember px-8 py-4 font-sans text-sm font-semibold text-cream"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.08 }}
              >
                <LogIn className="h-4 w-4" /> Login
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
