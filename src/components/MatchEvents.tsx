"use client";

interface MatchEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: string;
  detail: string;
}

interface MatchEventsProps {
  events: MatchEvent[];
  homeTeam: string;
  golesLocal?: number;
  golesVisitante?: number;
}

function getEventIcon(type: string, detail: string): string {
  if (type === "Goal") {
    if (detail === "Own Goal") return "🔴⚽";
    if (detail === "Penalty") return "⚽(P)";
    return "⚽";
  }
  if (type === "Card") {
    if (detail === "Yellow Card") return "🟨";
    if (detail === "Red Card") return "🟥";
    if (detail === "Second Yellow card") return "🟨🟥";
    return "🟨";
  }
  if (type === "subst") return "🔄";
  if (type === "Var") return "📺";
  return "•";
}

function getEventText(event: MatchEvent): string {
  if (event.type === "Goal") {
    let text = event.player.name;
    if (event.assist.name && event.assist.name !== event.player.name) {
      text += ` (asist. ${event.assist.name})`;
    }
    if (event.detail === "Own Goal") text += " (Autogol)";
    if (event.detail === "Penalty") text += " (Penal)";
    return text;
  }
  if (event.type === "subst") {
    return `${event.assist.name || "?"} → ${event.player.name}`;
  }
  if (event.type === "Card") {
    return event.player.name;
  }
  return event.player.name;
}

export default function MatchEvents({ events, homeTeam, golesLocal, golesVisitante }: MatchEventsProps) {
  if (!events || events.length === 0) return null;

  const actualGoals = (golesLocal ?? 0) + (golesVisitante ?? 0);

  // Filter goals to match actual score if there's a mismatch
  let filteredEvents = events.filter(
    (e) => e.type === "Goal" || e.type === "Card" || e.type === "subst"
  );

  const goalEvents = filteredEvents.filter((e) => e.type === "Goal");
  if (actualGoals > 0 && goalEvents.length > actualGoals) {
    // Too many goals in API data — only keep goals that match the score
    let homeGoalsShown = 0;
    let awayGoalsShown = 0;
    const maxHomeGoals = golesLocal ?? 0;
    const maxAwayGoals = golesVisitante ?? 0;

    filteredEvents = filteredEvents.filter((e) => {
      if (e.type !== "Goal") return true;
      const isHome = e.team.name === homeTeam;
      if (isHome && homeGoalsShown < maxHomeGoals) {
        homeGoalsShown++;
        return true;
      }
      if (!isHome && awayGoalsShown < maxAwayGoals) {
        awayGoalsShown++;
        return true;
      }
      return false;
    });
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <h3 className="text-sm font-bold text-gray-300 mb-3">⏱️ Eventos del partido</h3>

      <div className="space-y-2">
        {filteredEvents.map((event, i) => {
          const isHome = event.team.name === homeTeam;
          return (
            <div
              key={i}
              className={`flex items-center gap-2 text-xs ${
                isHome ? "" : "flex-row-reverse text-right"
              }`}
            >
              <span className="text-gray-400 min-w-[2rem]">
                {event.time.elapsed}&apos;{event.time.extra ? `+${event.time.extra}` : ""}
              </span>
              <span className="text-base">{getEventIcon(event.type, event.detail)}</span>
              <span className="text-white flex-1 truncate">{getEventText(event)}</span>
            </div>
          );
        })}
      </div>

      {goalEvents.length > actualGoals && actualGoals > 0 && (
        <p className="text-[10px] text-gray-500 mt-3 italic">
          ⚠️ Algunos eventos fueron filtrados por inconsistencia con el marcador final
        </p>
      )}
    </div>
  );
}
