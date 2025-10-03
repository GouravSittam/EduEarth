"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Bell, MessageCircle, User, Home, Grid, FileText, Flag, Trophy, Settings, Award, Star, Shield, Calendar, Play } from "lucide-react";
import React, { useState } from "react";

export default function DashboardPage() {
  type Tab = 'Overview' | 'Modules' | 'Assignments' | 'Missions' | 'LeaderBoard' | 'Messages' | 'Certificates' | 'Settings';
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  return (
    <div className="min-h-screen flex relative text-gray-800" >
      <div
  className="absolute inset-0 bg-cover bg-center z-0"
  style={{
    backgroundImage: `url('/signimage.jpeg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
></div>
{/* Dark Overlay for Readability */}
<div className="absolute inset-0 bg-black/60 z-10"></div>


      {/* Sidebar */}
      <aside className="w-72 bg-green-900/80 text-white px-4 py-6 flex-shrink-0 relative z-20">
        <div className="text-l font-semibold mb-6">Menu</div>
        <nav className="space-y-2">
          <NavItem icon={<Home size={18} />} label="Overview" activeTab={activeTab} onClick={() => setActiveTab('Overview')} />
          <NavItem icon={<Grid size={18} />} label="Modules" activeTab={activeTab} onClick={() => setActiveTab('Modules')} />
          <NavItem icon={<FileText size={18} />} label="Assignments" activeTab={activeTab} onClick={() => setActiveTab('Assignments')} />
          <NavItem icon={<Trophy size={18} />} label="LeaderBoard" activeTab={activeTab} onClick={() => setActiveTab('LeaderBoard')} />
          <NavItem icon={<MessageCircle size={18} />} label="Messages" badge="2" activeTab={activeTab} onClick={() => setActiveTab('Messages')} />
        </nav>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col relative z-20">
        {/* Header */}
        <header className="w-full bg-gradient-to-r from-blue-600/80 to-blue-400/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center shadow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15 8H9L12 2Z" fill="white" />
                <path d="M12 22C16.4183 22 20 18.4183 20 14C20 9.58172 16.4183 6 12 6C7.58172 6 4 9.58172 4 14C4 18.4183 7.58172 22 12 22Z" fill="white" opacity="0.12" />
              </svg>
            </div>
            <div className="text-white font-bold text-lg">ECO Play</div>
          </div>

          <div className="flex-1 mx-6">
            <h1 className="text-white text-2xl font-bold text-center">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-[420px] max-w-xs">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400"><Search size={16} /></div>
              <input placeholder="Search Across Modules, Assignments, Missions, etc..." className="w-full pl-10 pr-4 py-2 rounded-full bg-white/90 placeholder-gray-500 focus:outline-none" />
            </div>

            <button className="relative bg-transparent p-2 rounded-full text-white hover:opacity-90">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-xs text-black rounded-full px-1">3</span>
            </button>

            <button className="bg-transparent p-2 rounded-full text-white">
              <MessageCircle size={18} />
            </button>

            <div className="w-9 h-9 rounded-full overflow-hidden">
              <Image src="/avatar.png" alt="avatar" width={36} height={36} className="object-cover" />
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 p-6 ">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
            {/* Conditional layout: Overview (main + stats) or Modules (full-width main) */}
            {activeTab === 'Overview' ? (
              <>
                <main className="col-span-8">
                  <OverviewContent />
                </main>

                <aside className="col-span-4 space-y-4 sticky top-6">
                  {/* Student Profile Card */}
                  <div className="bg-gradient-to-br from-orange-500 to-red-400 rounded-xl p-4 text-white shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                        <Image src="/avatar.png" alt="student" width={64} height={64} className="object-cover" />
                      </div>
                      <div style={{fontFamily : "poppine"}}>
                        <div className="font-semibold text-lg">Ajay Sharma</div>
                        <div className="text-xs opacity-90">Student • 8,979 Points</div>
                      </div>
                    </div>
                    <div className="mt-4" style={{fontFamily : "poppine"}}>
                      <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: '45%' }} />
                      </div>
                      <div className="text-xs mt-2">45% Profile Completed</div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center" style={{fontFamily : "poppine"}}>
                      <StatBox label="Streaks" value="54" icon={<Star size={18} />} />
                      <StatBox label="Missions" value="98" icon={<Shield size={18} />} />
                      <StatBox label="Rank" value="02" icon={<Trophy size={18} />} />
                    </div>
                  </div>

                  {/* Weekly Streak */}
                  <div className="bg-green-800 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 font-semibold"> <Calendar size={16} /> Weekly Streak</div>
                      <div className="text-xs">Sep 2025</div>
                    </div>
                    <div className="flex gap-2" style={{fontFamily : "poppine"}}>
                      {renderWeekDays()}
                    </div>
                  </div>

                  {/* Course Progress Row */}
                  <div className="flex gap-3">
                    <div className="flex-1 bg-orange-300 rounded-xl p-3 text-sm">
                      <div className="font-semibold">3 Courses In Progress</div>
                      <div className="text-xs mt-1" style={{fontFamily : "poppine"}}>Keep up the momentum</div>
                    </div>
                    <div className="flex-1 bg-orange-300 rounded-xl p-3 text-sm">
                      <div className="font-semibold">13 Courses Completed</div>
                      <div className="text-xs mt-1" style={{fontFamily : "poppine"}}>Great job!</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="bg-white rounded-xl p-3">
                    <div className="font-semibold mb-2">Badges</div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center">★</div>
                      <div className="w-12 h-12 rounded-full bg-purple-300 flex items-center justify-center">★</div>
                      <div className="w-12 h-12 rounded-full bg-indigo-300 flex items-center justify-center">★</div>
                    </div>
                  </div>
                </aside>
              </>
            ) : activeTab === 'Modules' ? (
              <main className="col-span-12">
                <ModulesContent />
              </main>
            ) : activeTab === 'Assignments' ? (
              <>
                <main className="col-span-8">
                  <AssignmentsContent />
                </main>

                <aside className="col-span-4 space-y-4 sticky top-6">
                  {/* reuse right-hand stats panel from Overview */}
                  <div className="bg-gradient-to-br from-orange-500 to-red-400 rounded-xl p-4 text-white shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                        <Image src="/avatar.png" alt="student" width={64} height={64} className="object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">Ajay Sharma</div>
                        <div className="text-xs opacity-90">Student • 8,979 Points</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: '45%' }} />
                      </div>
                      <div className="text-xs mt-2">45% Profile Completed</div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <StatBox label="Streaks" value="54" icon={<Star size={18} />} />
                      <StatBox label="Missions" value="98" icon={<Shield size={18} />} />
                      <StatBox label="Rank" value="02" icon={<Trophy size={18} />} />
                    </div>
                  </div>

                  <div className="bg-green-800 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 font-semibold"> <Calendar size={16} /> Weekly Streak</div>
                      <div className="text-xs">Sep 2025</div>
                    </div>
                    <div className="flex gap-2">
                      {renderWeekDays()}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 bg-orange-300 rounded-xl p-3 text-sm">
                      <div className="font-semibold">3 Courses In Progress</div>
                      <div className="text-xs mt-1">Keep up the momentum</div>
                    </div>
                    <div className="flex-1 bg-orange-300 rounded-xl p-3 text-sm">
                      <div className="font-semibold">13 Courses Completed</div>
                      <div className="text-xs mt-1">Great job!</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3">
                    <div className="font-semibold mb-2">Badges</div>
                    <div className="flex items-center gap-3"  style={{fontFamily : "poppine"}}>
                      <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center">★</div>
                      <div className="w-12 h-12 rounded-full bg-purple-300 flex items-center justify-center">★</div>
                      <div className="w-12 h-12 rounded-full bg-indigo-300 flex items-center justify-center">★</div>
                    </div>
                  </div>
                </aside>
              </>
            ) : activeTab === 'Missions' ? (
              <>
                <main className="col-span-8">
                  <MissionsContent />
                </main>

                <aside className="col-span-4 space-y-4 sticky top-6">
                  {/* right-hand stats reused */}
                  <div className="bg-gradient-to-br from-orange-500 to-red-400 rounded-xl p-4 text-white shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                        <Image src="/avatar.png" alt="student" width={64} height={64} className="object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">Ajay Sharma</div>
                        <div className="text-xs opacity-90">Student • 8,979 Points</div>
                      </div>
                    </div>
                  </div>
                </aside>
              </>
            ) : activeTab === 'LeaderBoard' ? (
              <main className="col-span-12">
                <LeaderboardContent />
              </main>
            ) : activeTab === 'Messages' ? (
              <main className="col-span-12">
                <MessagesContent />
              </main>
            ) : (
              // default fallback: overview with small notice
              <>
                <main className="col-span-8">
                  <OverviewContent />
                  <div className="mt-6 text-sm text-gray-500">This section is coming soon for &quot;{activeTab}&quot;.</div>
                </main>

                <aside className="col-span-4 space-y-4 sticky top-6">
                  {/* reuse right-hand stats panel from Overview */}
                  <div className="bg-gradient-to-br from-orange-500 to-red-400 rounded-xl p-4 text-white shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                        <Image src="/avatar.png" alt="student" width={64} height={64} className="object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">Ajay Sharma</div>
                        <div className="text-xs opacity-90">Student • 8,979 Points</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: '45%' }} />
                      </div>
                      <div className="text-xs mt-2">45% Profile Completed</div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <StatBox label="Streaks" value="54" icon={<Star size={18} />} />
                      <StatBox label="Missions" value="98" icon={<Shield size={18} />} />
                      <StatBox label="Rank" value="02" icon={<Trophy size={18} />} />
                    </div>
                  </div>

                  <div className="bg-green-800 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 font-semibold"> <Calendar size={16} /> Weekly Streak</div>
                      <div className="text-xs">Sep 2025</div>
                    </div>
                    <div className="flex gap-2">
                      {renderWeekDays()}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 bg-orange-300 rounded-xl p-3 text-sm">
                      <div className="font-semibold">3 Courses In Progress</div>
                      <div className="text-xs mt-1">Keep up the momentum</div>
                    </div>
                    <div className="flex-1 bg-orange-300 rounded-xl p-3 text-sm">
                      <div className="font-semibold">13 Courses Completed</div>
                      <div className="text-xs mt-1">Great job!</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3">
                    <div className="font-semibold mb-2">Badges</div>
                    <div className="flex items-center gap-3"  style={{fontFamily : "poppine"}}>
                      <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center">★</div>
                      <div className="w-12 h-12 rounded-full bg-purple-300 flex items-center justify-center">★</div>
                      <div className="w-12 h-12 rounded-full bg-indigo-300 flex items-center justify-center">★</div>
                    </div>
                  </div>
                </aside>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------------------- Helper components ---------------------- */

function NavItem({ icon, label, badge, activeTab, onClick }: { icon: React.ReactNode; label: string; badge?: string; activeTab?: string; onClick?: () => void }) {
  const isActive = activeTab === label;
  return (
    <div onClick={onClick} className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${isActive ? 'bg-yellow-400 text-black' : 'hover:bg-green-800/60'}`}>
      <div className="flex items-center gap-3">
        <div className="opacity-95">{icon}</div>
        <div className="text-sm font-medium">{label}</div>
      </div>
      {badge && <div className="bg-yellow-400 text-black rounded-full px-2 text-xs">{badge}</div>}
    </div>
  );
}

/** OverviewContent: extracted from previous main central column */
function OverviewContent() {
  return (
    <>
      {/* Continue Learning */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
        <p className="text-l text-gray-600 mb-4 text-white" style={{fontFamily : "poppine"}}>Pick up where you left off</p>

        <div className="flex gap-4 overflow-x-auto pb-2 text-l" style={{fontFamily : "poppine"}}>
          <LearningCard image="/forest.png" title="Solar System Adventure" progress={40} lessons={[1,2,3,4,5]} timeLeft="0:50 mins left" />
          <LearningCard title="Ocean Ecology" progress={65} lessons={[1,2,3,4]} timeLeft="1:10 hrs left" />
        </div>
      </section>

      {/* Recommended Modules */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 text-white">Recommended Modules</h2>
        <div className="text-l text-gray-600 mb-4 text-white"  style={{fontFamily : "poppine"}}>Modules picked for you</div>

        <div className="flex gap-4 overflow-x-auto pb-2" style={{fontFamily : "poppine"}}>
          <RecommendedCard image="/forest.png" title="Forest and Rain" author="Dr. Ayesha" duration="2h 30m (10 Levels)" reward="+500 XP" rating={4.8} players={320} />
          <RecommendedCard image="/study.jpg" title="Wetlands Wonders" author="Dr. Kumar" duration="1h 20m (6 Levels)" reward="+250 XP" rating={4.6} players={120} />
        </div>
      </section>
    </>
  );
}

/** ModulesContent: new full-width modules layout without right-hand stats */
function ModulesContent() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 text-white">Climate & Weather</h2>
        <div className="text-l text-gray-600 mb-4 text-white" style={{fontFamily : "poppine"}}>Top modules about climate and weather</div>

        <div className="flex gap-4 overflow-x-auto pb-2" style={{fontFamily : "poppine"}}>
          <RecommendedCard image="/forest.png" title="Forest and Rain" author="Dr. Ayesha" duration="2h 30m (10 Levels)" reward="+500 XP" rating={4.8} players={320} />
          <RecommendedCard image="/cloud.jpg" title="Storm Systems" author="Dr. Meera" duration="1h 45m (8 Levels)" reward="+350 XP" rating={4.7} players={210} />
          <RecommendedCard image="/earth.jpg" title="Ocean Currents" author="Dr. Suresh" duration="2h 10m (9 Levels)" reward="+420 XP" rating={4.6} players={180} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 text-white">Energy & Resources</h2>
        <div className="text-l text-gray-600 mb-4 text-white" style={{fontFamily : "poppine"}}>Explore modules about energy and sustainable resources</div>

        <div className="flex gap-4 overflow-x-auto pb-2" style={{fontFamily : "poppine"}}>
          <RecommendedCard image="/study12.png" title="Solar Harvest" author="Dr. Patel" duration="1h 50m (7 Levels)" reward="+300 XP" rating={4.5} players={140} />
          <RecommendedCard image="/forest.png" title="Wind Energy Basics" author="Dr. Rao" duration="1h 20m (5 Levels)" reward="+200 XP" rating={4.4} players={110} />
          <RecommendedCard image="/forest.png" title="Sustainable Materials" author="Dr. Amin" duration="2h 00m (8 Levels)" reward="+380 XP" rating={4.6} players={160} />
        </div>
      </section>
    </div>
  );
}

function LearningCard({ image, title, progress, lessons, timeLeft }: { image?: string; title: string; progress: number; lessons: number[]; timeLeft: string }) {
  return (
    <div className="min-w-[320px] bg-purple-600 text-white rounded-xl p-0 flex flex-col shadow-lg overflow-hidden">
      {image && (
        <div className="relative h-28 w-full">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
      )}
      <div className="p-4 flex flex-col">
        <div className="font-semibold text-lg mb-2">{title}</div>
        <div className="text-xs mb-3">{lessons.length}/5 lessons</div>
        <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden mb-2">
          <div className="h-full bg-white" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs opacity-90 mb-4">{timeLeft} • Keep going to Unlock Solar Badge</div>
        <div className="mt-auto">
          <button className="w-full py-2 rounded-md bg-yellow-400 text-black font-semibold flex items-center justify-center gap-2">
            <Play size={14} /> Continue Module
          </button>
        </div>
      </div>
    </div>
  );
}

function RecommendedCard({ image, title, author, duration, reward, rating, players }: { image?: string; title: string; author: string; duration: string; reward: string; rating: number; players: number }) {
  const imgSrc = image ?? '/images/foliage.jpg';
  return (
    <div className="min-w-[380px] bg-white rounded-xl shadow p-0 overflow-hidden">
      <div className="relative h-44">
        <Image src={imgSrc} alt={title} fill className="object-cover" />
        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">7:09</div>
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">30:00</div>
      </div>
      <div className="p-4">
        <div className="font-semibold text-lg">{title}</div>
        <div className="text-sm text-gray-500">By - {author}</div>
        <div className="text-sm text-gray-600 mt-2">Duration: {duration}</div>
        <div className="text-sm text-gray-600">Reward: {reward}</div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-yellow-400 font-semibold">★ Unlock Forest Explorer</div>
            <div className="text-sm text-gray-500">{rating} ({players} players)</div>
          </div>
           <Link href="/course-detail" >
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold">
                Start Now
              </button>
          </Link>      
          </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/20 rounded-md p-3">
      <div className="text-sm opacity-90">{label}</div>
      <div className="flex items-center gap-2 font-bold text-lg">{icon} <span>{value}</span></div>
    </div>
  );
}

function renderWeekDays() {
  const days = [20,21,22,23,24,25,26];
  return days.map((d, i) => (
    <div key={i} className={`w-9 h-9 rounded ${i < 4 ? 'bg-purple-500 text-white' : 'bg-white text-gray-800'} flex flex-col items-center justify-center font-semibold`}>
      <div className="text-xs">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</div>
      <div className="text-sm">{d}</div>
    </div>

  ));
}

/* ---------------------- New Tab Contents: Assignments, Missions, Leaderboard, Messages ---------------------- */

function AssignmentsContent() {
  const assignments = [
    { id: 1, module: 'Solar System Adventure', title: 'Quiz: Planetary Motion', due: 'Sep 28, 2025', status: 'Pending' },
    { id: 2, module: 'Ocean Ecology', title: 'Project: Plastic Cleanup Plan', due: 'Oct 02, 2025', status: 'In Progress' },
    { id: 3, module: 'Forest and Rain', title: 'Assignment: Rainfall Data Analysis', due: 'Oct 05, 2025', status: 'Pending' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-3">Assignments</h2>
      <div className="space-y-3">
        {assignments.map(a => (
          <div key={a.id} className="bg-white/90 rounded-xl p-4 flex items-center justify-between">
            <div style={{fontFamily : "poppine"}}>
              <div className="font-semibold">{a.title}</div>
              <div className="text-sm text-gray-600">Module: {a.module}</div>
              <div className="text-xs text-gray-500">Due: {a.due}</div>
            </div>
            <div className="text-right" style={{fontFamily : "poppine"}}>
              <div className={`px-3 py-1 rounded-full text-sm ${a.status === 'Pending' ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white'}`}>{a.status}</div>
              <button className="mt-2 block bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Open</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MissionsContent() {
  const missions = [
    { id: 1, type: 'Daily', title: 'Collect 50 virtual seeds', reward: 50 },
    { id: 2, type: 'Weekly', title: 'Complete 3 eco-modules', reward: 250 },
    { id: 3, type: 'Challenge', title: 'Plant a community tree', reward: 1000 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-3">Missions</h2>
      <div className="grid grid-cols-1 gap-3">
        {missions.map(m => (
          <div key={m.id} className="bg-white/90 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">{m.type} Mission</div>
              <div className="font-semibold">{m.title}</div>
            </div>
            <div className="text-right">
              <div className="text-sm">Reward</div>
              <div className="font-bold">{m.reward} pts</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardContent() {
  const rows = [
    { rank: 1, name: 'Priya K', points: 12050 },
    { rank: 2, name: 'Ajay Sharma', points: 8979 },
    { rank: 3, name: 'Rina P', points: 8320 },
    { rank: 4, name: 'Suresh K', points: 7800 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-3">Leaderboard</h2>
      <div className="bg-white/90 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Name</th>
              <th className="p-3">Points</th>
            </tr>
          </thead>
          <tbody style={{fontFamily : "poppine"}}>
            {rows.map(r => (
              <tr key={r.rank} className="border-t">
                <td className="p-3 font-semibold">#{r.rank}</td>
                <td className="p-3">{r.name}</td>
                <td className="p-3 font-bold">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MessagesContent() {
  const contacts = [
    { id: 1, name: 'Priya K', last: 'See you in the module!' },
    { id: 2, name: 'Teacher Meera', last: 'Assignment graded' },
    { id: 3, name: 'Suresh', last: 'Let\'s form a study group' },
  ];

  const messages = [
    { id: 1, from: 'Priya K', text: 'Hey, want to join the Solar module?' },
    { id: 2, from: 'You', text: 'Sure! Let\'s start tonight.' },
    { id: 3, from: 'Priya K', text: 'Great — see you then!' },
  ];

  return (
    <div className="grid grid-cols-12 gap-4" style={{fontFamily : "poppine"}}>
      <div className="col-span-4">
        <div className="bg-white/90 rounded-xl p-3 space-y-2">
          {contacts.map(c => (
            <div key={c.id} className="p-2 rounded hover:bg-gray-200 cursor-pointer">
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-gray-600">{c.last}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-8">
        <div className="bg-white/90 rounded-xl p-4 h-[420px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 p-2">
            {messages.map(m => (
              <div key={m.id} className={`max-w-[80%] p-2 rounded ${m.from === 'You' ? 'ml-auto bg-blue-100' : 'bg-gray-100'}`}>
                <div className="text-sm">{m.text}</div>
                <div className="text-xs text-gray-500 mt-1">{m.from}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input className="flex-1 p-2 rounded border" placeholder="Type a message..." />
            <button className="px-4 py-2 bg-green-600 text-white rounded">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
