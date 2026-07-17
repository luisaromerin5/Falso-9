"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDailySeed } from "@/lib/daily-seed";
import GameLeaderboard from "@/components/GameLeaderboard";

interface GuessPlayer {
  name: string;
  club: string;
  nationality: string;
  position: string;
  attributes: Record<string, boolean>;
}

const QUESTIONS: { id: string; text: string }[] = [
  { id: "plays_europe", text: "¿Juega actualmente en Europa?" },
  { id: "is_forward", text: "¿Es delantero?" },
  { id: "is_midfielder", text: "¿Es mediocampista?" },
  { id: "is_defender", text: "¿Es defensa o portero?" },
  { id: "won_ballon_dor", text: "¿Ha ganado el Balón de Oro?" },
  { id: "won_world_cup", text: "¿Ha ganado un Mundial?" },
  { id: "won_champions", text: "¿Ha ganado la Champions League?" },
  { id: "plays_spain", text: "¿Juega en un club de España?" },
  { id: "plays_england", text: "¿Juega en un club de Inglaterra?" },
  { id: "plays_italy_germany_france", text: "¿Juega en Italia, Alemania o Francia?" },
  { id: "south_american", text: "¿Es sudamericano?" },
  { id: "european", text: "¿Es europeo?" },
  { id: "over_30", text: "¿Tiene más de 30 años?" },
  { id: "under_25", text: "¿Tiene menos de 25 años?" },
  { id: "plays_real_madrid", text: "¿Juega en el Real Madrid?" },
  { id: "plays_barcelona", text: "¿Juega en el Barcelona?" },
  { id: "plays_manchester_city", text: "¿Juega en el Manchester City?" },
  { id: "plays_liverpool", text: "¿Juega en el Liverpool?" },
  { id: "plays_psg", text: "¿Juega en el PSG?" },
  { id: "plays_bayern", text: "¿Juega en el Bayern Munich?" },
  { id: "plays_premier", text: "¿Juega en la Premier League?" },
];

const GUESS_PLAYERS: GuessPlayer[] = [
  { name: "Kylian Mbappé", club: "Real Madrid", nationality: "France", position: "Forward",
    attributes: { plays_europe: true, is_forward: true, is_midfielder: false, is_defender: false, won_ballon_dor: false, won_world_cup: true, won_champions: false, plays_spain: true, plays_england: false, plays_italy_germany_france: false, south_american: false, european: true, over_30: false, under_25: false, plays_real_madrid: true, plays_barcelona: false, plays_manchester_city: false, plays_liverpool: false, plays_psg: false, plays_bayern: false, plays_premier: false }},
  { name: "Lionel Messi", club: "Inter Miami", nationality: "Argentina", position: "Forward",
    attributes: { plays_europe: false, is_forward: true, is_midfielder: false, is_defender: false, won_ballon_dor: true, won_world_cup: true, won_champions: true, plays_spain: false, plays_england: false, plays_italy_germany_france: false, south_american: true, european: false, over_30: true, under_25: false, plays_real_madrid: false, plays_barcelona: false, plays_manchester_city: false, plays_liverpool: false, plays_psg: false, plays_bayern: false, plays_premier: false }},
  { name: "Erling Haaland", club: "Manchester City", nationality: "Norway", position: "Forward",
    attributes: { plays_europe: true, is_forward: true, is_midfielder: false, is_defender: false, won_ballon_dor: false, won_world_cup: false, won_champions: false, plays_spain: false, plays_england: true, plays_italy_germany_france: false, south_american: false, european: true, over_30: false, under_25: false, plays_real_madrid: false, plays_barcelona: false, plays_manchester_city: true, plays_liverpool: false, plays_psg: false, plays_bayern: false, plays_premier: true }},
  { name: "Vinicius Jr", club: "Real Madrid", nationality: "Brazil", position: "Forward",
    attributes: { plays_europe: true, is_forward: true, is_midfielder: false, is_defender: false, won_ballon_dor: false, won_world_cup: false, won_champions: true, plays_spain: true, plays_england: false, plays_italy_germany_france: false, south_american: true, european: false, over_30: false, under_25: false, plays_real_madrid: true, plays_barcelona: false, plays_manchester_city: false, plays_liverpool: false, plays_psg: false, plays_bayern: false, plays_premier: false }},
  { name: "Jude Bellingham", club: "Real Madrid", nationality: "England", position: "Midfielder",
    attributes: { plays_europe: true, is_forward: false, is_midfielder: true, is_defender: false, won_ballon_dor: false, won_world_cup: false, won_champions: true, plays_spain: true, plays_england: false, plays_italy_germany_france: false, south_american: false, european: true, over_30: false, under_25: true, plays_real_madrid: true, plays_barcelona: false, plays_manchester_city: false, plays_liverpool: false, plays_psg: false, plays_bayern: false, plays_premier: false }},
  { name: "Lamine Yamal", club: "Barcelona", nationality: "Spain", position: "Forward",
    attributes: { plays_europe: true, is_forward: true, is_midfielder: false, is_defender: false, won_ballon_dor: false, won_world_cup: false, won_champions: false, plays_spain: true, plays_england: false, plays_italy_germany_france: false, south_american: false, european: true, over_30: false, under_25: true, plays_real_madrid: false, plays_barcelona: true, plays_manchester_city: false, plays_liverpool: false, plays_psg: false, plays_bayern: false, plays_premier: false }},
  { name: "Mohamed Salah", club: "Liverpool", nationality: "Egypt", position: "Forward",
    attributes: { plays_europe: true, is_forward: true, is_midfielder: false, is_defender: false, won_ballon_dor: false, won_world_cup: false, won_champions: true, plays_spain: false, plays_england: true, plays_italy_germany_france: false, south_american: false, european: false, over_30: true, under_25: false, plays_real_madrid: false, plays_barcelona: false, plays_manchester_city: false, plays_liverpool: true, plays_psg: false, plays_bayern: false, plays_premier: true }},
  { name: "Rodri", club: "Manchester City", nationality: "Spain", position: "Midfielder",
    attributes: { plays_europe: true, is_forward: false, is_midfielder: true, is_defender: false, won_ballon_dor: true, won_world_cup: false, won_champions: true, plays_spain: false, plays_england: true, plays_italy_germany_france: false, south_american: false, european: true, over_30: false, under_25: false, plays_real_madrid: false, plays_barcelona: false, plays_manchester_city: true, plays_liverpool: false, plays_psg: false, plays_bayern: false, plays_premier: true }},
  { name: "Cristiano Ronaldo", club: "Al-Nassr", nationality: "Portugal", position: "Forward",
    attributes: { plays_europe: false, is_forward: true, is_midfielder: false, is_defender: false, won_ballon_dor: true, won_world_cup: false, won_champions: true, plays_spain: false, plays_england: false, plays_italy_germany_france: false, south_american: false, european: true, over_30: true, under_25: false, plays_real_madrid: false, plays_barcelona: false, plays_manchester_city: false, plays_liverpool: false, plays_psg: false, plays_bayern: false, plays_premier: false }},
  { name: "Harry Kane", club: "Bayern Munich", nationality: "England", position: "Forward",
    attributes: { plays_europe: true, is_forward: true, is_midfielder: false, is_defender: false, won_ballon_dor: false, won_world_cup: false, won_champions: false, plays_spain: false, plays_england: false, plays_italy_germany_france: true, south_american: false, european: true, over_30: true, under_25: false, plays_real_madrid: false, plays_barcelona: false, plays_manchester_city: false, plays_liverpool: false, plays_psg: false, plays_bayern: true, plays_premier: false }},
  { name: "Virgil van Dijk", club: "Liverpool", nationality: "Netherlands", position: "Defender",
    attributes: { plays_europe: true, is_forward: false, is_midfielder: false, is_defender: true, won_ballon_dor: false, won_world_cup: false, won_champions: true, plays_spain: false, plays_england: true, plays_italy_germany_france: false, south_american: false, european: true, over_30: true, under_25: false, plays_real_madrid: false, plays_barcelona: false, plays_manchester_city: false, plays_liverpool: true, plays_psg: false, plays_bayern: false, plays_premier: true }},
  { name: "Pedri", club: "Barcelona", nationality: "Spain", position: "Midfielder",
    attributes: { plays_europe: true, is_forward: false, is_midfielder: true, is_defender: false, won_ballon_dor: false, won_world_cup: false, won_champions: false, plays_spain: true, plays_england: false, plays_italy_germany_france: false, south_american: false, european: true, over_30: false, under_25: true, plays_real_madrid: false, plays_barcelona: true, plays_manchester_city: false, plays_liverpool: false, plays_psg: false, plays_bayern: false, plays_premier: false }},
];

export default function AdivinaQuienPage() {
  const [secretPlayer, setSecretPlayer] = useState<GuessPlayer | null>(null);
  const [availableQuestions, setAvailableQuestions] = useState(QUESTIONS);
  const [askedQuestions, setAskedQuestions] = useState<{ text: string; answer: boolean }[]>([]);
  const [questionsLeft, setQuestionsLeft] = useState(10);
  const [guessInput, setGuessInput] = useState("");
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [message, setMessage] = useState("");
  const [guessAttempts, setGuessAttempts] = useState(2);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);

  useEffect(() => {
    const lastPlayed = localStorage.getItem("adivina_last_date");
    const today = new Date().toISOString().split("T")[0];
    if (lastPlayed === today) {
      setAlreadyPlayed(true);
      setGameState("lost");
      const savedScore = localStorage.getItem("adivina_today_score");
      
    } else {
      startNewGame();
    }
  }, []);

  const startNewGame = () => {
    const seed = getDailySeed() + 42; // offset so different from other games
    const player = GUESS_PLAYERS[seed % GUESS_PLAYERS.length];
    setSecretPlayer(player);
    setAvailableQuestions(QUESTIONS);
    setAskedQuestions([]);
    setQuestionsLeft(10);
    setGuessInput("");
    setGameState("playing");
    setMessage("");
    setGuessAttempts(2);
  };

  const askQuestion = (question: { id: string; text: string }) => {
    if (!secretPlayer || questionsLeft <= 0) return;

    const answer = secretPlayer.attributes[question.id];
    setAskedQuestions([...askedQuestions, { text: question.text, answer }]);
    setAvailableQuestions(availableQuestions.filter((q) => q.id !== question.id));
    setQuestionsLeft(questionsLeft - 1);
  };

  const submitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretPlayer || !guessInput.trim()) return;

    const normalized = guessInput.toLowerCase().trim();
    const playerName = secretPlayer.name.toLowerCase();

    if (playerName.includes(normalized) || normalized.includes(playerName) || 
        normalized.includes(playerName.split(" ").pop()!.toLowerCase())) {
      setGameState("won");
      localStorage.setItem("adivina_last_date", new Date().toISOString().split("T")[0]);
      localStorage.setItem("adivina_today_score", String((10 - questionsLeft) * 10 + guessAttempts * 5));
    } else {
      const remaining = guessAttempts - 1;
      setGuessAttempts(remaining);
      if (remaining <= 0) {
        setMessage("Sin intentos de adivinanza!");
        setGameState("lost");
        localStorage.setItem("adivina_last_date", new Date().toISOString().split("T")[0]);
        localStorage.setItem("adivina_today_score", "0");
      } else {
        setMessage(`Incorrecto! Te queda ${remaining} intento${remaining > 1 ? "s" : ""} de adivinar.`);
      }
    }
    setGuessInput("");
  };

  if (!secretPlayer) return null;

  return (
    <div className="py-4">
      <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-white">Adivina Quién</h1>
        <div className="text-right">
          <span className="text-xs text-gray-400">Preguntas: <span className="text-white font-bold">{questionsLeft}</span>/10</span>
          <p className="text-[9px] text-gray-500">Intentos: {guessAttempts}</p>
        </div>
      </div>

      {/* Win/Lose screen */}
      {gameState !== "playing" && (
      <>
        <div className={`bg-gray-800 rounded-xl p-6 border ${gameState === "won" ? "border-green-500" : "border-red-500"} mb-4 text-center`}>
          <p className="text-xl font-bold text-white mb-1">{gameState === "won" ? "Correcto!" : "Game Over"}</p>
          <p className="text-sm text-gray-400 mb-1">El jugador era:</p>
          <p className="text-lg font-black text-orange-400">{secretPlayer.name}</p>
          <p className="text-xs text-gray-400">{secretPlayer.club} • {secretPlayer.nationality}</p>
          {gameState === "won" && (
            <p className="text-sm text-green-400 mt-2">Lo adivinaste con {10 - questionsLeft} preguntas</p>
          )}
          <p className="text-xs text-gray-400 text-center mt-4">Vuelve mañana para un nuevo reto</p>
        </div>

        <GameLeaderboard game="adivina-quien" currentScore={gameState === "won" ? (10 - questionsLeft) * 10 + guessAttempts * 5 : 0} />

        <p className="text-xs text-gray-400 text-center mt-4">Vuelve mañana para un nuevo reto</p>
      </>
      )}

      {/* Game area */}
      {gameState === "playing" && (
        <>
          {/* Guess input */}
          <form onSubmit={submitGuess} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                placeholder="¿Quién es? Escribe tu respuesta..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none"
              />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 rounded-lg text-sm">
                Adivinar
              </button>
            </div>
          </form>

          {message && (
            <p className="text-xs text-red-400 bg-red-900/20 p-2 rounded-lg mb-3">{message}</p>
          )}

          {/* Asked questions */}
          {askedQuestions.length > 0 && (
            <div className="mb-4 space-y-1.5">
              <p className="text-[10px] text-gray-400 uppercase">Preguntas hechas</p>
              {askedQuestions.map((q, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2 border border-gray-700">
                  <span className="text-xs text-gray-300">{q.text}</span>
                  <span className={`text-xs font-bold ${q.answer ? "text-green-400" : "text-red-400"}`}>
                    {q.answer ? "SÍ" : "NO"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Available questions */}
          <div>
            <p className="text-[10px] text-gray-400 uppercase mb-2">Haz una pregunta</p>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
              {availableQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => askQuestion(q)}
                  className="w-full text-left bg-gray-800 border border-gray-700 hover:border-orange-500 rounded-lg px-3 py-2.5 text-xs text-white transition-colors"
                >
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
