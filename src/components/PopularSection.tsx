import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { showcaseItems, menuItems, formatPKR } from '../data/menu';
import { useCart } from '../context/CartContext';

export function PopularSection() {
  const [active, setActive] = useState(0);
  const { addItem } = useCart();

  const next = () => setActive((p) => (p + 1) % showcaseItems.length);
  const prev = () => setActive((p) => (p - 1 + showcaseItems.length) % showcaseItems.length);

  const activeShowcase = showcaseItems[active];
  const matchedItem = menuItems.find((m) => m.id === activeShowcase.id);

  return (
    <section id="popular" className="relative w-full overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.4em] text-amber">Fan Favorites</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-cream sm:text-6xl">
            Popular <span className="text-gradient-ember">Showcase</span>
          </h2>
        </motion.div>

        <div className="relative flex min-h-[460px] items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`glow-${active}`}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[50vmin] w-[50vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
              style={{ background: showcaseItems[active].glow, opacity: 0.25 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.25, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6 }}
            />
          </AnimatePresence>

          {[-1, 1].map((offset) => {
            const idx = (active + offset + showcaseItems.length) % showcaseItems.length;
            return (
              <button
                key={offset}
                onClick={offset > 0 ? next : prev}
                className="absolute hidden h-64 w-48 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all hover:border-amber/30 md:flex"
                style={{
                  [offset > 0 ? 'right' : 'left']: '8%',
                  opacity: 0.4,
                  transform: `scale(0.75) ${offset > 0 ? 'perspective(800px) rotateY(-15deg)' : 'perspective(800px) rotateY(15deg)'}`,
                }}
              >
                <span className="text-5xl opacity-60">{showcaseItems[idx].emoji}</span>
              </button>
            );
          })}

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="relative z-10 flex w-full max-w-md flex-col items-center rounded-[2rem] border border-white/10 bg-gradient-to-br p-10 text-center backdrop-blur-xl"
              style={{ backgroundImage: `linear-gradient(135deg, ${showcaseItems[active].glow}22, transparent)` }}
              initial={{ opacity: 0, scale: 0.85, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotateY: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-amber/60"
                  style={{ left: `${20 + i * 12}%`, top: `${10 + (i % 3) * 25}%` }}
                  animate={{ y: [0, -15, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}

              <motion.div
                className="mb-6 text-[7rem] leading-none"
                animate={{ y: [-4, -12, -4], rotate: [0, 4, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {activeShowcase.emoji}
              </motion.div>

              <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.3em] text-amber">{activeShowcase.tagline}</p>
              <h3 className="mb-3 font-display text-3xl font-bold text-cream">{activeShowcase.name}</h3>
              <p className="mb-5 font-sans text-sm leading-relaxed text-white/60">{activeShowcase.desc}</p>

              {matchedItem && (
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-bold text-gradient-ember">{formatPKR(matchedItem.price)}</span>
                  <button
                    onClick={() => addItem(matchedItem)}
                    className="flex items-center gap-1.5 rounded-full bg-ember px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-cream shadow-[0_4px_20px_-4px_rgba(255,77,0,0.5)] transition-transform hover:scale-105"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add to Cart
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-4">
            <button
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all hover:border-amber/40 hover:text-amber"
              aria-label="Previous item"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {showcaseItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? '32px' : '8px',
                    background: i === active ? showcaseItems[active].glow : 'rgba(255,255,255,0.2)',
                  }}
                  aria-label={`Go to item ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all hover:border-amber/40 hover:text-amber"
              aria-label="Next item"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
