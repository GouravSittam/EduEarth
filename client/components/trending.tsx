"use client";

import React from "react";
import Image from "next/image";

interface NewsCardData {
  id: number;
  image: string; // image URL
  title: string;
  summary: string;
}

const newsData: NewsCardData[] = [
  { id: 1, image: "news.jpg", title: "Breaking News 1", summary: "Lorem ipsum dolor sit amet." },
  { id: 2, image: "news.jpg", title: "Global Update", summary: "Consectetur adipiscing elit." },
  { id: 3, image: "news.jpg", title: "Tech Insights", summary: "Sed do eiusmod tempor incididunt." },
  { id: 4, image: "news.jpg", title: "Politics", summary: "Ut labore et dolore magna aliqua." },
  { id: 5, image: "news.jpg", title: "Business", summary: "Quis nostrud exercitation ullamco." },
  { id: 6, image: "news.jpg", title: "Entertainment", summary: "Laboris nisi ut aliquip ex ea." },
  { id: 7, image: "news.jpg", title: "Sports", summary: "Commodo consequat." },
  { id: 8, image: "news.jpg", title: "Science", summary: "Duis aute irure dolor in reprehenderit." },
];

const TrendingNewsCarousel: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-green-400 to-blue-500 flex flex-col items-center px-4 sm:px-6">
      <style>
        {`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>

      <h2 className="absolute top-6 left-1/2 -translate-x-1/2 text-black font-bold text-base sm:text-xl bg-yellow-400 px-3 sm:px-4 py-2 rounded z-0">
        Trending News
      </h2>

      <div className="overflow-hidden w-full mt-28">
        <div
          className="flex w-[200%] animate-[scrollLeft_40s_linear_infinite] hover:pause p-4 sm:p-6 md:p-10"
          style={{ animationPlayState: "running" }}
        >
          {[...newsData, ...newsData].map((card) => (
            <div
              key={card.id + "-" + Math.random()}
              className="flex-0 w-[220px] sm:w-[260px] md:w-[300px] h-[260px] sm:h-[300px] md:h-[340px] border-2 border-purple-600 rounded-xl p-4 m-2 shadow-md 
                         flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 bg-white/80"
            >
              <div className="w-full h-28 sm:h-32 md:h-36 relative overflow-hidden mb-3 rounded-lg">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 220px, (max-width: 768px) 260px, 300px"
                  className="object-cover"
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{card.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingNewsCarousel;
