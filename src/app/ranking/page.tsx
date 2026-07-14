"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Partido } from "@/lib/types";

export default function RankingPage() {
  const { user } = useAuth();
  const [topPartidos, setTopPartidos] = useState<Partido[]>([]);
  const [allPartidos, setAllPartidos] = useState<Partido[]>([]);
  const [activeTab, setActiveTab] = useState<"global" | "compañeros" | "personal">("global");
  const [feed, setFeed] = useState<any[]>([]);
  const [diary, setDiary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const promises: Promise<any>[] = [
      fetch("/api/ranking").then((r) => r.json()),
      fetch("/api/partidos?orden=rating_desc").then((r) => r.json()),
    ];
    if (user) {
      promises.push(fetch("/api/feed").then((r) => r.json()));
      promises.push(fetch("/api/diario").then((r) => r.json()));
    }
    Promise.all(promises).then(([ranked, all, f, d]) => {
      setTopPartidos(ranked);
      setAllPartidos(all);
      if (Array.isArray(f)) setFeed(f);
      if (Array.isArray(d)) setDiary(d);
      setLoading(false);
    });
  }, [user]);

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Get data based on active tab
  let displayData: any[] = [];
  if (activeTab === "global") {
    displayData = topPartidos;
  } else if (activeTab === "compañeros") {
    // Get unique matches from feed, sorted by rating
    const matchMap = new Map();
    feed.forEach((item) => {
      if (!matchMap.has(item.partido_id) || item.general > matchMap.get(item.partido_id).general) {
        matchMap.set(item.partido_id, item);
      }
    });
    displayData = Array.from(matchMap.values()).sort((a, b) => b.general - a.general);
  } else if (activeTab === "personal") {
    displayData = diary
      .filter((d) => d.mi_calificacion)
      .sort((a, b) => (b.mi_calificacion || 0) - (a.mi_calificacion || 0));
  }

  return (
    <div className="py-4">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-white">Rankings</h1>
        <p className="text-[11px] text-gray-400">Los partidos mejor calificados</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-800 rounded-lg p-1 border border-gray-700">
        <button
          onClick={() => setActiveTab("global")}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
            activeTab === "global" ? "bg-green-600 text-white" : "text-gray-400"
          }`}
        >
          Global
        </button>
        <button
          onClick={() => setActiveTab("compañeros")}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
            activeTab === "compañeros" ? "bg-green-600 text-white" : "text-gray-400"
          }`}
          disabled={!user}
        >
          Compañeros
        </button>
        <button
          onClick={() => setActiveTab("personal")}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
            activeTab === "personal" ? "bg-green-600 text-white" : "text-gray-400"
          }`}
          disabled={!user}
        >
          Personal
        </button>
      </div>

      {/* Results */}
      {displayData.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">📊</p>
          <p className="text-sm">
            {activeTab === "global"
              ? "Aún no hay suficientes votos para el ranking"
              : activeTab === "compañeros"
              ? "Tus compañeros aún no han calificado partidos"
              : "Aún no has calificado partidos"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayData.map((item, index) => {
            const partido = activeTab === "global"
              ? item
              : activeTab === "personal"
              ? item
              : item;

            const partidoId = partido.partido_id || partido.id;
            const equipoLocal = partido.equipo_local;
            const equipoVisitante = partido.equipo_visitante;
            const golesL = partido.goles_local;
            const golesV = partido.goles_visitante;
            const competicion = partido.competicion;
            const rating = activeTab === "personal"
              ? partido.mi_calificacion
              : activeTab === "compañeros"
              ? partido.general
              : partido.promedio_general;
            const votos = partido.total_votos;

            return (
              <Link key={`${activeTab}-${index}`} href={`/partido/${partidoId}`}>
                <div className="bg-gray-800 rounded-xl p-3 border border-gray-700 hover:border-green-500 transition-all flex items-center gap-3 mb-2">
                  <div className="text-xl min-w-[2rem] text-center">
                    {getMedal(index)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {equipoLocal} {golesL}-{golesV} {equipoVisitante}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {competicion}
                      {activeTab === "compañeros" && partido.usuario && ` • @${partido.usuario}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">
                      {Number(rating).toFixed(1)}
                    </p>
                    {votos && <p className="text-[9px] text-gray-400">{votos} votos</p>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
