import React from "react";
import ElectricBorder from "./ElectricBorder";
import { JSX } from "react";

export default function EducationLanding(): JSX.Element {
  return (
    <div 
className="relative pt-30 flex h-200px w-full flex-col items-center justify-center bg-cover bg-center px-4 py-10 text-center md:px-6"
      style={{
        fontFamily: '"Press Start 2P", system-ui, sans-serif',
        backgroundImage: "url('/herobackground.jpg')",
      }}
      > 
           <div className="absolute inset-0 bg-black/60 z-0"></div>

           <div className="w-full max-w-6xl z-2">
        {/* Top banner */}
        <div className="mx-auto mb-8 w-fit rounded-2xl bg-yellow-300 px-6 py-3 shadow-md" role="banner">
          <h1 className="text-black font-extrabold text-lg md:text-xl lg:text-2xl">Built for Schools & Families</h1>
        </div>

        {/* Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <ElectricBorder color="#FFD400" speed={1.2} chaos={1.1} thickness={2} className="rounded-2xl">
        <article className="bg-yellow-300 rounded-2xl border-2 border-black p-6 flex flex-col items-center text-center shadow-lg">
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-black mb-4">
              {/* Stylized black & white profile (young man with headphones) - inline SVG */}
              <svg viewBox="0 0 120 120" width="90" height="90" aria-hidden="true">
                <rect width="120" height="120" fill="#fff" />
                <g transform="translate(10,8)" fill="#000">
                  <path d="M50 18c-9 0-16 7-16 16s7 16 16 16 16-7 16-16-7-16-16-16z" />
                  <path d="M2 54c0-14 11-25 25-25h66c14 0 25 11 25 25v22c0 14-11 25-25 25H27C13 126 2 115 2 101V54z" fill="#fff" />
                  <path d="M6 62v24c0 11 9 20 20 20h66c11 0 20-9 20-20V62" stroke="#000" strokeWidth="3" fill="none" />
                  {/* Headphones */}
                  <path d="M10 46c0-18 14-32 32-32s32 14 32 32" stroke="#000" strokeWidth="4" fill="none" />
                  <rect x="6" y="46" width="14" height="22" rx="4" fill="#000" />
                  <rect x="100" y="46" width="14" height="22" rx="4" fill="#000" />
                  {/* Face details (white) */}
                  <circle cx="50" cy="34" r="6" fill="#fff" />
                  <rect x="44" y="40" width="12" height="6" rx="3" fill="#fff" />
                </g>
              </svg>
            </div>

            <h2 className="text-black font-bold text-lg md:text-xl mb-2">Teacher Dashboard</h2>
            <p className="text-black text-xl mb-6" 
                              style={{ fontFamily: "poppines" }}
>Auto-generate PPTs, quizzes, and lesson aids instantly. Track student scores &amp; streaks in real-time.</p>

            <button className="mt-auto inline-flex items-center gap-3 bg-black text-white px-4 py-2 rounded-lg border-2 border-black hover:opacity-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 3v18l15-9L5 3z" fill="#fff" />
              </svg>
              <span className="text-sm font-semibold" style={{ fontFamily: "poppines" }}>Get Started as a Teacher</span>
            </button>
          </article>
        </ElectricBorder>

        {/* Card 2 */}
        <ElectricBorder color="#FFD400" speed={1.2} chaos={1.1} thickness={2} className="rounded-2xl">
        <article className="bg-yellow-300 rounded-2xl border-2 border-black p-6 flex flex-col items-center text-center shadow-lg">
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-black mb-4">
              {/* reuse SVG avatar */}
              <svg viewBox="0 0 120 120" width="90" height="90" aria-hidden="true">
                <rect width="120" height="120" fill="#fff" />
                <g transform="translate(10,8)" fill="#000">
                  <path d="M50 18c-9 0-16 7-16 16s7 16 16 16 16-7 16-16-7-16-16-16z" />
                  <path d="M2 54c0-14 11-25 25-25h66c14 0 25 11 25 25v22c0 14-11 25-25 25H27C13 126 2 115 2 101V54z" fill="#fff" />
                  <path d="M6 62v24c0 11 9 20 20 20h66c11 0 20-9 20-20V62" stroke="#000" strokeWidth="3" fill="none" />
                  <path d="M10 46c0-18 14-32 32-32s32 14 32 32" stroke="#000" strokeWidth="4" fill="none" />
                  <rect x="6" y="46" width="14" height="22" rx="4" fill="#000" />
                  <rect x="100" y="46" width="14" height="22" rx="4" fill="#000" />
                  <circle cx="50" cy="34" r="6" fill="#fff" />
                  <rect x="44" y="40" width="12" height="6" rx="3" fill="#fff" />
                </g>
              </svg>
            </div>

            <h2 className="text-black font-bold text-lg md:text-xl mb-2">Parent Insights</h2>
            <p className="text-black text-xl mb-6" style={{ fontFamily: "poppines" }}>See your child's learning progress &amp; eco-habits. Celebrate streaks, view certificates, and reward eco-actions.</p>

            <button className="mt-auto inline-flex items-center gap-3 bg-black text-white px-4 py-2 rounded-lg border-2 border-black hover:opacity-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 3v18l15-9L5 3z" fill="#fff" />
              </svg>
              <span className="text-sm font-semibold" style={{ fontFamily: "poppines" }}>Join as a Parent</span>
            </button>
          </article>
        </ElectricBorder>

        {/* Card 3 */}
        <ElectricBorder color="#FFD400" speed={1.2} chaos={1.1} thickness={2} className="rounded-2xl">
        <article className="bg-yellow-300 rounded-2xl border-2 border-black p-6 flex flex-col items-center text-center shadow-lg">
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-black mb-4">
              {/* reuse SVG avatar */}
              <svg viewBox="0 0 120 120" width="90" height="90" aria-hidden="true">
                <rect width="120" height="120" fill="#fff" />
                <g transform="translate(10,8)" fill="#000">
                  <path d="M50 18c-9 0-16 7-16 16s7 16 16 16 16-7 16-16-7-16-16-16z" />
                  <path d="M2 54c0-14 11-25 25-25h66c14 0 25 11 25 25v22c0 14-11 25-25 25H27C13 126 2 115 2 101V54z" fill="#fff" />
                  <path d="M6 62v24c0 11 9 20 20 20h66c11 0 20-9 20-20V62" stroke="#000" strokeWidth="3" fill="none" />
                  <path d="M10 46c0-18 14-32 32-32s32 14 32 32" stroke="#000" strokeWidth="4" fill="none" />
                  <rect x="6" y="46" width="14" height="22" rx="4" fill="#000" />
                  <rect x="100" y="46" width="14" height="22" rx="4" fill="#000" />
                  <circle cx="50" cy="34" r="6" fill="#fff" />
                  <rect x="44" y="40" width="12" height="6" rx="3" fill="#fff" />
                </g>
              </svg>
            </div>

            <h2 className="text-black font-bold text-lg md:text-xl mb-2">Rewards &amp; Certificates</h2>
            <p className="text-black text-xl mb-6" style={{ fontFamily: "poppines" }}>Students earn verified eco-certificates. Printable badges for school portfolios &amp; family pride.</p>

            <button className="mt-auto inline-flex items-center gap-3 bg-black text-white px-4 py-2 rounded-lg border-2 border-black hover:opacity-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 16v-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 20h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-semibold" style={{ fontFamily: "poppines" }}>Download a Sample Certificate</span>
            </button>
          </article>
        </ElectricBorder>
        </div>
      </div>
    </div>
  );
}
