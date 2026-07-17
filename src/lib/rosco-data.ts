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
  // Set 3 - Legends
  [
    { letter: "A", question: "Entrenador italiano que ganó Champions con Real Madrid y AC Milan", answer: "Ancelotti", aliases: ["carlo ancelotti"] },
    { letter: "B", question: "Defensa alemán que ganó Balón de Oro, inventó el líbero", answer: "Beckenbauer", aliases: ["franz beckenbauer"] },
    { letter: "C", question: "Portero español leyenda del Real Madrid y selección", answer: "Casillas", aliases: ["iker casillas"] },
    { letter: "D", question: "Delantero argentino leyenda, 'El Fenómeno' de los 50s en Real Madrid", answer: "Di Stéfano", aliases: ["di stefano", "alfredo"] },
    { letter: "E", question: "Delantero portugués, leyenda de Benfica, 'La Pantera Negra'", answer: "Eusébio", aliases: ["eusebio"] },
    { letter: "F", question: "Entrenador escocés del Manchester United durante 26 años", answer: "Ferguson", aliases: ["alex ferguson", "sir alex"] },
    { letter: "G", question: "Mediocampista inglés leyenda del Liverpool, resbaló en 2014", answer: "Gerrard", aliases: ["steven gerrard"] },
    { letter: "H", question: "Delantero francés máximo goleador histórico del Arsenal", answer: "Henry", aliases: ["thierry henry"] },
    { letter: "I", question: "Mediocampista español que marcó el gol del Mundial 2010", answer: "Iniesta", aliases: ["andres iniesta"] },
    { letter: "J", question: "Holandés que creó el fútbol total, 3 Balones de Oro", answer: "Johan Cruyff", aliases: ["cruyff"] },
    { letter: "K", question: "Alemán máximo goleador en la historia de los Mundiales", answer: "Klose", aliases: ["miroslav klose"] },
    { letter: "L", question: "Mediocampista inglés leyenda del Chelsea y selección", answer: "Lampard", aliases: ["frank lampard"] },
    { letter: "M", question: "Argentino, 'La Mano de Dios', campeón del mundo 1986", answer: "Maradona", aliases: ["diego maradona"] },
    { letter: "N", question: "Mediocampista checo, Balón de Oro 2003, jugó en Juventus", answer: "Nedved", aliases: ["pavel nedved"] },
    { letter: "O", question: "Delantero inglés Balón de Oro 2001, jugó en Liverpool y Real Madrid", answer: "Owen", aliases: ["michael owen"] },
    { letter: "P", question: "Leyenda brasileña, 3 Mundiales, considerado el Rey del fútbol", answer: "Pelé", aliases: ["pele"] },
    { letter: "Q", question: "Colombiano de tiros libres que jugó en River Plate y selección", answer: "Quintero", aliases: ["juan fernando quintero"] },
    { letter: "R", question: "Brasileño 'Il Fenomeno', 2 Mundiales, jugó en Barcelona e Inter", answer: "Ronaldo", aliases: ["ronaldo nazario", "r9"] },
    { letter: "S", question: "Delantero inglés máximo goleador histórico de la Premier League", answer: "Shearer", aliases: ["alan shearer"] },
    { letter: "T", question: "Italiano leyenda de la Roma, jugó 25 años en un solo club", answer: "Totti", aliases: ["francesco totti"] },
    { letter: "U", question: "País sudamericano ganador del primer Mundial en 1930", answer: "Uruguay", aliases: [] },
    { letter: "V", question: "Holandés, 3 Balones de Oro consecutivos, AC Milan", answer: "Van Basten", aliases: ["marco van basten"] },
    { letter: "W", question: "Entrenador francés del Arsenal, 'El Profesor', invicto 2004", answer: "Wenger", aliases: ["arsene wenger"] },
    { letter: "X", question: "Mediocampista español del Barcelona, cerebro del tiki-taka", answer: "Xavi", aliases: ["xavi hernandez"] },
    { letter: "Y", question: "Mediocampista marfileño que dominó la Premier con Man City", answer: "Yaya Touré", aliases: ["yaya toure"] },
    { letter: "Z", question: "Francés que marcó el gol de volea más famoso en una final de Champions", answer: "Zidane", aliases: ["zinedine zidane", "zizou"] },
  ],
  // Set 4 - Current Stars
  [
    { letter: "A", question: "Mediocampista español que fue a los Juegos Olímpicos con España, Arsenal", answer: "Arteta", aliases: ["mikel arteta"] },
    { letter: "B", question: "Delantero argentino 'Batigol', goleador histórico de Fiorentina", answer: "Batistuta", aliases: ["gabriel batistuta"] },
    { letter: "C", question: "Portero que hizo penales heroicos en la final del Mundial 2022", answer: "Cuti Romero", aliases: ["romero", "cristian romero"] },
    { letter: "D", question: "Extremo francés rápido que jugó en Barcelona y Dortmund", answer: "Dembélé", aliases: ["dembele", "ousmane"] },
    { letter: "E", question: "Portero argentino del Aston Villa, héroe de penales", answer: "Emiliano Martínez", aliases: ["dibu", "dibu martinez"] },
    { letter: "F", question: "Mediocampista inglés joven del Manchester City", answer: "Foden", aliases: ["phil foden"] },
    { letter: "G", question: "Delantero argentino joven del Manchester United", answer: "Garnacho", aliases: ["alejandro garnacho"] },
    { letter: "H", question: "Lateral derecho marroquí del PSG, ex-Real Madrid", answer: "Hakimi", aliases: ["achraf hakimi"] },
    { letter: "I", question: "Delantero sueco del Newcastle, goleador de la Premier", answer: "Isak", aliases: ["alexander isak"] },
    { letter: "J", question: "Mediocampista alemán joven del Bayern Munich", answer: "Jamal Musiala", aliases: ["musiala"] },
    { letter: "K", question: "Extremo georgiano que fichó por PSG desde Napoli", answer: "Kvaratskhelia", aliases: ["kvara"] },
    { letter: "L", question: "Delantero argentino del Inter, goleador de Serie A", answer: "Lautaro", aliases: ["lautaro martinez"] },
    { letter: "M", question: "Mediocampista croata del Real Madrid, Balón de Oro 2018", answer: "Modric", aliases: ["luka modric"] },
    { letter: "N", question: "Extremo español del Athletic, velocista, Euro 2024", answer: "Nico Williams", aliases: ["williams"] },
    { letter: "O", question: "Mediocampista español del Barcelona, ex-Leipzig", answer: "Olmo", aliases: ["dani olmo"] },
    { letter: "P", question: "Delantero inglés del Chelsea que explotó en 2024", answer: "Palmer", aliases: ["cole palmer"] },
    { letter: "Q", question: "Ciudad de Argentina donde nació Messi", answer: "Quesada", aliases: [] },
    { letter: "R", question: "Extremo brasileño del Barcelona, goleador 2024", answer: "Raphinha", aliases: [] },
    { letter: "S", question: "Delantero coreano del Tottenham, máximo goleador asiático en Premier", answer: "Son", aliases: ["son heung-min"] },
    { letter: "T", question: "Mediocampista francés del Real Madrid, pivote defensivo", answer: "Tchouaméni", aliases: ["tchouameni"] },
    { letter: "U", question: "Defensa francés del Bayern, rápido y potente", answer: "Upamecano", aliases: ["dayot upamecano"] },
    { letter: "V", question: "Mediocampista uruguayo del Real Madrid, box to box", answer: "Valverde", aliases: ["fede valverde", "federico valverde"] },
    { letter: "W", question: "Mediocampista alemán del Leverkusen, mejor joven de Bundesliga", answer: "Wirtz", aliases: ["florian wirtz"] },
    { letter: "X", question: "Mediocampista suizo del Leverkusen, campeón invicto 2024", answer: "Xhaka", aliases: ["granit xhaka"] },
    { letter: "Y", question: "Extremo español más joven en jugar un Clásico y una Euro", answer: "Yamal", aliases: ["lamine yamal"] },
    { letter: "Z", question: "Mediocampista francés joven del PSG nacido en 2006", answer: "Zaïre-Emery", aliases: ["zaire-emery", "warren"] },
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
