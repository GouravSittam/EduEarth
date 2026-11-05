"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  Gamepad2,
  GraduationCap,
  Leaf,
  Loader2,
  Plus,
  School,
  Star,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import JoinSchoolCard from "@/components/JoinSchoolCard";
import { classesApi, institutionsApi } from "@/lib/api";
import type { ClassSummary, InstitutionStatistics } from "@/lib/types";

const pixelFont = { fontFamily: '"Press Start 2P", system-ui, sans-serif' };
const readableFont = {
  fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
};
const numberFormat = new Intl.NumberFormat("en-US");

const QUOTES = [
  "Every lesson plants the seed of change.",
  "The greatest threat to our planet is the belief that someone else will save it.",
  "We don't inherit the earth from our ancestors; we borrow it from our children.",
  "Small acts, multiplied by millions of people, can transform the world.",
];

export default function TeacherDashboard() {
  const router = useRouter();
  const { user, authUser, isLoading, refreshUser } = useAuth();

  const role =
    user?.role?.toUpperCase() ??
    (typeof authUser?.user_metadata?.role === "string"
      ? authUser.user_metadata.role.toUpperCase()
      : null);
  const isSignedIn = Boolean(user || authUser);
  const isTeacher = role === "TEACHER" || Boolean(user?.isAdmin);
  const teacher = user?.teacher ?? null;
  const institution = teacher?.institution ?? null;

  const displayName =
    user?.name ??
    (typeof authUser?.user_metadata?.full_name === "string"
      ? authUser.user_metadata.full_name
      : null) ??
    "Teacher";
  const avatar =
    user?.avatar ??
    (typeof authUser?.user_metadata?.avatar_url === "string"
      ? authUser.user_metadata.avatar_url
      : null) ??
    "/avatar.png";

  // Teachers only: everyone else goes to sign-in or the student dashboard.
  useEffect(() => {
    if (isLoading) return;
    if (!isSignedIn) {
      router.replace("/auth-model");
      return;
    }
    if (!isTeacher) {
      router.replace("/student-dashboard");
    }
  }, [isLoading, isSignedIn, isTeacher, router]);

  const [stats, setStats] = useState<InstitutionStatistics | null>(null);
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [dataState, setDataState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const loadSchoolData = useCallback(async (institutionId: string) => {
    setDataState("loading");
    try {
      const [statsResponse, classesResponse] = await Promise.all([
        institutionsApi.statistics(institutionId),
        institutionsApi.classes(institutionId),
      ]);
      setStats(statsResponse.data ?? null);
      setClasses(classesResponse.data?.classes ?? []);
      setDataState("ready");
    } catch {
      setDataState("error");
    }
  }, []);

  useEffect(() => {
    if (institution?.id) {
      void loadSchoolData(institution.id);
    }
  }, [institution?.id, loadSchoolData]);

  if (isLoading || !isSignedIn || !isTeacher) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b2f1d] px-4">
        <div
          className="flex items-center gap-3 rounded-3xl border-4 border-black bg-yellow-300 p-6 text-sm text-black shadow-[0_10px_0_#000]"
          style={pixelFont}
        >
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.18),transparent_35%),linear-gradient(180deg,#0b2f1d,#052e16)] text-black">
      <header className="sticky top-0 z-30 border-b-4 border-black bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400">
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
            Teacher HQ
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

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        {/* Welcome */}
        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[1.75rem] border-4 border-black bg-gradient-to-br from-yellow-300 via-amber-300 to-orange-300 p-6 shadow-[0_10px_0_#000]">
            <p className="text-[0.6rem] uppercase text-black/70" style={pixelFont}>
              Welcome back
            </p>
            <h2 className="mt-2 text-lg leading-8 sm:text-2xl" style={pixelFont}>
              {displayName}
            </h2>
            <p className="mt-3 text-sm text-black/75" style={readableFont}>
              {institution
                ? `Guiding eco-learners at ${institution.name}`
                : "Join your school to set up classes and track your students."}
            </p>
          </div>
          <div className="flex items-center rounded-[1.75rem] border-4 border-black bg-black p-6 text-yellow-200 shadow-[0_10px_0_#000]">
            <p className="text-sm italic leading-7" style={readableFont}>
              “{quote}”
            </p>
          </div>
        </section>

        {!institution && (
          <JoinSchoolCard audience="teacher" onJoined={() => void refreshUser()} />
        )}

        {institution && (
          <>
            {dataState === "loading" && (
              <p className="flex items-center gap-2 text-sm text-white/80" style={readableFont}>
                <Loader2 className="h-4 w-4 animate-spin" /> Loading school data…
              </p>
            )}
            {dataState === "error" && (
              <p className="text-sm text-red-300" style={readableFont}>
                Couldn&apos;t load your school data. Please refresh to try again.
              </p>
            )}

            {stats && (
              <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" style={readableFont}>
                <KpiCard icon={Users} label="Students" value={stats.overview.totalStudents} />
                <KpiCard icon={School} label="Classes" value={stats.overview.totalClasses} />
                <KpiCard icon={Star} label="Eco-points earned" value={stats.overview.totalEcoPoints} />
                <KpiCard
                  icon={GraduationCap}
                  label="Avg points / student"
                  value={stats.engagement.avgEcoPointsPerStudent}
                />
              </section>
            )}

            <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <ClassesPanel
                institutionId={institution.id}
                classes={classes}
                onCreated={() => void loadSchoolData(institution.id)}
              />
              <TopPerformersPanel performers={stats?.topPerformers ?? []} />
            </section>
          </>
        )}

        <section className="rounded-[1.5rem] border-4 border-black bg-[#fffbea] p-5 shadow-[0_8px_0_#000]">
          <h2 className="mb-4 text-[0.75rem] sm:text-sm" style={pixelFont}>
            Teaching Toolkit
          </h2>
          <div className="grid gap-3 sm:grid-cols-3" style={readableFont}>
            <ToolkitLink
              href="/home#modules"
              icon={BookOpen}
              title="Browse modules"
              text="Video lessons with assignments and missions to set for your class."
            />
            <ToolkitLink
              href="/games/eco-sprint"
              icon={Gamepad2}
              title="Run an Eco Sprint"
              text="Live 1v1 quiz duels — great as a class warm-up."
            />
            <ToolkitLink
              href="/articles"
              icon={Leaf}
              title="Today's eco news"
              text="Fresh environmental stories with quick summaries for discussion."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border-4 border-black bg-white p-4 shadow-[0_6px_0_#000]">
      <Icon className="h-5 w-5 text-emerald-700" />
      <div className="mt-2 text-2xl font-black sm:text-3xl">{numberFormat.format(value)}</div>
      <div className="text-xs uppercase tracking-wide text-black/60">{label}</div>
    </div>
  );
}

function ClassesPanel({
  institutionId,
  classes,
  onCreated,
}: {
  institutionId: string;
  classes: ClassSummary[];
  onCreated: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const createClass = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !subject.trim()) {
      setError("Class name and subject are required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await classesApi.create({
        name: name.trim(),
        subject: subject.trim(),
        institutionId,
        ...(description.trim() ? { description: description.trim() } : {}),
      });
      setName("");
      setSubject("");
      setDescription("");
      setShowForm(false);
      onCreated();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Could not create class");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border-[3px] border-black bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-500/50";

  return (
    <div className="rounded-[1.5rem] border-4 border-black bg-[#fffbea] p-5 shadow-[0_8px_0_#000]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[0.75rem] sm:text-sm" style={pixelFont}>
          Classes
        </h2>
        <button
          type="button"
          onClick={() => setShowForm((open) => !open)}
          className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-yellow-300 px-3 py-1.5 text-xs font-bold shadow-[0_2px_0_#000]"
          style={readableFont}
        >
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "New class"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(event) => void createClass(event)}
          className="mb-5 grid gap-3 rounded-2xl border-[3px] border-black bg-white/70 p-4 sm:grid-cols-2"
          style={readableFont}
        >
          <label className="text-sm font-semibold">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grade 7 – Section B"
              className={`${inputClass} mt-1`}
              required
            />
          </label>
          <label className="text-sm font-semibold">
            Subject
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Environmental Science"
              className={`${inputClass} mt-1`}
              required
            />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Description (optional)
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={`${inputClass} mt-1`}
            />
          </label>
          {error && <p className="text-sm font-semibold text-red-700 sm:col-span-2">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl border-[3px] border-black bg-green-400 px-4 py-2 text-sm font-bold shadow-[0_3px_0_#000] disabled:opacity-60 sm:col-span-2"
          >
            {saving ? "Creating…" : "Create class"}
          </button>
        </form>
      )}

      {classes.length === 0 ? (
        <p className="py-6 text-center text-sm text-black/60" style={readableFont}>
          No classes yet. Create your first one to start organising students.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2" style={readableFont}>
          {classes.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border-[3px] border-black bg-white p-4 shadow-[0_3px_0_#000]"
            >
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-black/65">{item.subject}</p>
              <p className="mt-2 text-xs text-black/55">
                {item._count?.students ?? 0} students · {item._count?.teachers ?? 0} teachers
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TopPerformersPanel({
  performers,
}: {
  performers: InstitutionStatistics["topPerformers"];
}) {
  return (
    <div className="rounded-[1.5rem] border-4 border-black bg-[#fffbea] p-5 shadow-[0_8px_0_#000]">
      <h2 className="mb-4 flex items-center gap-2 text-[0.75rem] sm:text-sm" style={pixelFont}>
        <Trophy className="h-4 w-4" /> Top Eco Rangers
      </h2>
      {performers.length === 0 ? (
        <p className="py-6 text-center text-sm text-black/60" style={readableFont}>
          Once students start completing lessons, your stars will show up here.
        </p>
      ) : (
        <ol className="space-y-2" style={readableFont}>
          {performers.map((student, index) => (
            <li
              key={student.id}
              className="flex items-center gap-3 rounded-xl border-2 border-black bg-white px-3 py-2"
            >
              <span className="w-8 text-center font-black">
                {["🥇", "🥈", "🥉"][index] ?? `#${index + 1}`}
              </span>
              <img
                src={student.user.avatar || "/avatar.png"}
                alt=""
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full border-2 border-black object-cover"
              />
              <span className="min-w-0 flex-1 truncate font-semibold">
                {student.user.name ?? "Eco Explorer"}
              </span>
              <span className="font-black">{numberFormat.format(student.ecoPoints)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function ToolkitLink({
  href,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="flex gap-3 rounded-2xl border-[3px] border-black bg-white p-4 shadow-[0_4px_0_#000] transition hover:-translate-y-0.5"
    >
      <Icon className="h-6 w-6 shrink-0 text-emerald-700" />
      <span>
        <span className="block font-bold">{title}</span>
        <span className="block text-sm text-black/65">{text}</span>
      </span>
    </Link>
  );
}
