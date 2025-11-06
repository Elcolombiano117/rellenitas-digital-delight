import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Index from "./Index";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const HomeRedirect = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const checkRole = async () => {
      if (!user) {
        if (mounted) setIsAdmin(false);
        return;
      }

      try {
        // Check user_roles table for 'admin'
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .limit(1)
          .single();

        if (!error && data) {
          if (mounted) setIsAdmin(true);
        } else {
          if (mounted) setIsAdmin(false);
        }
      } catch (err) {
        if (mounted) setIsAdmin(false);
      }
    };

    checkRole();
    return () => { mounted = false; };
  }, [user]);

  if (loading) return null; // or a loader

  if (isAdmin === null) {
    // still checking; render nothing
    return null;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Index />;
};

export default HomeRedirect;
