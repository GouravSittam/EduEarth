"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Brain,
  Flame,
  Gamepad2,
  Grid,
  Home,
  Leaf,
  Loader2,
  Medal,
  School,
  Search,
  Star,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import JoinSchoolCard from "@/components/JoinSchoolCard";
import { leaderboardApi } from "@/lib/api";
import { modulesData, type ModuleData } from "@/lib/modulesData";
import { missionsData } from "@/lib/moduleExtras";
import type { LeaderboardEntry, StudentProfile } from "@/lib/types";

type Tab = "Overview" | "Modules" | "Leaderboard" | "Missions";

const TABS: Array<{ id: Tab; icon: LucideIcon }> = [
  { id: "Overview", icon: Home },
  { id: "Modules", icon: Grid },
  { id: "Leaderboard", icon: Trophy },
  { id: "Missions", icon: Target },
];

const pixelFont = { fontFamily: '"Press Start 2P", system-ui, sans-serif' };
const readableFont = {
  fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
};

const numberFormat = new Intl.NumberFormat("en-US");

/** YouTube embed URL → thumbnail URL. */
const thumbnailFor = (mod: ModuleData) => {
  const id = mod.videoUrl.split("/embed/")[1]?.split(/[?&]/)[0];
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "/forest.png";
};

/** Rotate recommendations daily so the dashboard feels alive. */
const dailyPicks = (count: number) => {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return Array.from(
    { length: Math.min(count, modulesData.length) },
    (_, i) => modulesData[(dayIndex * 3 + i) % modulesData.length]!,
  );
};

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const router = useRouter();
  const { user, authUser, isLoading, refreshUser } = useAuth();

  const normalizedRole =
    user?.role?.toUpperCase() ??
    (typeof authUser?.user_metadata?.role === "string"
      ? authUser.user_metadata.role.toUpperCase()
      : null);
  const isSignedIn = Boolean(user || authUser);
  const isTeacher = normalizedRole === "TEACHER";
  const student = user?.student ?? null;

  const displayName =
    user?.name ??
    (typeof authUser?.user_metadata?.full_name === "string"
      ? authUser.user_metadata.full_name
      : null) ??
    authUser?.email?.split("@")[0] ??
    "Eco Learner";
  const avatar =
    user?.avatar ??
    (typeof authUser?.user_metadata?.avatar_url === "string"
      ? authUser.user_metadata.avatar_url
      : null) ??
    "/avatar.png";

  useEffect(() => {
    if (isLoading) return;

    if (!isSignedIn) {
      router.replace("/auth-model");
      return;
    }

    if (isTeacher) {
      router.replace("/teacher-dashboard");
    }
  }, [isLoading, isSignedIn, isTeacher, router]);

  if (isLoading || !isSignedIn || isTeacher) {
    return <DashboardLoading />;
  }

  return (
    <div className="relative min-h-screen text-black">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/signimage.jpeg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(3,18,12,0.78),rgba(3,18,12,0.9))]" />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b-4 border-black bg-gradient-to-r from-green-400 via-emerald-400 to-sky-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 rounded-full border-[3px] border-black bg-yellow-300 px-3 py-2 text-[0.6rem] shadow-[0_3px_0_#000] transition hover:-translate-y-0.5"
            style={pixelFont}
          >
            <Leaf className="h-4 w-4" />
            <span className="hidden sm:inline">EduEarth</span>
          </Link>
          <h1 className="truncate text-[0.7rem] sm:text-sm" style={pixelFont}>
            Mission Control
          </h1>
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-[3px] border-black bg-white">
            <img
              src={avatar}
              alt={`${displayName}'s avatar`}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        {/* Navigation: horizontal tabs on mobile, sidebar on desktop */}
        <nav
          aria-label="Dashboard sections"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:sticky lg:top-24 lg:mx-0 lg:h-fit lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-visible lg:px-0"
        >
          {TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              aria-current={activeTab === id ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl border-[3px] border-black px-4 py-3 text-[0.6rem] shadow-[0_4px_0_#000] transition hover:-translate-y-0.5 ${
                activeTab === id ? "bg-yellow-300" : "bg-white/90"
              }`}
              style={pixelFont}
            >
              <Icon className="h-4 w-4" />
              {id}
            </button>
          ))}
        </nav>

        <main className="min-w-0 flex-1">
          {activeTab === "Overview" && (
            <OverviewTab
              displayName={displayName}
              student={student}
              onJoined={() => void refreshUser()}
              onOpenTab={setActiveTab}
            />
          )}
          {activeTab === "Modules" && <ModulesTab />}
          {activeTab === "Leaderboard" && <LeaderboardTab student={student} />}
          {activeTab === "Missions" && <MissionsTab />}
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared building blocks                                               */
/* ------------------------------------------------------------------ */

function DashboardLoading() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
      style={{
        backgroundImage: "url('/signimage.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div
        className="relative z-10 flex items-center gap-3 rounded-3xl border-4 border-black bg-yellow-300 p-6 text-sm text-black shadow-[0_10px_0_#000]"
        style={pixelFont}
      >
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading your dashboard...
      </div>
    </div>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[1.5rem] border-4 border-black bg-[#fffbea] p-5 shadow-[0_8px_0_#000] ${className}`}
    >
      {children}
    </section>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-[0.75rem] leading-6 sm:text-sm" style={pixelFont}>
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

function OverviewTab({
  displayName,
  student,
  onJoined,
  onOpenTab,
}: {
  displayName: string;
  student: StudentProfile | null;
  onJoined: () => void;
  onOpenTab: (tab: Tab) => void;
}) {
  const picks = useMemo(() => dailyPicks(3), []);

  return (
    <div className="space-y-6">
      <ProfileCard displayName={displayName} student={student} />

      {!student && <JoinSchoolCard onJoined={onJoined} />}

      {student && (
        <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <WeeklyActivity activityDays={student.activityDays ?? []} />
          <Panel>
            <PanelTitle>Your Stats</PanelTitle>
            <div className="grid grid-cols-2 gap-3" style={readableFont}>
              <StatTile icon={BookOpen} label="Lessons done" value={student._count.completedLessons} />
              <StatTile icon={Brain} label="Quiz attempts" value={student._count.quizAttempts} />
              <StatTile icon={School} label="Classes" value={student._count.classes} />
              <StatTile icon={Medal} label="Badges" value={student._count.badges} />
            </div>
          </Panel>
        </div>
      )}

      <Panel>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <PanelTitle>Today&apos;s Picks</PanelTitle>
          <button
            type="button"
            onClick={() => onOpenTab("Modules")}
            className="rounded-full border-2 border-black bg-white px-3 py-1.5 text-xs font-semibold shadow-[0_2px_0_#000]"
            style={readableFont}
          >
            All modules →
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {picks.map((mod) => (
            <ModuleCard key={mod.slug} mod={mod} />
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelTitle>Quick Play</PanelTitle>
        <div className="grid gap-3 sm:grid-cols-3" style={readableFont}>
          {[
            { href: "/games/eco-sprint", title: "Eco Sprint", text: "1v1 live eco quiz duel" },
            { href: "/games/recycle-rush", title: "Recycle Rush", text: "Sort waste at speed" },
            { href: "/games/eco-strike", title: "Eco Strike", text: "Defend the planet" },
          ].map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className="flex items-center gap-3 rounded-2xl border-[3px] border-black bg-gradient-to-br from-sky-200 to-emerald-200 p-4 shadow-[0_4px_0_#000] transition hover:-translate-y-0.5"
            >
              <Gamepad2 className="h-6 w-6 shrink-0" />
              <span>
                <span className="block font-bold">{game.title}</span>
                <span className="block text-xs text-black/70">{game.text}</span>
              </span>
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ProfileCard({
  displayName,
  student,
}: {
  displayName: string;
  student: StudentProfile | null;
}) {
  const ecoPoints = student?.ecoPoints ?? 0;
  const level = student?.level ?? 1;
  const floor = student?.levelProgress?.currentLevelPoints ?? 0;
  const ceiling = student?.levelProgress?.nextLevelPoints ?? 50;
  const progress = Math.min(
    100,
    Math.max(0, ((ecoPoints - floor) / Math.max(1, ceiling - floor)) * 100),
  );

  return (
    <div className="overflow-hidden rounded-[1.75rem] border-4 border-black bg-gradient-to-br from-yellow-300 via-amber-300 to-orange-300 shadow-[0_10px_0_#000]">
      <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-[0.6rem] uppercase text-black/70" style={pixelFont}>
            Welcome back
          </p>
          <h2
            className="mt-2 truncate text-lg leading-8 sm:text-2xl"
            style={pixelFont}
          >
            {displayName}
          </h2>
          <p className="mt-2 text-sm text-black/75" style={readableFont}>
            {student?.institution?.name
              ? `Eco Ranger at ${student.institution.name}`
              : "Join your school to start earning eco-points"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3" style={readableFont}>
          <BigStat icon={Star} label="Eco-points" value={numberFormat.format(ecoPoints)} />
          <BigStat
            icon={Flame}
            label="Day streak"
            value={String(student?.streak ?? 0)}
            highlight={(student?.streak ?? 0) > 0}
          />
          <BigStat
            icon={Trophy}
            label="Global rank"
            value={student?.rank ? `#${student.rank}` : "—"}
          />
        </div>
      </div>

      <div className="border-t-4 border-black bg-black/90 px-5 py-4 text-yellow-200 sm:px-6">
        <div className="mb-2 flex items-center justify-between text-xs" style={readableFont}>
          <span className="font-bold text-yellow-300">Level {level}</span>
          <span>
            {numberFormat.format(Math.max(0, ceiling - ecoPoints))} pts to level {level + 1}
          </span>
        </div>
        <div
          className="h-4 overflow-hidden rounded-full border-2 border-yellow-300 bg-black"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label={`Progress to level ${level + 1}`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-300 to-yellow-300 transition-[width] duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function BigStat({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="min-w-[5.5rem] rounded-2xl border-[3px] border-black bg-white/90 px-3 py-3 text-center shadow-[0_4px_0_#000]">
      <Icon
        className={`mx-auto h-5 w-5 ${highlight ? "text-orange-500" : "text-black"}`}
      />
      <div className="mt-1 text-lg font-black">{value}</div>
      <div className="text-[0.65rem] uppercase tracking-wide text-black/60">
        {label}
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border-[3px] border-black bg-white p-3 shadow-[0_3px_0_#000]">
      <Icon className="h-5 w-5 text-emerald-700" />
      <div className="mt-2 text-2xl font-black">{numberFormat.format(value)}</div>
      <div className="text-xs text-black/60">{label}</div>
    </div>
  );
}

function WeeklyActivity({ activityDays }: { activityDays: string[] }) {
  const days = useMemo(() => {
    const active = new Set(activityDays);
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setUTCDate(today.getUTCDate() - (6 - index));
      const iso = date.toISOString().slice(0, 10);
      return {
        iso,
        label: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
        day: date.getUTCDate(),
        active: active.has(iso),
        isToday: index === 6,
      };
    });
  }, [activityDays]);

  const activeCount = days.filter((day) => day.active).length;

  return (
    <Panel>
      <PanelTitle>Last 7 Days</PanelTitle>
      <div className="grid grid-cols-7 gap-2" style={readableFont}>
        {days.map((day) => (
          <div
            key={day.iso}
            title={day.active ? "You learned something this day!" : "No activity"}
            className={`flex aspect-square flex-col items-center justify-center rounded-xl border-[3px] text-center ${
              day.active
                ? "border-black bg-green-400 shadow-[0_3px_0_#000]"
                : "border-black/20 bg-white"
            } ${day.isToday ? "ring-4 ring-yellow-400" : ""}`}
          >
            <span className="text-[0.6rem] uppercase text-black/60">{day.label}</span>
            <span className="text-sm font-black">{day.active ? "🌱" : day.day}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-black/70" style={readableFont}>
        {activeCount === 0
          ? "Complete a lesson or quiz today to start a streak!"
          : `Active on ${activeCount} of the last 7 days — keep it growing!`}
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Modules                                                             */
/* ------------------------------------------------------------------ */

function ModuleCard({ mod }: { mod: ModuleData }) {
  return (
    <Link
      href={`/modules/${mod.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border-[3px] border-black bg-white shadow-[0_5px_0_#000] transition hover:-translate-y-1 hover:shadow-[0_8px_0_#000]"
      style={readableFont}
    >
      <div className="relative aspect-video overflow-hidden border-b-[3px] border-black bg-emerald-200">
        <img
          src={thumbnailFor(mod)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full border-2 border-black bg-yellow-300 px-2 py-0.5 text-[0.65rem] font-bold">
          {mod.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold leading-snug">{mod.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-black/65">{mod.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-black/60">
          <span>
            {mod.duration} · {mod.chapters} chapters
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
            <Star className="h-3.5 w-3.5 fill-current" />
            {mod.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ModulesTab() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(modulesData.map((m) => m.category)))],
    [],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return modulesData.filter(
      (mod) =>
        (category === "All" || mod.category === category) &&
        (!term ||
          mod.title.toLowerCase().includes(term) ||
          mod.description.toLowerCase().includes(term)),
    );
  }, [category, query]);

  return (
    <Panel>
      <PanelTitle>Learning Modules</PanelTitle>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row" style={readableFont}>
        <label className="relative flex-1">
          <span className="sr-only">Search modules</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search modules…"
            className="w-full rounded-xl border-[3px] border-black bg-white py-2.5 pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-500/50"
          />
        </label>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              className={`shrink-0 rounded-full border-2 border-black px-3 py-1.5 text-xs font-semibold ${
                category === name ? "bg-yellow-300" : "bg-white"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-black/60" style={readableFont}>
          No modules match your search.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((mod) => (
            <ModuleCard key={mod.slug} mod={mod} />
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Leaderboard                                                          */
/* ------------------------------------------------------------------ */

function LeaderboardTab({ student }: { student: StudentProfile | null }) {
  const institutionId = student?.institution?.id;
  const [scope, setScope] = useState<"global" | "school">("global");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    setState("loading");
    leaderboardApi
      .get({
        limit: 25,
        ...(scope === "school" && institutionId ? { institutionId } : {}),
      })
      .then((response) => {
        if (!active) return;
        setEntries(response.data?.leaderboard ?? []);
        setState("ready");
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, [scope, institutionId]);

  const medal = (rank: number) =>
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <PanelTitle>Leaderboard</PanelTitle>
        {institutionId && (
          <div className="flex gap-2" style={readableFont}>
            {(["global", "school"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setScope(value)}
                className={`rounded-full border-2 border-black px-3 py-1.5 text-xs font-semibold ${
                  scope === value ? "bg-yellow-300" : "bg-white"
                }`}
              >
                {value === "global" ? "🌍 Global" : "🏫 My school"}
              </button>
            ))}
          </div>
        )}
      </div>

      {state === "loading" && (
        <p className="flex items-center gap-2 py-8 text-sm text-black/60" style={readableFont}>
          <Loader2 className="h-4 w-4 animate-spin" /> Loading rankings…
        </p>
      )}
      {state === "error" && (
        <p className="py-8 text-sm text-red-700" style={readableFont}>
          Couldn&apos;t load the leaderboard. Please try again later.
        </p>
      )}
      {state === "ready" && entries.length === 0 && (
        <p className="py-8 text-sm text-black/60" style={readableFont}>
          No eco-points earned yet — be the first on the board!
        </p>
      )}
      {state === "ready" && entries.length > 0 && (
        <ol className="space-y-2" style={readableFont}>
          {entries.map((entry) => {
            const isMe = entry.studentId === student?.id;
            return (
              <li
                key={entry.studentId}
                className={`flex items-center gap-3 rounded-xl border-2 border-black px-3 py-2 ${
                  isMe ? "bg-yellow-200 shadow-[0_3px_0_#000]" : "bg-white"
                }`}
              >
                <span className="w-10 text-center text-lg font-black">{medal(entry.rank)}</span>
                <img
                  src={entry.avatar || "/avatar.png"}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 rounded-full border-2 border-black object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {entry.name}
                    {isMe && <span className="ml-2 text-xs text-emerald-700">(you)</span>}
                  </p>
                  <p className="truncate text-xs text-black/60">
                    Level {entry.level}
                    {entry.institution ? ` · ${entry.institution.name}` : ""}
                  </p>
                </div>
                <span className="font-black">{numberFormat.format(entry.ecoPoints)}</span>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Missions                                                            */
/* ------------------------------------------------------------------ */

function MissionsTab() {
  const missions = useMemo(
    () =>
      Object.entries(missionsData).flatMap(([slug, list]) => {
        const mod = modulesData.find((m) => m.slug === slug);
        return list.map((mission) => ({
          ...(mission as { name: string; obj: string; reward: string }),
          slug,
          moduleTitle: mod?.title ?? slug,
        }));
      }),
    [],
  );

  return (
    <Panel>
      <PanelTitle>Real-World Missions</PanelTitle>
      <p className="mb-5 text-sm text-black/70" style={readableFont}>
        Take what you learn offline. Each mission belongs to a module — open it
        to learn the background first.
      </p>
      <div className="grid gap-3 md:grid-cols-2" style={readableFont}>
        {missions.map((mission) => (
          <Link
            key={`${mission.slug}-${mission.name}`}
            href={`/modules/${mission.slug}`}
            className="flex flex-col rounded-2xl border-[3px] border-black bg-white p-4 shadow-[0_4px_0_#000] transition hover:-translate-y-0.5"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {mission.moduleTitle}
            </span>
            <span className="mt-1 font-bold">{mission.name}</span>
            <span className="mt-1 text-sm text-black/70">{mission.obj}</span>
            <span className="mt-3 inline-flex w-fit rounded-full border-2 border-black bg-yellow-300 px-2 py-0.5 text-xs font-bold">
              {mission.reward}
            </span>
          </Link>
        ))}
      </div>
    </Panel>
  );
}
