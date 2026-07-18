"use client";

import { useState } from "react";
import Link from "next/link";
import { PLAYERS, GamePlayer } from "@/lib/game-data";
import { getDailySeed, seededShuffle } from "@/lib/daily-seed";
import GameLeaderboard from "@/components/GameLeaderboard";
import AlreadyPlayed from "@/components/AlreadyPlayed";

const FORMATION = [
  { position: "Goalkeeper", label: "Portero", count: 1 },
  { position: "Defender", label: "Lateral Derecho", count: 1 },
  { position: "Defender", label: "Defensa Central", count: 1 },
  { position: "Defender", label: "Defensa Central", count: 1 },
  { position: "Defender", label: "Lateral Izquierdo", count: 1 },
  { position: "Midfielder", label: "Mediocampista", count: 1 },
  { position: "Midfielder", label: "Mediocampista", count: 1 },
  { position: "Midfielder", label: "Mediocampista", count: 1 },
  { position: "Forward", label: "Extremo Izquierdo", count: 1 },
  { position: "Forward", label: "Delantero Centro", count: 1 },
  { position: "Forward", label: "Extremo Derecho", count: 1 },
];

const BUDGETS = [
  { label: "€400M", value: 400 },
  { label: "€500M", value: 500 },
  { label: "€600M", value: 600 },
  { label: "€700M", value: 700 },
];

function getPlayersForPosition(position: string, maxPrice: number, exclude: number[], slotIndex: number): GamePlayer[] {
  const available = PLAYERS.filter(
    (p) => p.position === position && p.marketValue <= maxPrice && !exclude.includes(p.id)
  );
  // Use different seed offset per slot to ensure different options for same position
  const seed = getDailySeed() + slotIndex * 13 + slotIndex * slotIndex;
  const shuffled = seededShuffle(available, seed);
  return shuffled.slice(0, 5);
}

type GameState = "budget" | "picking" | "won" | "lost";

export default function SubastaPage() {
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== "undefined") {
      const lastPlayed = localStorage.getItem("subasta_last_date");
      const today = new Date().toISOString().split("T")[0];
      if (lastPlayed === today) return "won";
    }
    return "budget";
  });
  const [budget, setBudget] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [team, setTeam] = useState<GamePlayer[]>([]);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [options, setOptions] = useState<GamePlayer[]>([]);
  const [usedIds, setUsedIds] = useState<number[]>([]);

  // Build the list of slots to fill
  const slots: { position: string; label: string }[] = FORMATION.map((f) => ({
    position: f.position,
    label: f.label,
  }));

  const startGame = (budgetValue: number) => {
    setBudget(budgetValue);
    setRemaining(budgetValue);
    setTeam([]);
    setCurrentSlot(0);
    setUsedIds([]);

    const firstOptions = getPlayersForPosition(slots[0].position, budgetValue, [], 0);
    if (firstOptions.length === 0) {
      setGameState("lost");
      return;
    }
    setOptions(firstOptions);
    setGameState("picking");
  };

  const pickPlayer = (player: GamePlayer) => {
    // If player costs more than remaining, lose
    if (player.marketValue > remaining) {
      setGameState("lost");
      return;
    }

    const newTeam = [...team, player];
    const newRemaining = remaining - player.marketValue;
    const newUsedIds = [...usedIds, player.id];
    const nextSlot = currentSlot + 1;

    setTeam(newTeam);
    setRemaining(newRemaining);
    setUsedIds(newUsedIds);

    if (nextSlot >= 11) {
      setGameState("won");
      localStorage.setItem("subasta_last_date", new Date().toISOString().split("T")[0]);
      return;
    }

    setCurrentSlot(nextSlot);
    const nextOptions = getPlayersForPosition(slots[nextSlot].position, newRemaining, newUsedIds, nextSlot);

    if (nextOptions.length === 0) {
      setGameState("lost");
      return;
    }

    setOptions(nextOptions);
  };

  // Check if already played
  const alreadyPlayedSubasta = typeof window !== "undefined" && localStorage.getItem("subasta_last_date") === new Date().toISOString().split("T")[0];
  if (alreadyPlayedSubasta && gameState === "budget") return <AlreadyPlayed game="subasta" score={0} title="Subasta" />;

  // Budget selection
  if (gameState === "budget") {
    return (
      <div className="py-4">
        <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>

        <h1 className="text-xl font-bold text-white mb-2">Subasta</h1>
        <p className="text-xs text-gray-400 mb-6">
          Arma un equipo de 11 jugadores (4-3-3) sin exceder tu presupuesto. Si te quedas sin dinero para alguna posición, pierdes.
        </p>

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <p className="text-sm text-gray-300 mb-4">Elige tu presupuesto:</p>
          <div className="grid grid-cols-2 gap-3">
            {BUDGETS.map((b) => (
              <button
                key={b.value}
                onClick={() => startGame(b.value)}
                className="bg-gray-700 hover:bg-orange-500 text-white font-bold py-4 rounded-xl text-lg transition-colors"
              >
                {b.label}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-gray-500 mt-3 text-center">Menor presupuesto = más difícil</p>
        </div>
      </div>
    );
  }

  // Won screen
  if (gameState === "won") {
    return (
      <div className="py-4">
        <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>

        <div className="bg-gray-800 rounded-xl p-5 border border-green-500 text-center mb-4">
          <p className="text-xl font-bold text-white mb-1">Equipo completo!</p>
          <p className="text-sm text-gray-400">Presupuesto: €{budget}M</p>
          <p className="text-sm text-green-400">Sobrante: €{remaining}M</p>
        </div>

        <div className="space-y-1.5">
          {team.map((p, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-2.5 border border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{p.name}</p>
                <p className="text-[9px] text-gray-400">{p.club} • {slots[i].label}</p>
              </div>
              <span className="text-xs text-green-400 font-bold">€{p.marketValue}M</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">Vuelve mañana para un nuevo reto</p>

        <GameLeaderboard game="subasta" currentScore={remaining} />

      </div>
    );
  }

  // Lost screen
  if (gameState === "lost") {
    return (
      <div className="py-4">
        <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>

        <div className="bg-gray-800 rounded-xl p-5 border border-red-500 text-center mb-4">
          <p className="text-xl font-bold text-white mb-1">Te quedaste sin dinero</p>
          <p className="text-sm text-gray-400">No hay jugadores disponibles para {slots[currentSlot]?.label}</p>
          <p className="text-sm text-red-400">Restante: €{remaining}M</p>
          <p className="text-xs text-gray-500 mt-2">{team.length}/11 posiciones cubiertas</p>
        </div>

        {team.length > 0 && (
          <div className="space-y-1.5 mb-4">
            {team.map((p, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-2 border border-gray-700 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white">{p.name}</p>
                  <p className="text-[9px] text-gray-500">{slots[i].label}</p>
                </div>
                <span className="text-[10px] text-gray-400">€{p.marketValue}M</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setGameState("budget")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // Picking screen
  return (
    <div className="py-4">
      <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>

      {/* Status bar */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-xs text-gray-400">Posición {currentSlot + 1}/11</p>
          <p className="text-sm font-bold text-white">{slots[currentSlot].label}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400">Presupuesto restante</p>
          <p className={`text-lg font-black ${remaining < 50 ? "text-red-400" : "text-green-400"}`}>€{remaining}M</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-700 rounded-full mb-4">
        <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${(currentSlot / 11) * 100}%` }} />
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        <p className="text-[10px] text-gray-400 uppercase">Elige un jugador:</p>
        {options.map((player) => (
          <button
            key={player.id}
            onClick={() => pickPlayer(player)}
            className="w-full bg-gray-800 border border-gray-700 hover:border-orange-500 rounded-xl p-4 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-white">{player.name}</p>
                <p className="text-[10px] text-gray-400">{player.club} • {player.nationality}</p>
              </div>
              <span className="text-lg font-black text-green-400">€{player.marketValue}M</span>
            </div>
          </button>
        ))}
      </div>

      {/* Team so far */}
      {team.length > 0 && (
        <details className="mt-4">
          <summary className="text-[10px] text-gray-500 cursor-pointer">Tu equipo ({team.length}/11)</summary>
          <div className="mt-2 space-y-1">
            {team.map((p, i) => (
              <div key={i} className="flex justify-between text-[10px] text-gray-400">
                <span>{p.name} ({slots[i].label})</span>
                <span>€{p.marketValue}M</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
