"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Earth,
  GraduationCap,
  HeartHandshake,
  KeyRound,
  Leaf,
  Mail,
  School,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/components/auth/AuthProvider";

type Tab = "signin" | "signup";

type RoleOption = {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  activeClasses: string;
};

const readableTextStyle = {
  fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
};

const authModes: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
  cardClasses: string;
}> = [
  {
    title: "Password Login",
    description:
      "Jump straight into your dashboard with classic email and password access.",
    icon: KeyRound,
    cardClasses: "from-yellow-300 via-amber-300 to-orange-300",
  },
  {
    title: "Magic Link",
    description:
      "Get a secure sign-in link in your inbox and enter without typing a password.",
    icon: Mail,
    cardClasses: "from-green-300 via-emerald-300 to-teal-300",
  },
  {
    title: "Google Connect",
    description:
      "Use Google for a one-click entry while keeping your role and profile synced.",
    icon: Sparkles,
    cardClasses: "from-sky-300 via-cyan-300 to-blue-300",
  },
];

const roleOptions: RoleOption[] = [
  {
    value: "student",
    label: "Student",
    description: "Missions, streaks, and lessons",
    icon: GraduationCap,
    activeClasses: "from-yellow-300 to-amber-300",
  },
  {
    value: "teacher",
    label: "Teacher",
    description: "Classes, quizzes, and reports",
    icon: School,
    activeClasses: "from-green-300 to-emerald-300",
  },
  {
    value: "parent",
    label: "Parent",
    description: "Progress and family support",
    icon: HeartHandshake,
    activeClasses: "from-sky-300 to-cyan-300",
  },
];

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#0b2f1d] px-4 py-8 text-black sm:px-6 lg:px-8"
      style={{
        fontFamily: '"Press Start 2P", system-ui, sans-serif',
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/herobackground.jpg')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.28),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.2),transparent_28%),linear-gradient(180deg,rgba(3,18,12,0.2),rgba(3,18,12,0.88))]" />
      <div className="pointer-events-none absolute -left-16 top-16 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl sm:h-56 sm:w-56" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-52 w-52 rounded-full bg-emerald-300/20 blur-3xl sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-28 w-28 -translate-x-1/2 rounded-full border-4 border-dashed border-yellow-300/35" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center">
        {children}
      </div>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1 text-[0.52rem] uppercase tracking-[0.26em] text-black/60">
      <div className="h-1 flex-1 rounded-full bg-black/10" />
      <span>{label}</span>
      <div className="h-1 flex-1 rounded-full bg-black/10" />
    </div>
  );
}

function StatusNotice({
  tone,
  message,
}: {
  tone: "error" | "success" | "info";
  message: string;
}) {
  const classes =
    tone === "error"
      ? "border-red-700 bg-red-100 text-red-900"
      : tone === "success"
        ? "border-green-700 bg-green-100 text-green-900"
        : "border-sky-700 bg-sky-100 text-sky-900";

  return (
    <div
      className={`rounded-[1.2rem] border-4 px-4 py-3 text-[0.62rem] leading-relaxed shadow-[0_4px_0_#000] ${classes}`}
      style={readableTextStyle}
    >
      {message}
    </div>
  );
}

function PixelInput({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.58rem] uppercase tracking-[0.22em] text-black/70">
        {label}
      </span>
      <input
        {...props}
        className="min-h-[3.35rem] w-full rounded-[1.2rem] border-4 border-black bg-white/95 px-4 py-3 text-sm text-black shadow-[0_5px_0_#000] outline-none transition duration-200 placeholder:text-black/45 focus:-translate-y-0.5 focus:shadow-[0_8px_0_#000]"
        style={readableTextStyle}
      />
    </label>
  );
}

function AuthPageContent() {
  const [activeTab, setActiveTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, signIn, signUp, sendMagicLink, signInWithGoogle } =
    useAuth();

  const callbackError = useMemo(
    () => searchParams.get("error_description") ?? searchParams.get("error") ?? "",
    [searchParams]
  );

  const isBusy = loading || isLoading;

  useEffect(() => {
    if (callbackError) {
      setError(callbackError);
    }
  }, [callbackError]);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/home");
    }
  }, [isLoading, router, user]);

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setError("");
    setSuccessMessage("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await signIn({ email, password });
      router.push("/home");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !password || !confirmPassword || !fullName) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp({
        email,
        password,
        fullName,
        role,
      });

      if (result.requiresEmailConfirmation) {
        setSuccessMessage(
          "Account created. Check your inbox and confirm your email to finish signing in."
        );
        setActiveTab("signin");
        setPassword("");
        setConfirmPassword("");
        return;
      }

      router.push("/home");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Enter your email first.");
      return;
    }

    setLoading(true);

    try {
      await sendMagicLink({
        email,
        fullName,
        role,
        shouldCreateUser: activeTab === "signup",
      });

      setSuccessMessage(
        "Magic link sent. Open your email and click the link to continue."
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Magic link failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await signInWithGoogle(
        activeTab === "signup" ? { fullName, role } : undefined
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign in failed");
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="grid w-full gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
        <section className="order-2 lg:order-1">
          <div className="rounded-[2rem] border-[5px] border-black bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 p-5 shadow-[0_10px_0_#000,0_20px_45px_rgba(0,0,0,0.28)] sm:p-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border-4 border-black bg-yellow-300 px-3 py-2 text-[0.52rem] uppercase tracking-[0.25em] shadow-[0_4px_0_#000]">
                EduEarth Access Portal
              </span>
              <span
                className="rounded-full border-4 border-black bg-white px-3 py-2 text-[0.72rem] text-black shadow-[0_4px_0_#000]"
                aria-hidden="true"
              >
                <Earth className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-6 max-w-2xl">
              <h1 className="text-[clamp(1.8rem,4vw,3.6rem)] leading-[1.15] text-black">
                Start Your Next Eco Quest
              </h1>
              <p
                className="mt-4 max-w-2xl text-sm leading-7 text-black/80 sm:text-base"
                style={readableTextStyle}
              >
                Sign in or build your profile with the same bright arcade energy
                as the rest of EduEarth. Your streaks, lessons, classrooms, and
                future rewards all start here.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border-4 border-black bg-white/90 px-4 py-4 shadow-[0_6px_0_#000]">
                <div className="text-lg text-black">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="mt-3 text-[0.95rem] text-black">Secure Sessions</p>
                <p
                  className="mt-2 text-sm leading-6 text-black/70"
                  style={readableTextStyle}
                >
                  Supabase keeps sign-ins, sessions, and callbacks protected.
                </p>
              </div>
              <div className="rounded-[1.5rem] border-4 border-black bg-white/90 px-4 py-4 shadow-[0_6px_0_#000]">
                <div className="text-lg text-black">
                  <Leaf className="h-5 w-5" />
                </div>
                <p className="mt-3 text-[0.95rem] text-black">3 Entry Modes</p>
                <p
                  className="mt-2 text-sm leading-6 text-black/70"
                  style={readableTextStyle}
                >
                  Password, magic link, or Google. Pick the flow that feels best.
                </p>
              </div>
              <div className="rounded-[1.5rem] border-4 border-black bg-white/90 px-4 py-4 shadow-[0_6px_0_#000]">
                <div className="text-lg text-black">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <p className="mt-3 text-[0.95rem] text-black">Role Aware</p>
                <p
                  className="mt-2 text-sm leading-6 text-black/70"
                  style={readableTextStyle}
                >
                  Student, teacher, and parent journeys stay connected from day one.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {authModes.map(({ title, description, icon: Icon, cardClasses }) => (
                <article
                  key={title}
                  className={`rounded-[1.7rem] border-4 border-black bg-gradient-to-br ${cardClasses} p-4 shadow-[0_8px_0_#000] transition-transform duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-black bg-white text-black shadow-[0_4px_0_#000]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowRight className="h-4 w-4 text-black/70" />
                  </div>
                  <h2 className="mt-4 text-[0.92rem] leading-6 text-black">
                    {title}
                  </h2>
                  <p
                    className="mt-3 text-sm leading-6 text-black/75"
                    style={readableTextStyle}
                  >
                    {description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-[1.7rem] border-4 border-black bg-black px-5 py-5 text-yellow-300 shadow-[0_8px_0_#000]">
              <p className="text-[0.8rem] leading-6 sm:text-[0.92rem]">
                One portal. All your learning momentum.
              </p>
              <p
                className="mt-3 text-sm leading-7 text-yellow-100/90"
                style={readableTextStyle}
              >
                The moment you finish signing in, we send you back into the
                EduEarth experience with your profile, role, and progress ready
                to go.
              </p>
            </div>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-[2rem] border-[5px] border-black bg-gradient-to-br from-yellow-100 via-yellow-50 to-white p-5 shadow-[0_10px_0_#000,0_20px_45px_rgba(0,0,0,0.28)] sm:p-7">
            <div className="pointer-events-none absolute -right-10 top-0 h-24 w-24 rounded-full bg-yellow-300/60 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-green-300/50 blur-2xl" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border-4 border-black bg-black px-3 py-2 text-[0.5rem] uppercase tracking-[0.24em] text-yellow-300 shadow-[0_4px_0_#000]">
                  {activeTab === "signin" ? "Player Login" : "Create Account"}
                </span>
                <span
                  className="rounded-full border-4 border-black bg-green-300 px-3 py-2 text-[0.58rem] uppercase tracking-[0.2em] text-black shadow-[0_4px_0_#000]"
                  style={readableTextStyle}
                >
                  {isBusy ? "Connecting..." : "Session Ready"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 rounded-[1.4rem] border-4 border-black bg-black/5 p-2">
                <button
                  type="button"
                  onClick={() => switchTab("signin")}
                  className={`min-h-[3.35rem] rounded-[1rem] border-4 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] shadow-[0_4px_0_#000] transition ${
                    activeTab === "signin"
                      ? "border-black bg-yellow-300 text-black"
                      : "border-black/15 bg-white/70 text-black/65 shadow-none hover:bg-white"
                  }`}
                  aria-pressed={activeTab === "signin"}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchTab("signup")}
                  className={`min-h-[3.35rem] rounded-[1rem] border-4 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] shadow-[0_4px_0_#000] transition ${
                    activeTab === "signup"
                      ? "border-black bg-green-300 text-black"
                      : "border-black/15 bg-white/70 text-black/65 shadow-none hover:bg-white"
                  }`}
                  aria-pressed={activeTab === "signup"}
                >
                  Sign Up
                </button>
              </div>

              <div className="mt-6">
                <h2 className="text-[1.2rem] leading-7 text-black sm:text-[1.35rem]">
                  {activeTab === "signin"
                    ? "Resume Your Mission"
                    : "Build Your Eco Profile"}
                </h2>
                <p
                  className="mt-3 text-sm leading-7 text-black/70"
                  style={readableTextStyle}
                >
                  {activeTab === "signin"
                    ? "Use your password, a fast email link, or Google to jump straight back into EduEarth."
                    : "Create your account with password, email magic link, or Google. Your chosen role carries into the app."}
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {error ? <StatusNotice tone="error" message={error} /> : null}
                {successMessage ? (
                  <StatusNotice tone="success" message={successMessage} />
                ) : null}
                {isBusy ? (
                  <StatusNotice
                    tone="info"
                    message="Working on your auth request. Hold tight for a second."
                  />
                ) : null}
              </div>

              {activeTab === "signin" ? (
                <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                  <PixelInput
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    aria-label="Email Address"
                    required
                  />
                  <PixelInput
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    aria-label="Password"
                    required
                  />

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="min-h-[3.6rem] w-full rounded-[1.25rem] border-4 border-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 px-4 py-3 text-[0.66rem] uppercase tracking-[0.18em] text-black shadow-[0_6px_0_#000] transition hover:-translate-y-0.5 hover:shadow-[0_8px_0_#000] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    Sign In With Password
                  </button>

                  <Divider label="or use another route" />

                  <button
                    type="button"
                    onClick={() => void handleMagicLink()}
                    disabled={isBusy}
                    className="flex min-h-[3.6rem] w-full items-center justify-center gap-3 rounded-[1.25rem] border-4 border-black bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 px-4 py-3 text-[0.66rem] uppercase tracking-[0.16em] text-black shadow-[0_6px_0_#000] transition hover:-translate-y-0.5 hover:shadow-[0_8px_0_#000] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    <Mail className="h-4 w-4" />
                    Send Magic Link
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleGoogle()}
                    disabled={isBusy}
                    className="flex min-h-[3.6rem] w-full items-center justify-center gap-3 rounded-[1.25rem] border-4 border-black bg-white px-4 py-3 text-[0.66rem] uppercase tracking-[0.16em] text-black shadow-[0_6px_0_#000] transition hover:-translate-y-0.5 hover:shadow-[0_8px_0_#000] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    <FcGoogle className="h-5 w-5" />
                    Continue With Google
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                  <PixelInput
                    type="text"
                    label="Full Name"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    autoComplete="name"
                    aria-label="Full Name"
                    required
                  />
                  <PixelInput
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    aria-label="Email Address"
                    required
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <PixelInput
                      type="password"
                      label="Password"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="new-password"
                      aria-label="Password"
                      minLength={6}
                      required
                    />
                    <PixelInput
                      type="password"
                      label="Confirm Password"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      autoComplete="new-password"
                      aria-label="Confirm Password"
                      minLength={6}
                      required
                    />
                  </div>

                  <div>
                    <span className="mb-2 block text-[0.58rem] uppercase tracking-[0.22em] text-black/70">
                      Pick Your Role
                    </span>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {roleOptions.map(
                        ({
                          value,
                          label,
                          description,
                          icon: Icon,
                          activeClasses,
                        }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setRole(value)}
                            aria-pressed={role === value}
                            className={`min-h-[5.6rem] rounded-[1.2rem] border-4 p-3 text-left shadow-[0_6px_0_#000] transition hover:-translate-y-0.5 hover:shadow-[0_8px_0_#000] ${
                              role === value
                                ? `border-black bg-gradient-to-br ${activeClasses}`
                                : "border-black bg-white/85"
                            }`}
                          >
                            <div className="flex items-center gap-2 text-black">
                              <Icon className="h-4 w-4" />
                              <span className="text-[0.62rem] uppercase tracking-[0.14em]">
                                {label}
                              </span>
                            </div>
                            <p
                              className="mt-2 text-xs leading-5 text-black/70"
                              style={readableTextStyle}
                            >
                              {description}
                            </p>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="min-h-[3.6rem] w-full rounded-[1.25rem] border-4 border-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 px-4 py-3 text-[0.66rem] uppercase tracking-[0.18em] text-black shadow-[0_6px_0_#000] transition hover:-translate-y-0.5 hover:shadow-[0_8px_0_#000] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    Create Account
                  </button>

                  <Divider label="or fast-track signup" />

                  <button
                    type="button"
                    onClick={() => void handleMagicLink()}
                    disabled={isBusy}
                    className="flex min-h-[3.6rem] w-full items-center justify-center gap-3 rounded-[1.25rem] border-4 border-black bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 px-4 py-3 text-[0.66rem] uppercase tracking-[0.16em] text-black shadow-[0_6px_0_#000] transition hover:-translate-y-0.5 hover:shadow-[0_8px_0_#000] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    <Mail className="h-4 w-4" />
                    Sign Up With Magic Link
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleGoogle()}
                    disabled={isBusy}
                    className="flex min-h-[3.6rem] w-full items-center justify-center gap-3 rounded-[1.25rem] border-4 border-black bg-white px-4 py-3 text-[0.66rem] uppercase tracking-[0.16em] text-black shadow-[0_6px_0_#000] transition hover:-translate-y-0.5 hover:shadow-[0_8px_0_#000] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    <FcGoogle className="h-5 w-5" />
                    Continue With Google
                  </button>

                  <p
                    className="rounded-[1.15rem] border-4 border-black bg-white/85 px-4 py-3 text-sm leading-6 text-black/70 shadow-[0_4px_0_#000]"
                    style={readableTextStyle}
                  >
                    Google signup will carry your selected role into the first
                    profile sync after auth completes.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </AuthShell>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <AuthShell>
          <div className="mx-auto w-full max-w-xl rounded-[2rem] border-[5px] border-black bg-gradient-to-br from-yellow-100 via-yellow-50 to-white p-6 text-center shadow-[0_10px_0_#000,0_20px_45px_rgba(0,0,0,0.28)]">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[1.4rem] border-4 border-black bg-yellow-300 shadow-[0_6px_0_#000]">
              <Earth className="h-8 w-8 text-black" />
            </div>
            <h1 className="mt-5 text-[1.15rem] leading-7 text-black">
              Loading Auth Portal
            </h1>
            <p
              className="mt-3 text-sm leading-7 text-black/70"
              style={readableTextStyle}
            >
              Pulling in your sign-in options and getting everything ready.
            </p>
          </div>
        </AuthShell>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
