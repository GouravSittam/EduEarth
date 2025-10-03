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

interface RecycleRushProps {
  className?: string;
  onDataChange?: (data: CanvasData) => void;
}

// Bin types
type BinType = "green" | "blue";

// Waste item interface
interface WasteItem {
  image: string;
  type: "biodegradable" | "non-biodegradable";
}

// Floating score indicator interface
interface FloatingScore {
  x: number;
  y: number;
  value: number; // +10 or -5
  createdAt: number;
  duration: number;
}

// Game states
type GameState = "menu" | "playing" | "paused" | "gameOver";

// Waste items array
const WASTE_ITEMS: WasteItem[] = [
  // Biodegradable items
  { image: "/recycle-rush/peels.png", type: "biodegradable" },
  { image: "/recycle-rush/paper.png", type: "biodegradable" },
  { image: "/recycle-rush/wood.png", type: "biodegradable" },

  // Non-biodegradable items
  { image: "/recycle-rush/plastic-bag.png", type: "non-biodegradable" },
  { image: "/recycle-rush/glass-bottle.png", type: "non-biodegradable" },
  { image: "/recycle-rush/can.png", type: "non-biodegradable" },
];

// Bin class for catching falling objects
class Bin {
  x: number;
  y: number;
  displayWidth: number; // Hardcoded display width
  displayHeight: number; // Calculated display height based on aspect ratio
  color: string;
  binType: BinType = "green"; // Current bin type

  // Images for both bin types
  greenImage: HTMLImageElement | null = null;
  blueImage: HTMLImageElement | null = null;
  greenImageLoaded: boolean = false;
  blueImageLoaded: boolean = false;

  constructor(x: number, y: number, displayWidth: number, color: string) {
    this.x = x;
    this.y = y;
    this.displayWidth = displayWidth; // This will be hardcoded
    this.displayHeight = displayWidth; // Initial value, will be updated when image loads
    this.color = color;

    // Load both bin images
    this.greenImage = new Image();
    this.greenImage.src = "/recycle-rush/green-bin.png";
    this.greenImage.onload = () => {
      // Calculate display height based on green bin aspect ratio and hardcoded width
      const aspectRatio = this.greenImage!.width / this.greenImage!.height;
      this.displayHeight = this.displayWidth / aspectRatio;
      this.greenImageLoaded = true;
    };

    this.blueImage = new Image();
    this.blueImage.src = "/recycle-rush/blue-bin.png";
    this.blueImage.onload = () => {
      // If green image hasn't loaded yet, use blue image dimensions
      if (!this.greenImageLoaded) {
        const aspectRatio = this.blueImage!.width / this.blueImage!.height;
        this.displayHeight = this.displayWidth / aspectRatio;
      }
      this.blueImageLoaded = true;
    };
  }

  // Switch between bin types
  switchBinType() {
    this.binType = this.binType === "green" ? "blue" : "green";
  }

  update(canvas: HTMLCanvasElement, mouseX: number) {
    // Keep bin at the very bottom of canvas
    this.y = canvas.height - this.displayHeight; // No margin - all the way at bottom

    // Follow mouse horizontally, but keep bin fully within canvas bounds
    this.x = mouseX - this.displayWidth / 2;

    // Boundary constraints
    if (this.x < 0) this.x = 0;
    if (this.x + this.displayWidth > canvas.width)
      this.x = canvas.width - this.displayWidth;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const currentImage =
      this.binType === "green" ? this.greenImage : this.blueImage;
    const currentImageLoaded =
      this.binType === "green" ? this.greenImageLoaded : this.blueImageLoaded;

    if (currentImage && currentImage.complete && currentImageLoaded) {
      // Draw current bin image using calculated dimensions that maintain aspect ratio
      ctx.drawImage(
        currentImage,
        this.x,
        this.y,
        this.displayWidth,
        this.displayHeight
      );
    } else {
      // Fallback to rectangle with different colors for different bin types
      ctx.fillStyle = this.binType === "green" ? "#4CAF50" : "#2196F3"; // Green or Blue
      ctx.fillRect(this.x, this.y, this.displayWidth, this.displayHeight);

      // Draw bin outline
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y, this.displayWidth, this.displayHeight);

      // Draw bin opening (top edge highlight)
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.displayWidth, this.y);
      ctx.stroke();
    }
  }

  // Check collision with falling object (touching the top of the bin)
  checkCollision(obj: FallingObject): boolean {
    return (
      obj.x < this.x + this.displayWidth &&
      obj.x + obj.width > this.x &&
      obj.y + obj.height >= this.y && // Object touches the top of bin
      obj.y + obj.height <= this.y + 10 // Only count if just touching the top
    );
  }
}

// Falling object class
class FallingObject {
  x: number;
  y: number;
  dx: number;
  dy: number;
  width: number;
  height: number;
  wasteItem: WasteItem;
  image: HTMLImageElement | null = null;
  imageLoaded: boolean = false;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    dx: number,
    dy: number,
    wasteItem: WasteItem
  ) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.width = width;
    this.height = height;
    this.wasteItem = wasteItem;

    // Load waste item image
    this.image = new Image();
    this.image.src = wasteItem.image;
    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  update(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // Linear motion - constant speed, no acceleration
    // Move straight down only (no horizontal movement)
    this.y += this.dy;
    // Remove horizontal movement: this.x += this.dx;

    this.draw(ctx);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.image && this.image.complete && this.imageLoaded) {
      // Save the current context state
      ctx.save();

      // Set composite operation to remove white background
      // ctx.globalCompositeOperation = "destination-in";

      // Draw waste item image
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

      // Restore the context state
      ctx.restore();
    } else {
      // Fallback to colored rectangle based on waste type
      ctx.fillStyle =
        this.wasteItem.type === "biodegradable" ? "#4CAF50" : "#2196F3";
      ctx.fillRect(this.x, this.y, this.width, this.height);

      // Draw border
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  // Check if object is off screen
  isOffScreen(canvas: HTMLCanvasElement): boolean {
    return this.y > canvas.height + this.height;
  }
}

export default function RecycleRush({
  className = "",
  onDataChange,
}: RecycleRushProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const binRef = useRef<Bin | null>(null);
  const fallingObjectsRef = useRef<FallingObject[]>([]);
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const lastSpawnTimeRef = useRef<number>(0);
  const spawnIntervalRef = useRef<number>(3000); // Increased spawn interval to 3 seconds
  const spawnedItemsRef = useRef<WasteItem[]>([]); // Track spawned items
  const availableItemsRef = useRef<WasteItem[]>([...WASTE_ITEMS]); // Available items to spawn
  const floatingScoresRef = useRef<FloatingScore[]>([]);
  const scoreRef = useRef<number>(0);
  const lastScoreChangeRef = useRef<number>(0);
  const lastScoreChangeTypeRef = useRef<"positive" | "negative">("positive");

  const [score, setScore] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [highScore, setHighScore] = useState<number>(0);
  const [canvasData, setCanvasData] = useState<CanvasData>({
    canvasWidth: 0,
    canvasHeight: 0,
    mousePosition: { x: 0, y: 0 },
    canvasRef,
    containerRef,
    isMouseInside: false,
  });

  // Load high score and saved game state from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("recycleRushHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    const savedGameState = localStorage.getItem("recycleRushGameState");
    const savedScore = localStorage.getItem("recycleRushCurrentScore");

    if (savedGameState === "paused" && savedScore) {
      setGameState("paused");
      const savedScoreNum = parseInt(savedScore, 10);
      setScore(savedScoreNum);
      scoreRef.current = savedScoreNum;
    }
  }, []);

  // Save high score when it changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("recycleRushHighScore", score.toString());
    }
  }, [score, highScore]);

  // Initialize game objects
  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load background image
    if (!backgroundImageRef.current) {
      backgroundImageRef.current = new Image();
      backgroundImageRef.current.src = "/recycle-rush/recycle-rush-bg.jpg";
    }

    // Create bin at bottom center - hardcoded width, height calculated from aspect ratio
    const hardcodedBinWidth = 150; // Hardcoded display width
    const binX = canvas.width / 2 - hardcodedBinWidth / 2;
    const binY = 0; // Will be updated in the Bin's update method

    binRef.current = new Bin(binX, binY, hardcodedBinWidth, "#8B4513"); // Brown bin
    fallingObjectsRef.current = [];
  }, []);

  // Game control functions
  const startGame = useCallback(() => {
    setGameState("playing");
    setScore(0);
    scoreRef.current = 0;

    // Clear localStorage saved game
    localStorage.removeItem("recycleRushGameState");
    localStorage.removeItem("recycleRushCurrentScore");

    // Reset game objects
    fallingObjectsRef.current = [];
    floatingScoresRef.current = [];
    availableItemsRef.current = [...WASTE_ITEMS];
    spawnedItemsRef.current = [];
    lastSpawnTimeRef.current = Date.now();
  }, []);

  const pauseGame = useCallback(() => {
    if (gameState === "playing") {
      setGameState("paused");
      // Save game state to localStorage
      localStorage.setItem("recycleRushGameState", "paused");
      localStorage.setItem("recycleRushCurrentScore", score.toString());
    }
  }, [gameState, score]);

  const resumeGame = useCallback(() => {
    setGameState("playing");
    // Clear paused state from localStorage
    localStorage.removeItem("recycleRushGameState");
    localStorage.removeItem("recycleRushCurrentScore");
  }, []);

  const goToMainMenu = useCallback(() => {
    setGameState("menu");
    setScore(0);
    scoreRef.current = 0;

    // Clear localStorage saved game
    localStorage.removeItem("recycleRushGameState");
    localStorage.removeItem("recycleRushCurrentScore");

    // Clear game objects
    fallingObjectsRef.current = [];
    floatingScoresRef.current = [];

    // Cancel animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const gameOver = useCallback(() => {
    setGameState("gameOver");

    // Clear localStorage saved game
    localStorage.removeItem("recycleRushGameState");
    localStorage.removeItem("recycleRushCurrentScore");

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        e.preventDefault();
        if (gameState === "playing") {
          pauseGame();
        }
      }
    },
    [gameState, pauseGame]
  );

  // Function to spawn a random waste item
  const spawnWasteItem = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== "playing") return;

    // If no items available, reset the available items list
    if (availableItemsRef.current.length === 0) {
      availableItemsRef.current = [...WASTE_ITEMS];
      spawnedItemsRef.current = [];
    }

    // Select random item from available items
    const randomIndex = Math.floor(
      Math.random() * availableItemsRef.current.length
    );
    const selectedItem = availableItemsRef.current[randomIndex];

    // Remove the selected item from available items
    availableItemsRef.current.splice(randomIndex, 1);
    spawnedItemsRef.current.push(selectedItem);

    // Random spawn position - scaled up even more
    const itemWidth = 80; // Increased from 60 to 80
    const itemHeight = 80; // Increased from 60 to 80
    const x = Math.random() * (canvas.width - itemWidth - 40) + 20; // 20px margin
    const y = -itemHeight; // Start above canvas
    const dx = 0; // No horizontal movement - straight down
    const dy = 1; // Constant linear speed

    const wasteObject = new FallingObject(
      x,
      y,
      itemWidth,
      itemHeight,
      dx,
      dy,
      selectedItem
    );
    fallingObjectsRef.current.push(wasteObject);
  }, [gameState]);

  // Draw function to render the current state (works in all states)
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image if loaded
    if (backgroundImageRef.current && backgroundImageRef.current.complete) {
      ctx.drawImage(
        backgroundImageRef.current,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } else {
      // Fallback background color
      ctx.fillStyle = "#87CEEB"; // Sky blue background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Always draw bin (even when paused)
    if (binRef.current) {
      binRef.current.update(canvas, mousePositionRef.current.x);
      binRef.current.draw(ctx);
    }

    // Always draw existing falling objects (even when paused)
    fallingObjectsRef.current.forEach((obj) => {
      obj.draw(ctx);
    });

    // Always draw floating scores
    const scoreCurrentTime = Date.now();
    floatingScoresRef.current = floatingScoresRef.current.filter(
      (floatingScore) => {
        const age = scoreCurrentTime - floatingScore.createdAt;
        if (age > floatingScore.duration) {
          return false; // Remove expired scores
        }

        // Calculate animation properties
        const progress = age / floatingScore.duration;
        const opacity = Math.max(0, 1 - progress);
        const yOffset = -progress * 80; // Float up 80 pixels
        const scale = Math.max(0.5, 1 - progress * 0.5); // Scale down slightly

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(floatingScore.x, floatingScore.y + yOffset);
        ctx.scale(scale, scale);

        // Style based on positive/negative score
        const isPositive = floatingScore.value > 0;
        ctx.fillStyle = isPositive ? "#4CAF50" : "#F44336"; // Green for +, Red for -
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const text = isPositive
          ? `+${floatingScore.value}`
          : `${floatingScore.value}`;

        // Draw text outline
        ctx.strokeText(text, 0, 0);
        // Draw text fill
        ctx.fillText(text, 0, 0);

        ctx.restore();
        return true; // Keep score
      }
    );

    // Draw score display on canvas with animation
    ctx.save();

    // Calculate animation properties based on recent score change
    const timeSinceScoreChange = Date.now() - lastScoreChangeRef.current;
    const animationDuration = 600; // 600ms animation
    const isAnimating = timeSinceScoreChange < animationDuration;

    let scale = 1;
    let glowIntensity = 0;
    let textColor = "white";

    if (isAnimating) {
      const progress = timeSinceScoreChange / animationDuration;
      // Scale up then back down
      const scaleProgress = progress * 2;
      scale =
        scaleProgress <= 1
          ? 1 + scaleProgress * 0.2 // Scale up to 1.2
          : 1.2 - (scaleProgress - 1) * 0.2; // Scale back to 1

      glowIntensity = Math.max(0, 1 - progress);
      textColor =
        lastScoreChangeTypeRef.current === "positive" ? "#4CAF50" : "#F44336";
    }

    const scoreText = `Score: ${scoreRef.current}`;
    ctx.font = `bold ${32 * scale}px Arial`;
    const textMetrics = ctx.measureText(scoreText);
    const padding = 20 * scale;
    const bgWidth = textMetrics.width + padding * 2;
    const bgHeight = 50 * scale;
    const bgX = canvas.width - bgWidth - 20;
    const bgY = 20;

    // Add glow effect if animating
    if (glowIntensity > 0) {
      ctx.shadowColor = textColor;
      ctx.shadowBlur = glowIntensity * 20;
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    // Draw rounded rectangle background (manual implementation for compatibility)
    const radius = 10 * scale;
    ctx.beginPath();
    ctx.moveTo(bgX + radius, bgY);
    ctx.lineTo(bgX + bgWidth - radius, bgY);
    ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + radius);
    ctx.lineTo(bgX + bgWidth, bgY + bgHeight - radius);
    ctx.quadraticCurveTo(
      bgX + bgWidth,
      bgY + bgHeight,
      bgX + bgWidth - radius,
      bgY + bgHeight
    );
    ctx.lineTo(bgX + radius, bgY + bgHeight);
    ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - radius);
    ctx.lineTo(bgX, bgY + radius);
    ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Reset shadow for text
    ctx.shadowBlur = 0;

    // Draw score text
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(scoreText, bgX + bgWidth / 2, bgY + bgHeight / 2);
    ctx.restore();
  }, []);

  // Animation loop (only updates game logic, always draws)
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentTime = Date.now();

    // Only update game logic if playing
    if (gameState === "playing") {
      // Spawn waste items at intervals
      if (currentTime - lastSpawnTimeRef.current > spawnIntervalRef.current) {
        spawnWasteItem();
        lastSpawnTimeRef.current = currentTime;
      }

      // Update falling objects with collision detection
      fallingObjectsRef.current.forEach((obj, index) => {
        obj.update(canvas, ctx);

        let shouldRemove = false;
        let scoreChange = 0;

        // Check collision with bin
        if (binRef.current && binRef.current.checkCollision(obj)) {
          // Calculate score based on correct/incorrect bin
          if (obj.wasteItem.type === "biodegradable") {
            // Biodegradable waste
            if (binRef.current.binType === "green") {
              scoreChange = 10; // Correct bin
            } else {
              scoreChange = -5; // Wrong bin
            }
          } else {
            // Non-biodegradable waste
            if (binRef.current.binType === "blue") {
              scoreChange = 10; // Correct bin
            } else {
              scoreChange = -5; // Wrong bin
            }
          }

          // Create floating score indicator at object position
          const floatingScore: FloatingScore = {
            x: obj.x + obj.width / 2,
            y: obj.y + obj.height / 2,
            value: scoreChange,
            createdAt: Date.now(),
            duration: 2000, // 2 seconds
          };
          floatingScoresRef.current.push(floatingScore);

          // Update score
          setScore((prev) => {
            const newScore = prev + scoreChange;
            scoreRef.current = newScore;
            lastScoreChangeRef.current = Date.now();
            lastScoreChangeTypeRef.current =
              scoreChange > 0 ? "positive" : "negative";

            // Check for game over
            if (newScore < 0) {
              setTimeout(() => gameOver(), 100); // Small delay to show the negative score
            }

            return newScore;
          });
          shouldRemove = true; // Remove after collision
        }
        // Check if object hits the floor (missed)
        else if (obj.y + obj.height >= canvas.height) {
          scoreChange = -5; // Penalty for missing

          // Create floating score indicator at floor position
          const floatingScore: FloatingScore = {
            x: obj.x + obj.width / 2,
            y: canvas.height - 40,
            value: scoreChange,
            createdAt: Date.now(),
            duration: 2000,
          };
          floatingScoresRef.current.push(floatingScore);

          setScore((prev) => {
            const newScore = prev + scoreChange;
            scoreRef.current = newScore;
            lastScoreChangeRef.current = Date.now();
            lastScoreChangeTypeRef.current = "negative";

            // Check for game over
            if (newScore < 0) {
              setTimeout(() => gameOver(), 100); // Small delay to show the negative score
            }

            return newScore;
          });
          shouldRemove = true;
        }
        // Check if object is off screen (top)
        else if (obj.isOffScreen(canvas)) {
          shouldRemove = true;
        }

        // Remove object if needed
        if (shouldRemove) {
          fallingObjectsRef.current.splice(index, 1);
        }
      });
    }

    // Always draw the current state
    draw();

    // Only continue animation if playing
    if (gameState === "playing") {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      animationFrameRef.current = null;
    }
  }, [spawnWasteItem, gameState, gameOver, draw]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const newMousePosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // Update both ref and state
    mousePositionRef.current = newMousePosition;
    setCanvasData((prev) => ({
      ...prev,
      mousePosition: newMousePosition,
    }));
  }, []);

  // Handle mouse enter/leave
  const handleMouseEnter = useCallback(() => {
    setCanvasData((prev) => ({ ...prev, isMouseInside: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCanvasData((prev) => ({ ...prev, isMouseInside: false }));
  }, []);

  // Handle click to switch bin type
  const handleClick = useCallback(() => {
    if (binRef.current) {
      binRef.current.switchBinType();
    }
  }, []);

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

    // Initialize mouse position
    mousePositionRef.current = { x: canvas.width / 2, y: canvas.height / 2 };

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
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    // Initialize only - don't start animation automatically
    init();
    // Draw initial state
    setTimeout(() => draw(), 0);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update canvas data when it changes
  useEffect(() => {
    onDataChange?.(canvasData);
  }, [canvasData, onDataChange]);

  // Control animation loop based on game state
  useEffect(() => {
    if (gameState === "playing" && !animationFrameRef.current) {
      animate();
    } else if (gameState !== "playing" && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      // Draw once when paused to show current state
      draw();
    }
  }, [gameState, animate, draw]);

  return (
    <div ref={containerRef} className={`w-full h-screen relative ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Main Menu */}
      {gameState === "menu" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-sans text-center z-[100] bg-black/80 bg-[url('/recycle-rush/recycle-rush-main-menu-bg.png')] bg-cover bg-center gap-6">
          <img
            src="/recycle-rush/recycle-rush-logo.png"
            alt="Recycle Rush Logo"
            className="max-w-lg max-h-lg bg"
          />
          <div
            className="text-4xl text-yellow-400 font-bold"
            style={{
              textShadow: "2px 2px 8px #000, 0 0 12px #FFD700, 0 0 2px #000",
              letterSpacing: "1px",
            }}
          >
            High Score: {highScore}
          </div>
          <img
            onClick={startGame}
            src="/recycle-rush/play-button.png"
            alt="Play Button"
            className="size-30 object-contain cursor-pointer animate-pulse-scale hover:animate-none transition-transform"
          />
          <style jsx global>{`
            @keyframes pulse-scale {
              0% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.15);
              }
              100% {
                transform: scale(1);
              }
            }
            .animate-pulse-scale {
              animation: pulse-scale 1.2s infinite;
            }
          `}</style>
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
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white font-sans text-center z-[100] bg-[url('/recycle-rush/recycle-rush-main-menu-bg.png')] bg-cover bg-center gap-10">
          <img
            src="/recycle-rush/recycle-rush-logo.png"
            alt="Recycle Rush Logo"
            className="max-w-sm max-h-sm bg"
          />
          <h1
            className="text-5xl text-yellow-400 font-bold"
            style={{
              textShadow: "2px 2px 8px #000, 0 0 12px #FFD700, 0 0 2px #000",
              letterSpacing: "1px",
            }}
          >
            PAUSED
          </h1>
          <div className="flex gap-5">
            <button
              onClick={resumeGame}
              className="text-xl px-6 py-3 bg-green-500 text-white border-0 rounded-lg cursor-pointer shadow-lg hover:bg-green-600"
            >
              Resume
            </button>
            <button
              onClick={goToMainMenu}
              className="text-xl px-6 py-3 bg-red-500 text-white border-0 rounded-lg cursor-pointer shadow-lg hover:bg-red-600"
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
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white font-sans text-center z-[100] bg-[url('/recycle-rush/recycle-rush-main-menu-bg.png')] bg-cover bg-center gap-10">
          <img
            src="/recycle-rush/recycle-rush-logo.png"
            alt="Recycle Rush Logo"
            className="max-w-sm max-h-sm bg"
          />
          <h1
            className="text-4xl text-red-400 font-bold"
            style={{
              textShadow: "2px 2px 8px #000, 0 0 12px #FFD700, 0 0 2px #000",
              letterSpacing: "1px",
            }}
          >
            Game Over!
          </h1>
          <div className="flex gap-4">
            <button
              onClick={startGame}
              className="text-xl px-6 py-3 bg-green-500 text-white border-0 rounded-lg cursor-pointer shadow-lg hover:bg-green-600"
            >
              Play Again
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

      {/* Pause Button (only visible during gameplay) */}
      {gameState === "playing" && (
        <img
          onClick={pauseGame}
          className="absolute top-5 left-5 size-20"
          src={"/recycle-rush/pause-button.png"}
        />
      )}
    </div>
  );
}
