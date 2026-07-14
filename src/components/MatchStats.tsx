"use client";

interface StatItem {
  type: string;
  value: string | number | null;
}

interface TeamStats {
  team: { id: number; name: string; logo: string };
  statistics: StatItem[];
}

interface MatchStatsProps {
  statistics: TeamStats[];
}

const STAT_LABELS: Record<string, string> = {
  "Ball Possession": "Posesión",
  "Total Shots": "Tiros totales",
  "Shots on Goal": "Tiros a puerta",
  "Shots off Goal": "Tiros fuera",
  "Corner Kicks": "Córners",
  "Offsides": "Fuera de juego",
  "Fouls": "Faltas",
  "Yellow Cards": "Tarjetas amarillas",
  "Red Cards": "Tarjetas rojas",
  "Goalkeeper Saves": "Atajadas",
  "Total passes": "Pases totales",
  "Passes accurate": "Pases precisos",
  "Passes %": "Precisión de pases",
  "expected_goals": "xG (Goles esperados)",
};

const KEY_STATS = [
  "Ball Possession",
  "Total Shots",
  "Shots on Goal",
  "Corner Kicks",
  "Fouls",
  "Yellow Cards",
  "Offsides",
  "Goalkeeper Saves",
  "Passes %",
];

export default function MatchStats({ statistics }: MatchStatsProps) {
  if (!statistics || statistics.length < 2) return null;

  const home = statistics[0];
  const away = statistics[1];

  const getStatValue = (stats: StatItem[], type: string): string => {
    const stat = stats.find((s) => s.type === type);
    return stat?.value?.toString() || "0";
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <h3 className="text-sm font-bold text-gray-300 mb-3">📊 Estadísticas</h3>

      {/* Team headers */}
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="flex items-center gap-2">
          {home.team.logo && <img src={home.team.logo} alt="" className="w-5 h-5" />}
          <span className="text-xs font-medium text-white">{home.team.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white">{away.team.name}</span>
          {away.team.logo && <img src={away.team.logo} alt="" className="w-5 h-5" />}
        </div>
      </div>

      {/* Stats bars */}
      <div className="space-y-3">
        {KEY_STATS.map((statType) => {
          const homeVal = getStatValue(home.statistics, statType);
          const awayVal = getStatValue(away.statistics, statType);
          const homeNum = parseFloat(homeVal) || 0;
          const awayNum = parseFloat(awayVal) || 0;
          const total = homeNum + awayNum || 1;
          const homePercent = (homeNum / total) * 100;

          return (
            <div key={statType}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white font-medium">{homeVal}</span>
                <span className="text-gray-400">{STAT_LABELS[statType] || statType}</span>
                <span className="text-white font-medium">{awayVal}</span>
              </div>
              <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-700">
                <div
                  className="bg-orange-500 transition-all"
                  style={{ width: `${homePercent}%` }}
                />
                <div
                  className="bg-blue-500 transition-all"
                  style={{ width: `${100 - homePercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
