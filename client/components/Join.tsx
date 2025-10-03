"use client";

import React from "react";
import Link from "next/link";

export default function SparklyGrowthPage() {
  return (
    <div className="pb-30 bg-white flex flex-col items-center border-t-8 border-blue-200">
      {/* Tag */}
      <div className="mt-12 bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium" style={{ fontFamily: "poppines" }}>
        Sparkly Growth
      </div>

      {/* Heading */}
      <h1 className="mt-6 text-3xl md:text-4xl font-bold text-gray-800 text-center">
        Join a Thriving Learning Community
      </h1>

      {/* Paragraph */}
      <p className="mt-4 text-gray-500 text-center text-xl max-w-2xl" style={{ fontFamily: "poppines" }}>
        Sparkly connects you with millions of learners and expert mentors,
        providing the guidance and resources needed to excel in your journey
      </p>

      {/* Cards */}
      <div className="mt-12 flex flex-col md:flex-row gap-6 text-xl" style={{ fontFamily: "poppines" }}  >
        {/* Card 1 */}
        <div className="flex items-center bg-white text-xl rounded-2xl shadow-md px-6 py-4 w-72" >
          <div>
            <p className="text-xl font-bold text-gray-800">2.5M+</p>
            <p className="text-gray-500 text-sm">Engaged Learners</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex items-center bg-white rounded-2xl shadow-md px-6 py-4 w-72">
          <div>
            <p className="text-xl font-bold text-gray-800">5K+</p>
            <p className="text-gray-500 text-sm">Courses Available</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex items-center bg-white rounded-2xl shadow-md px-6 py-4 w-72">
          <div>
            <p className="text-xl font-bold text-gray-800">800+</p>
            <p className="text-gray-500 text-sm">Expert Mentors</p>
          </div>
        </div>
      </div>

      {/* Button */}
      <Link href="#modules">
        <button className="mt-12 bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-full shadow-md transition">
          Explore courses
        </button>
      </Link>
    </div>
  );
}
