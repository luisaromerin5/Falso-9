"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";

interface ScoreEntry {
  user_id: number;
  username: string;
  avatar_color: string;
  avatar_url: string | null;
  score: number;
}

interface GameLeaderboardProps {
  game: string;
  currentScore?: number;
}

export default function GameLeaderboard({ game, currentScore }: GameLeaderboardProps) {
  const { user } = useAuth();
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [bestScore, setBestScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const doWork = async () => {
      // Save current score if provided and > 0
      if (currentScore !== undefined && currentScore > 0 && !saved) {
        try {
          await fetch("/api/game-scores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ game, score: currentScore }),
          });
          setSaved(true);
        } catch {}
      }

      // Fetch leaderboard
      try {
        const res = await fetch(`/api/game-scores?game=${game}`);
        if (res.ok) {
          const data = await res.json();
          setScores(data.scores || []);
          setBestScore(data.bestScore || 0);
        }
      } catch {}

      setLoading(false);
    };

    doWork();
  }, [user]);

  if (!user) return null;
  if (loading) return <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mt-4 text-center"><p className="text-xs text-gray-400">Cargando leaderboard...</p></div>;
  if (scores.length === 0 && !currentScore) return null;

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mt-4">
      <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Leaderboard del día</h3>

      {scores.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-2">Sé el primero en jugar hoy</p>
      ) : (
        <div className="space-y-2">
          {scores.map((entry, i) => {
            const isMe = entry.user_id === user.id;
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
            return (
              <div
                key={entry.user_id}
                className={`flex items-center gap-2.5 p-2 rounded-lg ${isMe ? "bg-orange-900/20 border border-orange-700/50" : ""}`}
              >
                <span className="text-sm w-6 text-center">{medal}</span>
                {entry.avatar_url ? (
                  <img src={entry.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: entry.avatar_color }}
                  >
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className={`text-xs flex-1 ${isMe ? "text-orange-400 font-bold" : "text-white"}`}>
                  @{entry.username}
                </span>
                <span className="text-sm font-black text-white">{entry.score} pts</span>
              </div>
            );
          })}
        </div>
      )}

      {bestScore > 0 && (
        <p className="text-[9px] text-gray-500 mt-2 text-right">Tu record histórico: {bestScore} pts</p>
      )}
    </div>
  );
}
