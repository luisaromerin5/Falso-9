"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import GameLeaderboard from "@/components/GameLeaderboard";

export default function CabecitasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameRef = useRef<any>({});

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Responsive canvas
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    // Game state
    const game = gameRef.current;
    game.player = { x: W / 2, y: H - 60, w: 50, h: 50, speed: 0 };
    game.ball = { x: W / 2, y: 100, r: 18, vx: 2, vy: 0, gravity: 0.45 };
    game.score = 0;
    game.running = true;

    // Preload player image
    const playerImg = new Image();
    playerImg.src = "/cabecitas-player.png";

    // Controls
    const keys: Record<string, boolean> = {};
    let touchX: number | null = null;

    const handleKeyDown = (e: KeyboardEvent) => { keys[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.key] = false; };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    };
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    };
    const handleTouchEnd = () => { touchX = null; };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    // Game loop
    let animId: number;
    const loop = () => {
      if (!game.running) return;

      // Clear - football field background
      // Sky
      ctx.fillStyle = "#1a3a5c";
      ctx.fillRect(0, 0, W, H * 0.4);
      // Grass gradient
      const grassGradient = ctx.createLinearGradient(0, H * 0.4, 0, H);
      grassGradient.addColorStop(0, "#2d8a4e");
      grassGradient.addColorStop(0.5, "#24793f");
      grassGradient.addColorStop(1, "#1c6633");
      ctx.fillStyle = grassGradient;
      ctx.fillRect(0, H * 0.4, W, H * 0.6);
      // Field lines
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.4);
      ctx.lineTo(W, H * 0.4);
      ctx.stroke();
      // Center circle
      ctx.beginPath();
      ctx.arc(W / 2, H * 0.7, 60, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.stroke();
      // Grass stripes
      for (let i = 0; i < 8; i++) {
        if (i % 2 === 0) {
          ctx.fillStyle = "rgba(255,255,255,0.03)";
          ctx.fillRect(0, H * 0.4 + i * (H * 0.6 / 8), W, H * 0.6 / 8);
        }
      }

      // Player movement
      const p = game.player;
      if (touchX !== null) {
        // Touch control - follow finger
        const diff = touchX - p.x;
        p.x += diff * 0.15;
      } else {
        // Keyboard control
        if (keys["ArrowLeft"] || keys["a"]) p.x -= 6;
        if (keys["ArrowRight"] || keys["d"]) p.x += 6;
      }
      // Bounds
      p.x = Math.max(p.w / 2, Math.min(W - p.w / 2, p.x));

      // Ball physics
      const b = game.ball;
      b.vy += b.gravity;
      b.x += b.vx;
      b.y += b.vy;

      // Wall bounce
      if (b.x - b.r < 0) { b.x = b.r; b.vx *= -1; }
      if (b.x + b.r > W) { b.x = W - b.r; b.vx *= -1; }

      // Collision with player head
      const headY = p.y - p.h / 2;
      const dx = b.x - p.x;
      const dy = b.y - headY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < b.r + 25 && b.vy > 0) {
        b.vy = -10 - Math.random() * 2;
        b.vx = (dx / 25) * 3 + (Math.random() - 0.5) * 2;
        game.score++;
        setScore(game.score);
      }

      // Ball fell below screen = game over
      if (b.y > H + 50) {
        game.running = false;
        setGameOver(true);

        return;
      }

      // Draw player (custom character image)
      if (playerImg.complete) {
        ctx.drawImage(playerImg, p.x - 25, p.y - 60, 50, 75);
      } else {
        // Fallback while loading
        ctx.fillStyle = "#f97316";
        ctx.fillRect(p.x - 10, p.y - 10, 20, 35);
        ctx.beginPath();
        ctx.arc(p.x, p.y - 25, 15, 0, Math.PI * 2);
        ctx.fillStyle = "#fbbf24";
        ctx.fill();
      }

      // Draw ball - realistic football
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Pentagon patches
      const patchAngles = [0, 72, 144, 216, 288];
      for (const angle of patchAngles) {
        const rad = (angle * Math.PI) / 180;
        const px = b.x + Math.cos(rad) * b.r * 0.55;
        const py = b.y + Math.sin(rad) * b.r * 0.55;
        ctx.beginPath();
        ctx.arc(px, py, b.r * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = "#222";
        ctx.fill();
      }

      // Draw score
      ctx.fillStyle = "#fff";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(game.score), W / 2, 40);

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      game.running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gameStarted, gameOver]);



  if (gameOver) {
    return (
      <div className="py-4">
        <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>
        <h1 className="text-lg font-bold text-white mb-4">Cabecitas</h1>
        <div className="bg-gray-800 rounded-xl p-6 border border-red-500/50 mb-4 text-center">
          <p className="text-xl font-bold text-white mb-1">Se cayó la pelota!</p>
          <p className="text-3xl font-black text-orange-400 mb-2">{score} cabecitas</p>
        </div>
        <GameLeaderboard game="cabecitas" currentScore={score * 10} />
        <button
          onClick={() => { setGameOver(false); setScore(0); setGameStarted(true); }}
          className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm"
        >
          Jugar de nuevo
        </button>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="py-4">
        <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>
        <h1 className="text-lg font-bold text-white mb-4">Cabecitas</h1>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
          <p className="text-4xl mb-3">⚽</p>
          <p className="text-sm text-gray-300 mb-4">
            Mantén la pelota en el aire con la cabeza del jugador. Muévelo con las flechas del teclado o arrastra tu dedo en la pantalla.
          </p>
          <button
            onClick={() => setGameStarted(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl text-sm"
          >
            Jugar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-2">
        <Link href="/juegos" className="text-orange-400 text-sm">← Juegos</Link>
        <span className="text-white font-bold">{score} cabecitas</span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full rounded-xl border border-gray-700"
        style={{ height: "500px", touchAction: "none" }}
      />
      <p className="text-[9px] text-gray-500 text-center mt-2">← → flechas o arrastra con el dedo</p>
    </div>
  );
}
