"use client";

import { useState } from "react";
import { Star, Users, Clock, Calendar, Globe, Award } from "lucide-react";
import Navbar from "@/components/Navbar";

// Dummy Components for Tabs
const RecommendedCard = ({ title }: { title: string }) => (
  <div className="min-w-[200px] bg-green-50 p-4 rounded-lg shadow-md mr-4">
    <h3 className="font-bold">{title}</h3>
  </div>
);

const AssignmentCard = ({ title, due, status }: { title: string; due: string; status: string }) => (
  <div className="p-4 border rounded-lg mb-3">
    <h3 className="font-bold">{title}</h3>
    <p>Due: {due}</p>
    <p>Status: {status}</p>
    <button className="mt-2 px-3 py-1 bg-green-500 text-white rounded">Start Assignment</button>
  </div>
);

const MissionCard = ({ name, obj, reward, status }: { name: string; obj: string; reward: string; status: string }) => (
  <div className="p-4 border rounded-lg mb-3">
    <h3 className="font-bold">{name}</h3>
    <p>{obj}</p>
    <p>Reward: {reward}</p>
    <p>Status: {status}</p>
    <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">Start Mission</button>
  </div>
);

const GameCard = ({ title, genre }: { title: string; genre: string }) => (
  <div className="p-4 border rounded-lg mb-3">
    <h3 className="font-bold">{title}</h3>
    <p>{genre}</p>
    <button className="mt-2 px-3 py-1 bg-yellow-400 text-white rounded">Play Now</button>
  </div>
);

const FlashcardSet = ({ title, cards }: { title: string; cards: number }) => (
  <div className="p-4 border rounded-lg mb-3">
    <h3 className="font-bold">{title}</h3>
    <p>{cards} Cards</p>
    <button className="mt-2 px-3 py-1 bg-green-500 text-white rounded">Study Now</button>
  </div>
);

export default function CourseDetails() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (

    <div className="p-6 pt-30 bg-white min-h-screen text-black"
      style={{
        fontFamily: "poppines",
        backgroundImage: "url('/cloud.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      <div className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/30 rounded-b-2xl z-50">
        <Navbar />
      </div>
      {/* Top Section */}
      <div className="mb-6">
        <div className="flex justify-between text-xl text-black mb-2">
          <span className="font-bold text-black">Floods & Droughts Explained</span>
          <span>Climate & Weather</span>
          <span>Duration - 35 mins | 3 Chapters | 2 Missions</span>
        </div>
        <div className="bg-gray-200 rounded-lg overflow-hidden mb-2 relative h-150 flex items-center justify-center">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/x-8n9zSxwl0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>


        <div className="flex justify-between items-center">
          <span className="font-bold">You're 20% done</span>
          <div className="flex gap-2">
            <button className="px-4 py-1 bg-green-500 text-white rounded">Continue</button>
            <button className="px-4 py-1 bg-gray-300 rounded">Restart</button>
            <button className="px-4 py-1 bg-gray-200 rounded">Exit</button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b mb-4 bg-white/80 sticky p-3 rounded ">
        {["Overview", "Assignments", "Missions", "Games", "Flashcards"].map((tab) => (
          <button
            key={tab}
            className={`mr-4 pb-2 ${activeTab === tab ? "border-b-2 border-green-500 font-bold" : "text-gray-500"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="bg-white/80 p-6 rounded shadow-md">
        {activeTab === "Overview" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Floods & Droughts Explained</h2>
            <ul className="mb-4 space-y-2">
              <li className="flex items-center gap-2"><Star className="text-yellow-400" /> Rating: 4.6/5</li>
              <li className="flex items-center gap-2"><Users /> Students Enrolled: 12,350</li>
              <li className="flex items-center gap-2"><Clock /> Duration: 25 mins | 3 Chapters | 2 Missions</li>
              <li className="flex items-center gap-2"><Calendar /> Last Updated: 15 Sept 2025</li>
              <li className="flex items-center gap-2"><Globe /> Language: English</li>
            </ul>
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-green-500" />
              <button className="px-3 py-1 bg-green-500 text-white rounded">Download Certificate</button>
            </div>
            <p className="mb-4">This module covers the essential understanding of floods and droughts, highlighting their causes, effects, and strategies for mitigation. Students will engage with real-world examples and interactive content to grasp the impact on ecosystems and communities.</p>
            <div className="mb-4">
              <h3 className="font-bold mb-2">Related Modules:</h3>
              <div className="flex overflow-x-auto">
                <RecommendedCard title="Forest and Rain" />
                <RecommendedCard title="Water Conservation" />
                <RecommendedCard title="Climate Impacts" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "Assignments" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Module Assessments & Quizzes</h2>
            <AssignmentCard title="Flood Risk Analysis Essay" due="Oct 10th" status="Pending" />
            <AssignmentCard title="Drought Effects Quiz" due="Oct 12th" status="Completed" />
            <AssignmentCard title="Water Management Project" due="Oct 15th" status="Graded" />
          </div>
        )}

        {activeTab === "Missions" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Real-World Eco Missions</h2>
            <MissionCard name="Local Water Usage Audit" obj="Analyze water usage in your community" reward="+150 XP" status="Available" />
            <MissionCard name="Community Clean-up Initiative" obj="Organize a clean-up drive" reward="Eco-Hero Badge" status="In Progress" />
            <MissionCard name="Tree Plantation Drive" obj="Plant trees locally" reward="+200 XP" status="Available" />
          </div>
        )}

        {activeTab === "Games" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Interactive Learning Games</h2>
            <GameCard title="Water Cycle Tycoon" genre="Strategy & Management" />
            <GameCard title="Climate Crisis Simulator" genre="Simulation" />
            <GameCard title="Eco Challenge Quest" genre="Adventure" />
          </div>
        )}

        {activeTab === "Flashcards" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Key Terms & Definitions</h2>
            <FlashcardSet title="Hydrological Cycle Terms" cards={15} />
            <FlashcardSet title="Climate Change Vocabulary" cards={12} />
          </div>
        )}
      </div>
    </div>
  );
}
