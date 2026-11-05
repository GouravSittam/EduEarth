"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { institutionsApi } from "@/lib/api";
import type { Institution } from "@/lib/types";

const pixelFont = { fontFamily: '"Press Start 2P", system-ui, sans-serif' };
const readableFont = {
  fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
};

/**
 * Lets a signed-in student or teacher find their school and join it, which
 * creates the profile that lessons, quizzes, classes and leaderboards use.
 */
export default function JoinSchoolCard({
  onJoined,
  audience = "student",
}: {
  onJoined: () => void;
  audience?: "student" | "teacher";
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Institution[]>([]);
  const [searching, setSearching] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    let active = true;
    setSearching(true);
    const timer = setTimeout(() => {
      institutionsApi
        .search(term)
        .then((response) => {
          if (active) setResults(response.data?.institutions ?? []);
        })
        .catch(() => {
          if (active) setResults([]);
        })
        .finally(() => {
          if (active) setSearching(false);
        });
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const join = async (institution: Institution) => {
    setError("");
    setJoiningId(institution.id);
    try {
      await institutionsApi.join(institution.id);
      onJoined();
    } catch (joinError) {
      setError(joinError instanceof Error ? joinError.message : "Could not join");
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <section className="rounded-[1.5rem] border-4 border-black bg-gradient-to-br from-green-200 to-emerald-100 p-5 shadow-[0_8px_0_#000]">
      <h2 className="mb-4 text-[0.75rem] leading-6 sm:text-sm" style={pixelFont}>
        Join Your School
      </h2>
      <p className="mb-4 text-sm leading-6 text-black/75" style={readableFont}>
        {audience === "teacher"
          ? "Link your account to your school to create classes and see how your students are doing."
          : "Link your account to your school to earn eco-points for lessons and quizzes, build streaks and climb the leaderboard."}
      </p>
      <label className="relative block">
        <span className="sr-only">Search for your school</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search your school by name or city…"
          className="w-full rounded-xl border-[3px] border-black bg-white py-3 pl-10 pr-4 text-sm shadow-[0_3px_0_#000] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-500/50"
          style={readableFont}
        />
      </label>

      <div className="mt-3 space-y-2" style={readableFont}>
        {searching && (
          <p className="flex items-center gap-2 text-sm text-black/60">
            <Loader2 className="h-4 w-4 animate-spin" /> Searching…
          </p>
        )}
        {!searching && query.trim().length >= 2 && results.length === 0 && (
          <p className="text-sm text-black/60">
            No schools found. Your school admin can register it with EduEarth.
          </p>
        )}
        {results.map((institution) => (
          <div
            key={institution.id}
            className="flex items-center justify-between gap-3 rounded-xl border-2 border-black bg-white px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold">{institution.name}</p>
              <p className="truncate text-xs capitalize text-black/60">
                {institution.type.toLowerCase()}
                {institution.address ? ` · ${institution.address}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void join(institution)}
              disabled={joiningId !== null}
              className="shrink-0 rounded-lg border-2 border-black bg-yellow-300 px-3 py-1.5 text-xs font-bold shadow-[0_2px_0_#000] disabled:opacity-60"
            >
              {joiningId === institution.id ? "Joining…" : "Join"}
            </button>
          </div>
        ))}
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      </div>
    </section>
  );
}
