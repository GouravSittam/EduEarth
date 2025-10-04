"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");
  const router = useRouter();

  // State for forms
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });

  // Handle sign-in
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (
        parsedUser.email === signInData.email &&
        parsedUser.password === signInData.password
      ) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...parsedUser, isLoggedIn: true })
        );
        alert(`Welcome back, ${parsedUser.email}!`);
        router.push("/"); // ✅ redirect
      } else {
        alert("Invalid email or password.");
      }
    } else {
      alert("No account found. Please sign up first.");
    }
  };

  // Handle sign-up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...signUpData,
        isLoggedIn: true,
      })
    );

    alert("Sign up successful! You are now logged in.");
    router.push("/"); // ✅ redirect
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-3 sm:p-4"
     style={{
        fontFamily: '"Press Start 2P", system-ui, sans-serif',
        backgroundImage: "url('/herobackground.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center", 
      }}>

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg w-full max-w-sm sm:max-w-md p-4 sm:p-6 z-1">
        {/* Tab Switcher */}
        <div className="flex mb-4 sm:mb-6 border-b">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-2 font-semibold text-sm sm:text-base ${
              activeTab === "signin"
                ? "border-b-2 border-yellow-500 text-yellow-500"
                : "text-gray-500"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
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
            <input
              type="email"
              placeholder="Email"
              value={signInData.email}
              onChange={(e) =>
                setSignInData({ ...signInData, email: e.target.value })
              }
              className="px-3 py-2 sm:px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
            />
            <input
              type="password"
              placeholder="Password"
              value={signInData.password}
              onChange={(e) =>
                setSignInData({ ...signInData, password: e.target.value })
              }
              className="px-3 py-2 sm:px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black px-3 py-2 sm:px-4 rounded-md font-semibold hover:bg-yellow-500 transition text-sm sm:text-base"
            >
              Sign In
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignUp} className="flex flex-col gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={signUpData.fullName}
              onChange={(e) =>
                setSignUpData({ ...signUpData, fullName: e.target.value })
              }
              className="px-3 py-2 sm:px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpData.email}
              onChange={(e) =>
                setSignUpData({ ...signUpData, email: e.target.value })
              }
              className="px-3 py-2 sm:px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpData.password}
              onChange={(e) =>
                setSignUpData({ ...signUpData, password: e.target.value })
              }
              className="px-3 py-2 sm:px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
            />
            <div className="flex flex-col">
              <label htmlFor="role" className="text-gray-700 mb-1 text-sm sm:text-base">
                I am a:
              </label>
              <select
                id="role"
                value={signUpData.role}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, role: e.target.value })
                }
                className="px-3 py-2 sm:px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-yellow-400 text-black px-3 py-2 sm:px-4 rounded-md font-semibold hover:bg-yellow-500 transition text-sm sm:text-base"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
