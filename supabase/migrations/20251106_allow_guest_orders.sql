-- 2025-11-06: Allow guest orders with order_token (idempotent)

-- 1) Add order_token column if not exists
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_token text;

-- 2) Index for token searches (optional)
CREATE INDEX IF NOT EXISTS idx_orders_order_token ON public.orders (order_token);

-- 3) Ensure RLS enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4) Drop possibly conflicting policies (if exist) to ensure idempotence
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'allow_authenticated_inserts'
  ) THEN
    EXECUTE 'DROP POLICY allow_authenticated_inserts ON public.orders';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'allow_guest_inserts'
  ) THEN
    EXECUTE 'DROP POLICY allow_guest_inserts ON public.orders';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'select_own_orders'
  ) THEN
    EXECUTE 'DROP POLICY select_own_orders ON public.orders';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'update_own_orders'
  ) THEN
    EXECUTE 'DROP POLICY update_own_orders ON public.orders';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'delete_own_orders'
  ) THEN
    EXECUTE 'DROP POLICY delete_own_orders ON public.orders';
  END IF;
END$$;

-- 5) Allow INSERT for authenticated users (user_id must equal auth.uid())
CREATE POLICY allow_authenticated_inserts
  ON public.orders
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- 6) Allow INSERT for guests: auth.uid() IS NULL, user_id IS NULL and order_token present
CREATE POLICY allow_guest_inserts
  ON public.orders
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL
    AND user_id IS NULL
    AND order_token IS NOT NULL
    AND char_length(order_token) >= 8
  );

-- 7) SELECT: only owners see their orders
CREATE POLICY select_own_orders
  ON public.orders
  FOR SELECT
  USING ( user_id = auth.uid() );

-- 8) UPDATE: only owners can update
CREATE POLICY update_own_orders
  ON public.orders
  FOR UPDATE
  USING ( user_id = auth.uid() )
  WITH CHECK ( user_id = auth.uid() );

-- 9) DELETE: only owners can delete
CREATE POLICY delete_own_orders
  ON public.orders
  FOR DELETE
  USING ( user_id = auth.uid() );
