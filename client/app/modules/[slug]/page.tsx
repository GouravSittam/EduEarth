"use client";

import { useState, useEffect, use } from "react";
import { Star, Users, Clock, Calendar, Globe, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { modulesData } from "@/lib/modulesData";
import { assignmentsData, missionsData } from "@/lib/moduleExtras";

// Component definitions
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

export default function ModuleDetail({ params }: { params: Promise<{ slug: string }> }) {
    const [activeTab, setActiveTab] = useState("Overview");
    const [module, setModule] = useState<any>(null);
    const [progress, setProgress] = useState(20);

    // Unwrap the params promise using React.use()
    const { slug } = use(params);

    useEffect(() => {
        const foundModule = modulesData.find(m => m.slug === slug);
        if (foundModule) {
            setModule(foundModule);
        }
    }, [slug]);

    if (!module) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-2 bg-green-500 text-white rounded"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const assignments = assignmentsData[module.slug] || [];
    const missions = missionsData[module.slug] || [
        { name: "Complete Module Challenge", obj: "Finish all lessons in this module", reward: "+100 XP", status: "Available" },
    ];

    return (
        <div
            className="p-6 pt-30 bg-white min-h-screen text-black"
            style={{
                fontFamily: "poppins",
                backgroundImage: "url('/cloud.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/30 rounded-b-2xl z-50">
                <Navbar />
            </div>

            {/* Top Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
            >
                <div className="flex justify-between text-xl text-black mb-2 flex-wrap gap-2">
                    <span className="font-bold text-black">{module.title}</span>
                    <span>{module.category}</span>
                    <span>Duration - {module.duration} | {module.chapters} Chapters | {module.missions} Missions</span>
                </div>
                <div className="bg-gray-200 rounded-lg overflow-hidden mb-2 relative h-96 flex items-center justify-center">
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src={module.videoUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                <div className="flex justify-between items-center">
                    <span className="font-bold">You're {progress}% done</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-1 bg-green-500 text-white rounded">Continue</button>
                        <button className="px-4 py-1 bg-gray-300 rounded">Restart</button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-4 py-1 bg-gray-200 rounded"
                        >
                            Exit
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Tabs Navigation */}
            <div className="border-b mb-4 bg-white/80 sticky p-3 rounded">
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
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 p-6 rounded shadow-md"
            >
                {activeTab === "Overview" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">{module.title}</h2>
                        <ul className="mb-4 space-y-2">
                            <li className="flex items-center gap-2"><Star className="text-yellow-400" /> Rating: {module.rating}/5</li>
                            <li className="flex items-center gap-2"><Users /> Students Enrolled: {module.enrolled.toLocaleString()}</li>
                            <li className="flex items-center gap-2"><Clock /> Duration: {module.duration} | {module.chapters} Chapters | {module.missions} Missions</li>
                            <li className="flex items-center gap-2"><Calendar /> Last Updated: {module.lastUpdated}</li>
                            <li className="flex items-center gap-2"><Globe /> Language: English</li>
                        </ul>
                        <div className="flex items-center gap-2 mb-4">
                            <Award className="text-green-500" />
                            <button className="px-3 py-1 bg-green-500 text-white rounded">Download Certificate</button>
                        </div>
                        <p className="mb-4">{module.overview}</p>
                        <div className="mb-4">
                            <h3 className="font-bold mb-2">Related Modules:</h3>
                            <div className="flex overflow-x-auto">
                                {module.relatedModules.map((relatedTitle: string, idx: number) => (
                                    <RecommendedCard key={idx} title={relatedTitle} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Assignments" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Module Assessments & Quizzes</h2>
                        {assignments.length > 0 ? (
                            assignments.map((assignment, idx) => (
                                <AssignmentCard key={idx} {...assignment} />
                            ))
                        ) : (
                            <p>No assignments available for this module yet.</p>
                        )}
                    </div>
                )}

                {activeTab === "Missions" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Real-World Eco Missions</h2>
                        {missions.map((mission, idx) => (
                            <MissionCard key={idx} {...mission} />
                        ))}
                    </div>
                )}

                {activeTab === "Games" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Interactive Learning Games</h2>
                        <GameCard title="Eco Sprint" genre="Quiz Racing Game" />
                        <GameCard title="Eco Strike" genre="Strategy & Problem Solving" />
                        <GameCard title="Recycle Rush" genre="Waste Management Simulation" />
                    </div>
                )}

                {activeTab === "Flashcards" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Key Terms & Definitions</h2>
                        <FlashcardSet title={`${module.category} Vocabulary`} cards={15} />
                        <FlashcardSet title="Sustainability Concepts" cards={12} />
                        <FlashcardSet title="Environmental Science Terms" cards={18} />
                    </div>
                )}
            </motion.div>
        </div>
    );
}
