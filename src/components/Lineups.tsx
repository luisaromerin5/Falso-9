"use client";

interface Player {
  player: { id: number; name: string; number: number; pos: string };
}

interface LineupData {
  team: { id: number; name: string; logo: string };
  formation: string;
  startXI: Player[];
  substitutes: Player[];
}

interface LineupsProps {
  lineups: LineupData[];
}

const posLabel: Record<string, string> = {
  G: "POR",
  D: "DEF",
  M: "MED",
  F: "DEL",
};

export default function Lineups({ lineups }: LineupsProps) {
  if (!lineups || lineups.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <h3 className="text-sm font-bold text-gray-300 mb-3">📋 Alineaciones</h3>

      <div className="grid grid-cols-2 gap-3">
        {lineups.map((lineup) => (
          <div key={lineup.team.id}>
            {/* Team header */}
            <div className="flex items-center gap-2 mb-2">
              {lineup.team.logo && (
                <img src={lineup.team.logo} alt="" className="w-5 h-5" />
              )}
              <span className="text-xs font-bold text-white truncate">
                {lineup.team.name}
              </span>
            </div>
            <p className="text-xs text-green-400 mb-2">⚙️ {lineup.formation}</p>

            {/* Starting XI */}
            <div className="space-y-0.5">
              {lineup.startXI.map((p, i) => (
                <div key={i} className="flex items-center gap-1 text-xs">
                  <span className="text-gray-500 w-5 text-right">{p.player.number}</span>
                  <span className="text-gray-400 w-8">{posLabel[p.player.pos] || p.player.pos}</span>
                  <span className="text-white truncate">{p.player.name}</span>
                </div>
              ))}
            </div>

            {/* Substitutes */}
            {lineup.substitutes && lineup.substitutes.length > 0 && (
              <details className="mt-2">
                <summary className="text-xs text-gray-400 cursor-pointer">
                  Suplentes ({lineup.substitutes.length})
                </summary>
                <div className="space-y-0.5 mt-1">
                  {lineup.substitutes.map((p, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs">
                      <span className="text-gray-500 w-5 text-right">{p.player.number}</span>
                      <span className="text-gray-400 w-8">{posLabel[p.player.pos] || p.player.pos}</span>
                      <span className="text-gray-300 truncate">{p.player.name}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
