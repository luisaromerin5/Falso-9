"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Partido, Competicion, Equipo } from "@/lib/types";
import { getTeamTrophies } from "@/lib/trophies";

export default function BuscarPage() {
  const [query, setQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [competiciones, setCompeticiones] = useState<Competicion[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [matchingTeams, setMatchingTeams] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(false);
  const [allPartidos, setAllPartidos] = useState<Partido[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/partidos").then((r) => r.json()),
      fetch("/api/competiciones").then((r) => r.json()),
      fetch("/api/equipos").then((r) => r.json()),
    ]).then(([p, c, e]) => {
      setAllPartidos(p);
      setCompeticiones(c);
      setEquipos(e);
    });
  }, []);

  useEffect(() => {
    if (query.length < 2 && !yearFilter) {
      setPartidos([]);
      return;
    }

    // Support "equipo año" format (e.g. "Barcelona 2023")
    const yearMatch = query.match(/(.+?)\s+(\d{4})$/);
    let q = query.toLowerCase();
    let yearFromQuery: string | null = null;

    if (yearMatch) {
      q = yearMatch[1].trim().toLowerCase();
      yearFromQuery = yearMatch[2];
    }

    // Use dropdown year filter, or year from query text
    const activeYear = yearFilter || yearFromQuery;

    let filtered = allPartidos;

    if (q.length >= 2) {
      filtered = filtered.filter(
        (p) =>
          p.equipo_local?.toLowerCase().includes(q) ||
          p.equipo_visitante?.toLowerCase().includes(q) ||
          p.competicion?.toLowerCase().includes(q)
      );
    }

    if (activeYear) {
      filtered = filtered.filter((p) => p.fecha?.startsWith(activeYear));
    }

    setPartidos(filtered.slice(0, 30));

    // Also find matching teams
    if (q.length >= 2) {
      const teamMatches = equipos.filter((e) =>
        e.nombre.toLowerCase().includes(q)
      ).slice(0, 5);
      setMatchingTeams(teamMatches);
    } else {
      setMatchingTeams([]);
    }
  }, [query, yearFilter, allPartidos, equipos]);

  return (
    <div className="py-4">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-white">Buscar</h1>
      </header>

      {/* Search input */}
      <div className="mb-4 space-y-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar equipo, competición..."
          className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none text-sm"
          autoFocus
        />
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm focus:border-orange-500 focus:outline-none"
        >
          <option value="">Todos los años</option>
          {Array.from({ length: 17 }, (_, i) => 2026 - i).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Quick filters by competition */}
      {query.length < 2 && !yearFilter && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Competiciones</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png" },
              { name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png" },
              { name: "UEFA Champions League", logo: "https://media.api-sports.io/football/leagues/2.png" },
              { name: "Serie A", logo: "https://media.api-sports.io/football/leagues/135.png" },
              { name: "Bundesliga", logo: "https://media.api-sports.io/football/leagues/78.png" },
              { name: "Ligue 1", logo: "https://media.api-sports.io/football/leagues/61.png" },
              { name: "CONMEBOL Libertadores", logo: "https://media.api-sports.io/football/leagues/13.png" },
              { name: "World Cup", logo: "/trophies/world-cup.png" },
            ].map((c) => (
              <button
                key={c.name}
                onClick={() => setQuery(c.name)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-left hover:border-orange-500 transition-all flex items-center gap-2 overflow-hidden"
              >
                <img src={c.logo} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
                <p className="text-sm text-white font-medium truncate">{c.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Team results with mini summary */}
      {matchingTeams.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Equipos</p>
          <div className="space-y-2">
            {matchingTeams.map((team) => {
              const trophies = getTeamTrophies(team.nombre);
              const totalTrophies = trophies ? trophies.reduce((sum, t) => sum + t.count, 0) : 0;
              return (
                <Link key={team.id} href={`/equipo/${team.id}`}>
                  <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-green-500 transition-all mb-2">
                    <div className="flex items-center gap-3">
                      {team.logo_url ? (
                        <img src={team.logo_url} alt="" className="w-8 h-8" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-600 rounded-full" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{team.nombre}</p>
                        <p className="text-[10px] text-gray-400">{team.pais}</p>
                      </div>
                      {totalTrophies > 0 && (
                        <div className="text-right">
                          <p className="text-sm font-bold text-yellow-400">🏆 {totalTrophies}</p>
                          <p className="text-[8px] text-gray-500">títulos</p>
                        </div>
                      )}
                    </div>
                    {trophies && (
                      <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
                        {trophies.slice(0, 4).map((t, i) => (
                          <span key={i} className="text-[9px] text-gray-400 bg-gray-900 px-1.5 py-0.5 rounded flex-shrink-0 flex items-center gap-1">
                            {t.logo ? (
                              <img src={t.logo} alt="" className="w-3 h-3 inline" />
                            ) : (
                              <span>{t.icon}</span>
                            )}
                            {t.count}x {t.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {partidos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">{partidos.length} resultados</p>
          {partidos.map((p) => (
            <Link key={p.id} href={`/partido/${p.id}`}>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3 hover:border-gray-600 transition-all mb-2">
                <div className="flex-shrink-0 flex items-center gap-1">
                  {p.logo_local && <img src={p.logo_local} alt="" className="w-6 h-6" />}
                  <span className="text-[10px] text-gray-500">vs</span>
                  {p.logo_visitante && <img src={p.logo_visitante} alt="" className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {p.equipo_local} {p.goles_local}-{p.goles_visitante} {p.equipo_visitante}
                  </p>
                  <p className="text-[10px] text-gray-400">{p.competicion} • {p.fecha}</p>
                </div>
                {p.promedio_general && p.promedio_general > 0 && (
                  <span className="text-xs font-bold text-green-400">{Number(p.promedio_general).toFixed(1)}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {query.length >= 2 && partidos.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm">No se encontraron partidos</p>
        </div>
      )}
    </div>
  );
}
