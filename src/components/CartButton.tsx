import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartButton() {
  const { count, openCart } = useCart();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.button
          onClick={openCart}
          className="fixed bottom-6 right-6 z-[80] flex items-center gap-3 rounded-full bg-gradient-to-r from-ember to-amber px-5 py-3.5 font-sans text-sm font-bold text-cream shadow-[0_8px_40px_-8px_rgba(255,77,0,0.7)]"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ type: 'spring', damping: 18, stiffness: 300 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open cart"
        >
          <ShoppingBag className="h-5 w-5" />
          <span>{count} item{count !== 1 ? 's' : ''}</span>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-coal/30 px-1.5 font-display text-xs font-bold">
            {count}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
