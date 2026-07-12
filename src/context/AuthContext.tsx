import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  sendVerificationCode: (email: string) => Promise<{ error: string | null }>;
  verifyCode: (email: string, code: string) => Promise<{ error: string | null }>;
  completeSignUp: (email: string, password: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Email send failed (${res.status})`);
  }
  return res.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Step 1: Generate a 6-digit code, store it in Supabase, and email it (to demo address).
  const sendVerificationCode = async (email: string): Promise<{ error: string | null }> => {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const { error: dbError } = await supabase.from('verification_codes').insert({
      email,
      code,
      expires_at: expiresAt,
      verified: false,
    });

    if (dbError) {
      return { error: 'Failed to generate verification code: ' + dbError.message };
    }

    try {
      await sendEmail({ type: 'verification', to: email, code });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to send verification email' };
    }
  };

  // Step 2: Verify the code the user entered.
  const verifyCode = async (email: string, code: string): Promise<{ error: string | null }> => {
    const { data, error } = await supabase
      .from('verification_codes')
      .select('id, code, expires_at, verified')
      .eq('email', email)
      .eq('code', code)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return { error: 'Verification failed: ' + error.message };
    }

    if (!data) {
      return { error: 'Invalid verification code. Please check and try again.' };
    }

    if (data.verified) {
      return { error: 'This code has already been used.' };
    }

    if (new Date(data.expires_at) < new Date()) {
      return { error: 'This code has expired. Please request a new one.' };
    }

    const { error: updateError } = await supabase
      .from('verification_codes')
      .update({ verified: true })
      .eq('id', data.id);

    if (updateError) {
      return { error: 'Failed to verify code: ' + updateError.message };
    }

    return { error: null };
  };

  // Step 3: After verification, create the actual Supabase auth account.
  const completeSignUp = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signOut,
        sendVerificationCode,
        verifyCode,
        completeSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
