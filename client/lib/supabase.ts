"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserSupabaseClient: SupabaseClient | null = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export class SupabaseUnavailableError extends Error {
  constructor() {
    super(
      "Can't reach the sign-in service right now. Check your internet connection and try again in a moment.",
    );
    this.name = "SupabaseUnavailableError";
  }
}

let reachability: Promise<boolean> | null = null;
let knownUnreachable = false;

/**
 * Probe Supabase once per page load, *before* the client is created.
 *
 * Creating the client immediately tries to refresh any stored session; if
 * Supabase can't be reached, supabase-js logs that failure with
 * console.error (shown as "Failed to fetch" in the Next.js dev overlay) and
 * keeps retrying. Probing first lets us skip creating the client entirely.
 *
 * Uses `no-cors` so only a genuine network/DNS failure counts as unreachable
 * (a CORS or HTTP error still proves the server is there). A slow response
 * (timeout) is treated as reachable rather than locking users out.
 */
export const checkSupabaseReachable = (): Promise<boolean> => {
  if (typeof window === "undefined" || !supabaseUrl) {
    return Promise.resolve(Boolean(supabaseUrl));
  }

  if (!reachability) {
    reachability = fetch(`${supabaseUrl}/auth/v1/health`, {
      mode: "no-cors",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })
      .then(() => true)
      .catch((error: unknown) => {
        const unreachable = error instanceof TypeError;
        if (unreachable) {
          knownUnreachable = true;
          console.warn(
            `EduEarth: can't reach Supabase at ${supabaseUrl}. Sign-in is disabled. ` +
              "Check your connection, and that the Supabase project exists and isn't paused.",
          );
        }
        return !unreachable;
      });
  }

  return reachability;
};

/** Get the client only after confirming Supabase is reachable. */
export const getReadySupabaseClient = async () => {
  if (!(await checkSupabaseReachable())) {
    throw new SupabaseUnavailableError();
  }
  return getSupabaseBrowserClient();
};

export const getSupabaseBrowserClient = () => {
  if (browserSupabaseClient) {
    return browserSupabaseClient;
  }

  if (!supabaseUrl || !publishableKey) {
    throw new Error(
      "Supabase auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  if (knownUnreachable) {
    throw new SupabaseUnavailableError();
  }

  browserSupabaseClient = createClient(supabaseUrl, publishableKey, {
    auth: {
      flowType: "pkce",
    },
  });

  return browserSupabaseClient;
};
