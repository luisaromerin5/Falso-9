// Player database for games - market values in millions of euros
export interface GamePlayer {
  id: number;
  name: string;
  club: string;
  nationality: string;
  position: string;
  marketValue: number; // in millions
  photo?: string;
}

export const PLAYERS: GamePlayer[] = [
  { id: 1, name: "Kylian Mbappé", club: "Real Madrid", nationality: "France", position: "Forward", marketValue: 180 },
  { id: 2, name: "Erling Haaland", club: "Manchester City", nationality: "Norway", position: "Forward", marketValue: 170 },
  { id: 3, name: "Vinicius Jr", club: "Real Madrid", nationality: "Brazil", position: "Forward", marketValue: 150 },
  { id: 4, name: "Jude Bellingham", club: "Real Madrid", nationality: "England", position: "Midfielder", marketValue: 150 },
  { id: 5, name: "Bukayo Saka", club: "Arsenal", nationality: "England", position: "Forward", marketValue: 140 },
  { id: 6, name: "Phil Foden", club: "Manchester City", nationality: "England", position: "Midfielder", marketValue: 130 },
  { id: 7, name: "Florian Wirtz", club: "Bayer Leverkusen", nationality: "Germany", position: "Midfielder", marketValue: 130 },
  { id: 8, name: "Lamine Yamal", club: "Barcelona", nationality: "Spain", position: "Forward", marketValue: 120 },
  { id: 9, name: "Rodri", club: "Manchester City", nationality: "Spain", position: "Midfielder", marketValue: 120 },
  { id: 10, name: "Pedri", club: "Barcelona", nationality: "Spain", position: "Midfielder", marketValue: 100 },
  { id: 11, name: "Jamal Musiala", club: "Bayern Munich", nationality: "Germany", position: "Midfielder", marketValue: 110 },
  { id: 12, name: "Mohamed Salah", club: "Liverpool", nationality: "Egypt", position: "Forward", marketValue: 80 },
  { id: 13, name: "Bruno Fernandes", club: "Manchester United", nationality: "Portugal", position: "Midfielder", marketValue: 75 },
  { id: 14, name: "Martin Ødegaard", club: "Arsenal", nationality: "Norway", position: "Midfielder", marketValue: 100 },
  { id: 15, name: "Declan Rice", club: "Arsenal", nationality: "England", position: "Midfielder", marketValue: 100 },
  { id: 16, name: "Harry Kane", club: "Bayern Munich", nationality: "England", position: "Forward", marketValue: 90 },
  { id: 17, name: "Lautaro Martínez", club: "Inter", nationality: "Argentina", position: "Forward", marketValue: 90 },
  { id: 18, name: "Gavi", club: "Barcelona", nationality: "Spain", position: "Midfielder", marketValue: 80 },
  { id: 19, name: "Federico Valverde", club: "Real Madrid", nationality: "Uruguay", position: "Midfielder", marketValue: 110 },
  { id: 20, name: "Khvicha Kvaratskhelia", club: "PSG", nationality: "Georgia", position: "Forward", marketValue: 85 },
  { id: 21, name: "Alejandro Garnacho", club: "Manchester United", nationality: "Argentina", position: "Forward", marketValue: 50 },
  { id: 22, name: "Lionel Messi", club: "Inter Miami", nationality: "Argentina", position: "Forward", marketValue: 25 },
  { id: 23, name: "Cristiano Ronaldo", club: "Al-Nassr", nationality: "Portugal", position: "Forward", marketValue: 15 },
  { id: 24, name: "Neymar Jr", club: "Santos", nationality: "Brazil", position: "Forward", marketValue: 15 },
  { id: 25, name: "Robert Lewandowski", club: "Barcelona", nationality: "Poland", position: "Forward", marketValue: 15 },
  { id: 26, name: "Kevin De Bruyne", club: "Manchester City", nationality: "Belgium", position: "Midfielder", marketValue: 50 },
  { id: 27, name: "Son Heung-min", club: "Tottenham", nationality: "South Korea", position: "Forward", marketValue: 50 },
  { id: 28, name: "Virgil van Dijk", club: "Liverpool", nationality: "Netherlands", position: "Defender", marketValue: 30 },
  { id: 29, name: "Thibaut Courtois", club: "Real Madrid", nationality: "Belgium", position: "Goalkeeper", marketValue: 30 },
  { id: 30, name: "Alisson", club: "Liverpool", nationality: "Brazil", position: "Goalkeeper", marketValue: 35 },
  { id: 31, name: "Dani Olmo", club: "Barcelona", nationality: "Spain", position: "Midfielder", marketValue: 60 },
  { id: 32, name: "William Saliba", club: "Arsenal", nationality: "France", position: "Defender", marketValue: 90 },
  { id: 33, name: "Nico Williams", club: "Athletic Club", nationality: "Spain", position: "Forward", marketValue: 70 },
  { id: 34, name: "Cole Palmer", club: "Chelsea", nationality: "England", position: "Forward", marketValue: 100 },
  { id: 35, name: "Bernardo Silva", club: "Manchester City", nationality: "Portugal", position: "Midfielder", marketValue: 70 },
  { id: 36, name: "Raphinha", club: "Barcelona", nationality: "Brazil", position: "Forward", marketValue: 70 },
  { id: 37, name: "Antonio Rüdiger", club: "Real Madrid", nationality: "Germany", position: "Defender", marketValue: 30 },
  { id: 38, name: "Achraf Hakimi", club: "PSG", nationality: "Morocco", position: "Defender", marketValue: 65 },
  { id: 39, name: "Trent Alexander-Arnold", club: "Liverpool", nationality: "England", position: "Defender", marketValue: 70 },
  { id: 40, name: "Marc-André ter Stegen", club: "Barcelona", nationality: "Germany", position: "Goalkeeper", marketValue: 25 },
  { id: 41, name: "Julián Álvarez", club: "Atlético Madrid", nationality: "Argentina", position: "Forward", marketValue: 80 },
  { id: 42, name: "Aurélien Tchouaméni", club: "Real Madrid", nationality: "France", position: "Midfielder", marketValue: 80 },
  { id: 43, name: "Victor Osimhen", club: "Napoli", nationality: "Nigeria", position: "Forward", marketValue: 75 },
  { id: 44, name: "Alexander Isak", club: "Newcastle", nationality: "Sweden", position: "Forward", marketValue: 85 },
  { id: 45, name: "Dani Carvajal", club: "Real Madrid", nationality: "Spain", position: "Defender", marketValue: 20 },
];

// Get random players for games
export function getRandomPlayers(count: number, exclude: number[] = []): GamePlayer[] {
  const available = PLAYERS.filter((p) => !exclude.includes(p.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
