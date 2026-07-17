"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getTodaysRosco, checkRoscoAnswer, RoscoQuestion } from "@/lib/rosco-data";
import GameLeaderboard from "@/components/GameLeaderboard";
import AlreadyPlayed from "@/components/AlreadyPlayed";

type LetterState = "pending" | "correct" | "wrong" | "skipped";

export default function RoscoPage() {
  const [questions, setQuestions] = useState<RoscoQuestion[]>([]);
  const [states, setStates] = useState<Map<string, LetterState>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [gameState, setGameState] = useState<"ready" | "playing" | "done">("ready");
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const lastPlayed = localStorage.getItem("rosco_last_date");
    const today = new Date().toISOString().split("T")[0];
    if (lastPlayed === today) {
      setAlreadyPlayed(true);
      setGameState("done");
    }
  }, []);

  useEffect(() => {
    const rosco = getTodaysRosco();
    setQuestions(rosco);
    const initialStates = new Map<string, LetterState>();
    rosco.forEach((q) => initialStates.set(q.letter, "pending"));
    setStates(initialStates);
  }, []);

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    } else if (timeLeft === 0 && gameState === "playing") {
      endGame();
    }
  }, [timeLeft, gameState]);

  const startGame = () => {
    setGameState("playing");
    setCurrentIndex(0);
    setTimeLeft(180);
  };

  const endGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGameState("done");
    localStorage.setItem("rosco_last_date", new Date().toISOString().split("T")[0]);
  };

  const findNextPending = (from: number): number => {
    for (let i = 0; i < questions.length; i++) {
      const idx = (from + i) % questions.length;
      if (states.get(questions[idx].letter) === "pending" || states.get(questions[idx].letter) === "skipped") {
        return idx;
      }
    }
    return -1; // All answered
  };

  const submitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || gameState !== "playing") return;

    const question = questions[currentIndex];
    const newStates = new Map(states);

    if (checkRoscoAnswer(input, question)) {
      newStates.set(question.letter, "correct");
    } else {
      newStates.set(question.letter, "wrong");
    }

    setStates(newStates);
    setInput("");

    // Find next pending
    const next = findNextPending(currentIndex + 1);
    if (next === -1) {
      endGame();
    } else {
      setCurrentIndex(next);
    }
  };

  const pasapalabra = () => {
    const newStates = new Map(states);
    newStates.set(questions[currentIndex].letter, "skipped");
    setStates(newStates);

    const next = findNextPending(currentIndex + 1);
    if (next === -1) {
      endGame();
    } else {
      setCurrentIndex(next);
    }
    setInput("");
  };

  const correctCount = Array.from(states.values()).filter((s) => s === "correct").length;
  const wrongCount = Array.from(states.values()).filter((s) => s === "wrong").length;

  if (alreadyPlayed) return <AlreadyPlayed game="rosco" score={0} title="Rosco" />;

  if (questions.length === 0) return null;

  // Ready screen
  if (gameState === "ready") {
    return (
      <div className="py-4">
        <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>
        <h1 className="text-xl font-bold text-white mb-2">Rosco</h1>
        <p className="text-xs text-gray-400 mb-6">
          26 letras, 26 preguntas. Responde correctamente o pasa (pasapalabra). Tienes 3 minutos.
        </p>
        <button onClick={startGame} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm">
          Comenzar Rosco
        </button>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Link href="/juegos" className="text-orange-400 text-sm mb-3 inline-block">← Juegos</Link>

      {/* Timer and score */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-3 text-xs">
          <span className="text-green-400">{correctCount} ✓</span>
          <span className="text-red-400">{wrongCount} ✗</span>
        </div>
        <span className={`text-lg font-black ${timeLeft <= 30 ? "text-red-400" : "text-white"}`}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </span>
      </div>

      {/* Letter circle */}
      <div className="relative w-full aspect-square max-w-[300px] mx-auto mb-4">
        {questions.map((q, i) => {
          const angle = (i / 26) * 2 * Math.PI - Math.PI / 2;
          const radius = 44;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          const state = states.get(q.letter);
          const isCurrent = i === currentIndex && gameState === "playing";

          let bgColor = "bg-gray-700";
          if (state === "correct") bgColor = "bg-green-600";
          else if (state === "wrong") bgColor = "bg-red-600";
          else if (state === "skipped") bgColor = "bg-yellow-600";
          if (isCurrent) bgColor = "bg-orange-500";

          return (
            <div
              key={q.letter}
              className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${bgColor} transition-colors`}
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
            >
              {q.letter}
            </div>
          );
        })}
      </div>

      {/* Current question */}
      {gameState === "playing" && (
        <div className="mb-4">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-3">
            <p className="text-xs text-orange-400 font-bold mb-1">Letra {questions[currentIndex].letter}:</p>
            <p className="text-sm text-white">{questions[currentIndex].question}</p>
          </div>

          <form onSubmit={submitAnswer} className="flex gap-2 mb-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tu respuesta..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none"
              autoFocus
            />
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 rounded-lg text-sm">
              OK
            </button>
          </form>
          <button onClick={pasapalabra} className="w-full bg-gray-700 hover:bg-gray-600 text-yellow-400 text-xs py-2 rounded-lg font-medium">
            Pasapalabra
          </button>
        </div>
      )}

      {/* Results */}
      {gameState === "done" && (
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 text-center mb-4">
          <p className="text-xl font-bold text-white mb-1">Resultado</p>
          <p className="text-3xl font-black text-orange-400">{correctCount}/26</p>
          <p className="text-xs text-gray-400 mt-1">
            {correctCount} correctas • {wrongCount} incorrectas • {26 - correctCount - wrongCount} sin responder
          </p>
          {correctCount === 26 && <p className="text-sm text-yellow-400 mt-2 font-bold">ROSCO PERFECTO!</p>}
        </div>
      )}

      {/* Answers revealed when done */}
      {gameState === "done" && (
        <>
        <GameLeaderboard game="rosco" currentScore={correctCount * 10} />
        <div className="space-y-1 mt-4">
          {questions.map((q) => {
            const state = states.get(q.letter);
            return (
              <div key={q.letter} className={`flex items-center gap-2 px-2 py-1.5 rounded text-[10px] ${
                state === "correct" ? "bg-green-900/20" : state === "wrong" ? "bg-red-900/20" : "bg-gray-800"
              }`}>
                <span className={`font-bold w-4 ${state === "correct" ? "text-green-400" : state === "wrong" ? "text-red-400" : "text-gray-500"}`}>{q.letter}</span>
                <span className="text-gray-400 flex-1 truncate">{q.question}</span>
                <span className="text-white font-medium">{q.answer}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">Vuelve mañana para un nuevo rosco</p>
        </>
      )}
    </div>
  );
}
