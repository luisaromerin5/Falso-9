// Map country names to flag emojis
const COUNTRY_FLAGS: Record<string, string> = {
  "Spain": "🇪🇸",
  "España": "🇪🇸",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Germany": "🇩🇪",
  "Alemania": "🇩🇪",
  "France": "🇫🇷",
  "Francia": "🇫🇷",
  "Italy": "🇮🇹",
  "Italia": "🇮🇹",
  "Portugal": "🇵🇹",
  "Netherlands": "🇳🇱",
  "Brazil": "🇧🇷",
  "Brasil": "🇧🇷",
  "Argentina": "🇦🇷",
  "Mexico": "🇲🇽",
  "México": "🇲🇽",
  "USA": "🇺🇸",
  "Colombia": "🇨🇴",
  "Uruguay": "🇺🇾",
  "Chile": "🇨🇱",
  "Ecuador": "🇪🇨",
  "Peru": "🇵🇪",
  "Paraguay": "🇵🇾",
  "Bolivia": "🇧🇴",
  "Venezuela": "🇻🇪",
  "Croatia": "🇭🇷",
  "Belgium": "🇧🇪",
  "Morocco": "🇲🇦",
  "Japan": "🇯🇵",
  "South Korea": "🇰🇷",
  "Australia": "🇦🇺",
  "Saudi Arabia": "🇸🇦",
  "Qatar": "🇶🇦",
  "Tunisia": "🇹🇳",
  "Senegal": "🇸🇳",
  "Cameroon": "🇨🇲",
  "Ghana": "🇬🇭",
  "Nigeria": "🇳🇬",
  "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Ireland": "🇮🇪",
  "Denmark": "🇩🇰",
  "Sweden": "🇸🇪",
  "Norway": "🇳🇴",
  "Switzerland": "🇨🇭",
  "Austria": "🇦🇹",
  "Poland": "🇵🇱",
  "Czech Republic": "🇨🇿",
  "Turkey": "🇹🇷",
  "Greece": "🇬🇷",
  "Serbia": "🇷🇸",
  "Canada": "🇨🇦",
  "Costa Rica": "🇨🇷",
  "Panama": "🇵🇦",
  "Honduras": "🇭🇳",
  "Iran": "🇮🇷",
  "World": "🌍",
  "Europa": "🇪🇺",
  "Europe": "🇪🇺",
  "Sudamérica": "🌎",
  "South America": "🌎",
};

// Map team names to their country
const TEAM_COUNTRIES: Record<string, string> = {
  "Real Madrid": "Spain",
  "Barcelona": "Spain",
  "Atletico Madrid": "Spain",
  "Atlético de Madrid": "Spain",
  "Sevilla": "Spain",
  "Real Sociedad": "Spain",
  "Villarreal": "Spain",
  "Real Betis": "Spain",
  "Athletic Club": "Spain",
  "Valencia": "Spain",
  "Manchester City": "England",
  "Manchester United": "England",
  "Liverpool": "England",
  "Arsenal": "England",
  "Chelsea": "England",
  "Tottenham": "England",
  "Newcastle": "England",
  "Aston Villa": "England",
  "West Ham": "England",
  "Brighton": "England",
  "Bayern Munich": "Germany",
  "Bayern München": "Germany",
  "Borussia Dortmund": "Germany",
  "RB Leipzig": "Germany",
  "Bayer Leverkusen": "Germany",
  "PSG": "France",
  "Paris Saint Germain": "France",
  "Olympique Marseille": "France",
  "Monaco": "France",
  "Lille": "France",
  "Lyon": "France",
  "Juventus": "Italy",
  "AC Milan": "Italy",
  "Inter": "Italy",
  "Napoli": "Italy",
  "AS Roma": "Italy",
  "Lazio": "Italy",
  "Atalanta": "Italy",
  "Fiorentina": "Italy",
  "Benfica": "Portugal",
  "Porto": "Portugal",
  "Sporting CP": "Portugal",
  "Ajax": "Netherlands",
  "PSV Eindhoven": "Netherlands",
  "Feyenoord": "Netherlands",
  "Boca Juniors": "Argentina",
  "River Plate": "Argentina",
  "Flamengo": "Brazil",
  "Palmeiras": "Brazil",
  "América": "Mexico",
  "Cruz Azul": "Mexico",
  "Guadalajara": "Mexico",
};

export function getCountryFlag(country: string): string {
  return COUNTRY_FLAGS[country] || "🏳️";
}

export function getTeamFlag(teamName: string): string {
  const country = TEAM_COUNTRIES[teamName];
  if (country) return COUNTRY_FLAGS[country] || "🏳️";
  
  // Try partial match
  for (const [team, ctry] of Object.entries(TEAM_COUNTRIES)) {
    if (teamName.includes(team) || team.includes(teamName)) {
      return COUNTRY_FLAGS[ctry] || "🏳️";
    }
  }
  
  return "🏳️";
}

export function getCompetitionFlag(competicion: string, pais?: string): string {
  if (pais) {
    const flag = COUNTRY_FLAGS[pais];
    if (flag) return flag;
  }
  
  if (competicion.includes("La Liga")) return "🇪🇸";
  if (competicion.includes("Premier")) return "🏴󠁧󠁢󠁥󠁮󠁧󠁿";
  if (competicion.includes("Bundesliga")) return "🇩🇪";
  if (competicion.includes("Serie A")) return "🇮🇹";
  if (competicion.includes("Ligue 1")) return "🇫🇷";
  if (competicion.includes("Champions")) return "🏆";
  if (competicion.includes("Europa League")) return "🏆";
  if (competicion.includes("World Cup")) return "🏆";
  if (competicion.includes("Libertadores")) return "🌎";
  if (competicion.includes("Liga MX")) return "🇲🇽";
  if (competicion.includes("MLS")) return "🇺🇸";
  
  return "⚽";
}
