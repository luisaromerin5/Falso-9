"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { STOP_CATEGORIES, VALID_LETTERS, VALID_ANSWERS, validateAnswer } from "@/lib/stop-data";
import { getDailySeed } from "@/lib/daily-seed";
import GameLeaderboard from "@/components/GameLeaderboard";
import AlreadyPlayed from "@/components/AlreadyPlayed";

export default function StopPage() {
  const [letter, setLetter] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean> | null>(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameState, setGameState] = useState<"ready" | "playing" | "done">("ready");
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const DIFFICULTY_TIMES = { easy: 120, medium: 90, hard: 60 };

  useEffect(() => {
    const lastPlayed = localStorage.getItem("stop_last_date");
    const today = new Date().toISOString().split("T")[0];
    if (lastPlayed === today) {
      setAlreadyPlayed(true);
      setGameState("done");
    }
  }, []);

  const startGame = () => {
    const seed = getDailySeed();
    const randomLetter = VALID_LETTERS[seed % VALID_LETTERS.length];
    setLetter(randomLetter);
    setAnswers({});
    setResults(null);
    setTimeLeft(DIFFICULTY_TIMES[difficulty]);
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    } else if (timeLeft === 0 && gameState === "playing") {
      endGame();
    }
  }, [timeLeft, gameState]);

  const endGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGameState("done");
    localStorage.setItem("stop_last_date", new Date().toISOString().split("T")[0]);
    localStorage.setItem("stop_today_score", String(correctCount * 10));

    // Validate all answers
    const newResults: Record<string, boolean> = {};
    STOP_CATEGORIES.forEach((cat) => {
      const answer = answers[cat] || "";
      newResults[cat] = validateAnswer(cat, letter, answer);
    });
    setResults(newResults);
  };

  const correctCount = results ? Object.values(results).filter(Boolean).length : 0;
  const allCorrect = correctCount === 8;

  if (alreadyPlayed) {
    const savedScore = typeof window !== "undefined" ? Number(localStorage.getItem("stop_today_score") || 0) : 0;
    return <AlreadyPlayed game="stop" score={savedScore} title="Stop / Basta" />;
  }

  // Ready screen
  if (gameState === "ready") {
    return (
      <div className="py-4">
        <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>

        <h1 className="text-xl font-bold text-white mb-2">Stop / Basta</h1>
        <p className="text-xs text-gray-400 mb-6">
          Se elige una letra al azar. Tienes 90 segundos para llenar las 8 categorías con respuestas que empiecen con esa letra. Si logras las 8 correctas, ganas.
        </p>

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 mb-4">
          {/* Difficulty */}
          <p className="text-xs text-gray-400 mb-2">Dificultad:</p>
          <div className="flex gap-2 mb-4">
            {[
              { key: "easy" as const, label: "Fácil", time: "120s" },
              { key: "medium" as const, label: "Normal", time: "90s" },
              { key: "hard" as const, label: "Difícil", time: "60s" },
            ].map((d) => (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                  difficulty === d.key ? "bg-orange-500 border-orange-500 text-white" : "bg-gray-700 border-gray-600 text-gray-300"
                }`}
              >
                {d.label}<br /><span className="text-[9px] opacity-70">{d.time}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mb-3">Categorías:</p>
          <div className="space-y-1.5">
            {STOP_CATEGORIES.map((cat) => (
              <p key={cat} className="text-sm text-gray-300">• {cat}</p>
            ))}
          </div>
        </div>

        <button
          onClick={startGame}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm"
        >
          Comenzar
        </button>
      </div>
    );
  }

  // Playing / Done
  return (
    <div className="py-4">
      <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-bold text-white">Letra: <span className="text-orange-400 text-2xl">{letter}</span></h1>
        </div>
        {gameState === "playing" && (
          <div className={`text-right ${timeLeft <= 10 ? "text-red-400" : "text-white"}`}>
            <p className="text-2xl font-black">{timeLeft}s</p>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2.5 mb-4">
        {STOP_CATEGORIES.map((cat) => (
          <div key={cat}>
            <label className="text-[10px] text-gray-400 block mb-0.5">{cat}</label>
            {gameState === "playing" ? (
              <input
                type="text"
                value={answers[cat] || ""}
                onChange={(e) => setAnswers({ ...answers, [cat]: e.target.value })}
                placeholder={`${letter}...`}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:border-orange-500 focus:outline-none"
              />
            ) : (
              <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                results?.[cat] ? "bg-green-900/20 border-green-700/50" : "bg-red-900/20 border-red-700/50"
              }`}>
                <div>
                  <span className={`text-sm ${results?.[cat] ? "text-green-300" : "text-red-300"}`}>
                    {answers[cat] || "(vacío)"}
                  </span>
                  {!results?.[cat] && (
                    <p className="text-[9px] text-gray-500 mt-0.5">
                      Válidas: {(VALID_ANSWERS[cat]?.[letter] || []).slice(0, 3).join(", ")}
                    </p>
                  )}
                </div>
                <span className="text-xs">{results?.[cat] ? "✓" : "✗"}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stop button */}
      {gameState === "playing" && (
        <button
          onClick={endGame}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-sm"
        >
          STOP!
        </button>
      )}

      {/* Results */}
      {gameState === "done" && (
        <div className={`bg-gray-800 rounded-xl p-4 border ${allCorrect ? "border-green-500" : "border-red-500"} text-center`}>
          <p className="text-xl font-bold text-white mb-1">{allCorrect ? "Ganaste!" : "Perdiste"}</p>
          <p className="text-sm text-gray-400">{correctCount}/8 correctas</p>
        </div>
      )}

      {gameState === "done" && <GameLeaderboard game="stop" currentScore={correctCount * 10} />}

      {gameState === "done" && (
        <p className="text-xs text-gray-400 text-center mt-4">Vuelve mañana para un nuevo reto</p>
      )}
    </div>
  );
}
