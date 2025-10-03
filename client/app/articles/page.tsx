"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import UserButton from "@/components/UserButton";

type Article = {
  section: string;
  source: string;
  publishDate: Date;
  extractedDate: Date;
  createdAt: Date;
  updatedAt: Date;
  headline: string;
  id: string;
  url: string;
  body: string;
  image_url: string | null;
  ai_summary: string | null;
};

export default function ArticlePage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const get = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/articles`
      );

      if (!response.ok) {
        alert("Failed to fetch articles");
        return;
      }

      type ArticlesResponse = {
        data: {
          articles: Article[];
          pagination: {
            currentPage: number;
            totalPages: number;
            totalCount: number;
            hasNext: boolean;
            hasPrev: boolean;
          };
        };
      };

      const { data }: ArticlesResponse = await response.json();

      setArticles(data.articles);
    };

    get();
  }, []);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getArticlePreview = (article: Article) => {
    if (article.ai_summary) {
      return truncateText(article.ai_summary);
    }
    // If no AI summary, show the beginning of the body text
    return truncateText(article.body, 200);
  };

  return (
    <main className="min-h-screen bg-[#141219]">
      {/* Navbar */}
      <nav className="sticky top-0 bg-gradient-to-r from-green-400 to-sky-400 shadow-lg z-50 px-6 py-2 flex items-center justify-between">
        <Link href="/home">
          <Image
            src="/eco-play-logo-small.png"
            alt="ECO Play Logo"
            width={100}
            height={100}
            className="size-15"
          />
        </Link>
        <span className="text-xl text-yellow-300 drop-shadow-[1px_1px_0px_black]">
          Environmental Articles
        </span>
        <UserButton />
      </nav>

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
              Environmental News & Articles
            </h1>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
              Stay updated with the latest environmental news, research, and
              insights from around the world.
            </p>
          </div>

          {/* Loading state */}
          {articles.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
            </div>
          ) : (
            /* Articles Grid */
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-gradient-to-b from-slate-700 to-slate-900 rounded-xl shadow-2xl hover:shadow-green-500/10 transition-all duration-300 overflow-hidden group border border-slate-600 hover:border-green-400/30"
                >
                  {/* Article Image */}
                  <div className="relative h-48 bg-slate-800 overflow-hidden">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.headline}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-600 to-sky-600">
                        <svg
                          className="w-16 h-16 text-white opacity-50"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    {/* Headline */}
                    <h2 className="text-xl font-bold text-green-400 mb-3 line-clamp-2 group-hover:text-green-300 transition-colors">
                      {article.headline}
                    </h2>

                    {/* AI Summary or Body Preview */}
                    <p className="text-zinc-300 mb-4 line-clamp-3 font-light">
                      {getArticlePreview(article)}
                    </p>

                    {/* Article Meta */}
                    <div className="flex items-center justify-between text-sm text-zinc-400 mb-4">
                      <span>Published: {formatDate(article.publishDate)}</span>
                      <span>{formatDate(article.extractedDate)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/articles/${article.id}`}
                        className="inline-flex items-center flex-1 justify-center px-4 py-3 bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Read Article
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </Link>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-3 bg-gradient-to-b from-orange-600 to-yellow-300 hover:from-yellow-300 hover:to-orange-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* AI Summary Indicator */}
                  {article.ai_summary && (
                    <div className="px-6 pb-4">
                      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-yellow-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          <span className="text-yellow-400 text-sm font-medium">
                            AI-generated summary available
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Stats Section */}
          {articles.length > 0 && (
            <div className="mt-16 bg-gradient-to-b from-slate-700 to-slate-900 rounded-xl shadow-2xl p-8 border border-slate-600">
              <h3 className="text-2xl font-bold text-green-400 mb-6 text-center">
                Article Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {articles.length}
                  </div>
                  <div className="text-zinc-300">Total Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-sky-400 mb-2">
                    {new Set(articles.map((a) => a.source)).size}
                  </div>
                  <div className="text-zinc-300">Sources</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {new Set(articles.map((a) => a.section)).size}
                  </div>
                  <div className="text-zinc-300">Sections</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">
                    {articles.filter((a) => a.ai_summary).length}
                  </div>
                  <div className="text-zinc-300">AI Summaries</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
