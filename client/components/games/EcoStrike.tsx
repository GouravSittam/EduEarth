"use client";

import { ArrowLeft, HomeIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useCallback, useState } from "react";

// Canvas data interface
interface CanvasData {
  canvasWidth: number;
  canvasHeight: number;
  mousePosition: { x: number; y: number };
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isMouseInside: boolean;
}

interface EcoStrikeProps {
  className?: string;
  onDataChange?: (data: CanvasData) => void;
}

// Quiz question interface
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer (0-3)
}

// Game states - similar to RecycleRush but with quiz state
type GameState = "menu" | "playing" | "quiz" | "paused" | "gameOver";

// Quiz questions array
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Which gas is the primary cause of global warming?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: 1,
  },
  {
    question:
      "What is the main source of energy for the Earth's climate system?",
    options: ["Moon", "Sun", "Wind", "Fossil Fuels"],
    correctAnswer: 1,
  },
  {
    question: "Which of the following is a renewable resource?",
    options: ["Coal", "Oil", "Solar Energy", "Natural Gas"],
    correctAnswer: 2,
  },
  {
    question: "Deforestation mainly leads to:",
    options: [
      "Increased rainfall",
      "Soil erosion",
      "Ozone layer protection",
      "Earthquake prevention",
    ],
    correctAnswer: 1,
  },
  {
    question: "The process by which plants release water vapor is called:",
    options: ["Transpiration", "Evaporation", "Condensation", "Precipitation"],
    correctAnswer: 0,
  },
  {
    question: "What percentage of Earth's water is fresh water?",
    options: ["97%", "71%", "3%", "50%"],
    correctAnswer: 2,
  },
  {
    question: "Which layer of the atmosphere contains the ozone layer?",
    options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
    correctAnswer: 1,
  },
  {
    question: "What is the primary cause of ocean acidification?",
    options: [
      "Plastic pollution",
      "Oil spills",
      "Carbon dioxide absorption",
      "Overfishing",
    ],
    correctAnswer: 2,
  },
  {
    question: "Which country produces the most carbon emissions?",
    options: ["United States", "India", "China", "Russia"],
    correctAnswer: 2,
  },
  {
    question: "What is biodiversity?",
    options: [
      "The study of life",
      "Variety of life in ecosystems",
      "Population growth",
      "Climate change effects",
    ],
    correctAnswer: 1,
  },
  {
    question: "Which of these is NOT a greenhouse gas?",
    options: ["Carbon Dioxide", "Methane", "Oxygen", "Nitrous Oxide"],
    correctAnswer: 2,
  },
  {
    question: "What is the main cause of coral bleaching?",
    options: [
      "Pollution",
      "Overfishing",
      "Rising sea temperatures",
      "Acidification",
    ],
    correctAnswer: 2,
  },
  {
    question: "How much of the Amazon rainforest has been deforested?",
    options: ["About 17%", "About 5%", "About 30%", "About 50%"],
    correctAnswer: 0,
  },
  {
    question: "Which renewable energy source is most widely used globally?",
    options: ["Solar", "Wind", "Hydroelectric", "Geothermal"],
    correctAnswer: 2,
  },
  {
    question: "What is the most abundant plastic pollutant in oceans?",
    options: ["Bottles", "Bags", "Microplastics", "Fishing nets"],
    correctAnswer: 2,
  },
  {
    question: "Which ecosystem stores the most carbon?",
    options: ["Tropical forests", "Grasslands", "Wetlands", "Oceans"],
    correctAnswer: 3,
  },
  {
    question:
      "What is the average global temperature increase since pre-industrial times?",
    options: ["0.5°C", "1.1°C", "2.0°C", "3.0°C"],
    correctAnswer: 1,
  },
  {
    question:
      "Which animal is considered an indicator species for climate change?",
    options: ["Elephants", "Polar bears", "Tigers", "Pandas"],
    correctAnswer: 1,
  },
  {
    question: "What is the largest source of methane emissions?",
    options: [
      "Livestock",
      "Landfills",
      "Natural gas production",
      "Rice cultivation",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which country has the largest area of protected land?",
    options: ["Brazil", "United States", "Russia", "Australia"],
    correctAnswer: 1,
  },
  {
    question: "What is the main component of smog?",
    options: [
      "Carbon monoxide",
      "Sulfur dioxide",
      "Ground-level ozone",
      "Nitrogen dioxide",
    ],
    correctAnswer: 2,
  },
  {
    question: "Which energy source has the lowest carbon footprint?",
    options: ["Natural gas", "Nuclear", "Solar", "Wind"],
    correctAnswer: 1,
  },
  {
    question:
      "What percentage of species are currently threatened with extinction?",
    options: ["5%", "10%", "25%", "40%"],
    correctAnswer: 2,
  },
  {
    question: "Which region is experiencing the fastest rate of warming?",
    options: ["Tropics", "Arctic", "Deserts", "Temperate zones"],
    correctAnswer: 1,
  },
  {
    question: "What is the primary driver of habitat loss?",
    options: [
      "Climate change",
      "Pollution",
      "Agriculture expansion",
      "Urbanization",
    ],
    correctAnswer: 2,
  },
  {
    question: "Which gas has the highest global warming potential?",
    options: [
      "Carbon dioxide",
      "Methane",
      "Nitrous oxide",
      "Sulfur hexafluoride",
    ],
    correctAnswer: 3,
  },
  {
    question: "What is the main cause of groundwater depletion?",
    options: ["Climate change", "Over-pumping", "Pollution", "Natural cycles"],
    correctAnswer: 1,
  },
  {
    question: "Which biome has the highest biodiversity?",
    options: [
      "Temperate forests",
      "Tropical rainforests",
      "Grasslands",
      "Tundra",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is the most effective way to reduce carbon footprint?",
    options: [
      "Recycling",
      "Using LED bulbs",
      "Reducing meat consumption",
      "Flying less",
    ],
    correctAnswer: 2,
  },
  {
    question: "Which environmental problem affects the most people globally?",
    options: [
      "Air pollution",
      "Water scarcity",
      "Climate change",
      "Deforestation",
    ],
    correctAnswer: 0,
  },
];

// Character class for both hero and villain
class Character {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  image: HTMLImageElement | null = null;
  imageLoaded: boolean = false;
  isHero: boolean;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    isHero: boolean
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.health = 100;
    this.maxHealth = 100;
    this.isHero = isHero;

    // Load character image
    this.image = new Image();
    this.image.src = isHero
      ? "/eco-strike/hero.png"
      : "/eco-strike/villain.png";
    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  takeDamage(damage: number) {
    this.health = Math.max(0, this.health - damage);
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.image && this.image.complete && this.imageLoaded) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      // Fallback rectangle
      ctx.fillStyle = this.isHero ? "#4CAF50" : "#F44336"; // Green for hero, Red for villain
      ctx.fillRect(this.x, this.y, this.width, this.height);

      // Draw border
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}

export default function EcoStrike({
  className = "",
  onDataChange,
}: EcoStrikeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const heroRef = useRef<Character | null>(null);
  const villainRef = useRef<Character | null>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);

  // Animation images
  const explosionImageRef = useRef<HTMLImageElement | null>(null);
  const heroFireBlastRef = useRef<HTMLImageElement | null>(null);
  const villainFireBlastRef = useRef<HTMLImageElement | null>(null);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<
    "correct" | "wrong" | null
  >(null);

  // Animation states - using refs to avoid re-renders
  const isHeroAttackingRef = useRef(false);
  const isVillainAttackingRef = useRef(false);
  const explosionPositionRef = useRef<{ x: number; y: number } | null>(null);

  // Fire blast animation states
  const heroBlastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const villainBlastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const heroBlastAnimationRef = useRef<number | null>(null);
  const villainBlastAnimationRef = useRef<number | null>(null);

  // Damage indicator states
  const damageIndicatorRef = useRef<{
    x: number;
    y: number;
    opacity: number;
    startTime: number;
    target: "hero" | "villain";
  } | null>(null);
  const damageAnimationRef = useRef<number | null>(null);

  // Function to get a random question index
  const getRandomQuestionIndex = useCallback(() => {
    return Math.floor(Math.random() * QUIZ_QUESTIONS.length);
  }, []);

  const [canvasData, setCanvasData] = useState<CanvasData>({
    canvasWidth: 0,
    canvasHeight: 0,
    mousePosition: { x: 0, y: 0 },
    canvasRef,
    containerRef,
    isMouseInside: false,
  });

  // Initialize game objects
  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load background image
    if (!backgroundImageRef.current) {
      backgroundImageRef.current = new Image();
      backgroundImageRef.current.src = "/eco-strike/background.jpg";
    }

    // Load animation images
    if (!explosionImageRef.current) {
      explosionImageRef.current = new Image();
      explosionImageRef.current.src = "/eco-strike/explosion.png";
    }
    if (!heroFireBlastRef.current) {
      heroFireBlastRef.current = new Image();
      heroFireBlastRef.current.src = "/eco-strike/fire-blast-hero.png";
    }
    if (!villainFireBlastRef.current) {
      villainFireBlastRef.current = new Image();
      villainFireBlastRef.current.src = "/eco-strike/fire-blast-villain.png";
    }

    // Platform positioning - characters should stand on the stone platform
    // Assuming the platform is roughly in the bottom 25% of the image
    const platformHeight = canvas.height * 0.75; // Platform starts at 75% down from top

    // Create hero on the left side - positioned on platform - scaled up further
    const heroWidth = 200; // Increased from 160
    const heroHeight = 250; // Increased from 200 (maintaining aspect ratio)
    const heroX = canvas.width * 0.25 - heroWidth / 2; // Left quarter of screen
    const heroY = platformHeight - heroHeight; // Standing on platform

    heroRef.current = new Character(heroX, heroY, heroWidth, heroHeight, true);

    // Create villain on the right side - positioned on platform - scaled up further
    const villainWidth = 200; // Increased from 160
    const villainHeight = 250; // Increased from 200 (maintaining aspect ratio)
    const villainX = canvas.width * 0.75 - villainWidth / 2; // Right quarter of screen
    const villainY = platformHeight - villainHeight; // Standing on platform

    villainRef.current = new Character(
      villainX,
      villainY,
      villainWidth,
      villainHeight,
      false
    );
  }, []);

  // Game control functions - adapted from RecycleRush
  const startGame = useCallback(() => {
    setGameState("playing"); // Start in playing state first
    setCurrentQuestionIndex(getRandomQuestionIndex()); // Start with random question

    // Reset characters' health
    if (heroRef.current) heroRef.current.health = 100;
    if (villainRef.current) villainRef.current.health = 100;

    // Start first quiz after a brief moment
    setTimeout(() => {
      if (
        heroRef.current &&
        villainRef.current &&
        !heroRef.current.isDead() &&
        !villainRef.current.isDead()
      ) {
        setGameState("quiz");
      }
    }, 1000);
  }, [getRandomQuestionIndex]);

  const pauseGame = useCallback(() => {
    if (gameState === "playing" || gameState === "quiz") {
      setGameState("paused");
    }
  }, [gameState]);

  const resumeGame = useCallback(() => {
    setGameState("quiz");
  }, []);

  const goToMainMenu = useCallback(() => {
    setGameState("menu");
    setCurrentQuestionIndex(getRandomQuestionIndex()); // Reset to random question

    // Cancel animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [getRandomQuestionIndex]);

  const gameOver = useCallback((heroWon: boolean) => {
    setGameState("gameOver");

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Clear any ongoing blast animations
    if (heroBlastAnimationRef.current) {
      cancelAnimationFrame(heroBlastAnimationRef.current);
      heroBlastAnimationRef.current = null;
    }
    if (villainBlastAnimationRef.current) {
      cancelAnimationFrame(villainBlastAnimationRef.current);
      villainBlastAnimationRef.current = null;
    }

    // Clear damage animation
    if (damageAnimationRef.current) {
      cancelAnimationFrame(damageAnimationRef.current);
      damageAnimationRef.current = null;
    }
    damageIndicatorRef.current = null;
  }, []);

  // Animate hero fire blast movement
  const animateHeroBlast = useCallback(() => {
    if (!heroRef.current || !villainRef.current || !isHeroAttackingRef.current)
      return;

    // Start from center of hero
    const startX = heroRef.current.x + heroRef.current.width / 2 - 50; // Center blast on hero
    const startY = heroRef.current.y + heroRef.current.height / 2 - 50;

    // End at center of villain
    const targetX = villainRef.current.x + villainRef.current.width / 2 - 50; // Center blast on villain
    const targetY = villainRef.current.y + villainRef.current.height / 2 - 50;

    const startTime = performance.now();
    const duration = 800; // 800ms for blast to travel

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentX = startX + (targetX - startX) * easeProgress;
      const currentY = startY + (targetY - startY) * easeProgress;

      heroBlastPositionRef.current = { x: currentX, y: currentY };

      if (progress < 1) {
        heroBlastAnimationRef.current = requestAnimationFrame(animate);
      } else {
        // Blast reached target
        isHeroAttackingRef.current = false;
        heroBlastPositionRef.current = null;
        heroBlastAnimationRef.current = null;
      }
    };

    heroBlastAnimationRef.current = requestAnimationFrame(animate);
  }, []);

  // Animate villain fire blast movement
  const animateVillainBlast = useCallback(() => {
    if (
      !heroRef.current ||
      !villainRef.current ||
      !isVillainAttackingRef.current
    )
      return;

    // Start from center of villain
    const startX = villainRef.current.x + villainRef.current.width / 2 - 50; // Center blast on villain
    const startY = villainRef.current.y + villainRef.current.height / 2 - 50;

    // End at center of hero
    const targetX = heroRef.current.x + heroRef.current.width / 2 - 50; // Center blast on hero
    const targetY = heroRef.current.y + heroRef.current.height / 2 - 50;

    const startTime = performance.now();
    const duration = 800; // 800ms for blast to travel

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentX = startX + (targetX - startX) * easeProgress;
      const currentY = startY + (targetY - startY) * easeProgress;

      villainBlastPositionRef.current = { x: currentX, y: currentY };

      if (progress < 1) {
        villainBlastAnimationRef.current = requestAnimationFrame(animate);
      } else {
        // Blast reached target
        isVillainAttackingRef.current = false;
        villainBlastPositionRef.current = null;
        villainBlastAnimationRef.current = null;
      }
    };

    villainBlastAnimationRef.current = requestAnimationFrame(animate);
  }, []);

  // Animate damage indicator
  const animateDamageIndicator = useCallback((target: "hero" | "villain") => {
    const character = target === "hero" ? heroRef.current : villainRef.current;
    if (!character) return;

    // Position damage indicator above character center
    const startTime = performance.now();
    const duration = 1500; // 1.5 seconds for damage indicator

    damageIndicatorRef.current = {
      x: character.x + character.width / 2,
      y: character.y - 20, // Start above character
      opacity: 1,
      startTime,
      target,
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (!damageIndicatorRef.current) return;

      // Move upward and fade out
      const moveDistance = 50; // Move up 50px
      const easeProgress = 1 - Math.pow(1 - progress, 2); // Ease out

      damageIndicatorRef.current.y =
        character.y - 20 - moveDistance * easeProgress;
      damageIndicatorRef.current.opacity = 1 - progress;

      if (progress < 1) {
        damageAnimationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        damageIndicatorRef.current = null;
        damageAnimationRef.current = null;
      }
    };

    damageAnimationRef.current = requestAnimationFrame(animate);
  }, []);

  // Handle answer selection
  const handleAnswerSelect = useCallback(
    (selectedIndex: number) => {
      const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
      const isCorrect = selectedIndex === currentQuestion.correctAnswer;

      // Set selected answer and feedback for UI - but don't change game state yet
      setSelectedAnswer(selectedIndex);
      setAnswerFeedback(isCorrect ? "correct" : "wrong");

      // Wait for feedback display, then start animations
      setTimeout(() => {
        if (isCorrect) {
          // Hero attacks villain - start animated fire blast
          isHeroAttackingRef.current = true;
          animateHeroBlast();
          console.log("Correct! Hero attacks villain");

          // Wait for blast to reach target, then show explosion
          setTimeout(() => {
            if (villainRef.current) {
              explosionPositionRef.current = {
                x: villainRef.current.x + villainRef.current.width / 2,
                y: villainRef.current.y + villainRef.current.height / 2,
              };

              // Show damage indicator
              animateDamageIndicator("villain");
            }
            villainRef.current?.takeDamage(10);

            // Clear explosion after duration
            setTimeout(() => {
              explosionPositionRef.current = null;
            }, 800);
          }, 800); // Wait for blast animation to complete
        } else {
          // Villain attacks hero - start animated fire blast
          isVillainAttackingRef.current = true;
          animateVillainBlast();
          console.log("Wrong! Villain attacks hero");

          // Wait for blast to reach target, then show explosion
          setTimeout(() => {
            if (heroRef.current) {
              explosionPositionRef.current = {
                x: heroRef.current.x + heroRef.current.width / 2,
                y: heroRef.current.y + heroRef.current.height / 2,
              };

              // Show damage indicator
              animateDamageIndicator("hero");
            }
            heroRef.current?.takeDamage(10);

            // Clear explosion after duration
            setTimeout(() => {
              explosionPositionRef.current = null;
            }, 800);
          }, 800); // Wait for blast animation to complete
        }

        // Check for game over and move to next question after all animations complete
        setTimeout(() => {
          if (heroRef.current?.isDead()) {
            gameOver(false); // Villain wins
            return;
          }

          if (villainRef.current?.isDead()) {
            gameOver(true); // Hero wins
            return;
          }

          // Move to next question (random selection)
          const nextQuestionIndex = getRandomQuestionIndex();
          setCurrentQuestionIndex(nextQuestionIndex);

          // Clear answer feedback and keep quiz state - no disappearing
          setSelectedAnswer(null);
          setAnswerFeedback(null);

          // Stay in quiz state - no flicker
          // No need to change to "playing" and back to "quiz"
        }, 2000); // Total animation time: 800ms fire blast + 800ms explosion + 400ms buffer
      }, 1200); // Show feedback for 1.2 seconds before starting animations
    },
    [
      currentQuestionIndex,
      gameOver,
      getRandomQuestionIndex,
      animateHeroBlast,
      animateVillainBlast,
      animateDamageIndicator,
    ]
  );

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        e.preventDefault();
        if (gameState === "quiz") {
          pauseGame();
        }
      }
    },
    [gameState, pauseGame]
  );

  // Draw function to render the current state
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image to fit the canvas
    if (backgroundImageRef.current && backgroundImageRef.current.complete) {
      ctx.drawImage(
        backgroundImageRef.current,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } else {
      // Fallback gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#87CEEB"); // Sky blue at top
      gradient.addColorStop(0.7, "#98FB98"); // Light green for ground
      gradient.addColorStop(1, "#696969"); // Dark gray for platform
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw characters (they'll appear on top of the background)
    if (heroRef.current) {
      heroRef.current.draw(ctx);
      drawCharacterHealthBar(ctx, heroRef.current, true);
    }

    if (villainRef.current) {
      villainRef.current.draw(ctx);
      drawCharacterHealthBar(ctx, villainRef.current, false);
    }

    // Draw attack animations
    if (
      heroBlastPositionRef.current &&
      heroFireBlastRef.current &&
      heroFireBlastRef.current.complete
    ) {
      // Hero fire blast - animated position
      ctx.drawImage(
        heroFireBlastRef.current,
        heroBlastPositionRef.current.x,
        heroBlastPositionRef.current.y,
        100,
        100
      );
    }

    if (
      villainBlastPositionRef.current &&
      villainFireBlastRef.current &&
      villainFireBlastRef.current.complete
    ) {
      // Villain fire blast - animated position
      ctx.drawImage(
        villainFireBlastRef.current,
        villainBlastPositionRef.current.x,
        villainBlastPositionRef.current.y,
        100,
        100
      );
    }

    // Draw explosion effect
    if (
      explosionPositionRef.current &&
      explosionImageRef.current &&
      explosionImageRef.current.complete
    ) {
      // Center explosion on the target
      const explosionSize = 120;
      const explosionX = explosionPositionRef.current.x - explosionSize / 2;
      const explosionY = explosionPositionRef.current.y - explosionSize / 2;
      ctx.drawImage(
        explosionImageRef.current,
        explosionX,
        explosionY,
        explosionSize,
        explosionSize
      );
    }

    // Draw damage indicator
    if (damageIndicatorRef.current) {
      const damage = damageIndicatorRef.current;
      ctx.save();
      ctx.globalAlpha = damage.opacity;

      // Draw -10 HP text
      ctx.fillStyle = "#FF0000";
      ctx.strokeStyle = "#FFFFFF";
      ctx.font = "bold 24px Arial";
      ctx.lineWidth = 3;
      ctx.textAlign = "center";

      const text = "-10 HP";
      ctx.strokeText(text, damage.x, damage.y);
      ctx.fillText(text, damage.x, damage.y);

      ctx.restore();
    }
  }, []);

  // Draw health bars above characters
  const drawCharacterHealthBar = useCallback(
    (ctx: CanvasRenderingContext2D, character: Character, isHero: boolean) => {
      const barWidth = 140;
      const barHeight = 12;
      const barX = character.x + (character.width - barWidth) / 2;
      const barY = character.y - 25; // Above the character

      const healthPercent = character.health / character.maxHealth;

      // Background
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(barX, barY, barWidth, barHeight);

      // Health bar
      ctx.fillStyle = isHero
        ? healthPercent > 0.3
          ? "#4CAF50"
          : "#F44336"
        : healthPercent > 0.3
        ? "#F44336"
        : "#666";
      ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

      // Border
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.strokeRect(barX, barY, barWidth, barHeight);

      // HP text above the bar
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.strokeText(
        `${character.health}/100 HP`,
        barX + barWidth / 2,
        barY - 5
      );
      ctx.fillText(`${character.health}/100 HP`, barX + barWidth / 2, barY - 5);
    },
    []
  );

  // Animation loop
  const animate = useCallback(() => {
    draw();

    if (gameState === "playing" || gameState === "quiz") {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      animationFrameRef.current = null;
    }
  }, [gameState, draw]);

  // Handle window resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const containerRect = container.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;

    const newCanvasData = {
      ...canvasData,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    };

    setCanvasData(newCanvasData);
    onDataChange?.(newCanvasData);
    init();
  }, [canvasData, onDataChange, init]);

  // Setup canvas and event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Initial canvas setup
    const containerRect = container.getBoundingClientRect();
    canvas.width = containerRect.width || window.innerWidth;
    canvas.height = containerRect.height || window.innerHeight;

    const initialCanvasData = {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      mousePosition: { x: canvas.width / 2, y: canvas.height / 2 },
      canvasRef,
      containerRef,
      isMouseInside: false,
    };

    setCanvasData(initialCanvasData);
    onDataChange?.(initialCanvasData);

    // Event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    // Initialize
    init();
    setTimeout(() => draw(), 0);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Control animation loop based on game state
  useEffect(() => {
    if (gameState === "playing" || gameState === "quiz") {
      if (!animationFrameRef.current) {
        animate();
      }
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      draw();
    }
  }, [gameState, animate, draw]);

  return (
    <div
      className={`flex flex-col w-full h-screen overflow-hidden ${className}`}
      ref={containerRef}
    >
      {/* Canvas section - takes remaining space above quiz */}
      <div className="flex-1 min-h-0 relative">
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* Pause Button (only visible during quiz) */}
        {gameState === "quiz" && (
          <img
            onClick={pauseGame}
            src="/eco-strike/pause-button.png"
            alt="Pause"
            className="absolute top-5 left-5 w-12 h-12 cursor-pointer z-50 hover:scale-110 transition-transform duration-300 drop-shadow-lg"
          />
        )}
      </div>

      {/* Quiz section - positioned at bottom, with expand animation */}
      <div
        className={`flex-shrink-0 overflow-hidden transition-all duration-500 ease-out bg-cover bg-center ${
          gameState === "quiz" ? "max-h-[40vh]" : "max-h-0"
        }`}
        style={{ backgroundImage: "url('/eco-strike/ground-bg.png')" }}
      >
        <div className="p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3 text-white text-center drop-shadow-2xl">
              Environmental Battle Challenge
            </h2>
            <p className="text-lg mb-4 text-white text-center font-medium drop-shadow-xl">
              {QUIZ_QUESTIONS[currentQuestionIndex].question}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {QUIZ_QUESTIONS[currentQuestionIndex].options.map(
                (option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectAnswer =
                    index ===
                    QUIZ_QUESTIONS[currentQuestionIndex].correctAnswer;

                  let buttonStyle =
                    "p-3 backdrop-blur-md border-2 rounded-xl text-left transition-all duration-300 shadow-xl text-white transform ";

                  if (answerFeedback && isSelected) {
                    // Show feedback for selected answer
                    if (answerFeedback === "correct") {
                      buttonStyle +=
                        "bg-green-600/80 border-green-400 scale-105 animate-pulse shadow-2xl shadow-green-500/50";
                    } else {
                      buttonStyle +=
                        "bg-red-600/80 border-red-400 scale-105 animate-pulse shadow-2xl shadow-red-500/50";
                    }
                  } else if (answerFeedback && isCorrectAnswer && !isSelected) {
                    // Show correct answer if user selected wrong
                    buttonStyle +=
                      "bg-green-600/60 border-green-400 animate-pulse";
                  } else {
                    // Default state
                    buttonStyle +=
                      "bg-black/40 hover:bg-black/60 border-white/30 hover:border-white/60 hover:scale-105";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        !answerFeedback ? handleAnswerSelect(index) : undefined
                      }
                      className={buttonStyle}
                      disabled={answerFeedback !== null}
                    >
                      <span className="font-bold text-yellow-300 mr-3 text-base drop-shadow-lg">
                        {String.fromCharCode(65 + index)})
                      </span>
                      <span className="text-white text-base font-medium drop-shadow-lg">
                        {option}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      {gameState === "menu" && (
        <div
          className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white font-sans text-center z-[100] bg-cover bg-center"
          style={{ backgroundImage: "url('/eco-strike/background.jpg')" }}
        >
          <img
            src="/eco-strike/logo.png"
            alt="Eco Strike Logo"
            className="max-w-100 mb-8 drop-shadow-2xl"
          />
          <img
            onClick={startGame}
            src="/eco-strike/play-button.png"
            alt="Start Battle"
            className="w-40 cursor-pointer hover:scale-110 transition-transform duration-300 drop-shadow-2xl"
          />
          <Link href={"/home"}>
            <button className="absolute top-5 left-5 flex items-center gap-2 bg-gray-800 hover:bg-gray-500 bg-opacity-70 hover:bg-opacity-90 text-white px-4 py-2 rounded-lg shadow-lg border border-white cursor-pointer hover:scale-110 transition-all duration-200">
              <ArrowLeft />
              Home
              <HomeIcon />
            </button>
          </Link>
        </div>
      )}

      {/* Pause Menu */}
      {gameState === "paused" && (
        <div
          className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-white font-sans text-center z-[100] bg-cover bg-center"
          style={{ backgroundImage: "url('/eco-strike/background.jpg')" }}
        >
          <h1 className="text-5xl mb-8 text-green-400 drop-shadow-lg">
            PAUSED
          </h1>
          <div className="flex gap-5 bg-black bg-opacity-50 p-8 rounded-lg">
            <button
              onClick={resumeGame}
              className="text-xl px-6 py-3 bg-green-500 text-white border-0 rounded-lg cursor-pointer shadow-lg hover:bg-green-600 transition-all duration-300 ease-in-out hover:scale-105"
            >
              Resume
            </button>
            <button
              onClick={goToMainMenu}
              className="text-xl px-6 py-3 bg-red-500 text-white border-0 rounded-lg cursor-pointer shadow-lg hover:bg-red-600 transition-all duration-300 ease-in-out hover:scale-105"
            >
              Main Menu
            </button>
          </div>
          <Link href={"/home"}>
            <button className="absolute top-5 left-5 flex items-center gap-2 bg-gray-800 hover:bg-gray-500 bg-opacity-70 hover:bg-opacity-90 text-white px-4 py-2 rounded-lg shadow-lg border border-white cursor-pointer hover:scale-110 transition-all duration-200">
              <ArrowLeft />
              Home
              <HomeIcon />
            </button>
          </Link>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === "gameOver" && (
        <div
          className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white font-sans text-center z-[100] bg-cover bg-center"
          style={{ backgroundImage: "url('/eco-strike/ground-bg.png')" }}
        >
          <h1 className="text-5xl mb-5 text-red-500">Battle Over!</h1>
          <p className="text-2xl mb-8">
            {heroRef.current?.isDead() ? "Villain Wins! 😈" : "Hero Wins! 🌍"}
          </p>
          <div className="flex gap-4">
            <button
              onClick={startGame}
              className="text-xl px-6 py-3 bg-green-500 text-white border-0 rounded-lg cursor-pointer shadow-lg hover:bg-green-600"
            >
              Battle Again
            </button>
            <button
              onClick={goToMainMenu}
              className="text-xl px-6 py-3 bg-gray-600 text-white border-0 rounded-lg cursor-pointer shadow-lg hover:bg-gray-700"
            >
              Main Menu
            </button>
          </div>
          <Link href={"/home"}>
            <button className="absolute top-5 left-5 flex items-center gap-2 bg-gray-800 hover:bg-gray-500 bg-opacity-70 hover:bg-opacity-90 text-white px-4 py-2 rounded-lg shadow-lg border border-white cursor-pointer hover:scale-110 transition-all duration-200">
              <ArrowLeft />
              Home
              <HomeIcon />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
