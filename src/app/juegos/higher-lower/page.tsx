"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PLAYERS, GamePlayer } from "@/lib/game-data";
import { getDailySeed, seededShuffle } from "@/lib/daily-seed";
import GameLeaderboard from "@/components/GameLeaderboard";

function getDailyPlayers(): GamePlayer[] {
  const seed = getDailySeed();
  return seededShuffle(PLAYERS, seed);
}

export default function HigherLowerPage() {
  const [dailyPlayers] = useState<GamePlayer[]>(() => getDailyPlayers());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [basePlayer, setBasePlayer] = useState<GamePlayer | null>(null);
  const [comparePlayer, setComparePlayer] = useState<GamePlayer | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hl_highscore");
    if (saved) setHighScore(Number(saved));

    // Check if already played today
    const lastPlayed = localStorage.getItem("hl_last_date");
    const today = new Date().toISOString().split("T")[0];
    if (lastPlayed === today) {
      const savedScore = localStorage.getItem("hl_today_score");
      setAlreadyPlayed(true);
      setScore(Number(savedScore || 0));
      setGameOver(true);
    } else {
      setBasePlayer(dailyPlayers[0]);
      setComparePlayer(dailyPlayers[1]);
      setCurrentIndex(1);
    }
  }, []);

  const handleGuess = (guess: "higher" | "lower") => {
    if (!basePlayer || !comparePlayer || revealed) return;

    const isHigher = comparePlayer.marketValue >= basePlayer.marketValue;
    const isCorrect = (guess === "higher" && isHigher) || (guess === "lower" && !isHigher);

    setRevealed(true);
    setCorrect(isCorrect);

    if (isCorrect) {
      const newScore = score + 10;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem("hl_highscore", String(newScore));
      }

      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= dailyPlayers.length) {
          finishGame(newScore);
          return;
        }

        setBasePlayer(comparePlayer);
        setComparePlayer(dailyPlayers[nextIndex]);
        setCurrentIndex(nextIndex);
        setRevealed(false);
        setCorrect(null);
      }, 1500);
    } else {
      finishGame(score);
    }
  };

  const finishGame = (finalScore: number) => {
    setGameOver(true);
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("hl_last_date", today);
    localStorage.setItem("hl_today_score", String(finalScore));
  };

  if (!basePlayer || !comparePlayer) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-white">Higher or Lower</h1>
        <div className="text-right">
          <p className="text-xs text-gray-400">Puntos: <span className="text-white font-bold">{score}</span></p>
          <p className="text-[9px] text-gray-500">Record: {highScore}</p>
        </div>
      </div>

      {/* Game over overlay */}
      {gameOver && (
        <div className="bg-gray-800 rounded-xl p-6 border border-orange-500/50 mb-4 text-center">
          <p className="text-xl font-bold text-white mb-1">{alreadyPlayed ? "Ya jugaste hoy" : correct === false ? "Game Over" : "Sin más jugadores"}</p>
          <p className="text-3xl font-black text-orange-400 mb-2">{score} pts</p>
          {correct === false && comparePlayer && !alreadyPlayed && (
            <p className="text-sm text-gray-300 mb-2">
              {comparePlayer.name} vale <span className="text-green-400 font-bold">€{comparePlayer.marketValue}M</span>
            </p>
          )}
          {score >= highScore && score > 0 && !alreadyPlayed && (
            <p className="text-sm text-yellow-400 mb-2">Nuevo record!</p>
          )}
          <button
            onClick={() => window.location.href = "/juegos"}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-sm"
          >
            Volver a juegos
          </button>
          <p className="text-[10px] text-gray-500 mt-2">Vuelve mañana para un nuevo reto</p>
        </div>
      )}

      {/* Leaderboard - always show when game is over */}
      {gameOver && <GameLeaderboard game="higher-lower" currentScore={!alreadyPlayed ? score : undefined} />}

      {/* Players comparison */}
      {!gameOver && (
        <div className="space-y-3">
          {/* Base player (left/top) */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{basePlayer.name}</p>
              <p className="text-xs text-gray-400">{basePlayer.club} • {basePlayer.nationality}</p>
              <p className="text-[10px] text-gray-500">{basePlayer.position}</p>
              <p className="text-2xl font-black text-green-400 mt-2">€{basePlayer.marketValue}M</p>
            </div>
          </div>

          {/* VS divider */}
          <div className="text-center">
            <span className="text-sm font-bold text-gray-500">VS</span>
          </div>

          {/* Compare player (right/bottom) */}
          <div className={`bg-gray-800 rounded-xl p-4 border ${revealed ? (correct ? "border-green-500" : "border-red-500") : "border-gray-700"}`}>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{comparePlayer.name}</p>
              <p className="text-xs text-gray-400">{comparePlayer.club} • {comparePlayer.nationality}</p>
              <p className="text-[10px] text-gray-500">{comparePlayer.position}</p>

              {revealed ? (
                <div className="mt-2">
                  <p className="text-2xl font-black text-green-400">€{comparePlayer.marketValue}M</p>
                  <p className={`text-sm font-bold mt-1 ${correct ? "text-green-400" : "text-red-400"}`}>
                    {correct ? "Correcto!" : "Incorrecto"}
                  </p>
                </div>
              ) : (
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => handleGuess("higher")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm transition-colors active:scale-[0.97]"
                  >
                    ↑ Higher
                  </button>
                  <button
                    onClick={() => handleGuess("lower")}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-colors active:scale-[0.97]"
                  >
                    ↓ Lower
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!gameOver && (
        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-500">
            Adivina si el siguiente jugador vale más (Higher) o menos (Lower) que el anterior
          </p>
        </div>
      )}
    </div>
  );
}
