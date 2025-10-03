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
};

export default class GameServer {
  private io: SocketIOServer;
  private waitingQueue: Player[] = [];
  private activeGames: Map<string, GameSession> = new Map();

  constructor(httpServer: any) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
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

  private setupSocketHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`Player connected: ${socket.id}`);

      socket.on("join-queue", (playerName?: string) => {
        this.handleJoinQueue(socket, playerName);
      });

      socket.on(
        "answer-question",
        (data: { gameId: string; answer: number; timeTaken?: number }) => {
          this.handleAnswer(socket, data);
        }
      );

      socket.on("question-timeout", (data: { gameId: string }) => {
        const game = this.activeGames.get(data.gameId);
        if (
          !game ||
          game.gameState !== "playing" ||
          game.correctFound ||
          game.timedOut
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

  private handleJoinQueue(socket: Socket, playerName?: string) {
    const player: Player = {
      id: uuidv4(),
      name:
        playerName && playerName.trim() ? playerName : this.randomPlayerName(),
      socketId: socket.id,
      score: 0,
    };

    if (this.waitingQueue.length > 0) {
      const waitingPlayer = this.waitingQueue.shift()!;
      this.createGame([waitingPlayer, player]);
    } else {
      this.waitingQueue.push(player);
      socket.emit("queue-status", { status: "waiting", position: 1 as const });
    }
  }

  private createGame(players: Player[]) {
    const gameId = uuidv4();

    const selectedQuestions = [...QUESTIONS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    const gameSession: GameSession = {
      id: gameId,
      players,
      currentQuestion: 0,
      questions: selectedQuestions,
      gameState: "waiting",
      questionStartTime: 0,
      answered: {},
      correctFound: false,
      timedOut: false,
    };

    this.activeGames.set(gameId, gameSession);

    players.forEach((player) => {
      const opponent = players.find((p) => p.id !== player.id)!;
      this.io.to(player.socketId).emit("game-matched", {
        gameId,
        you: player.name,
        opponent: opponent.name,
      });
    });

    setTimeout(() => this.startQuestion(gameId), 1500);
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
      ])
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

      timeLimit: 15000,
    };

    game.players.forEach((p) =>
      this.io.to(p.socketId).emit("question-start", payload)
    );
  }

  private handleAnswer(
    socket: Socket,
    data: { gameId: string; answer: number; timeTaken?: number }
  ) {
    const game = this.activeGames.get(data.gameId);
    if (!game || game.gameState !== "playing") return;

    const player = game.players.find((p) => p.socketId === socket.id);
    if (!player) return;

    const currentQ = game.questions[game.currentQuestion];
    if (!currentQ) return;

    if (game.correctFound || game.timedOut) {
      this.io.to(socket.id).emit("too-late", {});
      return;
    }

    const prev = game.answered[socket.id];
    if (prev?.answered) {
      this.io.to(socket.id).emit("too-late", {});
      return;
    }

    const isCorrect = data.answer === currentQ.correctAnswer;
    const timeTaken = Math.max(
      0,
      Math.min(60000, Math.floor(data.timeTaken ?? 0))
    );

    game.answered[socket.id] = {
      answered: true,
      isCorrect,
      answerIndex: data.answer,
    };

    if (isCorrect) {
      game.correctFound = true;
      const bonus = Math.max(1, 10 - Math.floor(timeTaken / 1000));
      player.score += bonus;
      const resultPayload = {
        by: player.name,
        isCorrect: true,
        ended: true,
        correctAnswer: currentQ.correctAnswer,
        explanation: currentQ.explanation,
        scores: game.players.map((p) => ({ name: p.name, score: p.score })),
      };
      game.players.forEach((p) =>
        this.io.to(p.socketId).emit("answer-result", resultPayload)
      );

      setTimeout(() => {
        game.currentQuestion += 1;
        if (game.currentQuestion >= game.questions.length)
          this.endGame(game.id);
        else this.startQuestion(game.id);
      }, 1500);
      return;
    }

    const partialPayload = {
      by: player.name,
      isCorrect: false,
      ended: false,
      scores: game.players.map((p) => ({ name: p.name, score: p.score })),
    } as const;
    this.io.to(socket.id).emit("answer-result", partialPayload);

    const bothAnswered = game.players.every(
      (p) => game.answered[p.socketId]?.answered
    );
    if (bothAnswered && !game.correctFound) {
      this.revealAndNext(game);
    }
  }

  private revealAndNext(game: GameSession) {
    const currentQ = game.questions[game.currentQuestion];
    if (!currentQ) {
      this.endGame(game.id);
      return;
    }
    const payload = {
      by: null,
      isCorrect: false,
      ended: true,
      correctAnswer: currentQ.correctAnswer,
      explanation: currentQ.explanation,
      scores: game.players.map((p) => ({ name: p.name, score: p.score })),
    };
    game.players.forEach((p) =>
      this.io.to(p.socketId).emit("question-reveal", payload)
    );

    setTimeout(() => {
      game.currentQuestion += 1;
      if (game.currentQuestion >= game.questions.length) this.endGame(game.id);
      else this.startQuestion(game.id);
    }, 1500);
  }

  private endGame(gameId: string) {
    const game = this.activeGames.get(gameId);
    if (!game) return;
    game.gameState = "finished";

    const winner = game.players.reduce((prev, curr) =>
      prev.score >= curr.score ? prev : curr
    );
    const finalScores = game.players.map((p) => ({
      name: p.name,
      score: p.score,
    }));

    game.players.forEach((p) =>
      this.io.to(p.socketId).emit("game-end", {
        finalScores,
        winner: winner.name,
        isWinner: winner.socketId === p.socketId,
      })
    );

    this.activeGames.delete(gameId);
  }

  private handleDisconnect(socket: Socket) {
    this.waitingQueue = this.waitingQueue.filter(
      (p) => p.socketId !== socket.id
    );

    for (const [gameId, game] of this.activeGames.entries()) {
      const player = game.players.find((p) => p.socketId === socket.id);
      if (player) {
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
