"use client";

import { useState } from "react";
import Link from "next/link";
import { PLAYERS, GamePlayer } from "@/lib/game-data";

type GameState = "setup" | "passing" | "reveal" | "done";

export default function ImpostorPage() {
  const [state, setState] = useState<GameState>("setup");
  const [numPlayers, setNumPlayers] = useState(4);
  const [numImpostors, setNumImpostors] = useState(1);
  const [secretPlayer, setSecretPlayer] = useState<GamePlayer | null>(null);
  const [impostorIndices, setImpostorIndices] = useState<number[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  const startGame = () => {
    // Pick random secret player
    const player = PLAYERS[Math.floor(Math.random() * PLAYERS.length)];
    setSecretPlayer(player);

    // Pick random impostor indices
    const indices: number[] = [];
    while (indices.length < numImpostors) {
      const idx = Math.floor(Math.random() * numPlayers);
      if (!indices.includes(idx)) indices.push(idx);
    }
    setImpostorIndices(indices);
    setCurrentPlayerIndex(0);
    setShowRole(false);
    setState("passing");
  };

  const revealRole = () => {
    setShowRole(true);
    setState("reveal");
  };

  const nextPlayer = () => {
    setShowRole(false);
    const next = currentPlayerIndex + 1;
    if (next >= numPlayers) {
      setState("done");
    } else {
      setCurrentPlayerIndex(next);
      setState("passing");
    }
  };

  const isImpostor = impostorIndices.includes(currentPlayerIndex);

  // Setup screen
  if (state === "setup") {
    return (
      <div className="py-4">
        <Link href="/juegos" className="text-orange-400 text-sm mb-4 inline-block">← Juegos</Link>

        <h1 className="text-xl font-bold text-white mb-2">Impostor</h1>
        <p className="text-xs text-gray-400 mb-6">
          Juego para 3+ personas con un solo teléfono. Cada uno ve su rol — el impostor debe fingir que sabe quién es el jugador secreto.
        </p>

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-5">
          {/* Number of players */}
          <div>
            <label className="text-sm text-gray-300 block mb-2">¿Cuántos van a jugar?</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setNumPlayers(Math.max(3, numPlayers - 1))}
                className="w-10 h-10 bg-gray-700 rounded-lg text-white font-bold text-lg"
              >-</button>
              <span className="text-2xl font-black text-white w-8 text-center">{numPlayers}</span>
              <button
                onClick={() => setNumPlayers(Math.min(10, numPlayers + 1))}
                className="w-10 h-10 bg-gray-700 rounded-lg text-white font-bold text-lg"
              >+</button>
            </div>
          </div>

          {/* Number of impostors */}
          <div>
            <label className="text-sm text-gray-300 block mb-2">¿Cuántos impostores?</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setNumImpostors(Math.max(1, numImpostors - 1))}
                className="w-10 h-10 bg-gray-700 rounded-lg text-white font-bold text-lg"
              >-</button>
              <span className="text-2xl font-black text-white w-8 text-center">{numImpostors}</span>
              <button
                onClick={() => setNumImpostors(Math.min(Math.floor(numPlayers / 3), numImpostors + 1))}
                className="w-10 h-10 bg-gray-700 rounded-lg text-white font-bold text-lg"
              >+</button>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Máximo 1 impostor por cada 3 jugadores</p>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm"
          >
            Comenzar juego
          </button>
        </div>
      </div>
    );
  }

  // Passing screen - "pass the phone"
  if (state === "passing") {
    return (
      <div className="py-4 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">Pásale el teléfono al</p>
          <p className="text-4xl font-black text-white mb-6">Jugador {currentPlayerIndex + 1}</p>
          <p className="text-xs text-gray-500 mb-8">Asegúrate de que nadie más esté viendo</p>
          <button
            onClick={revealRole}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl text-sm"
          >
            Ver mi rol
          </button>
        </div>
      </div>
    );
  }

  // Reveal screen
  if (state === "reveal") {
    return (
      <div className="py-4 min-h-[70vh] flex flex-col items-center justify-center">
        {isImpostor ? (
          <div className="text-center">
            <div className="bg-red-900/30 border border-red-500 rounded-2xl p-8 mb-6">
              <p className="text-5xl font-black text-red-400 mb-2">IMPOSTOR</p>
              <p className="text-sm text-red-300">No sabes quién es el jugador. ¡Finge que sí!</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-green-900/30 border border-green-500 rounded-2xl p-8 mb-6">
              <p className="text-sm text-green-300 mb-2">El jugador secreto es:</p>
              <p className="text-3xl font-black text-white mb-2">{secretPlayer?.name}</p>
              <p className="text-sm text-gray-400">{secretPlayer?.club}</p>
              <p className="text-xs text-gray-500">{secretPlayer?.nationality} • {secretPlayer?.position}</p>
            </div>
          </div>
        )}

        <button
          onClick={nextPlayer}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl text-sm"
        >
          Ocultar y pasar al siguiente
        </button>
      </div>
    );
  }

  // Done - all players have seen their role
  if (state === "done") {
    const startingPlayer = Math.floor(Math.random() * numPlayers) + 1;
    return (
      <div className="py-4 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <p className="text-xl font-bold text-white mb-3">Todos vieron su rol</p>
          <p className="text-lg text-orange-400 font-bold mb-3">Empieza: Jugador {startingPlayer}</p>
          <p className="text-sm text-gray-400 mb-6 max-w-[280px]">
            Describan al jugador por turnos. El impostor debe adivinar quién es sin ser descubierto.
          </p>
          <p className="text-xs text-gray-500 mb-6">
            Después de la discusión, voten quién creen que es el impostor.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setShowReveal(!showReveal)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl text-sm"
            >
              {showReveal ? "Ocultar" : "Revelar impostor"}
            </button>
            {showReveal && (
              <div className="bg-red-900/20 border border-red-500 rounded-xl p-4 text-left">
                <p className="text-xs text-red-300 mb-1">Impostor(es): <span className="font-bold">Jugador {impostorIndices.map(i => i + 1).join(", ")}</span></p>
                <p className="text-xs text-green-300">Jugador secreto: <span className="font-bold">{secretPlayer?.name}</span> ({secretPlayer?.club})</p>
              </div>
            )}
            <button
              onClick={startGame}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm"
            >
              Jugar de nuevo
            </button>
            <Link href="/juegos" className="block text-gray-400 text-sm hover:text-white">
              ← Volver a juegos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
