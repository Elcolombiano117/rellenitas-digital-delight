-- Manual migration to allow guest orders by using an order_token
-- Run this SQL in your Supabase SQL editor (or include in your migration pipeline).
-- This is intentionally idempotent (uses IF NOT EXISTS / DROP IF EXISTS) so it can be applied safely.

-- 1) Add order_token column if not exists
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_token text;

-- 2) Create index for order_token (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_orders_order_token ON public.orders (order_token);

-- 3) Ensure RLS is enabled on the orders table (this file assumes RLS is enabled already)
-- If RLS is disabled and you rely on it elsewhere, skip this step.
-- ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4) Drop prior policies we will replace (safe to run)
DROP POLICY IF EXISTS allow_authenticated_insert ON public.orders;
DROP POLICY IF EXISTS allow_guest_insert_with_token ON public.orders;
DROP POLICY IF EXISTS select_by_order_token ON public.orders;

-- 5) Allow authenticated users to INSERT/SELECT/UPDATE as before (adjust role checks to your schema)
-- Replace the USING/WITH CHECK expressions below with your project's logic if different.
CREATE POLICY allow_authenticated_insert
  ON public.orders
  FOR INSERT
  TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL OR order_token IS NOT NULL);

-- 6) Allow INSERT for guests only when order_token provided and user_id is NULL
-- The client must set the order_token column on INSERT (a random token, >=8 chars)
CREATE POLICY allow_guest_insert_with_token
  ON public.orders
  FOR INSERT
  TO public
  USING (
    user_id IS NULL
  )
  WITH CHECK (
    user_id IS NULL
    AND order_token IS NOT NULL
    AND char_length(order_token) >= 8
  );

-- 7) Allow SELECT for guests only when they provide the same token via request header
-- Note: Supabase passes request headers into current_setting('request.header.<name>', true)
-- Example client usage: set header 'x-order-token' to the token value when requesting /orders?select=*
CREATE POLICY select_by_order_token
  ON public.orders
  FOR SELECT
  TO public
  USING (
    (
      -- authenticated users can select their own orders
      auth.uid() IS NOT NULL AND user_id = auth.uid()
    )
    OR (
      -- or when the client provides a matching x-order-token header
      order_token IS NOT NULL
      AND order_token = current_setting('request.header.x-order-token', true)
    )
  );

-- 8) Allow update/select for authenticated users (basic policy)
CREATE POLICY allow_authenticated_modify
  ON public.orders
  FOR UPDATE
  TO public
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- NOTE for frontend integration:
-- - To create an order as guest: generate a random token (>=8 chars) in the client,
--   include it in the row inserted as `order_token`, and leave `user_id` = NULL.
-- - To read the order as guest: send the header `x-order-token: <TOKEN>` with the request.
-- - For higher security, prefer creating orders from a server-side endpoint (Edge Function)
--   that uses a service_role key to insert rows; the migration above is a convenient alternative
--   but exposes the ability for anyone to create orders if they know the token generation scheme.

-- End of migration
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
