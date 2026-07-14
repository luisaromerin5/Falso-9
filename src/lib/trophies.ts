// Trofeos históricos de los principales equipos
// Datos actualizados a 2024

export interface Trophy {
  name: string;
  count: number;
  icon: string;
  logo?: string;
}

const TEAM_TROPHIES: Record<string, Trophy[]> = {
  "Real Madrid": [
    { name: "Champions League", count: 15, icon: "🏆" },
    { name: "La Liga", count: 36, icon: "🥇" },
    { name: "Copa del Rey", count: 20, icon: "🏅" },
    { name: "Supercopa de España", count: 13, icon: "🎖️" },
    { name: "Mundial de Clubes", count: 8, icon: "🌍" },
    { name: "Supercopa de Europa", count: 5, icon: "⭐" },
  ],
  "Barcelona": [
    { name: "Champions League", count: 5, icon: "🏆" },
    { name: "La Liga", count: 27, icon: "🥇" },
    { name: "Copa del Rey", count: 31, icon: "🏅" },
    { name: "Supercopa de España", count: 14, icon: "🎖️" },
    { name: "Mundial de Clubes", count: 3, icon: "🌍" },
    { name: "Supercopa de Europa", count: 5, icon: "⭐" },
  ],
  "Manchester City": [
    { name: "Champions League", count: 1, icon: "🏆" },
    { name: "Premier League", count: 10, icon: "🥇" },
    { name: "FA Cup", count: 7, icon: "🏅" },
    { name: "League Cup", count: 8, icon: "🎖️" },
    { name: "Mundial de Clubes", count: 1, icon: "🌍" },
  ],
  "Liverpool": [
    { name: "Champions League", count: 6, icon: "🏆" },
    { name: "Premier League", count: 19, icon: "🥇" },
    { name: "FA Cup", count: 8, icon: "🏅" },
    { name: "League Cup", count: 10, icon: "🎖️" },
    { name: "Supercopa de Europa", count: 4, icon: "⭐" },
  ],
  "Manchester United": [
    { name: "Champions League", count: 3, icon: "🏆" },
    { name: "Premier League", count: 20, icon: "🥇" },
    { name: "FA Cup", count: 12, icon: "🏅" },
    { name: "League Cup", count: 6, icon: "🎖️" },
    { name: "Europa League", count: 1, icon: "🏆" },
  ],
  "Bayern Munich": [
    { name: "Champions League", count: 6, icon: "🏆" },
    { name: "Bundesliga", count: 33, icon: "🥇" },
    { name: "DFB-Pokal", count: 20, icon: "🏅" },
    { name: "Mundial de Clubes", count: 2, icon: "🌍" },
    { name: "Supercopa de Europa", count: 2, icon: "⭐" },
  ],
  "Bayern München": [
    { name: "Champions League", count: 6, icon: "🏆" },
    { name: "Bundesliga", count: 33, icon: "🥇" },
    { name: "DFB-Pokal", count: 20, icon: "🏅" },
    { name: "Mundial de Clubes", count: 2, icon: "🌍" },
  ],
  "AC Milan": [
    { name: "Champions League", count: 7, icon: "🏆" },
    { name: "Serie A", count: 19, icon: "🥇" },
    { name: "Coppa Italia", count: 5, icon: "🏅" },
    { name: "Mundial de Clubes", count: 3, icon: "🌍" },
    { name: "Supercopa de Europa", count: 5, icon: "⭐" },
  ],
  "Inter": [
    { name: "Champions League", count: 3, icon: "🏆" },
    { name: "Serie A", count: 20, icon: "🥇" },
    { name: "Coppa Italia", count: 9, icon: "🏅" },
    { name: "Mundial de Clubes", count: 2, icon: "🌍" },
  ],
  "Juventus": [
    { name: "Champions League", count: 2, icon: "🏆" },
    { name: "Serie A", count: 36, icon: "🥇" },
    { name: "Coppa Italia", count: 14, icon: "🏅" },
    { name: "Supercoppa", count: 9, icon: "🎖️" },
  ],
  "Napoli": [
    { name: "Serie A", count: 3, icon: "🥇" },
    { name: "Coppa Italia", count: 6, icon: "🏅" },
    { name: "Supercoppa", count: 2, icon: "🎖️" },
  ],
  "Paris Saint Germain": [
    { name: "Ligue 1", count: 12, icon: "🥇" },
    { name: "Coupe de France", count: 15, icon: "🏅" },
    { name: "Coupe de la Ligue", count: 9, icon: "🎖️" },
  ],
  "PSG": [
    { name: "Ligue 1", count: 12, icon: "🥇" },
    { name: "Coupe de France", count: 15, icon: "🏅" },
    { name: "Coupe de la Ligue", count: 9, icon: "🎖️" },
  ],
  "Arsenal": [
    { name: "Premier League", count: 13, icon: "🥇" },
    { name: "FA Cup", count: 14, icon: "🏅" },
    { name: "League Cup", count: 2, icon: "🎖️" },
  ],
  "Chelsea": [
    { name: "Champions League", count: 2, icon: "🏆" },
    { name: "Premier League", count: 6, icon: "🥇" },
    { name: "FA Cup", count: 8, icon: "🏅" },
    { name: "Europa League", count: 2, icon: "🏆" },
    { name: "Mundial de Clubes", count: 1, icon: "🌍" },
  ],
  "Atletico Madrid": [
    { name: "La Liga", count: 11, icon: "🥇" },
    { name: "Copa del Rey", count: 10, icon: "🏅" },
    { name: "Europa League", count: 3, icon: "🏆" },
    { name: "Supercopa de Europa", count: 3, icon: "⭐" },
  ],
  "Atlético de Madrid": [
    { name: "La Liga", count: 11, icon: "🥇" },
    { name: "Copa del Rey", count: 10, icon: "🏅" },
    { name: "Europa League", count: 3, icon: "🏆" },
    { name: "Supercopa de Europa", count: 3, icon: "⭐" },
  ],
  "Borussia Dortmund": [
    { name: "Champions League", count: 1, icon: "🏆" },
    { name: "Bundesliga", count: 8, icon: "🥇" },
    { name: "DFB-Pokal", count: 5, icon: "🏅" },
    { name: "Mundial de Clubes", count: 1, icon: "🌍" },
  ],
  "Benfica": [
    { name: "Champions League", count: 2, icon: "🏆" },
    { name: "Primeira Liga", count: 38, icon: "🥇" },
    { name: "Taça de Portugal", count: 26, icon: "🏅" },
  ],
  "Porto": [
    { name: "Champions League", count: 2, icon: "🏆" },
    { name: "Primeira Liga", count: 30, icon: "🥇" },
    { name: "Taça de Portugal", count: 18, icon: "🏅" },
    { name: "Europa League", count: 2, icon: "🏆" },
  ],
  "Ajax": [
    { name: "Champions League", count: 4, icon: "🏆" },
    { name: "Eredivisie", count: 36, icon: "🥇" },
    { name: "KNVB Cup", count: 20, icon: "🏅" },
  ],
  "Boca Juniors": [
    { name: "Copa Libertadores", count: 6, icon: "🏆" },
    { name: "Liga Argentina", count: 35, icon: "🥇" },
    { name: "Copa Intercontinental", count: 3, icon: "🌍" },
  ],
  "River Plate": [
    { name: "Copa Libertadores", count: 4, icon: "🏆" },
    { name: "Liga Argentina", count: 38, icon: "🥇" },
    { name: "Copa Intercontinental", count: 1, icon: "🌍" },
  ],
  "Flamengo": [
    { name: "Copa Libertadores", count: 3, icon: "🏆" },
    { name: "Brasileirão", count: 8, icon: "🥇" },
    { name: "Copa do Brasil", count: 4, icon: "🏅" },
    { name: "Mundial de Clubes", count: 1, icon: "🌍" },
  ],
  "Tottenham": [
    { name: "Premier League", count: 2, icon: "🥇" },
    { name: "FA Cup", count: 8, icon: "🏅" },
    { name: "League Cup", count: 4, icon: "🎖️" },
  ],
  "Bayer Leverkusen": [
    { name: "Bundesliga", count: 1, icon: "🥇" },
    { name: "DFB-Pokal", count: 2, icon: "🏅" },
    { name: "UEFA Cup", count: 1, icon: "🏆" },
  ],
  // === SELECCIONES NACIONALES ===
  "Argentina": [
    { name: "World Cup", count: 3, icon: "🏆" },
    { name: "Copa América", count: 16, icon: "🏆" },
    { name: "Finalissima", count: 2, icon: "🏅" },
    { name: "Confederations Cup", count: 1, icon: "🏅" },
  ],
  "Brazil": [
    { name: "World Cup", count: 5, icon: "🏆" },
    { name: "Copa América", count: 9, icon: "🏆" },
    { name: "Confederations Cup", count: 4, icon: "🏅" },
  ],
  "Germany": [
    { name: "World Cup", count: 4, icon: "🏆" },
    { name: "European Championship", count: 3, icon: "🏆" },
    { name: "Confederations Cup", count: 1, icon: "🏅" },
  ],
  "Italy": [
    { name: "World Cup", count: 4, icon: "🏆" },
    { name: "European Championship", count: 2, icon: "🏆" },
  ],
  "France": [
    { name: "World Cup", count: 2, icon: "🏆" },
    { name: "European Championship", count: 2, icon: "🏆" },
    { name: "Confederations Cup", count: 2, icon: "🏅" },
    { name: "Nations League", count: 1, icon: "🏅" },
  ],
  "Spain": [
    { name: "World Cup", count: 1, icon: "🏆" },
    { name: "European Championship", count: 4, icon: "🏆" },
    { name: "Nations League", count: 1, icon: "🏅" },
  ],
  "England": [
    { name: "World Cup", count: 1, icon: "🏆" },
  ],
  "Uruguay": [
    { name: "World Cup", count: 2, icon: "🏆" },
    { name: "Copa América", count: 16, icon: "🥇" },
  ],
  "Portugal": [
    { name: "European Championship", count: 1, icon: "🥇" },
    { name: "Nations League", count: 1, icon: "🏅" },
  ],
  "Netherlands": [
    { name: "European Championship", count: 1, icon: "🥇" },
  ],
  "Mexico": [
    { name: "Gold Cup", count: 9, icon: "🥇" },
    { name: "Confederations Cup", count: 1, icon: "🎖️" },
  ],
  "USA": [
    { name: "Gold Cup", count: 7, icon: "🥇" },
  ],
  "Colombia": [
    { name: "Copa América", count: 2, icon: "🥇" },
  ],
  "Chile": [
    { name: "Copa América", count: 2, icon: "🥇" },
  ],
  "Japan": [
    { name: "Asian Cup", count: 4, icon: "🥇" },
  ],
  "Australia": [
    { name: "Asian Cup", count: 1, icon: "🥇" },
    { name: "OFC Nations Cup", count: 4, icon: "🏅" },
  ],
  "Morocco": [
    { name: "African Cup of Nations", count: 1, icon: "🥇" },
  ],
  "Senegal": [
    { name: "African Cup of Nations", count: 1, icon: "🥇" },
  ],
};

// National team trophies use local images (real trophy photos)
// Club trophies use competition logos from API
const NATIONAL_TROPHIES_WITH_IMAGES = new Set([
  "World Cup",
  "Copa América",
  "Finalissima",
  "Confederations Cup",
  "European Championship",
  "Nations League",
]);

// Club competition logos from API
const CLUB_TROPHY_LOGOS: Record<string, string> = {
  "Champions League": "https://media.api-sports.io/football/leagues/2.png",
  "La Liga": "https://media.api-sports.io/football/leagues/140.png",
  "Premier League": "https://media.api-sports.io/football/leagues/39.png",
  "Bundesliga": "https://media.api-sports.io/football/leagues/78.png",
  "Serie A": "https://media.api-sports.io/football/leagues/135.png",
  "Ligue 1": "https://media.api-sports.io/football/leagues/61.png",
  "Copa del Rey": "https://media.api-sports.io/football/leagues/143.png",
  "FA Cup": "https://media.api-sports.io/football/leagues/45.png",
  "DFB-Pokal": "https://media.api-sports.io/football/leagues/81.png",
  "Coppa Italia": "https://media.api-sports.io/football/leagues/137.png",
  "Europa League": "https://media.api-sports.io/football/leagues/3.png",
  "Copa Libertadores": "https://media.api-sports.io/football/leagues/13.png",
  "Mundial de Clubes": "https://media.api-sports.io/football/leagues/15.png",
  "Supercopa de España": "https://media.api-sports.io/football/leagues/556.png",
  "Supercopa de Europa": "https://media.api-sports.io/football/leagues/531.png",
  "League Cup": "https://media.api-sports.io/football/leagues/48.png",
  "Eredivisie": "https://media.api-sports.io/football/leagues/88.png",
  "Primeira Liga": "https://media.api-sports.io/football/leagues/94.png",
  "Liga Argentina": "https://media.api-sports.io/football/leagues/128.png",
  "Brasileirão": "https://media.api-sports.io/football/leagues/71.png",
  "Copa do Brasil": "https://media.api-sports.io/football/leagues/73.png",
  "KNVB Cup": "https://media.api-sports.io/football/leagues/90.png",
  "Taça de Portugal": "https://media.api-sports.io/football/leagues/96.png",
  "Supercoppa": "https://media.api-sports.io/football/leagues/547.png",
  "UEFA Cup": "https://media.api-sports.io/football/leagues/3.png",
  "Coupe de la Ligue": "https://media.api-sports.io/football/leagues/65.png",
  "Coupe de France": "https://media.api-sports.io/football/leagues/66.png",
};

// Local trophy images for national competitions
const NATIONAL_TROPHY_IMAGES: Record<string, string> = {
  "World Cup": "/trophies/world-cup.png",
  "Copa América": "/trophies/copa-america.png",
  "Finalissima": "/trophies/finalissima.png",
  "Confederations Cup": "/trophies/confederations-cup.png",
  "European Championship": "/trophies/euro.png",
  "Nations League": "/trophies/nations-league.png",
};

export function getTeamTrophies(teamName: string): Trophy[] | null {
  let trophies: Trophy[] | undefined;

  // Direct match
  if (TEAM_TROPHIES[teamName]) {
    trophies = TEAM_TROPHIES[teamName];
  } else {
    // Partial match
    for (const [key, t] of Object.entries(TEAM_TROPHIES)) {
      if (teamName.includes(key) || key.includes(teamName)) {
        trophies = t;
        break;
      }
    }
  }

  if (!trophies) return null;

  // Determine if this is a national team (has national competitions)
  const isNational = trophies.some((t) => NATIONAL_TROPHIES_WITH_IMAGES.has(t.name));

  // Attach logos based on type
  return trophies.map((t) => ({
    ...t,
    logo: isNational
      ? NATIONAL_TROPHY_IMAGES[t.name] || undefined
      : CLUB_TROPHY_LOGOS[t.name] || undefined,
  }));
}
