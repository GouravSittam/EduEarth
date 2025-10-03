"use client";

import React, { useState } from "react";
import { Bell, Settings } from "lucide-react";

// Types for sidebar links
type NavLink = {
  label: string;
  key: string;
};

const navLinks: NavLink[] = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Modules", key: "modules" },
  { label: "Chat", key: "chat" },
];

export default function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  return (
    <div className="flex h-screen" style={{ fontFamily: "poppines",}}>
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col justify-between fixed h-screen p-4">
        <div>
          <h1 className="text-xl font-bold mb-8">Teacher Dashboard</h1>
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.key}
                className={`flex items-center p-2 rounded hover:bg-blue-700 transition ${
                  activeSection === link.key ? "bg-blue-700 font-semibold" : ""
                }`}
                onClick={() => setActiveSection(link.key)}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded cursor-pointer">
          <Settings size={18} /> Settings
        </div>
      </aside>

      {/* Main content container */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="flex justify-between text-black items-center bg-white shadow px-6 py-4 fixed top-0 left-64 right-0 z-10">
          <div className="font-bold text-lg">Teacher Dashboard</div>
          <input
            type="text"
            placeholder="Search Across Modules, Assignments, Missions"
            className="border rounded px-4 py-2 w-1/2"
          />
          <div className="flex items-center gap-4">
            <Bell size={24} />
            <div className="flex items-center gap-2">
              <img
                src="/avatar.jpg"
                alt="Ajay"
                className="w-8 h-8 rounded-full"
              />
              <span>Ajay (Teacher)</span>
            </div>
          </div>
        </header>

        {/* Scrollable main content */}
        <main className="flex-1 bg-gray-50 p-6 pt-24 overflow-auto">
          {activeSection === "dashboard" && <DashboardView />}
          {activeSection === "modules" && <ModulesView />}
          {activeSection === "assignments" && <div>Assignments Content</div>}
          {activeSection === "missions" && <div>Missions Content</div>}
          {activeSection === "reports" && <div>Student Reports Content</div>}
          {activeSection === "certificates" && <div>Certificates & Rewards Content</div>}
          {activeSection === "chat" && <div>Chat Content</div>}
        </main>
      </div>
    </div>
  );
}

// Dashboard View Component
const DashboardView = () => {
  return (
    <div className="flex flex-col gap-6 text-black">
      {/* Row 1: Key Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Welcome back, Ajay</h2>
          <p>42 students learning</p>
          <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded shadow">
            View Profile
          </button>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-4">Today's Schedule</h2>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Assign 2 new modules (Climate & Pollution)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Review progress of Mission 'Save Water Challenge'
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Update weekly leaderboard
            </li>
          </ul>
        </div>

        {/* Calendar & Upcoming Events */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-4">Calendar & Upcoming Events</h2>
          <div className="mb-4">
            <div className="text-center text-lg font-bold">July 2, 2025</div>
            <div className="grid grid-cols-7 gap-1 text-sm mt-2">
              {/* Minimal calendar example */}
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className={`p-1 text-center ${
                    i + 1 === 2 ? "bg-blue-500 text-white rounded" : ""
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Upcoming:</h3>
            <ul className="text-sm flex flex-col gap-1">
              <li>25 Sep - Quiz Deadline A</li>
              <li>25 Sep - Quiz Deadline B</li>
              <li>25 Sep - Quiz Deadline C</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Row 2: Quote & Explore */}
      <div className="grid grid-cols-4 gap-6">
        {/* Quote of the Day */}
        <div className="col-span-1 bg-white p-6 rounded-xl shadow flex items-center justify-center text-center">
          <h2 className="font-semibold text-lg">
            "Every lesson plants the seed of change"
          </h2>
        </div>

        {/* Explore Section */}
        <div className="col-span-3 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Explore</h2>
          <div className="flex gap-4 overflow-x-auto">
            <ActionCard
              title="Upload Module"
              description="Add new learning content instantly."
              buttonText="Upload Now"
            />
            <ActionCard
              title="Set Assignment"
              description="Assign tasks and track submissions."
              buttonText="Create Assignment"
            />
            <ActionCard
              title="Set Mission"
              description="Gamify tasks like tree planting."
              buttonText="Launch Mission"
            />
            <ActionCard
              title="Check Student Progress"
              description="View progress, scores, and attendance."
              buttonText="View Dashboard"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Modules View Component
const ModulesView = () => {
  // stub state for form inputs (could be wired to API later)
  const [moduleName, setModuleName] = useState("");
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");

  const recentModules = Array.from({ length: 4 }).map((_, i) => ({
    id: i + 1,
    title: "Floods & Droughts Explained",
    grade: "Grade 7",
    duration: "30 mins",
    chapters: 5,
    status: i === 1 ? "Draft" : "Uploaded (Sep 25, 2025)",
    image: "/study12.png",
  }));

  return (
    <section id="modules-view" className="text-black flex flex-col gap-6">
      {/* Header + Progress */}
      <div className="bg-white p-6 rounded-xl shadow flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">Modules</h1>
          <p className="text-sm text-gray-600 mb-4">Manage learning modules and monitor student progress.</p>

          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Students' Progress Bar</div>
              <div className="text-sm font-semibold text-gray-700">40% Completed</div>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: "40%",
                  background: "linear-gradient(90deg, #00C853 0%, #40C4FF 100%)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="w-56 ml-6 flex-shrink-0 flex flex-col items-end">
          <div className="text-sm text-gray-500">Overview</div>
          <div className="mt-2 text-lg font-semibold">42 Students</div>
        </div>
      </div>

      {/* Recent Modules */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Modules</h2>
          <button className="text-sm text-blue-600">View All</button>
        </div>

        <div className="flex gap-4 overflow-x-auto py-2">
          {recentModules.map((m) => (
            <ModuleCard key={m.id} module={m} />
          ))}
        </div>
      </div>

      {/* Upload New Module Form */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Upload New Module</h2>
            <p className="text-sm text-gray-600 mb-4">Add a new learning module so your students can access it.</p>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Module Name</label>
                <input
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  placeholder="eg: Floods & Droughts Explained"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="">
                <label className="block text-sm font-medium mb-1">Grade</label>
                <input
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="eg: 8"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="eg: Lorem ipsum is placeholder text..."
                  className="w-full border rounded px-3 py-2 h-28"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="eg: 150 mins"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="eg: Water and Floods"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-2">Export to Sheets</label>
                <div className="flex items-center gap-4">
                  <button type="button" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2">
                    {/* upload icon (inline svg) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v9M8 8l4-4 4 4" />
                    </svg>
                    Upload Now
                  </button>
                  <div className="text-sm text-gray-600">Upload Video / PPT / PDF</div>
                </div>
              </div>
            </form>
          </div>

          {/* Right-side actions: stacked */}
          <div className="w-44 ml-6 flex flex-col items-stretch gap-3">
            <button className="flex items-center gap-2 justify-center bg-green-100 text-green-800 px-4 py-3 rounded shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z" />
              </svg>
              Save as Draft
            </button>

            <button className="flex items-center gap-2 justify-center bg-green-600 text-white px-4 py-3 rounded shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 9l5-5 5 5" />
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v13" />
              </svg>
              Publish Module
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Module Card Component
const ModuleCard = ({ module }: { module: any }) => {
  return (
    <div className="bg-white rounded-xl shadow min-w-[260px] overflow-hidden">
      <img src={module.image} alt={module.title} className="w-full h-36 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold mb-2">{module.title}</h3>
        <div className="text-sm text-gray-600 mb-2">
          <div>Grade: {module.grade}</div>
          <div>Duration: {module.duration}</div>
          <div>Chapters: {module.chapters}</div>
        </div>
        <div className={`text-sm font-medium ${module.status === 'Draft' ? 'text-yellow-600' : 'text-green-600'}`}>
          {module.status}
        </div>
      </div>
    </div>
  );
};

// Action Card Component
type ActionCardProps = {
  title: string;
  description: string;
  buttonText: string;
};
const ActionCard = ({ title, description, buttonText }: ActionCardProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow min-w-[200px] flex flex-col justify-between">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-4">{description}</p>
      <button className="mt-auto bg-blue-600 text-white px-3 py-2 rounded">
        {buttonText}
      </button>
    </div>
  );
};
