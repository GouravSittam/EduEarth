"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, session, user, refreshUser } = useAuth();

  const errorMessage =
    searchParams.get("error_description") ?? searchParams.get("error");

  useEffect(() => {
    if (errorMessage) {
      return;
    }

    if (isLoading) {
      return;
    }

    if (session || user) {
      void refreshUser().finally(() => {
        router.replace("/home");
      });
      return;
    }

    router.replace("/auth-model?error=Unable to complete sign in. Please try again.");
  }, [errorMessage, isLoading, refreshUser, router, session, user]);

  return (
    <div className="min-h-screen bg-[#141219] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        {errorMessage ? (
          <>
            <h1 className="text-xl font-semibold text-red-300 mb-3">
              Sign In Failed
            </h1>
            <p className="text-sm text-zinc-300 mb-5">{errorMessage}</p>
            <Link
              href="/auth-model"
              className="inline-flex items-center justify-center rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-black"
            >
              Back To Auth
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-green-300 mb-3">
              Completing Sign In
            </h1>
            <p className="text-sm text-zinc-300">
              Hold on while we finish your Supabase sign-in and take you home.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#141219] text-white flex items-center justify-center px-4">
          <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <h1 className="text-xl font-semibold text-green-300 mb-3">
              Completing Sign In
            </h1>
            <p className="text-sm text-zinc-300">
              Hold on while we finish your Supabase sign-in.
            </p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
