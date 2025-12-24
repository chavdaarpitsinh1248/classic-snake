import React, { useState, useEffect, useRef } from "react";
import Board from "./components/Board";
import ScoreBoard from "./components/ScoreBoard";
import "./index.css";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];

const App = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState("RIGHT");
  const directionRef = useRef(direction); // <-- ref for latest direction
  const [food, setFood] = useState({ x: 12, y: 10 });
  const [status, setStatus] = useState("idle"); // 'idle','running','paused','gameover'
  const [score, setScore] = useState(0);
  const highScore = useRef(Number(localStorage.getItem("snakeHighScore") || 0));
  const speed = useRef(200); // milliseconds
  const gameLoopRef = useRef();

  // Keep ref updated whenever direction changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Generate new food at random empty cell
  const generateFood = (snakeCells) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeCells.some((seg) => seg.x === newFood.x && seg.y === newFood.y));
    return newFood;
  };

  // Move snake
  const moveSnake = () => {
    setSnake((prev) => {
      const head = prev[0];
      let newHead;
      switch (directionRef.current) { // <-- use latest direction
        case "UP": newHead = { x: head.x, y: head.y - 1 }; break;
        case "DOWN": newHead = { x: head.x, y: head.y + 1 }; break;
        case "LEFT": newHead = { x: head.x - 1, y: head.y }; break;
        case "RIGHT": newHead = { x: head.x + 1, y: head.y }; break;
        default: newHead = head;
      }

      // Collision detection
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prev.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
      ) {
        setStatus("gameover");
        cancelAnimationFrame(gameLoopRef.current);
        return prev;
      }

      let newSnake = [newHead, ...prev];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 1);
        if (score + 1 > highScore.current) {
          highScore.current = score + 1;
          localStorage.setItem("snakeHighScore", highScore.current);
        }
        setFood(generateFood(newSnake));
        speed.current = Math.max(50, speed.current - 5); // gradually increase speed
      } else {
        newSnake.pop(); // remove tail if no food
      }

      return newSnake;
    });
  };

  // Game loop
  const gameLoop = () => {
    moveSnake();
    gameLoopRef.current = setTimeout(() => {
      if (status === "running") gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, speed.current);
  };

  // Start / Resume
  useEffect(() => {
    if (status === "running") gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [status]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (status !== "running") return;
      switch (e.key) {
        case "ArrowUp": if (directionRef.current !== "DOWN") setDirection("UP"); break;
        case "ArrowDown": if (directionRef.current !== "UP") setDirection("DOWN"); break;
        case "ArrowLeft": if (directionRef.current !== "RIGHT") setDirection("LEFT"); break;
        case "ArrowRight": if (directionRef.current !== "LEFT") setDirection("RIGHT"); break;
        default: break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection("RIGHT");
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    speed.current = 200;
    setStatus("running");
  };

  const pauseGame = () => {
    setStatus((prev) => (prev === "running" ? "paused" : "running"));
  };

  const restartGame = () => {
    startGame();
  };

  return (
    <div className="app">
      <h1>Snake Game</h1>
      <ScoreBoard score={score} highScore={highScore} />
      <Board snake={snake} food={food} gridSize={GRID_SIZE} />
      <div className="controls">
        {status !== "running" && status !== "paused" && <button onClick={startGame}>Start</button>}
        {status === "running" && <button onClick={pauseGame}>Pause</button>}
        {status === "paused" && <button onClick={pauseGame}>Resume</button>}
        <button onClick={restartGame}>Restart</button>
      </div>
      {status === "gameover" && <div className="gameover">Game Over!</div>}
    </div>
  );
};

export default App;
