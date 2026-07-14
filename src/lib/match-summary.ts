// Genera un resumen automático del partido basado en los datos disponibles

interface MatchData {
  equipo_local: string;
  equipo_visitante: string;
  goles_local: number;
  goles_visitante: number;
  competicion: string;
  fecha: string;
  estadio: string;
  events?: Array<{
    time: { elapsed: number; extra: number | null };
    team: { name: string };
    player: { name: string };
    assist: { name: string | null };
    type: string;
    detail: string;
  }>;
}

export function generateMatchSummary(match: MatchData): string {
  const { equipo_local, equipo_visitante, goles_local, goles_visitante, competicion, fecha, estadio } = match;

  const dateStr = new Date(fecha).toLocaleDateString("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Determine result
  let resultado: string;
  if (goles_local > goles_visitante) {
    resultado = `Victoria de ${equipo_local}`;
  } else if (goles_visitante > goles_local) {
    resultado = `Victoria de ${equipo_visitante}`;
  } else {
    resultado = "Empate";
  }

  // Build summary
  let summary = `${competicion || "Partido"} disputado el ${dateStr}`;
  if (estadio && estadio !== "Estadio no disponible") {
    summary += ` en ${estadio}`;
  }
  summary += `. ${resultado} con marcador ${goles_local}-${goles_visitante}.`;

  // Add goal details from events
  if (match.events) {
    const goals = match.events.filter((e) => e.type === "Goal");
    if (goals.length > 0) {
      const goalTexts = goals.map((g) => {
        let text = `${g.player.name} (${g.time.elapsed}')`;
        if (g.detail === "Penalty") text += " de penal";
        if (g.detail === "Own Goal") text = `Autogol de ${g.player.name} (${g.time.elapsed}')`;
        return text;
      });
      summary += ` Goles: ${goalTexts.join(", ")}.`;
    }
  }

  // Add flavor based on goal difference
  const diff = Math.abs(goles_local - goles_visitante);
  const totalGoals = goles_local + goles_visitante;

  if (totalGoals >= 5) {
    summary += " Un partido con muchos goles y emociones.";
  } else if (diff >= 3) {
    summary += " Dominio claro del ganador.";
  } else if (goles_local === goles_visitante && totalGoals > 0) {
    summary += " Partido parejo que terminó en tablas.";
  } else if (totalGoals === 0) {
    summary += " Un partido cerrado sin goles.";
  }

  return summary;
}
