import { motion } from 'framer-motion';
import { MapPin, Clock, Car, Utensils, Bike, UtensilsCrossed } from 'lucide-react';

const services = [
  { icon: Utensils, title: 'Dine In', desc: 'Premium seating experience' },
  { icon: Car, title: 'Drive Through', desc: 'Quick pickup from your car' },
  { icon: Bike, title: 'No Contact Delivery', desc: 'Safe, hot, at your door' },
];

export function LocationSection() {
  return (
    <section id="location" className="relative w-full overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-[40vmin] w-[40vmin] -translate-y-1/2 rounded-full bg-ember/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.4em] text-amber">Find Us</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-cream sm:text-6xl">
            Visit <span className="text-gradient-ember">Pizza House</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* map */}
          <motion.div
            className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <iframe
              title="Pizza Town Sukkur Location"
              src="https://www.google.com/maps?q=Military+Road,+Basheerabad,+Sukkur,+Pakistan&output=embed"
              className="h-full w-full"
              style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg) contrast(0.9) saturate(0.7)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-amber/20" />
          </motion.div>

          {/* info */}
          <motion.div
            className="flex flex-col justify-center gap-6"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="glass rounded-3xl p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ember/15 ring-1 ring-ember/20">
                  <MapPin className="h-5 w-5 text-amber" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-white/40">Address</p>
                  <p className="font-display text-base font-semibold text-cream">Military Road, Basheerabad, Sukkur</p>
                </div>
              </div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ember/15 ring-1 ring-ember/20">
                  <UtensilsCrossed className="h-5 w-5 text-amber" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-white/40">Order Online</p>
                  <a href="#menu" className="font-display text-base font-semibold text-cream transition-colors hover:text-amber">
                    Browse our menu
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ember/15 ring-1 ring-ember/20">
                  <Clock className="h-5 w-5 text-amber" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-white/40">Hours</p>
                  <p className="font-display text-base font-semibold text-cream">Open Daily · 12 PM – 1 AM</p>
                </div>
              </div>
            </div>

            {/* services */}
            <div className="grid grid-cols-3 gap-3">
              {services.map((s, i) => (
                <motion.div
                  key={s.title}
                  className="glass flex flex-col items-center gap-2 rounded-2xl p-5 text-center transition-all hover:border-amber/30"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <s.icon className="mb-1 h-6 w-6 text-amber" />
                  <p className="font-display text-xs font-semibold text-cream">{s.title}</p>
                  <p className="font-sans text-[10px] leading-tight text-white/40">{s.desc}</p>
                </motion.div>
              ))}
            </div>

            <a
              href="#menu"
              className="magnetic-btn flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ember to-amber px-8 py-4 font-sans text-sm font-semibold text-cream shadow-[0_8px_40px_-8px_rgba(255,77,0,0.6)] transition-transform hover:scale-105"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Browse Menu
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
