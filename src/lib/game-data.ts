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
  { id: 1, name: "Kylian Mbappé", club: "Real Madrid", nationality: "France", position: "Forward", marketValue: 180, photo: "https://media.api-sports.io/football/players/278.png" },
  { id: 2, name: "Erling Haaland", club: "Manchester City", nationality: "Norway", position: "Forward", marketValue: 170, photo: "https://media.api-sports.io/football/players/1100.png" },
  { id: 3, name: "Vinicius Jr", club: "Real Madrid", nationality: "Brazil", position: "Forward", marketValue: 150, photo: "https://media.api-sports.io/football/players/5765.png" },
  { id: 4, name: "Jude Bellingham", club: "Real Madrid", nationality: "England", position: "Midfielder", marketValue: 150, photo: "https://media.api-sports.io/football/players/129718.png" },
  { id: 5, name: "Bukayo Saka", club: "Arsenal", nationality: "England", position: "Forward", marketValue: 140, photo: "https://media.api-sports.io/football/players/152998.png" },
  { id: 6, name: "Phil Foden", club: "Manchester City", nationality: "England", position: "Midfielder", marketValue: 130, photo: "https://media.api-sports.io/football/players/3254.png" },
  { id: 7, name: "Florian Wirtz", club: "Liverpool", nationality: "Germany", position: "Midfielder", marketValue: 130, photo: "https://media.api-sports.io/football/players/287126.png" },
  { id: 8, name: "Lamine Yamal", club: "Barcelona", nationality: "Spain", position: "Forward", marketValue: 120, photo: "https://media.api-sports.io/football/players/406498.png" },
  { id: 9, name: "Rodri", club: "Manchester City", nationality: "Spain", position: "Midfielder", marketValue: 120, photo: "https://media.api-sports.io/football/players/49.png" },
  { id: 10, name: "Pedri", club: "Barcelona", nationality: "Spain", position: "Midfielder", marketValue: 100, photo: "https://media.api-sports.io/football/players/206079.png" },
  { id: 11, name: "Jamal Musiala", club: "Bayern Munich", nationality: "Germany", position: "Forward", marketValue: 110, photo: "https://media.api-sports.io/football/players/242444.png" },
  { id: 12, name: "Mohamed Salah", club: "Liverpool", nationality: "Egypt", position: "Forward", marketValue: 80, photo: "https://media.api-sports.io/football/players/306.png" },
  { id: 13, name: "Bruno Fernandes", club: "Manchester United", nationality: "Portugal", position: "Midfielder", marketValue: 75, photo: "https://media.api-sports.io/football/players/1485.png" },
  { id: 14, name: "Martin Ødegaard", club: "Arsenal", nationality: "Norway", position: "Midfielder", marketValue: 100, photo: "https://media.api-sports.io/football/players/2295.png" },
  { id: 15, name: "Declan Rice", club: "Arsenal", nationality: "England", position: "Midfielder", marketValue: 100, photo: "https://media.api-sports.io/football/players/1460.png" },
  { id: 16, name: "Harry Kane", club: "Bayern Munich", nationality: "England", position: "Forward", marketValue: 90, photo: "https://media.api-sports.io/football/players/184.png" },
  { id: 17, name: "Lautaro Martínez", club: "Inter", nationality: "Argentina", position: "Forward", marketValue: 90, photo: "https://media.api-sports.io/football/players/907.png" },
  { id: 18, name: "Gavi", club: "Barcelona", nationality: "Spain", position: "Midfielder", marketValue: 80, photo: "https://media.api-sports.io/football/players/285909.png" },
  { id: 19, name: "Federico Valverde", club: "Real Madrid", nationality: "Uruguay", position: "Midfielder", marketValue: 110, photo: "https://media.api-sports.io/football/players/12005.png" },
  { id: 20, name: "Khvicha Kvaratskhelia", club: "PSG", nationality: "Georgia", position: "Forward", marketValue: 85, photo: "https://media.api-sports.io/football/players/291443.png" },
  { id: 21, name: "Alejandro Garnacho", club: "Manchester United", nationality: "Argentina", position: "Forward", marketValue: 50, photo: "https://media.api-sports.io/football/players/284368.png" },
  { id: 22, name: "Lionel Messi", club: "Inter Miami", nationality: "Argentina", position: "Forward", marketValue: 25, photo: "https://media.api-sports.io/football/players/154.png" },
  { id: 23, name: "Cristiano Ronaldo", club: "Al-Nassr", nationality: "Portugal", position: "Forward", marketValue: 15, photo: "https://media.api-sports.io/football/players/874.png" },
  { id: 24, name: "Neymar Jr", club: "Santos", nationality: "Brazil", position: "Forward", marketValue: 15, photo: "https://media.api-sports.io/football/players/276.png" },
  { id: 25, name: "Robert Lewandowski", club: "Barcelona", nationality: "Poland", position: "Forward", marketValue: 15, photo: "https://media.api-sports.io/football/players/521.png" },
  { id: 26, name: "Kevin De Bruyne", club: "Manchester City", nationality: "Belgium", position: "Midfielder", marketValue: 50, photo: "https://media.api-sports.io/football/players/627.png" },
  { id: 27, name: "Son Heung-min", club: "Tottenham", nationality: "South Korea", position: "Forward", marketValue: 50, photo: "https://media.api-sports.io/football/players/186.png" },
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
  // More Defenders
  { id: 46, name: "Rúben Dias", club: "Manchester City", nationality: "Portugal", position: "Defender", marketValue: 75 },
  { id: 47, name: "João Cancelo", club: "Barcelona", nationality: "Portugal", position: "Defender", marketValue: 45 },
  { id: 48, name: "Theo Hernández", club: "AC Milan", nationality: "France", position: "Defender", marketValue: 55 },
  { id: 49, name: "Jules Koundé", club: "Barcelona", nationality: "France", position: "Defender", marketValue: 60 },
  { id: 50, name: "Marquinhos", club: "PSG", nationality: "Brazil", position: "Defender", marketValue: 50 },
  { id: 51, name: "Eder Militão", club: "Real Madrid", nationality: "Brazil", position: "Defender", marketValue: 60 },
  { id: 52, name: "Josko Gvardiol", club: "Manchester City", nationality: "Croatia", position: "Defender", marketValue: 75 },
  { id: 53, name: "Ronald Araújo", club: "Barcelona", nationality: "Uruguay", position: "Defender", marketValue: 55 },
  { id: 54, name: "Dayot Upamecano", club: "Bayern Munich", nationality: "France", position: "Defender", marketValue: 45 },
  { id: 55, name: "Lisandro Martínez", club: "Manchester United", nationality: "Argentina", position: "Defender", marketValue: 50 },
  { id: 56, name: "Andrew Robertson", club: "Liverpool", nationality: "Scotland", position: "Defender", marketValue: 30 },
  { id: 57, name: "Ben White", club: "Arsenal", nationality: "England", position: "Defender", marketValue: 55 },
  { id: 58, name: "Alessandro Bastoni", club: "Inter", nationality: "Italy", position: "Defender", marketValue: 65 },
  { id: 59, name: "Alphonso Davies", club: "Real Madrid", nationality: "Canada", position: "Defender", marketValue: 50 },
  { id: 60, name: "Pau Cubarsí", club: "Barcelona", nationality: "Spain", position: "Defender", marketValue: 60 },
  // More Goalkeepers
  { id: 61, name: "Ederson", club: "Manchester City", nationality: "Brazil", position: "Goalkeeper", marketValue: 35 },
  { id: 62, name: "Gianluigi Donnarumma", club: "PSG", nationality: "Italy", position: "Goalkeeper", marketValue: 35 },
  { id: 63, name: "Jan Oblak", club: "Atlético Madrid", nationality: "Slovenia", position: "Goalkeeper", marketValue: 25 },
  { id: 64, name: "André Onana", club: "Manchester United", nationality: "Cameroon", position: "Goalkeeper", marketValue: 30 },
  { id: 65, name: "Diogo Costa", club: "Porto", nationality: "Portugal", position: "Goalkeeper", marketValue: 30 },
  { id: 66, name: "Mike Maignan", club: "AC Milan", nationality: "France", position: "Goalkeeper", marketValue: 35 },
  { id: 67, name: "Emiliano Martínez", club: "Aston Villa", nationality: "Argentina", position: "Goalkeeper", marketValue: 30 },
  // More Midfielders
  { id: 68, name: "Enzo Fernández", club: "Chelsea", nationality: "Argentina", position: "Midfielder", marketValue: 70 },
  { id: 69, name: "Alexis Mac Allister", club: "Liverpool", nationality: "Argentina", position: "Midfielder", marketValue: 65 },
  { id: 70, name: "Luka Modric", club: "Real Madrid", nationality: "Croatia", position: "Midfielder", marketValue: 10 },
  { id: 71, name: "Eduardo Camavinga", club: "Real Madrid", nationality: "France", position: "Midfielder", marketValue: 80 },
  { id: 72, name: "Vitinha", club: "PSG", nationality: "Portugal", position: "Midfielder", marketValue: 70 },
  { id: 73, name: "Sandro Tonali", club: "Newcastle", nationality: "Italy", position: "Midfielder", marketValue: 45 },
  // More Forwards
  { id: 74, name: "Darwin Núñez", club: "Liverpool", nationality: "Uruguay", position: "Forward", marketValue: 60 },
  { id: 75, name: "Marcus Rashford", club: "Manchester United", nationality: "England", position: "Forward", marketValue: 50 },
  { id: 76, name: "Leroy Sané", club: "Bayern Munich", nationality: "Germany", position: "Forward", marketValue: 50 },
  { id: 77, name: "Antoine Griezmann", club: "Atlético Madrid", nationality: "France", position: "Forward", marketValue: 25 },
  { id: 78, name: "Paulo Dybala", club: "AS Roma", nationality: "Argentina", position: "Forward", marketValue: 20 },
  { id: 79, name: "Randal Kolo Muani", club: "PSG", nationality: "France", position: "Forward", marketValue: 50 },
  { id: 80, name: "Jamal Musiala", club: "Bayern Munich", nationality: "Germany", position: "Forward", marketValue: 110 },
];

// Get random players for games
export function getRandomPlayers(count: number, exclude: number[] = []): GamePlayer[] {
  const available = PLAYERS.filter((p) => !exclude.includes(p.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
