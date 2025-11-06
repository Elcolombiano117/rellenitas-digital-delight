-- Migration: Allow guest orders and read-by-token (idempotent)
-- Date: 2025-11-06
-- IMPORTANT: You will run this manually in Supabase SQL editor.

-- 1) Add order_token column if not exists
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_token text;

-- 2) Create index for order_token (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_orders_order_token ON public.orders (order_token);

-- 3) Enable Row Level Security (RLS) on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4) Drop existing policies if present (avoid duplicates)
DROP POLICY IF EXISTS allow_authenticated_inserts ON public.orders;
DROP POLICY IF EXISTS allow_guest_inserts ON public.orders;
DROP POLICY IF EXISTS select_own_orders ON public.orders;
DROP POLICY IF EXISTS update_own_orders ON public.orders;
DROP POLICY IF EXISTS delete_own_orders ON public.orders;
DROP POLICY IF EXISTS select_by_order_token ON public.orders;

-- 5) Allow INSERT for authenticated users (user_id must equal auth.uid())
CREATE POLICY allow_authenticated_inserts
  ON public.orders
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- 6) Allow INSERT for guests only when order_token provided and user_id is NULL
--    This permits anonymous orders but requires a token to identify them.
CREATE POLICY allow_guest_inserts
  ON public.orders
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL
    AND user_id IS NULL
    AND order_token IS NOT NULL
    AND char_length(order_token) >= 8
  );

-- 7) SELECT: owners (user_id = auth.uid()) can read their orders
CREATE POLICY select_own_orders
  ON public.orders
  FOR SELECT
  USING ( user_id = auth.uid() );

-- 8) UPDATE: only owners can update their orders
CREATE POLICY update_own_orders
  ON public.orders
  FOR UPDATE
  USING ( user_id = auth.uid() )
  WITH CHECK ( user_id = auth.uid() );

-- 9) DELETE: only owners can delete their orders
CREATE POLICY delete_own_orders
  ON public.orders
  FOR DELETE
  USING ( user_id = auth.uid() );

-- 10) SELECT by token: allow read if the client provides the token in header 'x-order-token'
--     The client must set the header before the request. Example: 'x-order-token: <ORDER_TOKEN>'
CREATE POLICY select_by_order_token
  ON public.orders
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR (
      order_token IS NOT NULL
      AND order_token = current_setting('request.header.x-order-token', true)
    )
  );

-- End of migration
