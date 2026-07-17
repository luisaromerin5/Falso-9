"use client";

import Link from "next/link";
import GameLeaderboard from "./GameLeaderboard";

interface AlreadyPlayedProps {
  game: string;
  score: number;
  title: string;
}

export default function AlreadyPlayed({ game, score, title }: AlreadyPlayedProps) {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const hoursLeft = Math.floor((midnight.getTime() - now.getTime()) / (1000 * 60 * 60));
  const minsLeft = Math.floor(((midnight.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="py-4">
      <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>
      <h1 className="text-lg font-bold text-white mb-4">{title}</h1>

      <div className="bg-gray-800 rounded-xl p-6 border border-orange-500/50 mb-4 text-center">
        <p className="text-xl font-bold text-white mb-1">Ya jugaste hoy</p>
        <p className="text-3xl font-black text-orange-400 mb-2">{score} pts</p>
        <p className="text-xs text-gray-400">Vuelve en {hoursLeft}h {minsLeft}m para un nuevo reto</p>
      </div>

      <GameLeaderboard game={game} />
    </div>
  );
}
