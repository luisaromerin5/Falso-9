export interface RoscoQuestion {
  letter: string;
  question: string;
  answer: string;
  aliases: string[];
}

export const ROSCO_SETS: RoscoQuestion[][] = [
  // Set 1
  [
    { letter: "A", question: "Delantero argentino que ganó el Mundial 2022 con Argentina", answer: "Álvarez", aliases: ["julian alvarez", "alvarez"] },
    { letter: "B", question: "Mediocampista inglés que fichó por el Real Madrid en 2023", answer: "Bellingham", aliases: ["jude bellingham"] },
    { letter: "C", question: "Portero belga del Real Madrid", answer: "Courtois", aliases: ["thibaut courtois"] },
    { letter: "D", question: "Entrenador francés que ganó el Mundial 2018 con Francia", answer: "Deschamps", aliases: ["didier deschamps"] },
    { letter: "E", question: "Delantero camerunés que jugó en Barcelona e Inter", answer: "Eto'o", aliases: ["etoo", "samuel etoo"] },
    { letter: "F", question: "Mediocampista inglés del Manchester City, joven estrella", answer: "Foden", aliases: ["phil foden"] },
    { letter: "G", question: "Entrenador español del Manchester City", answer: "Guardiola", aliases: ["pep guardiola", "pep"] },
    { letter: "H", question: "Delantero noruego del Manchester City, máximo goleador", answer: "Haaland", aliases: ["erling haaland"] },
    { letter: "I", question: "Mediocampista español que marcó el gol de la final del Mundial 2010", answer: "Iniesta", aliases: ["andres iniesta"] },
    { letter: "J", question: "Club italiano de Turín con más Serie A ganadas", answer: "Juventus", aliases: ["juve"] },
    { letter: "K", question: "Delantero inglés que fichó por Bayern Munich en 2023", answer: "Kane", aliases: ["harry kane"] },
    { letter: "L", question: "Joven extremo español del Barcelona nacido en 2007", answer: "Lamine Yamal", aliases: ["yamal", "lamine"] },
    { letter: "M", question: "Delantero francés que fichó por Real Madrid en 2024", answer: "Mbappé", aliases: ["mbappe", "kylian mbappe"] },
    { letter: "N", question: "Extremo español del Athletic Club, campeón de la Euro 2024", answer: "Nico Williams", aliases: ["williams"] },
    { letter: "O", question: "Mediocampista noruego capitán del Arsenal", answer: "Ødegaard", aliases: ["odegaard", "martin odegaard"] },
    { letter: "P", question: "Mediocampista español del Barcelona, joven promesa", answer: "Pedri", aliases: [] },
    { letter: "Q", question: "País que fue sede del Mundial 2022", answer: "Qatar", aliases: [] },
    { letter: "R", question: "Mediocampista español del Man City, Balón de Oro 2024", answer: "Rodri", aliases: [] },
    { letter: "S", question: "Delantero egipcio del Liverpool, máximo goleador histórico en Premier", answer: "Salah", aliases: ["mohamed salah", "mo salah"] },
    { letter: "T", question: "Lateral inglés del Liverpool conocido por sus pases", answer: "Trent", aliases: ["trent alexander-arnold", "alexander-arnold"] },
    { letter: "U", question: "Club italiano de la ciudad de Udine", answer: "Udinese", aliases: [] },
    { letter: "V", question: "Extremo brasileño del Real Madrid", answer: "Vinicius", aliases: ["vinicius jr", "vini", "vini jr"] },
    { letter: "W", question: "Mediocampista alemán del Bayer Leverkusen, joven estrella", answer: "Wirtz", aliases: ["florian wirtz"] },
    { letter: "X", question: "Exentrenador del Barcelona, leyenda como jugador y DT", answer: "Xavi", aliases: ["xavi hernandez"] },
    { letter: "Y", question: "Portero camerunés que jugó en Barcelona", answer: "Yaoundé", aliases: [] },
    { letter: "Z", question: "Entrenador francés que ganó 3 Champions seguidas con Real Madrid", answer: "Zidane", aliases: ["zinedine zidane", "zizou"] },
  ],
  // Set 2
  [
    { letter: "A", question: "Club inglés de Londres conocido como 'The Gunners'", answer: "Arsenal", aliases: [] },
    { letter: "B", question: "Club español más exitoso de Cataluña", answer: "Barcelona", aliases: ["barca"] },
    { letter: "C", question: "Lateral derecho del Real Madrid, capitán de España", answer: "Carvajal", aliases: ["dani carvajal"] },
    { letter: "D", question: "Mediocampista belga del Manchester City, genio creativo", answer: "De Bruyne", aliases: ["kevin de bruyne"] },
    { letter: "E", question: "País sudamericano con 2 Copas América y sede en 2024", answer: "Ecuador", aliases: [] },
    { letter: "F", question: "Exdelantero portugués, Balón de Oro 2000, jugó en Real Madrid", answer: "Figo", aliases: ["luis figo"] },
    { letter: "G", question: "Mediocampista español del Barcelona lesionado en 2023", answer: "Gavi", aliases: [] },
    { letter: "H", question: "Exdelantero francés que jugó en Arsenal y Barcelona", answer: "Henry", aliases: ["thierry henry"] },
    { letter: "I", question: "Club italiano de Milán con camiseta nerazzurra", answer: "Inter", aliases: ["inter milan", "internazionale"] },
    { letter: "J", question: "País asiático que sorprendió ganando a Alemania en Qatar 2022", answer: "Japón", aliases: ["japon", "japan"] },
    { letter: "K", question: "Exmediocampista brasileño, Balón de Oro 2007", answer: "Kaká", aliases: ["kaka"] },
    { letter: "L", question: "Delantero polaco del Barcelona, exBayern Munich", answer: "Lewandowski", aliases: ["robert lewandowski", "lewy"] },
    { letter: "M", question: "Argentino con 8 Balones de Oro, el más ganador de la historia", answer: "Messi", aliases: ["lionel messi", "leo messi"] },
    { letter: "N", question: "Club italiano de la ciudad de Nápoles", answer: "Napoli", aliases: [] },
    { letter: "O", question: "Delantero nigeriano del Napoli/Galatasaray", answer: "Osimhen", aliases: ["victor osimhen"] },
    { letter: "P", question: "Leyenda brasileña considerado el mejor de la historia por muchos", answer: "Pelé", aliases: ["pele"] },
    { letter: "Q", question: "Posición del jugador que defiende el arco", answer: "Querétaro", aliases: [] },
    { letter: "R", question: "Club español más ganador de Champions League con 15 títulos", answer: "Real Madrid", aliases: ["madrid"] },
    { letter: "S", question: "Entrenador argentino del Atlético de Madrid", answer: "Simeone", aliases: ["diego simeone", "cholo"] },
    { letter: "T", question: "Club inglés de Londres con estadio nuevo", answer: "Tottenham", aliases: ["spurs"] },
    { letter: "U", question: "País sudamericano con 2 Mundiales ganados", answer: "Uruguay", aliases: [] },
    { letter: "V", question: "Mediocampista uruguayo del Real Madrid", answer: "Valverde", aliases: ["federico valverde", "fede valverde"] },
    { letter: "W", question: "Exentrenador francés del Arsenal durante 22 años", answer: "Wenger", aliases: ["arsene wenger"] },
    { letter: "X", question: "Ciudad española donde juega el Celta", answer: "Xinzo", aliases: [] },
    { letter: "Y", question: "Extremo español de 17 años del Barcelona", answer: "Yamal", aliases: ["lamine yamal"] },
    { letter: "Z", question: "Defensa central del Inter, exJuventus, lateral argentino", answer: "Zanetti", aliases: ["javier zanetti"] },
  ],
];

export function getTodaysRosco(): RoscoQuestion[] {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - start.getTime()) / 86400000);
  return ROSCO_SETS[dayOfYear % ROSCO_SETS.length];
}

export function checkRoscoAnswer(input: string, question: RoscoQuestion): boolean {
  const normalized = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (normalized.length < 2) return false;

  const answerNorm = question.answer.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  if (answerNorm.includes(normalized) || normalized.includes(answerNorm)) return true;

  for (const alias of question.aliases) {
    const aliasNorm = alias.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    if (aliasNorm.includes(normalized) || normalized.includes(aliasNorm)) return true;
  }

  return false;
}
