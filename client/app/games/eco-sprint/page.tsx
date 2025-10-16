"use client";

import { ArrowLeft, HomeIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type Question = {
  id: number;
  question: string;
  options: string[]; // 4 options
};

type MatchedPayload = { gameId: string; you: string; opponent: string };
type QuestionStartPayload = {
  questionNumber: number;
  totalQuestions: number;
  question: Question;
  timeLimit: number;
};

type AnswerResult = {
  by: string;
  isCorrect: boolean;
  ended?: boolean;
  correctAnswer?: number;
  explanation?: string;
  scores: { name: string; score: number }[];
};

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:6969";

export default function GamePage() {
  const [stage, setStage] = useState<
    "idle" | "queue" | "matched" | "playing" | "result" | "ended"
  >("idle");
  const [playerName, setPlayerName] = useState("");
  const [opponent, setOpponent] = useState("");
  const [gameId, setGameId] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState<QuestionStartPayload | null>(null);
  const [answerIdx, setAnswerIdx] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [final, setFinal] = useState<{
    finalScores: { name: string; score: number }[];
    winner: string;
    isWinner: boolean;
  } | null>(null);

  const [timeLeft, setTimeLeft] = useState(0);
  const questionStartRef = useRef<number>(0);
  const timeoutSentRef = useRef<boolean>(false);

  const socketRef = useRef<Socket | null>(null);

  const [defaultName, setDefaultName] = useState("Eco Player");
  useEffect(() => {
    const kids = [
      "Sunny",
      "Breezy",
      "Leafy",
      "Splashy",
      "Pebble",
      "Sprout",
      "Twinkle",
      "Bumble",
    ];
    const animals = [
      "Panda",
      "Koala",
      "Turtle",
      "Dolphin",
      "Frog",
      "Otter",
      "Penguin",
      "Fox",
    ];
    const k = kids[Math.floor(Math.random() * kids.length)];
    const a = animals[Math.floor(Math.random() * animals.length)];
    setDefaultName(`${k} ${a}`);
  }, []);

  useEffect(() => {
    if (stage === "idle") return;
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      const name = playerName.trim() || defaultName;
      socket.emit("join-queue", name);
      setStage("queue");
    });

    socket.on("queue-status", () => {});

    socket.on("game-matched", (p: MatchedPayload) => {
      setGameId(p.gameId);
      setOpponent(p.opponent);
      setStage("matched");
    });

    socket.on("question-start", (q: QuestionStartPayload) => {
      setCurrentQ(q);
      setAnswerIdx(null);
      setResult(null);
      setStage("playing");
      questionStartRef.current = Date.now();
      setTimeLeft(Math.floor(q.timeLimit / 1000));
      timeoutSentRef.current = false;
    });

    socket.on("answer-result", (r: AnswerResult) => {
      setResult(r);

      if (r.ended) setStage("result");
    });

    socket.on("question-reveal", (r: AnswerResult) => {
      setResult({ ...r, ended: true });
      setStage("result");
    });

    socket.on("game-end", (payload) => {
      setFinal(payload);
      setStage("ended");
    });

    socket.on("opponent-disconnected", () => {
      setFinal({ finalScores: [], winner: "Opponent left", isWinner: true });
      setStage("ended");
    });

    return () => {
      socket.disconnect();
    };
  }, [stage !== "idle"]);

  useEffect(() => {
    if (!currentQ || stage !== "playing") return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - questionStartRef.current;
      const remaining = Math.max(
        0,
        Math.floor((currentQ.timeLimit - elapsed) / 1000)
      );
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        if (!timeoutSentRef.current && socketRef.current && gameId) {
          timeoutSentRef.current = true;
          socketRef.current.emit("question-timeout", { gameId });
        }
      }
    }, 250);
    return () => clearInterval(interval);
  }, [currentQ, stage]);

  function startGame() {
    if (stage !== "idle") return;
    setStage("queue");
  }

  function sendAnswer(idx: number) {
    if (!socketRef.current || !gameId || !currentQ) return;
    if (answerIdx !== null) return;
    setAnswerIdx(idx);
    const timeTaken = Date.now() - questionStartRef.current;
    socketRef.current.emit("answer-question", {
      gameId,
      answer: idx,
      timeTaken,
    });
  }

  return (
    <div
      className="min-h-screen text-emerald-900"
      style={{
        backgroundImage:
          "url('/eco-sprint/background.png'), linear-gradient(to bottom, #a7f3d0, #bae6fd)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto max-w-3xl p-6">
        <header className="text-center mb-6">
          <img
            src="/eco-sprint/logo.png"
            alt="Eco Sprint Logo"
            className="mx-auto max-w-80 mb-4 drop-shadow-lg"
          />
          <p className="text-lg font-medium opacity-90 drop-shadow-sm">
            Be the quickest eco-hero!
          </p>
        </header>

        {stage === "idle" && (
          <div className="bg-white/70 rounded-2xl p-6 shadow">
            <label className="block text-sm mb-2">Your fun name</label>
            <input
              className="w-full rounded-xl border border-emerald-300 px-3 py-2 mb-4 bg-white/80"
              placeholder={defaultName}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button
              onClick={startGame}
              className="w-full rounded-xl bg-emerald-600 text-white py-3 hover:bg-emerald-700 transition"
            >
              Play Game
            </button>
            <div className="mt-4 text-xs opacity-80">
              Matchmaking pairs 2 players. Queue size is 1. Questions about the
              environment.
            </div>
          </div>
        )}

        {stage === "queue" && (
          <div className="bg-white/70 rounded-2xl p-6 shadow text-center">
            <p className="text-lg">Waiting for a friend to join…</p>
            <div className="mt-2 animate-bounce">🌱</div>
          </div>
        )}

        {(stage === "matched" || stage === "playing" || stage === "result") && (
          <div className="bg-white/80 rounded-2xl p-6 shadow">
            <div className="flex items-center justify-between text-sm mb-4">
              <span>
                You: <b>{playerName || defaultName}</b>
              </span>
              <span>
                Vs <b>{opponent}</b>
              </span>
            </div>

            {stage !== "matched" && currentQ && (
              <div>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <div>
                    Question {currentQ.questionNumber}/{currentQ.totalQuestions}
                  </div>
                  <div className="font-bold">⏱ {timeLeft}s</div>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                  <div className="text-lg mb-4">
                    {currentQ.question.question}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentQ.question.options.map((opt, i) => (
                      <button
                        key={i}
                        disabled={stage !== "playing" || answerIdx !== null}
                        onClick={() => sendAnswer(i)}
                        className={
                          "rounded-xl border px-3 py-3 text-left bg-white hover:bg-emerald-100 transition " +
                          (answerIdx === i
                            ? " border-emerald-600"
                            : " border-emerald-200")
                        }
                      >
                        <span className="mr-2">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Live banner for wrong attempt while question continues */}
            {stage === "playing" && result && !result.ended && (
              <div className="mt-4 p-3 rounded-xl bg-orange-50 border border-orange-200 text-sm">
                <b>{result.by}</b> answered wrong. The question is still open!
                <div className="mt-1 opacity-70">
                  Be quick and choose wisely 🌿
                </div>
              </div>
            )}

            {stage === "result" && result && (
              <div className="mt-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                {result.by && (
                  <div className="mb-1">
                    <b>{result.by}</b> answered{" "}
                    {result.isCorrect ? "correctly" : "wrong"}.
                  </div>
                )}
                {result.explanation && (
                  <div className="text-sm opacity-80">{result.explanation}</div>
                )}
                <div className="mt-2 text-sm">
                  Scores:{" "}
                  {result.scores
                    .map((s) => `${s.name} (${s.score})`)
                    .join(" • ")}
                </div>
              </div>
            )}
          </div>
        )}

        {stage === "ended" && final && (
          <div className="bg-white/90 rounded-2xl p-6 shadow text-center">
            <div className="text-2xl mb-2">🏆 {final.winner}</div>
            {final.finalScores?.length > 0 && (
              <div className="text-sm mb-4">
                {final.finalScores.map((s, i) => (
                  <div key={i}>
                    {s.name}: {s.score}
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                setStage("idle");
                setGameId(null);
                setOpponent("");
                setCurrentQ(null);
                setAnswerIdx(null);
                setResult(null);
                setFinal(null);
              }}
              className="rounded-xl bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700"
            >
              Play Again
            </button>
          </div>
        )}
        <Link href={"/home"}>
          <button className="absolute top-5 left-5 flex items-center gap-2 bg-gray-800 hover:bg-gray-500 bg-opacity-70 hover:bg-opacity-90 text-white px-4 py-2 rounded-lg shadow-lg border border-white cursor-pointer hover:scale-110 transition-all duration-200">
            <ArrowLeft />
            Home
            <HomeIcon />
          </button>
        </Link>
        <footer className="mt-8 text-center text-xs opacity-70">
          Made for young eco-explorers 🌎
        </footer>
      </div>
    </div>
  );
}
