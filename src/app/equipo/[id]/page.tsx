"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTeamTrophies } from "@/lib/trophies";

function FollowTeamButton({ equipoId }: { equipoId: number }) {
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    fetch("/api/favoritos")
      .then((r) => r.json())
      .then((data) => {
        if (data.favorites) {
          setFollowing(data.favorites.some((f: any) => f.id === equipoId));
        }
      })
      .catch(() => {});
  }, [equipoId]);

  const toggle = async () => {
    await fetch("/api/favoritos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: following ? "remove" : "add", equipo_id: equipoId }),
    });
    setFollowing(!following);
  };

  return (
    <button onClick={toggle} className={`text-xs px-3 py-1.5 rounded-lg font-medium flex-shrink-0 ${following ? "bg-orange-900/30 text-orange-400 border border-orange-700/50" : "bg-orange-500 text-white"}`}>
      {following ? "★ Siguiendo" : "☆ Seguir"}
    </button>
  );
}

interface TeamData {
  equipo: { id: number; nombre: string; logo_url: string; pais: string };
  stats: {
    matches: number; wins: number; draws: number; losses: number;
    goalsFor: number; goalsAgainst: number; goalDifference: number; winRate: number;
  };
  partidos: Array<any>;
  apiTeam?: { id: number; name: string; logo: string; founded: number; country: string };
  venue?: { name: string; city: string; capacity: number; image: string };
  squad?: Array<{ id: number; name: string; age: number; number: number; position: string; photo: string }>;
}

export default function EquipoDetallePage() {
  const { id } = useParams();
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "squad" | "matches">("overview");
  const [squadLoaded, setSquadLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/equipo/${id}`).then((r) => r.json()).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [id]);

  const loadSquad = () => {
    if (squadLoaded) return;
    setActiveTab("squad");
    fetch(`/api/equipo/${id}?tab=squad`).then((r) => r.json()).then((d) => {
      setData(d);
      setSquadLoaded(true);
    });
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const { equipo, stats, partidos } = data;

  return (
    <div className="py-4">
      <Link href="/equipos" className="text-orange-400 text-sm mb-4 inline-block">← Equipos</Link>

      {/* Team header */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 mb-4">
        <div className="flex items-center gap-4">
          {equipo.logo_url ? (
            <img src={equipo.logo_url} alt="" className="w-16 h-16" />
          ) : (
            <div className="w-16 h-16 bg-gray-600 rounded-full" />
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{equipo.nombre}</h1>
            <p className="text-xs text-gray-400">{data.apiTeam?.country || equipo.pais}</p>
            {data.apiTeam?.founded && (
              <p className="text-[10px] text-gray-500">Fundado en {data.apiTeam.founded}</p>
            )}
          </div>
          <FollowTeamButton equipoId={Number(id)} />
        </div>

        {/* Venue */}
        {data.venue && (
          <div className="mt-4 bg-gray-900 rounded-lg p-3">
            <div className="flex items-center gap-3">
              {data.venue.image && (
                <img src={data.venue.image} alt="" className="w-16 h-10 rounded object-cover" />
              )}
              <div>
                <p className="text-sm text-white font-medium">🏟️ {data.venue.name}</p>
                <p className="text-[10px] text-gray-400">
                  {data.venue.city} • {data.venue.capacity?.toLocaleString()} asientos
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trophies */}
      {(() => {
        const trophies = getTeamTrophies(equipo.nombre);
        if (!trophies) return null;
        return (
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
            <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Palmarés</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {trophies.map((t, i) => (
                <div key={i} className="flex-shrink-0 text-center min-w-[70px]">
                  {t.logo ? (
                    <img src={t.logo} alt={t.name} className="w-10 h-10 mx-auto mb-0.5 object-contain" />
                  ) : (
                    <div className="w-10 h-10 mx-auto mb-0.5 flex items-center justify-center text-2xl">
                      {t.icon}
                    </div>
                  )}
                  <p className="text-lg font-black text-white">{t.count}</p>
                  <p className="text-[8px] text-gray-400 leading-tight">{t.name}</p>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-500 mt-2 text-right">
              Total: {trophies.reduce((sum, t) => sum + t.count, 0)} títulos
            </p>
          </div>
        );
      })()}

      {/* Stats overview */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-gray-800 rounded-lg p-2.5 text-center border border-gray-700">
          <p className="text-lg font-bold text-white">{stats.matches}</p>
          <p className="text-[8px] text-gray-400">Partidos</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-2.5 text-center border border-gray-700">
          <p className="text-lg font-bold text-orange-400">{stats.wins}</p>
          <p className="text-[8px] text-gray-400">Victorias</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-2.5 text-center border border-gray-700">
          <p className="text-lg font-bold text-yellow-400">{stats.draws}</p>
          <p className="text-[8px] text-gray-400">Empates</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-2.5 text-center border border-gray-700">
          <p className="text-lg font-bold text-red-400">{stats.losses}</p>
          <p className="text-[8px] text-gray-400">Derrotas</p>
        </div>
      </div>

      {/* More stats */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Goles a favor</span>
            <span className="text-xs text-white font-medium">{stats.goalsFor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Goles en contra</span>
            <span className="text-xs text-white font-medium">{stats.goalsAgainst}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Diferencia</span>
            <span className={`text-xs font-medium ${stats.goalDifference >= 0 ? "text-orange-400" : "text-red-400"}`}>
              {stats.goalDifference > 0 ? "+" : ""}{stats.goalDifference}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">% Victoria</span>
            <span className="text-xs text-white font-medium">{stats.winRate}%</span>
          </div>
        </div>
        {/* Win rate bar */}
        <div className="mt-3 flex h-2 rounded-full overflow-hidden">
          <div className="bg-orange-500" style={{ width: `${stats.winRate}%` }} />
          <div className="bg-yellow-500" style={{ width: `${stats.matches > 0 ? (stats.draws / stats.matches) * 100 : 0}%` }} />
          <div className="bg-red-500" style={{ width: `${stats.matches > 0 ? (stats.losses / stats.matches) * 100 : 0}%` }} />
        </div>
        <div className="flex justify-between mt-1 text-[8px] text-gray-500">
          <span>V {stats.winRate}%</span>
          <span>E {stats.matches > 0 ? Math.round((stats.draws / stats.matches) * 100) : 0}%</span>
          <span>D {stats.matches > 0 ? Math.round((stats.losses / stats.matches) * 100) : 0}%</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-800 rounded-lg p-1 border border-gray-700">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
            activeTab === "overview" ? "bg-orange-500 text-white" : "text-gray-400"
          }`}
        >
          Partidos
        </button>
        <button
          onClick={loadSquad}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
            activeTab === "squad" ? "bg-orange-500 text-white" : "text-gray-400"
          }`}
        >
          Plantilla
        </button>
      </div>

      {/* Matches tab */}
      {activeTab === "overview" && (
        <div className="space-y-2">
          {partidos.map((p: any) => (
            <Link key={p.id} href={`/partido/${p.id}`}>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3 hover:border-gray-600 mb-2">
                <div className="flex items-center gap-1 flex-shrink-0">
                  {p.logo_local && <img src={p.logo_local} alt="" className="w-5 h-5" />}
                  <span className="text-xs font-bold text-white">{p.goles_local}-{p.goles_visitante}</span>
                  {p.logo_visitante && <img src={p.logo_visitante} alt="" className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-white truncate">
                    {p.equipo_local} vs {p.equipo_visitante}
                  </p>
                  <p className="text-[9px] text-gray-400">{p.competicion} • {p.fecha}</p>
                </div>
                {p.promedio_general > 0 && (
                  <span className="text-xs font-bold text-orange-400">{Number(p.promedio_general).toFixed(1)}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Squad tab */}
      {activeTab === "squad" && (
        <div>
          {!data.squad || data.squad.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-3"></div>
              <p className="text-sm">Cargando plantilla...</p>
            </div>
          ) : (
            <div>
              {/* Group by position */}
              {["Goalkeeper", "Defender", "Midfielder", "Attacker"].map((pos) => {
                const players = data.squad!.filter((p) => p.position === pos);
                if (players.length === 0) return null;

                const posLabels: Record<string, string> = {
                  Goalkeeper: "🧤 Porteros",
                  Defender: "🛡️ Defensas",
                  Midfielder: "⚙️ Mediocampistas",
                  Attacker: "⚡ Delanteros",
                };

                return (
                  <div key={pos} className="mb-4">
                    <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                      {posLabels[pos]}
                    </h3>
                    <div className="space-y-1">
                      {players.map((player) => (
                        <div key={player.id} className="bg-gray-800 rounded-lg p-2.5 border border-gray-700 flex items-center gap-3">
                          {player.photo && (
                            <img src={player.photo} alt="" className="w-9 h-9 rounded-full object-cover" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">{player.name}</p>
                            <p className="text-[10px] text-gray-400">{player.age} años</p>
                          </div>
                          <span className="text-sm font-bold text-gray-500">#{player.number || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
