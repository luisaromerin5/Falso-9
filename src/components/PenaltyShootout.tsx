"use client";

interface ShootoutEvent {
  time: { elapsed: number };
  team: { name: string };
  player: { name: string };
  detail: string;
  type: string;
}

interface PenaltyShootoutProps {
  events: ShootoutEvent[];
  homeTeam: string;
  awayTeam: string;
}

export default function PenaltyShootout({ events, homeTeam, awayTeam }: PenaltyShootoutProps) {
  // Filter only penalty shootout events (minute 120+ with Penalty in detail)
  const shootoutEvents = events.filter(
    (e) => e.time.elapsed >= 120 && e.type === "Goal" && (e.detail === "Penalty" || e.detail === "Missed Penalty")
  );

  if (shootoutEvents.length === 0) return null;

  // Count scores
  let homeScore = 0;
  let awayScore = 0;
  shootoutEvents.forEach((e) => {
    if (e.detail === "Penalty") {
      if (e.team.name === homeTeam) homeScore++;
      else awayScore++;
    }
  });

  const winner = homeScore > awayScore ? homeTeam : awayTeam;

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-yellow-700/50 mb-4">
      <h3 className="text-xs font-bold text-yellow-400 mb-3">Tanda de penales ({homeScore}-{awayScore})</h3>
      <p className="text-[10px] text-orange-400 mb-3">Ganador: {winner}</p>

      <div className="grid grid-cols-2 gap-4">
        {/* Home team */}
        <div>
          <p className="text-[10px] text-gray-400 mb-1 font-medium">{homeTeam}</p>
          <div className="space-y-1">
            {shootoutEvents
              .filter((e) => e.team.name === homeTeam)
              .map((e, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className={`text-sm ${e.detail === "Penalty" ? "text-orange-400" : "text-red-400"}`}>
                    {e.detail === "Penalty" ? "✓" : "✗"}
                  </span>
                  <span className="text-[11px] text-white">{e.player.name}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Away team */}
        <div>
          <p className="text-[10px] text-gray-400 mb-1 font-medium">{awayTeam}</p>
          <div className="space-y-1">
            {shootoutEvents
              .filter((e) => e.team.name === awayTeam)
              .map((e, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className={`text-sm ${e.detail === "Penalty" ? "text-orange-400" : "text-red-400"}`}>
                    {e.detail === "Penalty" ? "✓" : "✗"}
                  </span>
                  <span className="text-[11px] text-white">{e.player.name}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
