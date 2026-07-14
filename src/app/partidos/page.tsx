"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Partido } from "@/lib/types";

const PAGE_SIZE = 28;

export default function PartidosListPage() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get("cat") || "popular";
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partidos?orden=fecha_desc")
      .then((r) => r.json())
      .then((data) => {
        const topLeagues = new Set([
          "La Liga", "Serie A", "Bundesliga", "Ligue 1",
          "UEFA Champions League", "CONMEBOL Libertadores",
          "World Cup", "Euro Championship", "Copa America",
        ]);

        let filtered = data;
        if (categoria === "popular") {
          filtered = data.filter((p: any) =>
            topLeagues.has(p.competicion) || (p.competicion === "Premier League" && p.competicion_pais === "England")
          );
        }
        // "recientes" shows all matches (already sorted by date desc)
        setPartidos(filtered);
        setLoading(false);
      });
  }, [categoria]);

  const totalPages = Math.ceil(partidos.length / PAGE_SIZE);
  const currentPartidos = partidos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const title = categoria === "popular" ? "Popular esta semana" : categoria === "recientes" ? "Recientes" : "Partidos";

  if (loading) {
    return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>;
  }

  return (
    <div className="py-4">
      <Link href="/" className="text-orange-400 text-sm mb-4 inline-block">← Inicio</Link>

      <h1 className="text-xl font-bold text-white mb-4">{title}</h1>
      <p className="text-[10px] text-gray-400 mb-4">Página {page} de {totalPages} ({partidos.length} partidos)</p>

      <div className="space-y-2">
        {currentPartidos.map((p) => (
          <Link key={p.id} href={`/partido/${p.id}`}>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3 hover:border-gray-600 mb-2">
              <div className="flex items-center gap-1 flex-shrink-0">
                {p.logo_local && <img src={p.logo_local} alt="" className="w-5 h-5" />}
                <span className="text-xs font-bold text-white">{p.goles_local}-{p.goles_visitante}</span>
                {p.logo_visitante && <img src={p.logo_visitante} alt="" className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{p.equipo_local} vs {p.equipo_visitante}</p>
                <p className="text-[9px] text-gray-400">{p.competicion} • {p.fecha}</p>
              </div>
              {p.promedio_general && p.promedio_general > 0 && (
                <span className="text-xs font-bold text-orange-400">{Number(p.promedio_general).toFixed(1)}</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-30"
        >
          ← Anterior
        </button>
        <span className="text-xs text-gray-400">{page} / {totalPages}</span>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-30"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
