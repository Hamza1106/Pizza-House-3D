import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowDown, Star, UtensilsCrossed } from 'lucide-react';

const PizzaScene = lazy(() => import('./three/PizzaScene').then((m) => ({ default: m.PizzaScene })));

const taglineWords = ['The', 'Real', 'Taste', 'of', 'Sukkur'];

export function HeroSection() {
  return (
    <section id="hero" className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/20 blur-[140px] animate-pulse-glow" />
        <div className="absolute right-[10%] top-[20%] h-[30vmin] w-[30vmin] rounded-full bg-amber/10 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] h-[25vmin] w-[25vmin] rounded-full bg-ember/10 blur-[90px]" />
      </div>

      {/* radial vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,10,0.8)_100%)]" />

      {/* 3D pizza — full bleed */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <Suspense fallback={<div className="h-80 w-80 animate-pulse rounded-full bg-ember/10 blur-3xl" />}>
          <PizzaScene />
        </Suspense>
      </div>

      {/* top-left brand */}
      <motion.div
        className="absolute left-6 top-28 z-20 sm:left-12"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <p className="font-sans text-[10px] uppercase tracking-ultra text-white/50">Est. Sukkur</p>
        <p className="font-sans text-[10px] uppercase tracking-ultra text-white/30">Military Road</p>
      </motion.div>

      {/* top-right rating */}
      <motion.div
        className="absolute right-6 top-28 z-20 text-right sm:right-12"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <div className="mb-1 flex items-center justify-end gap-1">
          {[0, 1, 2, 3].map((i) => (
            <Star key={i} className="h-3 w-3 fill-amber text-amber" />
          ))}
          <Star className="h-3 w-3 fill-amber/50 text-amber" />
        </div>
        <p className="font-sans text-[10px] uppercase tracking-ultra text-white/50">4.1 · 1940+ Reviews</p>
      </motion.div>

      {/* center tagline */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[18%] z-20 flex flex-col items-center px-6 text-center">
        <motion.p
          className="mb-3 font-sans text-[11px] uppercase tracking-[0.4em] text-amber"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Pizza Town
        </motion.p>
        <h1 className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-display text-5xl font-bold leading-none tracking-tight text-cream sm:text-7xl md:text-8xl">
          {taglineWords.map((word, i) => (
            <motion.span
              key={word}
              className={i === 2 || i === 3 ? 'text-gradient-shimmer' : ''}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* CTA buttons */}
      <motion.div
        className="absolute inset-x-0 bottom-[8%] z-20 flex items-center justify-center gap-4 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.7 }}
      >
        <a
          href="#menu"
          className="magnetic-btn group flex items-center gap-2 rounded-full bg-ember px-6 py-3.5 font-sans text-sm font-semibold text-cream shadow-[0_8px_40px_-8px_rgba(255,77,0,0.6)] transition-transform hover:scale-105 sm:px-8"
        >
          <UtensilsCrossed className="h-4 w-4" />
          Browse Menu
        </a>
        <a
          href="#about"
          className="magnetic-btn group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 font-sans text-sm font-medium text-cream backdrop-blur-xl transition-colors hover:border-amber/40 sm:px-8"
        >
          <Play className="h-4 w-4 fill-cream" />
          Watch Experience
        </a>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <ArrowDown className="h-4 w-4 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
