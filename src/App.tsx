import { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { CartProvider } from './context/CartContext';
import { CustomCursor } from './components/CustomCursor';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { MenuSection } from './components/MenuSection';
import { PopularSection } from './components/PopularSection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CartButton } from './components/CartButton';
import { CheckoutModal } from './components/CheckoutModal';

function App() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  useLenis();

  return (
    <CartProvider>
      <LoadingScreen onComplete={() => undefined} />
      <CustomCursor />
      <div className="noise-overlay" />

      <div className="relative min-h-screen bg-coal text-cream">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <MenuSection />
          <PopularSection />
          <ReviewsSection />
          <LocationSection />
        </main>
        <Footer />
      </div>

      <CartButton />
      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </CartProvider>
  );
}

export default App;
