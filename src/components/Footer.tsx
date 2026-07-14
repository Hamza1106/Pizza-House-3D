import { MapPin, Instagram, Facebook, UtensilsCrossed } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* brand */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-ember to-amber text-xl">
                🍕
              </div>  
              <div>
                <p className="font-display text-lg font-bold tracking-tight text-cream">PIZZA HOUSE</p>
                <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/40">Sukkur</p>
              </div>
            </div>
            <p className="max-w-sm font-sans text-sm leading-relaxed text-white/50">
              The real taste of Sukkur. Wood-fired pizzas, gourmet burgers, crispy wings and more —
              crafted fresh on Military Road, Basheerabad.
            </p>
            <p className="mt-4 font-display text-xl font-bold text-gradient-shimmer">
              "The Real Taste of Sukkur"
            </p>
          </div>

          {/* quick links */}
          <div>
            <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.25em] text-amber">Explore</p>
            <ul className="space-y-2.5">
              {[
                { label: 'About', href: '#about' },
                { label: 'Menu', href: '#menu' },
                { label: 'Popular', href: '#popular' },
                { label: 'Reviews', href: '#reviews' },
                { label: 'Visit Us', href: '#location' },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="font-sans text-sm text-white/50 transition-colors hover:text-amber">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.25em] text-amber">Contact</p>
            <ul className="space-y-3">
              <li>
                <a href="#menu" className="flex items-center gap-2 font-sans text-sm text-white/50 transition-colors hover:text-amber">
                  <UtensilsCrossed className="h-4 w-4" /> Browse our menu online
                </a>
              </li>
              <li className="flex items-start gap-2 font-sans text-sm text-white/50">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Military Road, Basheerabad, Sukkur, Pakistan
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:border-amber/40 hover:text-amber" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:border-amber/40 hover:text-amber" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="font-sans text-[11px] text-white/30">© {new Date().getFullYear()} Pizza Town Sukkur. All rights reserved.</p>
          <p className="font-sans text-[11px] text-white/30">Crafted with fire & passion.</p>
        </div>
      </div>
    </footer>
  );
}
