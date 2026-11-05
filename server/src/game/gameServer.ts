import { Server as SocketIOServer, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What type of waste is a mobile phone?",
    options: [
      "Biodegradable",
      "Non-biodegradable",
      "Compostable",
      "Recyclable",
    ],
    correctAnswer: 1,
    explanation:
      "Mobile phones contain electronic components and metals that don't break down naturally, making them non-biodegradable waste.",
  },
  {
    id: 2,
    question: "Which of these is a renewable energy source?",
    options: ["Coal", "Solar power", "Natural gas", "Oil"],
    correctAnswer: 1,
    explanation:
      "Solar power comes from the sun and is renewable, unlike fossil fuels like coal, natural gas, and oil.",
  },
  {
    id: 3,
    question: "What is the main cause of global warming?",
    options: [
      "Deforestation",
      "Greenhouse gases",
      "Ocean pollution",
      "Landfills",
    ],
    correctAnswer: 1,
    explanation:
      "Greenhouse gases like carbon dioxide trap heat in the atmosphere, causing global warming.",
  },
  {
    id: 4,
    question: "Which animal is most affected by plastic pollution in oceans?",
    options: ["Sharks", "Sea turtles", "Whales", "All of the above"],
    correctAnswer: 3,
    explanation:
      "All marine animals are affected by plastic pollution, but sea turtles are particularly vulnerable as they often mistake plastic bags for jellyfish.",
  },
  {
    id: 5,
    question: "What is the best way to reduce your carbon footprint?",
    options: [
      "Drive everywhere",
      "Use public transport",
      "Fly frequently",
      "Leave lights on",
    ],
    correctAnswer: 1,
    explanation:
      "Using public transport, walking, or cycling reduces carbon emissions compared to driving alone.",
  },
  {
    id: 6,
    question: "Which material takes the longest to decompose?",
    options: ["Banana peel", "Plastic bottle", "Paper", "Apple core"],
    correctAnswer: 1,
    explanation:
      "Plastic bottles can take up to 450 years to decompose, much longer than organic materials.",
  },
  {
    id: 7,
    question: "What is the primary purpose of recycling?",
    options: [
      "To make money",
      "To reduce waste",
      "To create jobs",
      "All of the above",
    ],
    correctAnswer: 3,
    explanation:
      "Recycling serves multiple purposes: it reduces waste, creates jobs, and can generate revenue.",
  },
  {
    id: 8,
    question: "Which of these is NOT a greenhouse gas?",
    options: ["Carbon dioxide", "Methane", "Oxygen", "Nitrous oxide"],
    correctAnswer: 2,
    explanation:
      "Oxygen is not a greenhouse gas. Carbon dioxide, methane, and nitrous oxide are all greenhouse gases.",
  },
  {
    id: 9,
    question: "What percentage of Earth's water is fresh water?",
    options: ["3%", "25%", "50%", "75%"],
    correctAnswer: 0,
    explanation:
      "Only about 3% of Earth's water is fresh water, and most of that is frozen in glaciers and ice caps.",
  },
  {
    id: 10,
    question: "Which activity uses the most water in a typical household?",
    options: ["Drinking", "Showering", "Washing clothes", "Watering plants"],
    correctAnswer: 2,
    explanation:
      "Washing clothes typically uses the most water in a household, especially with older washing machines.",
  },
  {
    id: 11,
    question: "What is the main benefit of planting trees?",
    options: [
      "They look nice",
      "They absorb CO2",
      "They provide shade",
      "All of the above",
    ],
    correctAnswer: 3,
    explanation:
      "Trees provide multiple benefits including absorbing CO2, providing shade, and improving aesthetics.",
  },
  {
    id: 12,
    question: "Which of these is a sustainable practice?",
    options: [
      "Using single-use plastics",
      "Composting food waste",
      "Burning trash",
      "Leaving taps running",
    ],
    correctAnswer: 1,
    explanation:
      "Composting food waste is a sustainable practice that reduces landfill waste and creates nutrient-rich soil.",
  },
  {
    id: 13,
    question: "What is the biggest source of air pollution in cities?",
    options: ["Factories", "Cars", "Power plants", "Construction"],
    correctAnswer: 1,
    explanation:
      "Vehicle emissions are typically the biggest source of air pollution in urban areas.",
  },
  {
    id: 14,
    question: "Which of these materials is most recyclable?",
    options: ["Glass", "Plastic bags", "Styrofoam", "Mixed materials"],
    correctAnswer: 0,
    explanation:
      "Glass is 100% recyclable and can be recycled indefinitely without losing quality.",
  },
  {
    id: 15,
    question: "What is the main cause of ocean acidification?",
    options: ["Plastic waste", "Oil spills", "Excess CO2", "Sewage"],
    correctAnswer: 2,
    explanation:
      "Ocean acidification is primarily caused by excess CO2 dissolving in seawater, making it more acidic.",
  },
];

type Player = {
  id: string;
  name: string;
  socketId: string;
  score: number;
};

type GameSession = {
  id: string;
  players: Player[];
  currentQuestion: number;
  questions: Question[];
  gameState: "waiting" | "playing" | "finished";
  questionStartTime: number;

  answered: Record<
    string,
    { answered: boolean; isCorrect: boolean | null; answerIndex: number | null }
  >;
  correctFound: boolean;
  timedOut: boolean;
  /** Pending server-side timers (question deadline, next-question delay). */
  timers: Set<NodeJS.Timeout>;
};

const QUESTIONS_PER_GAME = 5;
const QUESTION_TIME_LIMIT_MS = 15_000;
/** Grace period for network latency before the server closes a question. */
const QUESTION_GRACE_MS = 750;
const BETWEEN_QUESTIONS_MS = 2_000;
const MAX_PLAYER_NAME_LENGTH = 24;

/** Unbiased Fisher-Yates shuffle (sort(() => Math.random() - 0.5) is biased). */
const shuffle = <T>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
};

export default class GameServer {
  private io: SocketIOServer;
  private waitingQueue: Player[] = [];
  private activeGames: Map<string, GameSession> = new Map();

  constructor(httpServer: any, options: { corsOrigin?: any } = {}) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: options.corsOrigin ?? "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    this.setupSocketHandlers();
  }

  public getStats() {
    return {
      activeGames: this.activeGames.size,
      waitingPlayers: this.waitingQueue.length,
      totalQuestions: QUESTIONS.length,
    };
  }

  /**
   * Deliver an outbox event. Channel events only go to sockets subscribed to
   * that channel; channel-less events are broadcast.
   */
  public emitOutboxEvent(channel: string, eventName: string, payload: unknown) {
    const room = channel?.trim();
    if (room) {
      this.io.to(room).emit(eventName, payload);
      return;
    }

    this.io.emit(eventName, payload);
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket: Socket) => {
      socket.on("subscribe-channel", (channel: unknown) => {
        if (typeof channel !== "string") {
          return;
        }

        const room = channel.trim().slice(0, 64);
        if (!room) {
          return;
        }

        socket.join(room);
      });

      socket.on("unsubscribe-channel", (channel: unknown) => {
        if (typeof channel !== "string") {
          return;
        }

        const room = channel.trim().slice(0, 64);
        if (!room) {
          return;
        }

        socket.leave(room);
      });

      socket.on("join-queue", (playerName?: unknown) => {
        this.handleJoinQueue(socket, playerName);
      });

      socket.on("answer-question", (data: unknown) => {
        this.handleAnswer(socket, data);
      });

      // Kept for older clients. The server owns the clock, so a client may
      // only end a question once its time has genuinely run out.
      socket.on("question-timeout", (data: unknown) => {
        const gameId = (data as { gameId?: unknown } | null)?.gameId;
        if (typeof gameId !== "string") return;

        const game = this.activeGames.get(gameId);
        if (
          !game ||
          game.gameState !== "playing" ||
          game.correctFound ||
          game.timedOut ||
          !game.players.some((p) => p.socketId === socket.id) ||
          Date.now() - game.questionStartTime < QUESTION_TIME_LIMIT_MS
        )
          return;
        game.timedOut = true;
        this.revealAndNext(game);
      });

      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private schedule(game: GameSession, callback: () => void, delayMs: number) {
    const timer = setTimeout(() => {
      game.timers.delete(timer);
      callback();
    }, delayMs);
    game.timers.add(timer);
  }

  private clearTimers(game: GameSession) {
    for (const timer of game.timers) clearTimeout(timer);
    game.timers.clear();
  }

  private isSocketBusy(socketId: string) {
    if (this.waitingQueue.some((p) => p.socketId === socketId)) return true;
    for (const game of this.activeGames.values()) {
      if (game.players.some((p) => p.socketId === socketId)) return true;
    }
    return false;
  }

  private sanitizeName(playerName: unknown) {
    if (typeof playerName !== "string") return this.randomPlayerName();
    const cleaned = playerName
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .trim()
      .slice(0, MAX_PLAYER_NAME_LENGTH);
    return cleaned || this.randomPlayerName();
  }

  private handleJoinQueue(socket: Socket, playerName?: unknown) {
    // A socket can only wait in the queue or play one game at a time —
    // otherwise it could be matched against itself.
    if (this.isSocketBusy(socket.id)) {
      return;
    }

    const player: Player = {
      id: uuidv4(),
      name: this.sanitizeName(playerName),
      socketId: socket.id,
      score: 0,
    };

    const waitingPlayer = this.waitingQueue.shift();
    if (waitingPlayer) {
      this.createGame([waitingPlayer, player]);
    } else {
      this.waitingQueue.push(player);
      socket.emit("queue-status", { status: "waiting", position: 1 as const });
    }
  }

  private createGame(players: Player[]) {
    const gameId = uuidv4();

    const gameSession: GameSession = {
      id: gameId,
      players,
      currentQuestion: 0,
      questions: shuffle(QUESTIONS).slice(0, QUESTIONS_PER_GAME),
      gameState: "waiting",
      questionStartTime: 0,
      answered: {},
      correctFound: false,
      timedOut: false,
      timers: new Set(),
    };

    this.activeGames.set(gameId, gameSession);

    players.forEach((player) => {
      const opponent = players.find((p) => p.id !== player.id);
      this.io.to(player.socketId).emit("game-matched", {
        gameId,
        you: player.name,
        opponent: opponent?.name ?? "Opponent",
      });
    });

    this.schedule(gameSession, () => this.startQuestion(gameId), 1500);
  }

  private startQuestion(gameId: string) {
    const game = this.activeGames.get(gameId);
    if (!game) return;

    if (game.currentQuestion >= game.questions.length) {
      this.endGame(gameId);
      return;
    }

    game.gameState = "playing";
    game.questionStartTime = Date.now();
    game.correctFound = false;
    game.timedOut = false;

    game.answered = Object.fromEntries(
      game.players.map((p) => [
        p.socketId,
        { answered: false, isCorrect: null, answerIndex: null },
      ]),
    );

    const q = game.questions[game.currentQuestion];
    if (!q) {
      this.endGame(gameId);
      return;
    }
    const payload = {
      questionNumber: game.currentQuestion + 1,
      totalQuestions: game.questions.length,
      question: {
        id: q.id,
        question: q.question,
        options: q.options,
      },

      timeLimit: QUESTION_TIME_LIMIT_MS,
    };

    game.players.forEach((p) =>
      this.io.to(p.socketId).emit("question-start", payload),
    );

    // Server-side deadline: the question closes even if no client reports a
    // timeout (e.g. a tab is backgrounded or a client is tampered with).
    const questionIndex = game.currentQuestion;
    this.schedule(
      game,
      () => {
        if (
          game.currentQuestion !== questionIndex ||
          game.gameState !== "playing" ||
          game.correctFound ||
          game.timedOut
        )
          return;
        game.timedOut = true;
        this.revealAndNext(game);
      },
      QUESTION_TIME_LIMIT_MS + QUESTION_GRACE_MS,
    );
  }

  private handleAnswer(socket: Socket, data: unknown) {
    const { gameId, answer } = (data ?? {}) as { gameId?: unknown; answer?: unknown };
    if (typeof gameId !== "string") return;

    const game = this.activeGames.get(gameId);
    if (!game || game.gameState !== "playing") return;

    const player = game.players.find((p) => p.socketId === socket.id);
    if (!player) return;

    const currentQ = game.questions[game.currentQuestion];
    if (!currentQ) return;

    if (
      typeof answer !== "number" ||
      !Number.isInteger(answer) ||
      answer < 0 ||
      answer >= currentQ.options.length
    ) {
      return;
    }

    // Time is measured by the server; client-reported times are ignored.
    const timeTaken = Date.now() - game.questionStartTime;

    if (
      game.correctFound ||
      game.timedOut ||
      timeTaken > QUESTION_TIME_LIMIT_MS + QUESTION_GRACE_MS
    ) {
      this.io.to(socket.id).emit("too-late", {});
      return;
    }

    const prev = game.answered[socket.id];
    if (prev?.answered) {
      this.io.to(socket.id).emit("too-late", {});
      return;
    }

    const isCorrect = answer === currentQ.correctAnswer;

    game.answered[socket.id] = {
      answered: true,
      isCorrect,
      answerIndex: answer,
    };

    if (isCorrect) {
      game.correctFound = true;
      game.gameState = "waiting";
      // Faster answers earn more: 10 points in the first second, minimum 1.
      const bonus = Math.max(1, 10 - Math.floor(timeTaken / 1000));
      player.score += bonus;
      const resultPayload = {
        by: player.name,
        isCorrect: true,
        ended: true,
        bonus,
        correctAnswer: currentQ.correctAnswer,
        explanation: currentQ.explanation,
        scores: game.players.map((p) => ({ name: p.name, score: p.score })),
      };
      game.players.forEach((p) =>
        this.io.to(p.socketId).emit("answer-result", resultPayload),
      );

      this.advance(game);
      return;
    }

    const partialPayload = {
      by: player.name,
      isCorrect: false,
      ended: false,
      scores: game.players.map((p) => ({ name: p.name, score: p.score })),
    } as const;
    // Both players learn about a wrong answer: the opponent's UI shows
    // "X answered wrong — the question is still open!".
    game.players.forEach((p) =>
      this.io.to(p.socketId).emit("answer-result", partialPayload),
    );

    const bothAnswered = game.players.every(
      (p) => game.answered[p.socketId]?.answered,
    );
    if (bothAnswered && !game.correctFound) {
      this.revealAndNext(game);
    }
  }

  private advance(game: GameSession) {
    this.schedule(
      game,
      () => {
        game.currentQuestion += 1;
        if (game.currentQuestion >= game.questions.length) this.endGame(game.id);
        else this.startQuestion(game.id);
      },
      BETWEEN_QUESTIONS_MS,
    );
  }

  private revealAndNext(game: GameSession) {
    const currentQ = game.questions[game.currentQuestion];
    if (!currentQ) {
      this.endGame(game.id);
      return;
    }
    game.gameState = "waiting";
    const payload = {
      by: null,
      isCorrect: false,
      ended: true,
      correctAnswer: currentQ.correctAnswer,
      explanation: currentQ.explanation,
      scores: game.players.map((p) => ({ name: p.name, score: p.score })),
    };
    game.players.forEach((p) =>
      this.io.to(p.socketId).emit("question-reveal", payload),
    );

    this.advance(game);
  }

  private endGame(gameId: string) {
    const game = this.activeGames.get(gameId);
    if (!game) return;
    game.gameState = "finished";
    this.clearTimers(game);

    const topScore = Math.max(...game.players.map((p) => p.score));
    const leaders = game.players.filter((p) => p.score === topScore);
    const isDraw = leaders.length > 1;
    const winner = isDraw ? null : leaders[0] ?? null;
    const finalScores = game.players.map((p) => ({
      name: p.name,
      score: p.score,
    }));

    game.players.forEach((p) =>
      this.io.to(p.socketId).emit("game-end", {
        finalScores,
        winner: winner ? winner.name : "It's a draw!",
        isWinner: winner?.socketId === p.socketId,
        isDraw,
      }),
    );

    this.activeGames.delete(gameId);
  }

  private handleDisconnect(socket: Socket) {
    this.waitingQueue = this.waitingQueue.filter(
      (p) => p.socketId !== socket.id,
    );

    for (const [gameId, game] of this.activeGames.entries()) {
      const player = game.players.find((p) => p.socketId === socket.id);
      if (player) {
        this.clearTimers(game);
        const opponent = game.players.find((p) => p.socketId !== socket.id);
        if (opponent)
          this.io.to(opponent.socketId).emit("opponent-disconnected", {});
        this.activeGames.delete(gameId);
        break;
      }
    }
  }

  private randomPlayerName() {
    const animals = [
      "Panda",
      "Koala",
      "Tiger",
      "Turtle",
      "Dolphin",
      "Bee",
      "Frog",
      "Otter",
      "Penguin",
      "Fox",
    ];
    const colors = [
      "Green",
      "Sunny",
      "Eco",
      "Leafy",
      "Ocean",
      "Windy",
      "Earthy",
      "Rainy",
    ];
    const a = animals[Math.floor(Math.random() * animals.length)];
    const c = colors[Math.floor(Math.random() * colors.length)];
    const n = Math.floor(Math.random() * 900 + 100);
    return `${c} ${a} ${n}`;
  }
}
