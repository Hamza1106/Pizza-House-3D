import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const stages = ['Kneading dough', 'Spreading sauce', 'Melting cheese', 'Flying ingredients', 'Baking'];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 7 + 3;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => setDone(true), 600);
        setTimeout(onComplete, 1400);
      } else {
        setProgress(p);
        setStage(Math.min(stages.length - 1, Math.floor((p / 100) * stages.length)));
      }
    }, 130);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10001] flex flex-col items-center justify-center bg-coal"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* ambient glow */}
          <div className="absolute h-[40vmin] w-[40vmin] rounded-full bg-ember/30 blur-[120px] animate-pulse-glow" />

          {/* assembling pizza svg */}
          <div className="relative mb-10 h-40 w-40">
            <motion.svg
              viewBox="0 0 200 200"
              className="absolute inset-0 h-full w-full"
            >
              {/* base */}
              <motion.circle
                cx="100" cy="100" r="80"
                fill="#d9a066"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'backOut' }}
                style={{ transformOrigin: '100px 100px' }}
              />
              {/* crust */}
              <motion.circle
                cx="100" cy="100" r="80"
                fill="none" stroke="#b5743f" strokeWidth="14"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ ease: 'easeOut' }}
              />
              {/* sauce */}
              <motion.circle
                cx="100" cy="100" r="66"
                fill="#c1272d"
                initial={{ scale: 0 }}
                animate={{ scale: Math.min(1, progress / 40) }}
                style={{ transformOrigin: '100px 100px' }}
                transition={{ ease: 'backOut' }}
              />
              {/* cheese */}
              <motion.circle
                cx="100" cy="100" r="62"
                fill="#ffd45e"
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 40 ? Math.min(1, (progress - 40) / 30) : 0 }}
                transition={{ duration: 0.4 }}
              />
              {/* toppings */}
              {[
                { x: 78, y: 70, d: 55 },
                { x: 122, y: 78, d: 65 },
                { x: 88, y: 120, d: 70 },
                { x: 118, y: 118, d: 75 },
                { x: 100, y: 95, d: 80 },
                { x: 70, y: 100, d: 85 },
              ].map((t, i) => (
                <motion.circle
                  key={i}
                  cx={t.x} cy={t.y} r="6"
                  fill="#7a2d12"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: progress > t.d ? 1 : 0,
                    opacity: progress > t.d ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: 'backOut' }}
                  style={{ transformOrigin: `${t.x}px ${t.y}px` }}
                />
              ))}
            </motion.svg>
            {/* steam */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-2 h-10 w-1.5 -translate-x-1/2 rounded-full bg-white/40 blur-sm"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: progress > 80 ? [0, 0.6, 0] : 0, y: progress > 80 ? [0, -30, -50] : 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </div>

          <div className="font-display text-3xl font-bold tracking-tight text-cream sm:text-4xl">
            PIZZA <span className="text-gradient-ember">HOUSE</span>
          </div>
          <div className="mt-1 font-sans text-[11px] uppercase tracking-ultra text-white/40">
            Sukkur
          </div>

          {/* progress bar */}
          <div className="mt-8 h-px w-56 overflow-hidden bg-white/10 sm:w-72">
            <motion.div
              className="h-full bg-gradient-to-r from-ember to-amber"
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
          <div className="mt-3 flex w-56 items-center justify-between font-sans text-[10px] uppercase tracking-[0.2em] text-white/40 sm:w-72">
            <span>{stages[stage]}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
