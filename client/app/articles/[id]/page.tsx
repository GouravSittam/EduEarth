"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function ArticleDetailPage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/articles/${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("Article not found");
          } else {
            setError("Failed to fetch article");
          }
          return;
        }

        const data = await response.json();
        setArticle(data.data);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("Failed to fetch article");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#141219] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="min-h-screen bg-[#141219] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-red-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h1 className="text-2xl font-bold text-red-400 mb-2">
                {error || "Article not found"}
              </h1>
              <p className="text-zinc-300 mb-6">
                The article you're looking for doesn't exist or has been
                removed.
              </p>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-b from-orange-600 to-yellow-300 hover:from-yellow-300 hover:to-orange-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Articles
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
          Article Details
        </span>
        <UserButton />
      </nav>

      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href="/articles"
              className="inline-flex items-center text-zinc-400 hover:text-green-400 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Articles
            </Link>
          </div>

          {/* Article Container */}
          <article className="bg-gradient-to-b from-slate-700 to-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-600">
            {/* Article Header Image */}
            {article.image_url && (
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={article.image_url}
                  alt={article.headline}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              </div>
            )}

            {/* Article Content */}
            <div className="p-6 md:p-8">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="text-zinc-400 text-sm">
                  {formatDateShort(article.publishDate)}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-6 leading-tight">
                {article.headline}
              </h1>

              {/* AI Summary */}
              {article.ai_summary && (
                <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <svg
                      className="w-5 h-5 text-yellow-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span className="text-yellow-400 font-semibold">
                      AI Summary
                    </span>
                  </div>
                  <p className="text-zinc-200 leading-relaxed font-light">
                    {article.ai_summary}
                  </p>
                </div>
              )}

              {/* Article Body */}
              <div className="prose prose-invert max-w-none mb-8">
                <div className="text-zinc-200 leading-relaxed space-y-4">
                  {article.body.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="font-light">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Article Footer */}
              <div className="border-t border-slate-600 pt-6 mt-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Publication Info */}
                  <div className="text-sm text-zinc-400">
                    <p>
                      <span className="font-medium">Published:</span>{" "}
                      {formatDate(article.publishDate)}
                    </p>
                    <p>
                      <span className="font-medium">Extracted:</span>{" "}
                      {formatDate(article.extractedDate)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-b from-orange-600 to-yellow-300 hover:from-yellow-300 hover:to-orange-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
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
                      Original Source
                    </a>

                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: article.headline,
                            text: article.ai_summary || article.headline,
                            url: window.location.href,
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert("Article link copied to clipboard!");
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all duration-300 border border-slate-600"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
