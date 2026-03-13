import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Use a ref to store the latest direction to prevent rapid double-turns
  const currentDirectionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    currentDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused || !hasStarted) return;

      const currentDir = currentDirectionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused, hasStarted]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        currentDirectionRef.current = direction;

        switch (direction) {
          case 'UP':
            newHead.y -= 1;
            break;
          case 'DOWN':
            newHead.y += 1;
            break;
          case 'LEFT':
            newHead.x -= 1;
            break;
          case 'RIGHT':
            newHead.x += 1;
            break;
        }

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, isPaused, hasStarted, generateFood]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (optional, for neon effect)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food (Magenta)
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(
      food.x * CELL_SIZE,
      food.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    // Draw snake (Cyan)
    ctx.shadowBlur = 0;
    
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#00ffff';
      
      // Draw raw squares for snake segments
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
    });

    // Reset shadow for next frame
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-[400px] mb-4 px-2 items-end">
        <div 
          className="text-[#00ffff] font-digital text-5xl md:text-6xl drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] glitch" 
          data-text={`SCORE: ${score.toString().padStart(4, '0')}`}
        >
          SCORE: {score.toString().padStart(4, '0')}
        </div>
        <div className="text-[#ff00ff] font-digital text-2xl flex items-center drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] pb-1">
          {isPaused ? 'PAUSED' : 'PLAYING'}
        </div>
      </div>

      <div className="relative overflow-hidden border-glitch bg-black">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="block"
        />

        {(!hasStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10">
            {gameOver ? (
              <>
                <h2 
                  className="text-6xl font-digital text-[#ff00ff] mb-2 drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] glitch"
                  data-text="FATAL_ERROR"
                >
                  FATAL_ERROR
                </h2>
                <p className="text-[#00ffff] font-digital mb-6 text-3xl">DATA_CORRUPTION: {score}</p>
              </>
            ) : (
              <h2 
                className="text-6xl font-digital text-[#00ffff] mb-6 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)] tracking-widest glitch"
                data-text="EXECUTE.SNAKE"
              >
                EXECUTE.SNAKE
              </h2>
            )}
            
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-transparent border-glitch text-[#ff00ff] font-digital text-2xl tracking-widest hover:bg-[#ff00ff] hover:text-black transition-none"
            >
              {gameOver ? 'REBOOT_SYSTEM' : 'INITIALIZE'}
            </button>
            
            <div className="mt-8 text-[#00ffff] font-digital text-xl text-center opacity-70">
              <p>INPUT: [W,A,S,D] OR [ARROWS]</p>
              <p className="mt-1">HALT: [SPACE]</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
