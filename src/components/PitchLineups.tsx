"use client";

import { useState } from "react";

interface Player {
  player: { id: number; name: string; number: number; pos: string };
}

interface LineupData {
  team: { id: number; name: string; logo: string };
  formation: string;
  startXI: Player[];
  substitutes: Player[];
}

interface PitchLineupsProps {
  lineups: LineupData[];
}

// Parse formation string like "4-3-3" into rows [4, 3, 3]
function parseFormation(formation: string): number[] {
  return formation.split("-").map(Number);
}

// Position players on the pitch based on formation
function getPlayerPositions(
  startXI: Player[],
  formation: string,
): { player: Player; x: number; y: number }[] {
  const rows = parseFormation(formation);
  const positions: { player: Player; x: number; y: number }[] = [];

  // Goalkeeper at the bottom
  const gk = startXI[0];
  positions.push({
    player: gk,
    x: 50,
    y: 92,
  });

  // Distribute remaining players by formation rows across full pitch
  let playerIndex = 1;
  const totalRows = rows.length;

  rows.forEach((playersInRow, rowIndex) => {
    // Y position: spread from ~78% (defense) to ~12% (attack)
    const yPercent = 78 - ((rowIndex / (totalRows - 1 || 1)) * 65);

    for (let i = 0; i < playersInRow; i++) {
      if (playerIndex >= startXI.length) break;

      // X position: distribute evenly across width
      const xPercent = ((i + 1) / (playersInRow + 1)) * 100;

      positions.push({
        player: startXI[playerIndex],
        x: xPercent,
        y: yPercent,
      });
      playerIndex++;
    }
  });

  return positions;
}

function PlayerDot({
  player,
  x,
  y,
  color,
  textColor,
}: {
  player: Player;
  x: number;
  y: number;
  color: string;
  textColor: string;
}) {
  const [showName, setShowName] = useState(false);
  const lastName = player.player.name.split(" ").pop() || player.player.name;

  return (
    <div
      className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={() => setShowName(!showName)}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-md ${color} ${textColor}`}
      >
        {player.player.number}
      </div>
      <span
        className={`text-[9px] mt-0.5 font-medium text-center max-w-[60px] truncate ${
          showName ? "text-white bg-black/80 px-1 rounded" : "text-white/80"
        }`}
      >
        {showName ? player.player.name : lastName}
      </span>
    </div>
  );
}

export default function PitchLineups({ lineups }: PitchLineupsProps) {
  const [activeTeam, setActiveTeam] = useState<"home" | "away">("home");

  if (!lineups || lineups.length < 2) return null;

  const home = lineups[0];
  const away = lineups[1];

  const homePositions = getPlayerPositions(home.startXI, home.formation);
  const awayPositions = getPlayerPositions(away.startXI, away.formation);

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <h3 className="text-sm font-bold text-gray-300 mb-3">📋 Alineaciones</h3>

      {/* Team selector */}
      <div className="flex gap-1 mb-3 bg-gray-900 rounded-lg p-1">
        <button
          onClick={() => setActiveTeam("home")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${
            activeTeam === "home" ? "bg-green-700 text-white" : "text-gray-400"
          }`}
        >
          {home.team.logo && <img src={home.team.logo} alt="" className="w-4 h-4" />}
          {home.team.name}
        </button>
        <button
          onClick={() => setActiveTeam("away")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${
            activeTeam === "away" ? "bg-blue-700 text-white" : "text-gray-400"
          }`}
        >
          {away.team.logo && <img src={away.team.logo} alt="" className="w-4 h-4" />}
          {away.team.name}
        </button>
      </div>

      {/* Formation label */}
      <div className="text-center text-xs text-gray-400 mb-1">
        <span>
          Formación: <span className="text-white font-medium">{activeTeam === "home" ? home.formation : away.formation}</span>
        </span>
      </div>

      {/* Football pitch */}
      <div className="relative w-full aspect-[68/105] bg-green-800 rounded-lg overflow-hidden border border-green-600">
        {/* Pitch markings */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 68 105" fill="none">
          {/* Outline */}
          <rect x="1" y="1" width="66" height="103" stroke="white" strokeWidth="0.3" strokeOpacity="0.4" />
          {/* Center line */}
          <line x1="1" y1="52.5" x2="67" y2="52.5" stroke="white" strokeWidth="0.3" strokeOpacity="0.4" />
          {/* Center circle */}
          <circle cx="34" cy="52.5" r="9.15" stroke="white" strokeWidth="0.3" strokeOpacity="0.4" />
          <circle cx="34" cy="52.5" r="0.5" fill="white" fillOpacity="0.4" />
          {/* Top penalty area */}
          <rect x="13.84" y="1" width="40.32" height="16.5" stroke="white" strokeWidth="0.3" strokeOpacity="0.4" />
          <rect x="24.84" y="1" width="18.32" height="5.5" stroke="white" strokeWidth="0.3" strokeOpacity="0.4" />
          <circle cx="34" cy="11" r="0.5" fill="white" fillOpacity="0.4" />
          {/* Bottom penalty area */}
          <rect x="13.84" y="87.5" width="40.32" height="16.5" stroke="white" strokeWidth="0.3" strokeOpacity="0.4" />
          <rect x="24.84" y="98.5" width="18.32" height="5.5" stroke="white" strokeWidth="0.3" strokeOpacity="0.4" />
          <circle cx="34" cy="94" r="0.5" fill="white" fillOpacity="0.4" />
          {/* Corner arcs */}
          <path d="M 1 3 A 2 2 0 0 0 3 1" stroke="white" strokeWidth="0.3" strokeOpacity="0.4" />
          <path d="M 65 1 A 2 2 0 0 0 67 3" stroke="white" strokeWidth="0.3" strokeOpacity="0.4" />
          <path d="M 1 102 A 2 2 0 0 1 3 104" stroke="white" strokeWidth="0.3" strokeOpacity="0.4" />
          <path d="M 65 104 A 2 2 0 0 1 67 102" stroke="white" strokeWidth="0.3" strokeOpacity="0.4" />
        </svg>

        {/* Players */}
        {activeTeam === "home" &&
          homePositions.map((p, i) => (
            <PlayerDot
              key={`home-${i}`}
              player={p.player}
              x={p.x}
              y={p.y}
              color="bg-green-600"
              textColor="text-white"
            />
          ))}

        {activeTeam === "away" &&
          awayPositions.map((p, i) => (
            <PlayerDot
              key={`away-${i}`}
              player={p.player}
              x={p.x}
              y={p.y}
              color="bg-blue-600"
              textColor="text-white"
            />
          ))}
      </div>

      {/* Substitutes */}
      <details className="mt-3">
        <summary className="text-xs text-gray-400 cursor-pointer">
          🔄 Suplentes
        </summary>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {lineups.map((lineup) => (
            <div key={lineup.team.id}>
              <p className="text-xs font-bold text-gray-300 mb-1 flex items-center gap-1">
                {lineup.team.logo && <img src={lineup.team.logo} alt="" className="w-4 h-4" />}
                {lineup.team.name}
              </p>
              <div className="space-y-0.5">
                {lineup.substitutes.map((p, i) => (
                  <div key={i} className="text-[10px] text-gray-400">
                    <span className="text-gray-500">{p.player.number}</span>{" "}
                    {p.player.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
