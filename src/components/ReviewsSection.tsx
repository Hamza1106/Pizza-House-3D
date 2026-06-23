import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Review {
  name: string;
  text: string;
  rating: number;
  initials: string;
}

const reviews: Review[] = [
  { name: 'Ahmed Raza', text: 'The Supreme Pizza with extra mayo is unreal. Best in Sukkur, hands down. The cheese pull is legendary.', rating: 5, initials: 'AR' },
  { name: 'Sana Malik', text: 'We love the drive-through. Quick, hot, and always fresh. The BBQ pizza is my family favorite.', rating: 4, initials: 'SM' },
  { name: 'Bilal Shaikh', text: 'Chicken wings are crispy perfection. Russian salad balances it all out. Great spot on Military Road.', rating: 5, initials: 'BS' },
  { name: 'Fatima Khan', text: 'No-contact delivery was seamless. The Chicken Mallai Pizza arrived hot and creamy. Will order again.', rating: 4, initials: 'FK' },
  { name: 'Usman Memon', text: 'Dine-in experience felt premium. The garlic bread alone is worth the visit. Highly recommend.', rating: 5, initials: 'UM' },
  { name: 'Hira Abro', text: 'Burgers are stacked tall and grilled right. Ice cream to finish made it a perfect family night.', rating: 4, initials: 'HA' },
];

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      className="glass group relative h-full overflow-hidden rounded-3xl p-7 transition-all duration-500 hover:border-amber/30"
      initial={{ opacity: 0, y: 60, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, scale: 1.02 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-ember/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <Quote className="mb-4 h-8 w-8 text-ember/40" />

      <div className="mb-4 flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber text-amber' : 'fill-white/10 text-white/10'}`}
          />
        ))}
      </div>

      <p className="mb-6 font-sans text-sm leading-relaxed text-white/70">"{review.text}"</p>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-ember to-amber font-display text-sm font-bold text-cream">
          {review.initials}
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-cream">{review.name}</p>
          <p className="font-sans text-[10px] uppercase tracking-wider text-white/40">Verified Customer</p>
        </div>
      </div>
    </motion.div>
  );
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="relative w-full overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute right-0 top-1/4 h-[40vmin] w-[40vmin] rounded-full bg-amber/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.4em] text-amber">Loved by Sukkur</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-cream sm:text-6xl">
            What They <span className="text-gradient-ember">Say</span>
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <Star key={i} className="h-5 w-5 fill-amber text-amber" />
              ))}
              <Star className="h-5 w-5 fill-amber/50 text-amber" />
            </div>
            <span className="font-display text-2xl font-bold text-cream">4.1</span>
            <span className="font-sans text-sm text-white/50">· 1940+ reviews</span>
          </div>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <ReviewCard key={r.name} review={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
