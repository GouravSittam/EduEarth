"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

type Tab = "signin" | "signup";
type Step = "email" | "otp";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<Tab>("signin");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (step === "email") {
      if (!email) return setError("Email is required");
      setLoading(true);
      try {
        await authApi.loginWithEmail(email);
        setStep("otp");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Sign in failed");
      } finally {
        setLoading(false);
      }
    } else {
      if (!otp) return setError("OTP is required");
      setLoading(true);
      try {
        await authApi.verifyOtp(email, otp);
        router.push("/home");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "OTP verification failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !fullName) return setError("All fields are required");
    setLoading(true);
    try {
      await authApi.loginWithEmail(email);
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setStep("email");
    setError("");
    setOtp("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-green-50 p-3 sm:p-4"
      style={{
        fontFamily: '"Press Start 2P", system-ui, sans-serif',
        backgroundImage: "url('/herobackground.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg w-full max-w-sm sm:max-w-md p-4 sm:p-6 z-1">
        {loading && (
          <div className="mb-4 text-sm text-gray-600">Processing...</div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-500 border border-red-300 rounded p-2">
            {error}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex mb-4 sm:mb-6 border-b">
          <button
            onClick={() => switchTab("signin")}
            className={`flex-1 py-2 font-semibold text-sm sm:text-base ${
              activeTab === "signin"
                ? "border-b-2 border-yellow-500 text-yellow-500"
                : "text-gray-500"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab("signup")}
            className={`flex-1 py-2 font-semibold text-sm sm:text-base ${
              activeTab === "signup"
                ? "border-b-2 border-yellow-500 text-yellow-500"
                : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Sign In Form */}
        {activeTab === "signin" && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-3 sm:gap-4">
            {step === "email" ? (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  aria-label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-2 sm:px-4 border rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400 text-sm sm:text-base"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-400 text-black px-3 py-2 sm:px-4 rounded-md font-semibold hover:bg-yellow-500 transition text-sm sm:text-base disabled:opacity-50"
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-600">
                  OTP sent to {email}
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  aria-label="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="px-3 py-2 sm:px-4 border rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400 text-sm sm:text-base"
                  required
                  maxLength={6}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-400 text-black px-3 py-2 sm:px-4 rounded-md font-semibold hover:bg-yellow-500 transition text-sm sm:text-base disabled:opacity-50"
                >
                  Verify & Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setError("");
                    setOtp("");
                  }}
                  className="text-xs text-gray-500 underline"
                >
                  Change email
                </button>
              </>
            )}
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === "signup" && step === "email" && (
          <form onSubmit={handleSignUp} className="flex flex-col gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Full Name"
              aria-label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="px-3 py-2 sm:px-4 border rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400 text-sm sm:text-base"
              required
            />
            <input
              type="email"
              placeholder="Email"
              aria-label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 sm:px-4 border rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400 text-sm sm:text-base"
              required
            />
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3 py-2 sm:px-4 border rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400 text-sm sm:text-base"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 text-black px-3 py-2 sm:px-4 rounded-md font-semibold hover:bg-yellow-500 transition text-sm sm:text-base disabled:opacity-50"
            >
              Sign Up
            </button>
          </form>
        )}

        {/* OTP step for Sign Up */}
        {activeTab === "signup" && step === "otp" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              if (!otp) return setError("OTP is required");
              setLoading(true);
              try {
                await authApi.verifyOtp(email, otp);
                router.push("/home");
              } catch (err: unknown) {
                setError(
                  err instanceof Error ? err.message : "OTP verification failed"
                );
              } finally {
                setLoading(false);
              }
            }}
            className="flex flex-col gap-3 sm:gap-4"
          >
            <p className="text-xs text-gray-600">OTP sent to {email}</p>
            <input
              type="text"
              placeholder="Enter OTP"
              aria-label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="px-3 py-2 sm:px-4 border rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400 text-sm sm:text-base"
              required
              maxLength={6}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 text-black px-3 py-2 sm:px-4 rounded-md font-semibold hover:bg-yellow-500 transition text-sm sm:text-base disabled:opacity-50"
            >
              Verify & Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError("");
                setOtp("");
              }}
              className="text-xs text-gray-500 underline"
            >
              Change email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
