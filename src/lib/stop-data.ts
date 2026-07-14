// Valid answers for Stop/Basta game by category and letter

export const STOP_CATEGORIES = [
  "Jugador actual",
  "Jugador retirado",
  "País mundialista",
  "Club de España",
  "Club de Inglaterra",
  "Ganador Balón de Oro",
  "Entrenador",
  "Club de Italia",
];

// Letters that have enough valid answers (exclude very hard ones)
export const VALID_LETTERS = "ABCDEFGHIJKLMNOPRSTUVZ".split("");

export const VALID_ANSWERS: Record<string, Record<string, string[]>> = {
  "Jugador actual": {
    A: ["Alexander Isak", "Achraf Hakimi", "Antoine Griezmann", "Alisson"],
    B: ["Bukayo Saka", "Bellingham", "Bernardo Silva", "Bruno Fernandes"],
    C: ["Cole Palmer", "Courtois", "Carvajal"],
    D: ["Declan Rice", "Dani Olmo", "De Bruyne"],
    E: ["Erling Haaland", "Enzo Fernández"],
    F: ["Foden", "Federico Valverde", "Florian Wirtz"],
    G: ["Gavi", "Garnacho", "Grealish"],
    H: ["Haaland", "Harry Kane", "Hakimi"],
    I: ["Isak", "Ivan Toney"],
    J: ["Jude Bellingham", "Julian Alvarez"],
    K: ["Kane", "Kvaratskhelia", "Kimmich"],
    L: ["Lamine Yamal", "Lewandowski", "Lautaro Martinez"],
    M: ["Mbappe", "Messi", "Mohamed Salah", "Musiala"],
    N: ["Neymar", "Nico Williams", "Nunez"],
    O: ["Osimhen", "Odegaard"],
    P: ["Pedri", "Palmer"],
    R: ["Rodri", "Raphinha", "Rashford"],
    S: ["Salah", "Saka", "Son"],
    T: ["Trent Alexander-Arnold", "Tchouameni", "Ter Stegen"],
    U: ["Upamecano"],
    V: ["Vinicius Jr", "Valverde", "Van Dijk"],
    Z: ["Zaire-Emery"],
  },
  "Jugador retirado": {
    A: ["Andrea Pirlo", "Andres Iniesta", "Alessandro Del Piero"],
    B: ["Beckham", "Buffon", "Batistuta"],
    C: ["Casillas", "Cafu", "Cruyff"],
    D: ["Di Stefano", "Drogba", "Del Piero"],
    E: ["Eto'o", "Eusebio"],
    F: ["Figo", "Falcao", "Ferdinand"],
    G: ["Gerrard", "Gullit", "Gerd Muller"],
    H: ["Henry", "Hugo Sanchez"],
    I: ["Iniesta", "Ibrahimovic"],
    J: ["Johan Cruyff", "Javier Zanetti"],
    K: ["Kaka", "Klinsmann", "Keegan"],
    L: ["Lampard", "Lahm"],
    M: ["Maradona", "Maldini", "Matthaus"],
    N: ["Nedved", "Nesta"],
    O: ["Owen", "Okocha"],
    P: ["Pele", "Platini", "Pirlo", "Puskas"],
    R: ["Ronaldinho", "Ronaldo Nazario", "Raul", "Roberto Carlos", "Rivaldo"],
    S: ["Scholes", "Shearer", "Seedorf"],
    T: ["Totti", "Thierry Henry", "Torres"],
    U: ["Ulf Kirsten"],
    V: ["Van Basten", "Vieira", "Villa"],
    Z: ["Zidane", "Zanetti", "Zico"],
  },
  "País mundialista": {
    A: ["Argentina", "Alemania", "Australia", "Arabia Saudita"],
    B: ["Brasil", "Belgica"],
    C: ["Colombia", "Croacia", "Costa Rica", "Camerun", "Chile", "Corea del Sur"],
    D: ["Dinamarca"],
    E: ["España", "Ecuador", "Estados Unidos"],
    F: ["Francia"],
    G: ["Ghana", "Gales"],
    H: ["Holanda", "Honduras"],
    I: ["Inglaterra", "Iran", "Italia"],
    J: ["Japon"],
    K: ["Kuwait"],
    L: ["Liberia"],
    M: ["Mexico", "Marruecos"],
    N: ["Nigeria", "Noruega"],
    O: ["Oman"],
    P: ["Portugal", "Peru", "Paraguay", "Polonia"],
    R: ["Rusia", "Rumania"],
    S: ["Senegal", "Serbia", "Suiza", "Suecia"],
    T: ["Tunez", "Turquia", "Togo"],
    U: ["Uruguay", "Ucrania"],
    V: ["Venezuela"],
    Z: ["Zambia", "Zimbabwe"],
  },
  "Club de España": {
    A: ["Athletic Club", "Atletico de Madrid", "Alaves", "Almeria"],
    B: ["Barcelona", "Betis"],
    C: ["Celta de Vigo", "Cadiz"],
    D: ["Deportivo"],
    E: ["Espanyol", "Elche"],
    F: ["Fiorentina"],
    G: ["Getafe", "Girona", "Granada"],
    H: ["Huesca"],
    L: ["Levante", "Las Palmas"],
    M: ["Mallorca", "Malaga"],
    O: ["Osasuna"],
    R: ["Real Madrid", "Real Sociedad", "Rayo Vallecano", "Real Betis"],
    S: ["Sevilla", "Sporting Gijon"],
    V: ["Valencia", "Villarreal", "Valladolid"],
    Z: ["Zaragoza"],
  },
  "Club de Inglaterra": {
    A: ["Arsenal", "Aston Villa"],
    B: ["Brighton", "Burnley", "Bournemouth", "Brentford"],
    C: ["Chelsea", "Crystal Palace", "Coventry"],
    E: ["Everton"],
    F: ["Fulham", "Forest"],
    H: ["Huddersfield"],
    I: ["Ipswich"],
    L: ["Liverpool", "Leicester", "Leeds", "Luton"],
    M: ["Manchester City", "Manchester United", "Middlesbrough"],
    N: ["Newcastle", "Norwich", "Nottingham Forest"],
    P: ["Portsmouth"],
    S: ["Southampton", "Sheffield United", "Sunderland", "Stoke"],
    T: ["Tottenham"],
    W: ["West Ham", "Wolves", "Watford"],
  },
  "Ganador Balón de Oro": {
    B: ["Beckenbauer", "Best"],
    C: ["Cruyff", "Cannavaro", "Cristiano Ronaldo"],
    D: ["Di Stefano"],
    E: ["Eusebio"],
    F: ["Figo"],
    G: ["George Best"],
    H: ["Henry"],
    I: ["Iniesta"],
    K: ["Kaka", "Keegan", "Karl-Heinz Rummenigge"],
    L: ["Lewandowski", "Luis Suarez"],
    M: ["Messi", "Modric", "Matthaus", "Michael Owen", "Maradona"],
    N: ["Nedved"],
    O: ["Owen"],
    P: ["Platini", "Puskas"],
    R: ["Ronaldo", "Ronaldinho", "Rivaldo", "Rodri"],
    S: ["Shevchenko", "Stoichkov", "Sammer"],
    V: ["Van Basten"],
    Z: ["Zidane", "Zinedine Zidane"],
  },
  "Entrenador": {
    A: ["Ancelotti", "Allegri", "Arteta"],
    B: ["Bielsa"],
    C: ["Conte", "Capello", "Cruyff"],
    D: ["Del Bosque", "Deschamps"],
    E: ["Emery"],
    F: ["Ferguson", "Flick"],
    G: ["Guardiola", "Galtier"],
    H: ["Heynckes"],
    I: ["Inzaghi"],
    J: ["Jurgen Klopp"],
    K: ["Klopp", "Koeman"],
    L: ["Low", "Lippi"],
    M: ["Mourinho", "Mancini"],
    N: ["Nagelsmann"],
    P: ["Pochettino", "Pep Guardiola"],
    R: ["Rijkaard"],
    S: ["Simeone", "Sacchi", "Scaloni"],
    T: ["Tuchel", "Ten Hag"],
    V: ["Van Gaal"],
    W: ["Wenger"],
    X: ["Xavi"],
    Z: ["Zidane"],
  },
  "Club de Italia": {
    A: ["AC Milan", "Atalanta", "AS Roma"],
    B: ["Bologna"],
    C: ["Cagliari", "Como"],
    E: ["Empoli"],
    F: ["Fiorentina"],
    G: ["Genoa"],
    H: ["Hellas Verona"],
    I: ["Inter"],
    J: ["Juventus"],
    L: ["Lazio", "Lecce"],
    M: ["Milan", "Monza"],
    N: ["Napoli"],
    P: ["Parma", "Palermo"],
    R: ["Roma"],
    S: ["Sampdoria", "Sassuolo", "Salernitana"],
    T: ["Torino"],
    U: ["Udinese"],
    V: ["Venezia", "Verona"],
  },
};

// English/Spanish equivalents for countries
const COUNTRY_TRANSLATIONS: Record<string, string[]> = {
  "argentina": ["argentina"],
  "alemania": ["alemania", "germany"],
  "australia": ["australia"],
  "arabia saudita": ["arabia saudita", "saudi arabia"],
  "brasil": ["brasil", "brazil"],
  "belgica": ["belgica", "belgium"],
  "colombia": ["colombia"],
  "croacia": ["croacia", "croatia"],
  "costa rica": ["costa rica"],
  "camerun": ["camerun", "cameroon"],
  "chile": ["chile"],
  "corea del sur": ["corea del sur", "south korea", "korea"],
  "dinamarca": ["dinamarca", "denmark"],
  "espana": ["espana", "spain"],
  "ecuador": ["ecuador"],
  "estados unidos": ["estados unidos", "usa", "united states"],
  "francia": ["francia", "france"],
  "ghana": ["ghana"],
  "gales": ["gales", "wales"],
  "holanda": ["holanda", "netherlands", "holland"],
  "honduras": ["honduras"],
  "inglaterra": ["inglaterra", "england"],
  "iran": ["iran"],
  "italia": ["italia", "italy"],
  "japon": ["japon", "japan"],
  "mexico": ["mexico"],
  "marruecos": ["marruecos", "morocco"],
  "nigeria": ["nigeria"],
  "noruega": ["noruega", "norway"],
  "portugal": ["portugal"],
  "peru": ["peru"],
  "paraguay": ["paraguay"],
  "polonia": ["polonia", "poland"],
  "rusia": ["rusia", "russia"],
  "rumania": ["rumania", "romania"],
  "senegal": ["senegal"],
  "serbia": ["serbia"],
  "suiza": ["suiza", "switzerland"],
  "suecia": ["suecia", "sweden"],
  "tunez": ["tunez", "tunisia"],
  "turquia": ["turquia", "turkey"],
  "uruguay": ["uruguay"],
  "ucrania": ["ucrania", "ukraine"],
  "venezuela": ["venezuela"],
};

export function normalizeForStop(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function validateAnswer(category: string, letter: string, answer: string): boolean {
  if (!answer.trim()) return false;

  const validList = VALID_ANSWERS[category]?.[letter];
  if (!validList) return false;

  const normalized = normalizeForStop(answer);

  // Direct match against valid list
  if (validList.some((valid) => {
    const normalizedValid = normalizeForStop(valid);
    return normalizedValid.includes(normalized) || normalized.includes(normalizedValid);
  })) return true;

  // For country category, also check translations
  if (category === "País mundialista") {
    for (const translations of Object.values(COUNTRY_TRANSLATIONS)) {
      const matchesInput = translations.some((t) => normalizeForStop(t).includes(normalized) || normalized.includes(normalizeForStop(t)));
      if (matchesInput) {
        // Check if any translation starts with the required letter
        const matchesLetter = translations.some((t) => normalizeForStop(t).startsWith(letter.toLowerCase()));
        if (matchesLetter) return true;
        // Also check if original valid list has a match
        const originalMatch = validList.some((v) => {
          const nv = normalizeForStop(v);
          return translations.some((t) => normalizeForStop(t).includes(nv) || nv.includes(normalizeForStop(t)));
        });
        if (originalMatch) return true;
      }
    }
  }

  return false;
}
