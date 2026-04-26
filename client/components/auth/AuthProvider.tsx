"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { authApi } from "@/lib/api";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { User } from "@/lib/types";

type SignInInput = {
  email: string;
  password: string;
};

type SignUpInput = {
  email: string;
  password: string;
  fullName: string;
  role: string;
};

type MagicLinkInput = {
  email: string;
  fullName?: string;
  role?: string;
  shouldCreateUser: boolean;
};

type GoogleInput = {
  fullName?: string;
  role?: string;
};

type SignUpResult = {
  requiresEmailConfirmation: boolean;
};

type AuthContextValue = {
  user: User | null;
  authUser: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<SignUpResult>;
  sendMagicLink: (input: MagicLinkInput) => Promise<void>;
  signInWithGoogle: (input?: GoogleInput) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
};

type PendingProfileDraft = {
  fullName?: string;
  role?: string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_CALLBACK_PATH = "/auth/callback";
const PENDING_PROFILE_STORAGE_KEY = "eduearth-pending-profile";

const getAuthCallbackUrl = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return `${window.location.origin}${AUTH_CALLBACK_PATH}`;
};

const loadServerUser = async () => {
  const response = await authApi.getUser();
  return response.data?.user ?? null;
};

const savePendingProfileDraft = (draft?: GoogleInput) => {
  if (typeof window === "undefined") {
    return;
  }

  const nextDraft = {
    fullName: draft?.fullName?.trim() || undefined,
    role: draft?.role?.trim().toUpperCase() || undefined,
  };

  if (!nextDraft.fullName && !nextDraft.role) {
    window.sessionStorage.removeItem(PENDING_PROFILE_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(
    PENDING_PROFILE_STORAGE_KEY,
    JSON.stringify(nextDraft)
  );
};

const readPendingProfileDraft = (): PendingProfileDraft | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(PENDING_PROFILE_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as PendingProfileDraft;
  } catch {
    window.sessionStorage.removeItem(PENDING_PROFILE_STORAGE_KEY);
    return null;
  }
};

const clearPendingProfileDraft = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(PENDING_PROFILE_STORAGE_KEY);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let supabase;

    try {
      supabase = getSupabaseBrowserClient();
    } catch (error) {
      console.error("Supabase auth is not configured in the client", error);

      if (isMounted) {
        setIsLoading(false);
      }

      return () => {
        isMounted = false;
      };
    }

    const applyPendingProfileDraft = async (serverUser: User) => {
      const pendingProfileDraft = readPendingProfileDraft();

      if (!pendingProfileDraft) {
        return serverUser;
      }

      const updates: Record<string, unknown> = {};

      if (pendingProfileDraft.fullName && !serverUser.name) {
        updates.name = pendingProfileDraft.fullName;
      }

      if (pendingProfileDraft.role && serverUser.role === "USER") {
        updates.role = pendingProfileDraft.role;
      }

      if (Object.keys(updates).length === 0) {
        clearPendingProfileDraft();
        return serverUser;
      }

      try {
        const response = await authApi.updateUser(updates);
        clearPendingProfileDraft();
        return response.data?.user ?? serverUser;
      } catch (error) {
        console.error("Failed to apply pending auth profile", error);
        clearPendingProfileDraft();
        return serverUser;
      }
    };

    const syncFromSession = async (nextSession: Session | null) => {
      if (!isMounted) {
        return null;
      }

      setSession(nextSession);
      setAuthUser(nextSession?.user ?? null);

      if (!nextSession) {
        setUser(null);
        setIsLoading(false);
        return null;
      }

      try {
        const serverUser = await loadServerUser();
        const hydratedUser = serverUser
          ? await applyPendingProfileDraft(serverUser)
          : null;

        if (isMounted) {
          setUser(hydratedUser);
        }

        return hydratedUser;
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        await syncFromSession(initialSession);
      } catch (error) {
        console.error("Failed to initialize Supabase auth", error);

        if (isMounted) {
          setUser(null);
          setAuthUser(null);
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    void initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setIsLoading(true);
      void syncFromSession(nextSession).catch((error) => {
        console.error("Failed to sync authenticated user", error);

        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshUser = useCallback(async () => {
    if (!session) {
      setUser(null);
      return null;
    }

    setIsLoading(true);

    try {
      const serverUser = await loadServerUser();
      setUser(serverUser);
      return serverUser;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const signIn = useCallback(async ({ email, password }: SignInInput) => {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const signUp = useCallback(async ({
    email,
    password,
    fullName,
    role,
  }: SignUpInput): Promise<SignUpResult> => {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
        data: {
          full_name: fullName,
          role: role.toUpperCase(),
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      requiresEmailConfirmation: !data.session,
    };
  }, []);

  const sendMagicLink = useCallback(async ({
    email,
    fullName,
    role,
    shouldCreateUser,
  }: MagicLinkInput) => {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
        shouldCreateUser,
        data: shouldCreateUser
          ? {
              full_name: fullName?.trim() || undefined,
              role: role?.toUpperCase() || undefined,
            }
          : undefined,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const signInWithGoogle = useCallback(async (input?: GoogleInput) => {
    const supabase = getSupabaseBrowserClient();
    savePendingProfileDraft(input);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getAuthCallbackUrl(),
      },
    });

    if (error) {
      clearPendingProfileDraft();
      throw new Error(error.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    clearPendingProfileDraft();
    setUser(null);
    setAuthUser(null);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      authUser,
      session,
      isLoading,
      signIn,
      signUp,
      sendMagicLink,
      signInWithGoogle,
      signOut,
      refreshUser,
    }),
    [
      user,
      authUser,
      session,
      isLoading,
      signIn,
      signUp,
      sendMagicLink,
      signInWithGoogle,
      signOut,
      refreshUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
