"use client";

import Link from "next/link";

const GAMES = [
  {
    id: "higher-lower",
    name: "Higher or Lower",
    description: "¿Quién vale más? Adivina si el siguiente jugador vale más o menos",
    available: true,
  },
  {
    id: "impostor",
    name: "Impostor",
    description: "Descubre quién no conoce al jugador secreto",
    available: true,
  },
  {
    id: "top10",
    name: "Top 10",
    description: "Adivina los 10 jugadores de cada categoría",
    available: true,
  },
  {
    id: "adivina-quien",
    name: "Adivina Quién",
    description: "Haz preguntas de sí/no para descubrir al jugador",
    available: true,
  },
  {
    id: "stop",
    name: "Stop / Basta",
    description: "Llena las categorías con una letra al azar",
    available: true,
  },
  {
    id: "subasta",
    name: "Subasta",
    description: "Arma tu equipo de 11 con presupuesto limitado",
    available: true,
  },
  {
    id: "rosco",
    name: "Rosco",
    description: "Responde una pregunta por cada letra del abecedario",
    available: true,
  },
  {
    id: "cabecitas",
    name: "Cabecitas",
    description: "Mantén la pelota en el aire con cabezazos",
    available: true,
  },
];

export default function GamesPage() {
  return (
    <div className="py-4">
      <header className="mb-5">
        <h1 className="text-xl font-bold text-white">Juegos</h1>
        <p className="text-[11px] text-gray-400">Minijuegos de fútbol para jugar solo o con amigos</p>
      </header>

      <div className="space-y-3">
        {GAMES.map((game) => (
          <div key={game.id}>
            {game.available ? (
              <Link href={`/juegos/${game.id}`}>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-orange-500 transition-all active:scale-[0.98]">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-white">{game.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{game.description}</p>
                    </div>
                    <span className="text-gray-500">→</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 opacity-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-gray-400">{game.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{game.description}</p>
                  </div>
                  <span className="text-[9px] text-gray-500 bg-gray-700 px-2 py-0.5 rounded">Próximamente</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
