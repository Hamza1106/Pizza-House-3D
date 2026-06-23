import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { menuItems, formatPKR, type MenuItem } from '../data/menu';
import { useCart } from '../context/CartContext';

function TiltCard({ item, index }: { item: MenuItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCart();

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -12, y: px * 14 });
  };

  const reset = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className="perspective-1000"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={reset}
        className="preserve-3d group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-7 transition-all duration-300 hover:border-amber/30"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ember/20 blur-3xl transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        />

        <div className="preserve-3d mb-5" style={{ transform: 'translateZ(40px)' }}>
          <motion.div
            className="text-6xl"
            animate={{ y: hovered ? [-4, -12, -4] : 0, rotate: hovered ? [0, 6, -6, 0] : 0 }}
            transition={{ duration: 3, repeat: hovered ? Infinity : 0, ease: 'easeInOut' }}
          >
            {item.emoji}
          </motion.div>
        </div>

        <div className="preserve-3d mb-3 flex flex-wrap gap-2" style={{ transform: 'translateZ(30px)' }}>
          {item.tags.map((t) => (
            <span key={t} className="rounded-full border border-amber/30 bg-amber/10 px-2.5 py-0.5 font-sans text-[9px] uppercase tracking-wider text-amber">
              {t}
            </span>
          ))}
        </div>

        <h3 className="preserve-3d mb-2 font-display text-xl font-semibold text-cream" style={{ transform: 'translateZ(25px)' }}>
          {item.name}
        </h3>
        <p className="preserve-3d mb-5 font-sans text-sm leading-relaxed text-white/55" style={{ transform: 'translateZ(20px)' }}>
          {item.desc}
        </p>

        <div className="preserve-3d flex items-center justify-between" style={{ transform: 'translateZ(35px)' }}>
          <span className="font-display text-lg font-bold text-gradient-ember">{formatPKR(item.price)}</span>
          <button
            onClick={() => addItem(item)}
            className="flex items-center gap-1.5 rounded-full bg-ember px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-wider text-cream shadow-[0_4px_20px_-4px_rgba(255,77,0,0.5)] transition-transform hover:scale-105"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function MenuSection() {
  return (
    <section id="menu" className="relative w-full overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[40vmin] w-[60vmin] -translate-x-1/2 rounded-full bg-ember/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.4em] text-amber">The Menu</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-cream sm:text-6xl">
            Interactive <span className="text-gradient-ember">Showcase</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-sm text-white/50">
            Hover any card to tilt it in 3D. Tap Add to build your order.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, i) => (
            <TiltCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
