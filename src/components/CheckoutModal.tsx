import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, Phone, MapPin, ShieldCheck, ArrowRight, ArrowLeft, Landmark, Banknote, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../data/menu';

type PaymentMethod = 'bank' | 'cod';
type Step = 'details' | 'verify' | 'payment' | 'processing' | 'success';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderResult {
  orderNumber: string;
  estimatedMinutes: number;
  email: string;
  name: string;
  paymentMethod: PaymentMethod;
  total: number;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { lines, subtotal, clear } = useCart();

  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [sentOtp, setSentOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((p) => p - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // reset when closed
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep('details');
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setOtp(['', '', '', '']);
        setSentOtp('');
        setOtpError('');
        setPayment(null);
        setOrder(null);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const detailsValid = name.trim() && email.trim() && phone.trim() && address.trim();

  const sendOtp = () => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setSentOtp(code);
    setResendTimer(30);
    setStep('verify');
    // In a real app this would be sent via backend email service.
    // For this front-end demo we surface it as a hint.
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setOtpError('');
    if (val && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const entered = otp.join('');
    if (entered === sentOtp) {
      setStep('payment');
    } else {
      setOtpError('Incorrect code. Please try again.');
    }
  };

  const placeOrder = () => {
    if (!payment) return;
    setStep('processing');
    setTimeout(() => {
      const orderNumber = 'PT-' + Math.floor(100000 + Math.random() * 900000);
      const estimatedMinutes = 35 + Math.floor(Math.random() * 20);
      setOrder({
        orderNumber,
        estimatedMinutes,
        email,
        name,
        paymentMethod: payment,
        total,
      });
      setStep('success');
      clear();
    }, 2600);
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-11 font-sans text-sm text-cream placeholder-white/30 outline-none transition-colors focus:border-amber/50 focus:bg-white/[0.07]';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-coal/95 backdrop-blur-2xl"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ember/20 blur-3xl" />

              {/* close */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-ember/40 hover:text-ember"
                aria-label="Close checkout"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="max-h-[88vh] overflow-y-auto no-scrollbar">
                {/* === STEP: DETAILS === */}
                {step === 'details' && (
                  <div className="p-7">
                    <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.3em] text-amber">Step 1 of 3</p>
                    <h3 className="mb-1 font-display text-2xl font-bold text-cream">Delivery Details</h3>
                    <p className="mb-6 font-sans text-sm text-white/40">Where should we bring your feast?</p>

                    <div className="space-y-3">
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                          className={inputClass}
                          placeholder="Full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                          className={inputClass}
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                          className={inputClass}
                          placeholder="Phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-4 h-4 w-4 text-white/30" />
                        <textarea
                          className={inputClass + ' min-h-[80px] resize-none pt-3'}
                          placeholder="Delivery address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      disabled={!detailsValid}
                      onClick={sendOtp}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ember to-amber px-6 py-3.5 font-sans text-sm font-bold text-cream shadow-[0_8px_30px_-8px_rgba(255,77,0,0.6)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                    >
                      Continue to Verification
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* === STEP: VERIFY === */}
                {step === 'verify' && (
                  <div className="p-7">
                    <button
                      onClick={() => setStep('details')}
                      className="mb-4 flex items-center gap-1 font-sans text-xs text-white/40 transition-colors hover:text-amber"
                    >
                      <ArrowLeft className="h-3 w-3" /> Back
                    </button>
                    <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.3em] text-amber">Step 2 of 3</p>
                    <h3 className="mb-1 font-display text-2xl font-bold text-cream">Verify Your Email</h3>
                    <p className="mb-6 font-sans text-sm text-white/40">
                      We sent a 4-digit code to <span className="text-cream">{email}</span>
                    </p>

                    {/* demo hint banner */}
                    <div className="mb-5 rounded-xl border border-amber/20 bg-amber/10 px-4 py-2.5">
                      <p className="font-sans text-xs text-amber">
                        Demo mode: your code is <span className="font-bold tracking-widest">{sentOtp}</span>
                      </p>
                    </div>

                    <div className="mb-4 flex justify-center gap-3">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          className="h-16 w-14 rounded-xl border border-white/15 bg-white/5 text-center font-display text-2xl font-bold text-cream outline-none transition-colors focus:border-amber/60 focus:bg-white/10"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKey(i, e)}
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>

                    {otpError && <p className="mb-3 text-center font-sans text-xs text-ember">{otpError}</p>}

                    <div className="mb-6 text-center">
                      {resendTimer > 0 ? (
                        <p className="font-sans text-xs text-white/40">Resend code in {resendTimer}s</p>
                      ) : (
                        <button
                          onClick={sendOtp}
                          className="font-sans text-xs text-amber transition-colors hover:text-ember"
                        >
                          Resend code
                        </button>
                      )}
                    </div>

                    <button
                      disabled={otp.join('').length !== 4}
                      onClick={verifyOtp}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ember to-amber px-6 py-3.5 font-sans text-sm font-bold text-cream shadow-[0_8px_30px_-8px_rgba(255,77,0,0.6)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Verify & Continue
                    </button>
                  </div>
                )}

                {/* === STEP: PAYMENT === */}
                {step === 'payment' && (
                  <div className="p-7">
                    <button
                      onClick={() => setStep('verify')}
                      className="mb-4 flex items-center gap-1 font-sans text-xs text-white/40 transition-colors hover:text-amber"
                    >
                      <ArrowLeft className="h-3 w-3" /> Back
                    </button>
                    <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.3em] text-amber">Step 3 of 3</p>
                    <h3 className="mb-1 font-display text-2xl font-bold text-cream">Payment Method</h3>
                    <p className="mb-6 font-sans text-sm text-white/40">Choose how you'd like to pay</p>

                    <div className="mb-6 space-y-3">
                      <button
                        onClick={() => setPayment('bank')}
                        className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                          payment === 'bank'
                            ? 'border-amber/50 bg-amber/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${payment === 'bank' ? 'bg-amber/20' : 'bg-white/5'}`}>
                          <Landmark className={`h-6 w-6 ${payment === 'bank' ? 'text-amber' : 'text-white/50'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-display text-sm font-semibold text-cream">Bank Transfer</p>
                          <p className="font-sans text-xs text-white/40">Pay via bank deposit / online transfer</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 ${payment === 'bank' ? 'border-amber bg-amber' : 'border-white/20'}`}>
                          {payment === 'bank' && <div className="h-full w-full rounded-full bg-cream" />}
                        </div>
                      </button>

                      <button
                        onClick={() => setPayment('cod')}
                        className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                          payment === 'cod'
                            ? 'border-amber/50 bg-amber/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${payment === 'cod' ? 'bg-amber/20' : 'bg-white/5'}`}>
                          <Banknote className={`h-6 w-6 ${payment === 'cod' ? 'text-amber' : 'text-white/50'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-display text-sm font-semibold text-cream">Cash on Delivery</p>
                          <p className="font-sans text-xs text-white/40">Pay with cash when your order arrives</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 ${payment === 'cod' ? 'border-amber bg-amber' : 'border-white/20'}`}>
                          {payment === 'cod' && <div className="h-full w-full rounded-full bg-cream" />}
                        </div>
                      </button>
                    </div>

                    {/* bank details */}
                    {payment === 'bank' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <p className="mb-3 font-sans text-[10px] uppercase tracking-wider text-amber">Bank Details</p>
                        <div className="space-y-1.5 font-sans text-xs text-white/60">
                          <p>Bank: <span className="text-cream">Habib Bank Limited (HBL)</span></p>
                          <p>Account: <span className="text-cream">Pizza Town Sukkur</span></p>
                          <p>Account #: <span className="text-cream">0012-3456789-001</span></p>
                          <p>IBAN: <span className="text-cream">PK36 HABB 0000 1234 5678 9001</span></p>
                        </div>
                        <p className="mt-3 font-sans text-[10px] text-white/30">
                          Please transfer the total amount and keep your receipt. Your order will be confirmed once payment is verified.
                        </p>
                      </motion.div>
                    )}

                    {/* order summary */}
                    <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="mb-3 font-sans text-[10px] uppercase tracking-wider text-white/40">Order Summary</p>
                      <div className="space-y-1.5">
                        {lines.map((l) => (
                          <div key={l.item.id} className="flex justify-between font-sans text-xs text-white/60">
                            <span>{l.item.emoji} {l.item.name} × {l.qty}</span>
                            <span>{formatPKR(l.item.price * l.qty)}</span>
                          </div>
                        ))}
                        <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-sans text-xs text-white/50">
                          <span>Delivery</span>
                          <span>{formatPKR(deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between font-display text-base font-bold text-cream">
                          <span>Total</span>
                          <span className="text-gradient-ember">{formatPKR(total)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={!payment}
                      onClick={placeOrder}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ember to-amber px-6 py-3.5 font-sans text-sm font-bold text-cream shadow-[0_8px_30px_-8px_rgba(255,77,0,0.6)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                    >
                      Place Order · {formatPKR(total)}
                    </button>
                  </div>
                )}

                {/* === STEP: PROCESSING === */}
                {step === 'processing' && (
                  <div className="flex flex-col items-center justify-center px-7 py-20 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="h-12 w-12 text-amber" />
                    </motion.div>
                    <h3 className="mt-6 font-display text-xl font-bold text-cream">Placing your order…</h3>
                    <p className="mt-2 font-sans text-sm text-white/40">Confirming details and firing up the oven</p>
                  </div>
                )}

                {/* === STEP: SUCCESS === */}
                {step === 'success' && order && (
                  <div className="flex flex-col items-center px-7 py-10 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                      className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-ember to-amber"
                    >
                      <CheckCircle2 className="h-10 w-10 text-cream" />
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="font-display text-2xl font-bold text-cream"
                    >
                      Order Confirmed!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-2 font-sans text-sm text-white/50"
                    >
                      Thank you, {order.name.split(' ')[0]}! Your delicious order is being prepared.
                    </motion.p>

                    {/* order details card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="font-sans text-[10px] uppercase tracking-wider text-white/40">Order Number</span>
                        <span className="font-display text-lg font-bold text-gradient-ember">{order.orderNumber}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-white/10 py-3">
                        <span className="font-sans text-[10px] uppercase tracking-wider text-white/40">Estimated Time</span>
                        <span className="font-display text-base font-semibold text-cream">{order.estimatedMinutes} min</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-white/10 py-3">
                        <span className="font-sans text-[10px] uppercase tracking-wider text-white/40">Payment</span>
                        <span className="font-sans text-sm text-cream">
                          {order.paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash on Delivery'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-3">
                        <span className="font-sans text-[10px] uppercase tracking-wider text-white/40">Total</span>
                        <span className="font-display text-base font-bold text-cream">{formatPKR(order.total)}</span>
                      </div>
                    </motion.div>

                    {/* email confirmation note */}
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber/20 bg-amber/10 px-4 py-2.5">
                      <Mail className="h-4 w-4 text-amber" />
                      <p className="font-sans text-xs text-amber">
                        Confirmation sent to {order.email}
                      </p>
                    </div>

                    {/* estimated time progress bar */}
                    <div className="mt-6 w-full">
                      <div className="mb-2 flex justify-between font-sans text-[10px] uppercase tracking-wider text-white/40">
                        <span>Preparing</span>
                        <span>Out for delivery</span>
                        <span>Delivered</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-ember to-amber"
                          initial={{ width: '0%' }}
                          animate={{ width: '15%' }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="mt-8 w-full rounded-full border border-white/15 bg-white/5 px-6 py-3.5 font-sans text-sm font-semibold text-cream transition-colors hover:border-amber/40 hover:text-amber"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
