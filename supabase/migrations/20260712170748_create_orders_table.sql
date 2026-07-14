/*
# Create orders table for Pizza Town online ordering

1. New Tables
- `orders`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to authenticated user, references auth.users with cascade delete)
  - `order_number` (text, unique, not null — human-readable order ID like PT-XXXXXX)
  - `items` (jsonb, not null — array of {id, name, price, qty} line items)
  - `subtotal` (integer, not null — sum of item prices in PKR)
  - `delivery_fee` (integer, not null — flat delivery fee in PKR)
  - `total` (integer, not null — subtotal + delivery_fee)
  - `customer_name` (text, not null)
  - `customer_email` (text, not null)
  - `customer_phone` (text, not null)
  - `delivery_address` (text, not null)
  - `payment_method` (text, not null — 'bank' or 'cod')
  - `estimated_minutes` (integer, not null — estimated delivery time)
  - `status` (text, not null, default 'preparing' — preparing/out_for_delivery/delivered)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `orders`.
- Owner-scoped CRUD: each authenticated user can only access their own orders.
- SELECT: users can read their own orders.
- INSERT: users can insert orders for themselves (user_id defaults to auth.uid()).
- UPDATE: users can update their own orders.
- DELETE: users can delete their own orders.

3. Indexes
- Index on `user_id` for efficient per-user queries.
- Index on `order_number` for lookups.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  items jsonb NOT NULL,
  subtotal integer NOT NULL,
  delivery_fee integer NOT NULL,
  total integer NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('bank', 'cod')),
  estimated_minutes integer NOT NULL,
  status text NOT NULL DEFAULT 'preparing' CHECK (status IN ('preparing', 'out_for_delivery', 'delivered')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_orders" ON orders;
CREATE POLICY "delete_own_orders" ON orders FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
