import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Flame, Leaf, Award, MapPin } from 'lucide-react';

const stats = [
  { value: '4.1★', label: 'Rating' },
  { value: '1940+', label: 'Reviews' },
  { value: '100%', label: 'Fresh' },
  { value: '3', label: 'Ways to Enjoy' },
];

const pillars = [
  { icon: Flame, title: 'Wood-Fired Soul', text: 'Every pizza crafted with fire, patience, and the real taste of Sukkur.' },
  { icon: Leaf, title: 'Fresh Ingredients', text: 'Locally sourced produce, hand-prepared daily — never frozen, never compromised.' },
  { icon: Award, title: 'Loved by Thousands', text: '1940+ reviews and counting. A neighborhood institution on Military Road.' },
];

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="about" ref={ref} className="relative w-full overflow-hidden py-24 sm:py-32">
      {/* floating ingredient emojis */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { e: '🍅', x: '8%', y: '15%', d: 0, s: 'text-4xl' },
          { e: '🧀', x: '85%', y: '20%', d: 1, s: 'text-5xl' },
          { e: '🌿', x: '15%', y: '70%', d: 2, s: 'text-3xl' },
          { e: '🌶️', x: '78%', y: '75%', d: 1.5, s: 'text-4xl' },
          { e: '🫒', x: '50%', y: '10%', d: 0.5, s: 'text-3xl' },
        ].map((f, i) => (
          <motion.div
            key={i}
            className={`absolute ${f.s} opacity-20`}
            style={{ left: f.x, top: f.y }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, delay: f.d, ease: 'easeInOut' }}
          >
            {f.e}
          </motion.div>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* heading */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.4em] text-amber">Our Story</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-cream sm:text-6xl">
            About <span className="text-gradient-ember">Pizza Town</span>
          </h2>
        </motion.div>

        {/* narrative */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <motion.p
            className="font-sans text-lg leading-relaxed text-white/70 sm:text-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Born on <span className="text-amber">Military Road, Basheerabad</span>, Pizza Town Sukkur is where
            fire meets flavor. We don't just make pizza — we craft an experience that has earned the love of
            thousands. From the first stretch of cheese to the last bite of crust, every detail is a tribute
            to the real taste of Sukkur.
          </motion.p>
        </div>

        {/* pillars */}
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              className="glass group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:border-amber/30"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-ember/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
              <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-ember/20 to-amber/10 ring-1 ring-ember/20">
                <p.icon className="h-6 w-6 text-amber" />
              </div>
              <h3 className="mb-3 font-display text-xl font-semibold text-cream">{p.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-white/60">{p.text}</p>
            </motion.div>
          ))}
        </div>

        {/* stats strip */}
        <motion.div
          className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5 md:grid-cols-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="flex flex-col items-center justify-center bg-coal/40 px-6 py-10 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span className="font-display text-4xl font-bold text-gradient-ember sm:text-5xl">{s.value}</span>
              <span className="mt-2 font-sans text-[10px] uppercase tracking-[0.25em] text-white/40">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* location line */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-2 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <MapPin className="h-4 w-4 text-amber" />
          <p className="font-sans text-sm text-white/50">Military Road, Basheerabad, Sukkur, Pakistan</p>
        </motion.div>
      </div>
    </section>
  );
}
