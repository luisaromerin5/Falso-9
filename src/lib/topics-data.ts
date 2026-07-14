export interface TopicAnswer {
  position: number;
  player: string;
  nationality: string;
  stat: string;
  aliases: string[];
}

export interface Topic {
  id: number;
  title: string;
  answers: TopicAnswer[];
}

export const TOPICS: Topic[] = [
  {
    id: 1,
    title: "Máximos goleadores en la historia del Real Madrid",
    answers: [
      { position: 1, player: "Cristiano Ronaldo", nationality: "Portugal", stat: "451 goles", aliases: ["cr7", "ronaldo"] },
      { position: 2, player: "Raúl", nationality: "Spain", stat: "323 goles", aliases: ["raul gonzalez"] },
      { position: 3, player: "Alfredo Di Stéfano", nationality: "Argentina", stat: "308 goles", aliases: ["di stefano", "distefano"] },
      { position: 4, player: "Karim Benzema", nationality: "France", stat: "354 goles", aliases: ["benzema"] },
      { position: 5, player: "Santillana", nationality: "Spain", stat: "290 goles", aliases: ["carlos santillana"] },
      { position: 6, player: "Ferenc Puskás", nationality: "Hungary", stat: "242 goles", aliases: ["puskas"] },
      { position: 7, player: "Hugo Sánchez", nationality: "Mexico", stat: "208 goles", aliases: ["hugo sanchez"] },
      { position: 8, player: "Emilio Butragueño", nationality: "Spain", stat: "171 goles", aliases: ["butragueno"] },
      { position: 9, player: "Pirri", nationality: "Spain", stat: "172 goles", aliases: [] },
      { position: 10, player: "Vinicius Jr", nationality: "Brazil", stat: "100+ goles", aliases: ["vinicius", "vini jr", "vini"] },
    ],
  },
  {
    id: 2,
    title: "Máximos goleadores en la historia del Barcelona",
    answers: [
      { position: 1, player: "Lionel Messi", nationality: "Argentina", stat: "672 goles", aliases: ["messi", "leo messi"] },
      { position: 2, player: "César", nationality: "Spain", stat: "232 goles", aliases: ["cesar rodriguez"] },
      { position: 3, player: "Luis Suárez", nationality: "Uruguay", stat: "198 goles", aliases: ["suarez"] },
      { position: 4, player: "László Kubala", nationality: "Hungary", stat: "194 goles", aliases: ["kubala"] },
      { position: 5, player: "Samuel Eto'o", nationality: "Cameroon", stat: "130 goles", aliases: ["etoo", "eto o"] },
      { position: 6, player: "Rivaldo", nationality: "Brazil", stat: "130 goles", aliases: [] },
      { position: 7, player: "Neymar", nationality: "Brazil", stat: "105 goles", aliases: ["neymar jr"] },
      { position: 8, player: "Thierry Henry", nationality: "France", stat: "49 goles", aliases: ["henry"] },
      { position: 9, player: "Ronaldinho", nationality: "Brazil", stat: "94 goles", aliases: ["ronaldinho gaucho"] },
      { position: 10, player: "David Villa", nationality: "Spain", stat: "48 goles", aliases: ["villa"] },
    ],
  },
  {
    id: 3,
    title: "Jugadores con más Balones de Oro",
    answers: [
      { position: 1, player: "Lionel Messi", nationality: "Argentina", stat: "8", aliases: ["messi", "leo messi"] },
      { position: 2, player: "Cristiano Ronaldo", nationality: "Portugal", stat: "5", aliases: ["cr7", "ronaldo"] },
      { position: 3, player: "Johan Cruyff", nationality: "Netherlands", stat: "3", aliases: ["cruyff"] },
      { position: 4, player: "Michel Platini", nationality: "France", stat: "3", aliases: ["platini"] },
      { position: 5, player: "Marco van Basten", nationality: "Netherlands", stat: "3", aliases: ["van basten"] },
      { position: 6, player: "Franz Beckenbauer", nationality: "Germany", stat: "2", aliases: ["beckenbauer"] },
      { position: 7, player: "Alfredo Di Stéfano", nationality: "Argentina", stat: "2", aliases: ["di stefano"] },
      { position: 8, player: "Ronaldo Nazário", nationality: "Brazil", stat: "2", aliases: ["ronaldo nazario", "r9", "ronaldo fenomeno"] },
      { position: 9, player: "Kevin Keegan", nationality: "England", stat: "2", aliases: ["keegan"] },
      { position: 10, player: "Karl-Heinz Rummenigge", nationality: "Germany", stat: "2", aliases: ["rummenigge"] },
    ],
  },
  {
    id: 4,
    title: "Máximos goleadores en la historia de las Copas del Mundo",
    answers: [
      { position: 1, player: "Miroslav Klose", nationality: "Germany", stat: "16 goles", aliases: ["klose"] },
      { position: 2, player: "Ronaldo Nazário", nationality: "Brazil", stat: "15 goles", aliases: ["ronaldo", "r9"] },
      { position: 3, player: "Gerd Müller", nationality: "Germany", stat: "14 goles", aliases: ["muller", "gerd muller"] },
      { position: 4, player: "Just Fontaine", nationality: "France", stat: "13 goles", aliases: ["fontaine"] },
      { position: 5, player: "Pelé", nationality: "Brazil", stat: "12 goles", aliases: ["pele"] },
      { position: 6, player: "Kylian Mbappé", nationality: "France", stat: "12 goles", aliases: ["mbappe"] },
      { position: 7, player: "Jürgen Klinsmann", nationality: "Germany", stat: "11 goles", aliases: ["klinsmann"] },
      { position: 8, player: "Sándor Kocsis", nationality: "Hungary", stat: "11 goles", aliases: ["kocsis"] },
      { position: 9, player: "Gabriel Batistuta", nationality: "Argentina", stat: "10 goles", aliases: ["batistuta", "batigol"] },
      { position: 10, player: "Thomas Müller", nationality: "Germany", stat: "10 goles", aliases: ["thomas muller", "t. muller"] },
    ],
  },
  {
    id: 5,
    title: "Equipos con más Champions League / Copa de Europa",
    answers: [
      { position: 1, player: "Real Madrid", nationality: "Spain", stat: "15 títulos", aliases: ["madrid"] },
      { position: 2, player: "AC Milan", nationality: "Italy", stat: "7 títulos", aliases: ["milan"] },
      { position: 3, player: "Bayern Munich", nationality: "Germany", stat: "6 títulos", aliases: ["bayern", "bayern münchen"] },
      { position: 4, player: "Liverpool", nationality: "England", stat: "6 títulos", aliases: [] },
      { position: 5, player: "Barcelona", nationality: "Spain", stat: "5 títulos", aliases: ["barca"] },
      { position: 6, player: "Ajax", nationality: "Netherlands", stat: "4 títulos", aliases: [] },
      { position: 7, player: "Inter", nationality: "Italy", stat: "3 títulos", aliases: ["inter milan", "internazionale"] },
      { position: 8, player: "Manchester United", nationality: "England", stat: "3 títulos", aliases: ["man utd", "man united"] },
      { position: 9, player: "Juventus", nationality: "Italy", stat: "2 títulos", aliases: ["juve"] },
      { position: 10, player: "Benfica", nationality: "Portugal", stat: "2 títulos", aliases: [] },
    ],
  },
  {
    id: 6,
    title: "Máximos goleadores en la historia de la Champions League",
    answers: [
      { position: 1, player: "Cristiano Ronaldo", nationality: "Portugal", stat: "140 goles", aliases: ["cr7", "ronaldo"] },
      { position: 2, player: "Lionel Messi", nationality: "Argentina", stat: "129 goles", aliases: ["messi", "leo messi"] },
      { position: 3, player: "Robert Lewandowski", nationality: "Poland", stat: "94 goles", aliases: ["lewandowski", "lewy"] },
      { position: 4, player: "Karim Benzema", nationality: "France", stat: "90 goles", aliases: ["benzema"] },
      { position: 5, player: "Raúl", nationality: "Spain", stat: "71 goles", aliases: ["raul gonzalez"] },
      { position: 6, player: "Ruud van Nistelrooy", nationality: "Netherlands", stat: "56 goles", aliases: ["van nistelrooy", "nistelrooy"] },
      { position: 7, player: "Thomas Müller", nationality: "Germany", stat: "54 goles", aliases: ["muller", "thomas muller"] },
      { position: 8, player: "Thierry Henry", nationality: "France", stat: "50 goles", aliases: ["henry"] },
      { position: 9, player: "Zlatan Ibrahimović", nationality: "Sweden", stat: "48 goles", aliases: ["ibrahimovic", "zlatan", "ibra"] },
      { position: 10, player: "Andriy Shevchenko", nationality: "Ukraine", stat: "48 goles", aliases: ["shevchenko"] },
    ],
  },
  {
    id: 7,
    title: "Selecciones con más Copas del Mundo",
    answers: [
      { position: 1, player: "Brasil", nationality: "South America", stat: "5 títulos", aliases: ["brazil"] },
      { position: 2, player: "Alemania", nationality: "Europe", stat: "4 títulos", aliases: ["germany"] },
      { position: 3, player: "Italia", nationality: "Europe", stat: "4 títulos", aliases: ["italy"] },
      { position: 4, player: "Argentina", nationality: "South America", stat: "3 títulos", aliases: [] },
      { position: 5, player: "Francia", nationality: "Europe", stat: "2 títulos", aliases: ["france"] },
      { position: 6, player: "Uruguay", nationality: "South America", stat: "2 títulos", aliases: [] },
      { position: 7, player: "Inglaterra", nationality: "Europe", stat: "1 título", aliases: ["england"] },
      { position: 8, player: "España", nationality: "Europe", stat: "1 título", aliases: ["spain"] },
      { position: 9, player: "Países Bajos", nationality: "Europe", stat: "0 (3 finales)", aliases: ["netherlands", "holanda", "holland"] },
      { position: 10, player: "Hungría", nationality: "Europe", stat: "0 (2 finales)", aliases: ["hungary"] },
    ],
  },
];

export function getTodaysTopic(): Topic {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - start.getTime()) / 86400000);
  return TOPICS[dayOfYear % TOPICS.length];
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = a[i - 1] === b[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
    }
  }
  return matrix[a.length][b.length];
}

function fuzzyMatch(input: string, target: string): boolean {
  if (input.length < 3) return input === target;
  // Exact or contains
  if (target.includes(input) || input.includes(target)) return true;
  // Check individual words (first name or last name)
  const targetWords = target.split(" ");
  for (const word of targetWords) {
    if (word.length >= 3 && (word.includes(input) || input.includes(word))) return true;
    // Allow 1 typo for words 4+ chars
    if (word.length >= 4 && input.length >= 4 && levenshtein(input, word) <= 1) return true;
  }
  // Full string with 1 typo
  if (target.length >= 4 && input.length >= 4 && levenshtein(input, target) <= 1) return true;
  return false;
}

export function checkAnswer(input: string, answer: TopicAnswer): boolean {
  const normalized = normalizeText(input);
  if (normalized.length < 2) return false;

  // Check main name
  if (fuzzyMatch(normalized, normalizeText(answer.player))) return true;

  // Check individual parts of the name
  const nameParts = normalizeText(answer.player).split(" ");
  for (const part of nameParts) {
    if (part.length >= 3 && fuzzyMatch(normalized, part)) return true;
  }

  // Check aliases
  for (const alias of answer.aliases) {
    if (fuzzyMatch(normalized, normalizeText(alias))) return true;
  }

  return false;
}
