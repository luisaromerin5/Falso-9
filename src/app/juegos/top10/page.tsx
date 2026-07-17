"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTodaysTopic, checkAnswer, Topic, TopicAnswer } from "@/lib/topics-data";
import GameLeaderboard from "@/components/GameLeaderboard";

export default function Top10Page() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [input, setInput] = useState("");
  const [guessed, setGuessed] = useState<Map<number, { answer: TopicAnswer; withHint: boolean }>>(new Map());
  const [hintUsed, setHintUsed] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setTopic(getTodaysTopic());
  }, []);

  if (!topic) return null;

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || finished) return;

    // Check if it matches any unguessed answer
    for (const answer of topic.answers) {
      if (guessed.has(answer.position)) continue;

      if (checkAnswer(input, answer)) {
        const hadHint = hintUsed.has(answer.position);
        const points = hadHint ? 5 : 10;
        const newGuessed = new Map(guessed);
        newGuessed.set(answer.position, { answer, withHint: hadHint });
        setGuessed(newGuessed);
        setScore(score + points);
        setMessage(`+${points} pts — ${answer.player}!`);
        setMessageType("success");
        setInput("");

        if (newGuessed.size === 10) {
          setFinished(true);
        }
        return;
      }
    }

    // Check if already guessed
    for (const [, value] of guessed) {
      if (checkAnswer(input, value.answer)) {
        setMessage("Ya lo adivinaste");
        setMessageType("info");
        setInput("");
        return;
      }
    }

    setMessage("Incorrecto");
    setMessageType("error");
    setInput("");
  };

  const useHint = () => {
    // Find the first unguessed answer without a hint
    for (const answer of topic.answers) {
      if (!guessed.has(answer.position) && !hintUsed.has(answer.position)) {
        const newHints = new Set(hintUsed);
        newHints.add(answer.position);
        setHintUsed(newHints);
        setMessage(`Pista: Hay un jugador de ${answer.nationality} en el puesto #${answer.position}`);
        setMessageType("info");
        return;
      }
    }
  };

  const endGame = () => {
    setFinished(true);
  };

  return (
    <div className="py-4">
      <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-lg font-bold text-white">Top 10</h1>
          <p className="text-[10px] text-gray-400">Tema del día</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-orange-400">{score} pts</p>
          <p className="text-[9px] text-gray-500">{guessed.size}/10</p>
        </div>
      </div>

      {/* Topic title */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
        <p className="text-sm font-bold text-white text-center">{topic.title}</p>
      </div>

      {/* Input area */}
      {!finished && (
        <form onSubmit={handleGuess} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un nombre..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none"
              autoFocus
            />
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 rounded-lg text-sm">
              OK
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={useHint}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-2 rounded-lg"
            >
              Pista (vale 5 pts)
            </button>
            <button
              type="button"
              onClick={endGame}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-2 rounded-lg"
            >
              Terminar
            </button>
          </div>
        </form>
      )}

      {/* Message */}
      {message && (
        <div className={`text-center text-sm py-2 px-3 rounded-lg mb-3 ${
          messageType === "success" ? "bg-green-900/30 text-green-400" :
          messageType === "error" ? "bg-red-900/30 text-red-400" :
          "bg-gray-800 text-gray-300"
        }`}>
          {message}
        </div>
      )}

      {/* Answers grid */}
      <div className="space-y-1.5">
        {topic.answers.map((answer) => {
          const isGuessed = guessed.has(answer.position);
          return (
            <div
              key={answer.position}
              className={`flex items-center gap-3 p-2.5 rounded-lg ${
                isGuessed ? "bg-green-900/20 border border-green-700/50" :
                finished ? "bg-red-900/10 border border-red-700/30" :
                "bg-gray-800 border border-gray-700"
              }`}
            >
              <span className="text-xs font-bold text-gray-500 w-5">#{answer.position}</span>
              {isGuessed ? (
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{answer.player}</p>
                  <p className="text-[10px] text-gray-400">{answer.nationality} — {answer.stat}</p>
                </div>
              ) : finished ? (
                <div className="flex-1">
                  <p className="text-sm text-red-300">{answer.player}</p>
                  <p className="text-[10px] text-gray-500">{answer.stat}</p>
                </div>
              ) : (
                <div className="flex-1">
                  <p className="text-sm text-gray-600">???</p>
                </div>
              )}
              {isGuessed && (
                <span className="text-[9px] text-green-400">
                  {guessed.get(answer.position)?.withHint ? "+5" : "+10"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Final score */}
      {finished && (
      <>
        <div className="mt-4 bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-2xl font-black text-orange-400">{score}/100 pts</p>
          <p className="text-xs text-gray-400 mt-1">{guessed.size} de 10 adivinados</p>
        </div>

        <GameLeaderboard game="top10" currentScore={score} />

        <p className="text-xs text-gray-400 text-center mt-4">Vuelve mañana para un nuevo tema</p>
      </>
      )}
    </div>
  );
}
