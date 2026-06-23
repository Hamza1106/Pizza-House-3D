import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../data/menu';

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { lines, isOpen, closeCart, increment, decrement, removeItem, subtotal, count, clear } = useCart();

  const deliveryFee = subtotal > 0 ? 150 : 0;
  const total = subtotal + deliveryFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-coal/95 backdrop-blur-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ember/15 ring-1 ring-ember/20">
                  <ShoppingBag className="h-5 w-5 text-amber" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-cream">Your Cart</h3>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-white/40">{count} item{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-amber/40 hover:text-amber"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* lines */}
            <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="text-6xl opacity-30">🍕</div>
                  <p className="font-display text-lg font-semibold text-white/60">Your cart is empty</p>
                  <p className="font-sans text-sm text-white/30">Add some delicious items from the menu!</p>
                  <button
                    onClick={closeCart}
                    className="mt-2 rounded-full border border-amber/30 bg-amber/10 px-6 py-2.5 font-sans text-xs font-semibold text-amber transition-colors hover:bg-amber/20"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {lines.map((line) => (
                      <motion.div
                        key={line.item.id}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0 }}
                        className="glass flex items-center gap-3 rounded-2xl p-3"
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/5 text-3xl">
                          {line.item.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-sm font-semibold text-cream">{line.item.name}</p>
                          <p className="font-sans text-xs text-amber">{formatPKR(line.item.price)}</p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <button
                              onClick={() => decrement(line.item.id)}
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-amber/40 hover:text-amber"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center font-sans text-sm font-semibold text-cream">{line.qty}</span>
                            <button
                              onClick={() => increment(line.item.id)}
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-amber/40 hover:text-amber"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-display text-sm font-bold text-cream">{formatPKR(line.item.price * line.qty)}</span>
                          <button
                            onClick={() => removeItem(line.item.id)}
                            className="text-white/30 transition-colors hover:text-ember"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* footer */}
            {lines.length > 0 && (
              <div className="border-t border-white/10 px-6 py-5">
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between font-sans text-sm text-white/50">
                    <span>Subtotal</span>
                    <span>{formatPKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm text-white/50">
                    <span>Delivery Fee</span>
                    <span>{formatPKR(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2 font-display text-lg font-bold text-cream">
                    <span>Total</span>
                    <span className="text-gradient-ember">{formatPKR(total)}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={clear}
                    className="rounded-full border border-white/15 px-4 py-3 font-sans text-xs font-medium text-white/50 transition-colors hover:border-ember/40 hover:text-ember"
                  >
                    Clear
                  </button>
                  <button
                    onClick={onCheckout}
                    className="flex-1 rounded-full bg-gradient-to-r from-ember to-amber px-6 py-3 font-sans text-sm font-bold text-cream shadow-[0_8px_30px_-8px_rgba(255,77,0,0.6)] transition-transform hover:scale-[1.02]"
                  >
                    Checkout · {formatPKR(total)}
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
