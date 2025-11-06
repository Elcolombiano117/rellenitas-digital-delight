import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update local state immediately when possible
      const session = data?.session ?? null;
      const usr = session?.user ?? null;
      setSession(session as Session | null);
      setUser(usr as User | null);

      toast({
        title: "¡Bienvenido de nuevo!",
        description: "Has iniciado sesión exitosamente.",
      });

      // Return success so callers can redirect immediately if they want
      return true;
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Verifica tus credenciales e intenta de nuevo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;

      // If a session is returned (some Supabase flows may return session), set local state
      const session = data?.session ?? null;
      const usr = session?.user ?? null;
      setSession(session as Session | null);
      setUser(usr as User | null);

      toast({
        title: "¡Cuenta creada!",
        description: "Revisa tu correo para confirmar tu cuenta.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error al crear cuenta",
        description: error.message || "No se pudo crear la cuenta. Intenta de nuevo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const signOut = async () => {
    try {
      // Refresh current session from client to avoid calling signOut when there's no valid session
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      // If there's no active session or no refresh token, just clear local state and skip the network call.
      if (!currentSession || !currentSession.refresh_token) {
        setUser(null);
        setSession(null);
        toast({
          title: "Sesión cerrada",
          description: "No había sesión activa. Ya estás desconectado.",
        });
  navigate('/');
        return;
      }

      const { error } = await supabase.auth.signOut();
      // Supabase may respond with 400/403 when the refresh token is already invalid server-side.
      // Treat those cases as a successful sign-out from the client perspective.
      if (error) {
        const status = (error as any)?.status;
        const msg = (error as any)?.message || String(error);
        if (status === 400 || status === 403 || (typeof msg === 'string' && msg.toLowerCase().includes('auth session missing'))) {
          setUser(null);
          setSession(null);
          toast({
            title: "Sesión cerrada",
            description: "La sesión ya no era válida y fue cerrada.",
          });
          navigate('/');
          return;
        }
        throw error;
      }

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });

  navigate('/');
    } catch (error: any) {
      const msg = error?.message || String(error);
      // Treat known auth-missing or forbidden/invalid token errors as successful sign-out to avoid noisy errors
      const status = (error as any)?.status;
      if (status === 400 || status === 403 || (typeof msg === 'string' && msg.toLowerCase().includes('auth session missing'))) {
        setUser(null);
        setSession(null);
        toast({
          title: "Sesión cerrada",
          description: "La sesión ya no era válida y fue cerrada.",
        });
  navigate('/');
        return;
      }

      toast({
        title: "Error al cerrar sesión",
        description: msg,
        variant: "destructive",
      });
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
