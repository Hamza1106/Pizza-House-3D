export interface MenuItem {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  price: number;
  tags: string[];
}

export const menuItems: MenuItem[] = [
  { id: 'supreme', name: 'Supreme Pizza', desc: 'Loaded with extra mayonnaise, pepperoni, peppers & a cheese pull that never quits.', emoji: '🍕', price: 1800, tags: ['Bestseller', 'Extra Mayo'] },
  { id: 'mallai', name: 'Chicken Mallai Pizza', desc: 'Creamy malai chicken on a golden crust — rich, mild, unforgettable.', emoji: '🍕', price: 1650, tags: ['Creamy'] },
  { id: 'cheese', name: 'Large Cheese Pizza', desc: 'The classic. Triple-blend cheese on our signature wood-fired base.', emoji: '🧀', price: 1400, tags: ['Classic'] },
  { id: 'bbq', name: 'BBQ Pizza', desc: 'Smoky BBQ chicken, onions & a drizzle of tangy BBQ sauce.', emoji: '🍖', price: 1700, tags: ['Smoky'] },
  { id: 'wings', name: 'Chicken Wings', desc: 'Eight wings tossed in our house spice blend. Crispy, juicy, addictive.', emoji: '🍗', price: 750, tags: ['Spicy'] },
  { id: 'burger', name: 'Gourmet Burger', desc: 'Flame-grilled patty, melted cheese, fresh veg — stacked tall.', emoji: '🍔', price: 650, tags: ['Grilled'] },
  { id: 'salad', name: 'Russian Salad', desc: 'Cool, creamy, crunchy — the perfect side to balance the heat.', emoji: '🥗', price: 450, tags: ['Fresh'] },
  { id: 'garlic', name: 'Garlic Bread', desc: 'Buttery, garlicky, herby — baked until golden and crisp.', emoji: '🥖', price: 400, tags: ['Side'] },
  { id: 'icecream', name: 'Ice Cream', desc: 'Creamy scoops to cool the heat and end the feast right.', emoji: '🍦', price: 250, tags: ['Dessert'] },
  { id: 'drinks', name: 'Chilled Drinks', desc: 'Ice-cold refreshments, the perfect pairing for every bite.', emoji: '🥤', price: 200, tags: ['Drinks'] },
];

export interface ShowcaseItem {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  desc: string;
  glow: string;
}

export const showcaseItems: ShowcaseItem[] = [
  { id: 'supreme', name: 'Supreme Pizza', tagline: 'The crown jewel', emoji: '🍕', desc: 'Extra mayonnaise, loaded toppings, legendary cheese pull.', glow: '#FF4D00' },
  { id: 'burger', name: 'Gourmet Burger', tagline: 'Stacked & grilled', emoji: '🍔', desc: 'Flame-grilled patty with layers of melted cheese and crisp lettuce.', glow: '#FFB100' },
  { id: 'wings', name: 'Chicken Wings', tagline: 'Spice storm', emoji: '🍗', desc: 'Crispy wings tossed in our signature house spice blend.', glow: '#FF4D00' },
  { id: 'icecream', name: 'Ice Cream', tagline: 'Cool finish', emoji: '🍦', desc: 'Creamy scoops to cool the heat and end the feast right.', glow: '#FFB100' },
  { id: 'drinks', name: 'Chilled Drinks', tagline: 'Bubbles & chill', emoji: '🥤', desc: 'Ice-cold refreshments, the perfect pairing for every bite.', glow: '#FF4D00' },
];

export function formatPKR(amount: number): string {
  return 'Rs. ' + amount.toLocaleString('en-PK');
}
