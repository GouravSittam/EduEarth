"use client";

import React from "react";

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-green-400 to-blue-500 flex flex-col items-center">
      <style>
        {`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>

      <h2 className="absolute top-6 left-1/2 transform -translate-x-1/2 text-black font-bold text-xl bg-yellow-400 px-4 py-2 rounded z-0">
        Trending News
      </h2>

      <div className="overflow-hidden w-500 mt-28">
        <div
          className="flex w-[200%] animate-[scrollLeft_40s_linear_infinite] hover:pause p-10"
          style={{ animationPlayState: "running" }}
        >
          {[...newsData, ...newsData].map((card) => (
            <div
              key={card.id + "-" + Math.random()}
              className="flex-0 w-90 h-120 border-2 border-purple-600 rounded-xl p-4 m-2 shadow-md 
                         flex flex-col items-center text-center transform transition-transform duration-300 
                         hover:scale-105"
            >
              <div className="w-50 h-50 overflow-hidden mb-3">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingNewsCarousel;
