"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Partido } from "@/lib/types";
import { useAuth } from "@/lib/AuthContext";
import { getCompetitionFlag } from "@/lib/flags";
import SyncButton from "@/components/SyncButton";

function PartidoPoster({ partido }: { partido: Partido }) {
  const compFlag = getCompetitionFlag(partido.competicion || "");

  return (
    <Link href={`/partido/${partido.id}`} className="flex-shrink-0">
      <div className="w-[130px] rounded-lg overflow-hidden border border-gray-700 hover:border-orange-500 transition-all active:scale-[0.97]">
        {/* Poster visual with logos */}
        <div className="relative h-[170px] bg-gradient-to-b from-gray-700 to-gray-900 flex flex-col items-center justify-center gap-1.5 p-2">
          {/* Team logos */}
          <div className="flex items-center gap-2">
            {partido.logo_local ? (
              <img src={partido.logo_local} alt="" className="w-9 h-9" />
            ) : (
              <div className="w-9 h-9 bg-gray-600 rounded-full" />
            )}
            <span className="text-gray-500 text-[10px]">vs</span>
            {partido.logo_visitante ? (
              <img src={partido.logo_visitante} alt="" className="w-9 h-9" />
            ) : (
              <div className="w-9 h-9 bg-gray-600 rounded-full" />
            )}
          </div>

          {/* Score */}
          <div className="text-white font-black text-xl mt-1">
            {partido.goles_local} - {partido.goles_visitante}
          </div>

          {/* Teams */}
          <div className="text-center mt-1">
            <p className="text-[9px] text-gray-300 truncate w-full font-medium">{partido.equipo_local}</p>
            <p className="text-[9px] text-gray-300 truncate w-full font-medium">{partido.equipo_visitante}</p>
          </div>

          {/* Rating badge */}
          {partido.promedio_general && partido.promedio_general > 0 && (
            <div className="absolute top-1.5 right-1.5 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              {Number(partido.promedio_general).toFixed(1)}
            </div>
          )}

          {/* Competition badge */}
          <div className="absolute bottom-1.5 left-1.5 right-1.5">
            <p className="text-[8px] text-center truncate bg-black/60 rounded px-1 py-0.5 text-gray-300">
              {compFlag} {partido.competicion}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function HorizontalScroll({ children, title, seeAllHref }: { children: React.ReactNode; title: string; seeAllHref?: string }) {
  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="text-xs text-orange-400">
            Ver todos →
          </Link>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [popular, setPopular] = useState<Partido[]>([]);
  const [recent, setRecent] = useState<Partido[]>([]);
  const [topRated, setTopRated] = useState<Partido[]>([]);
  const [destacados, setDestacados] = useState<any[]>([]);
  const [friendsActivity, setFriendsActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const promises: Promise<any>[] = [
      fetch("/api/partidos?orden=fecha_desc&limit=200").then((r) => r.json()),
      fetch("/api/ranking").then((r) => r.json()),
      fetch("/api/destacados").then((r) => r.json()),
    ];

    if (user) {
      promises.push(fetch("/api/feed").then((r) => r.json()));
    }

    Promise.all(promises).then(([allMatches, ranked, dest, feed]) => {
      // Top leagues for "Popular esta semana" - exact first division professional football
      const topLeagues = new Set([
        "La Liga",
        "Serie A",
        "Bundesliga",
        "Ligue 1",
        "UEFA Champions League",
        "CONMEBOL Libertadores",
        "World Cup",
        "Euro Championship",
        "Copa America",
      ]);

      // Premier League needs special handling (many countries have "Premier League")
      const topLeagueMatches = allMatches.filter((p: Partido) => {
        const comp = p.competicion || "";
        if (topLeagues.has(comp)) return true;
        // Only England's Premier League
        if (comp === "Premier League") {
          return (p as any).competicion_pais === "England";
        }
        return false;
      });

      setPopular(topLeagueMatches.slice(0, 15));
      setRecent(topLeagueMatches.length > 0 ? topLeagueMatches.slice(0, 20) : allMatches.slice(0, 20));
      setTopRated(ranked.slice(0, 15));
      if (Array.isArray(dest)) setDestacados(dest);
      if (feed && Array.isArray(feed)) setFriendsActivity(feed.slice(0, 10));
      setLoading(false);
    });
  }, [user, authLoading]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Header */}
      <header className="mb-5 text-center">
        <div>
          <img src="/logo-falso9.png" alt="Falso 9" className="mx-auto object-contain" style={{ width: "500px" }} />
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-5 border-b border-gray-700 pb-2">
        <span className="text-sm font-medium text-orange-400 border-b-2 border-orange-400 pb-1">Partidos</span>
        <Link href="/ranking" className="text-sm text-gray-400 hover:text-white">Top Reviews</Link>
      </div>

      {/* Destacados - clasicos, finales, goleadas */}
      {destacados.length > 0 && (
        <HorizontalScroll title="Partidos Destacados">
          {destacados.map((p: any) => (
            <PartidoPoster key={p.id} partido={p} />
          ))}
        </HorizontalScroll>
      )}

      {/* Friends activity */}
      {user && friendsActivity.length > 0 && (
        <section className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-bold text-white">De tus compañeros</h2>
            <Link href="/actividad" className="text-xs text-orange-400">Ver todo →</Link>
          </div>
          <div className="space-y-2">
            {friendsActivity.slice(0, 3).map((item: any) => (
              <Link key={item.id} href={`/partido/${item.partido_id}`}>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-2.5 hover:border-gray-600 mb-2">
                  {item.avatar_url ? (
                    <img src={item.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                      style={{ background: item.avatar_color }}
                    >
                      {item.usuario.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-300 truncate">
                      <span className="text-white font-medium">@{item.usuario}</span> calificó
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {item.equipo_local} vs {item.equipo_visitante}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-orange-400">{item.general}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent matches */}
      <HorizontalScroll title="Recientes" seeAllHref="/partidos?cat=recientes">
        {recent.map((p) => (
          <PartidoPoster key={p.id} partido={p} />
        ))}
      </HorizontalScroll>

      {/* Top rated / Friends rated */}
      <HorizontalScroll
        title={user && friendsActivity.length > 0 ? "Calificados por compañeros" : "Mejor calificados"}
      >
        {topRated.map((p) => (
          <PartidoPoster key={p.id} partido={p} />
        ))}
      </HorizontalScroll>

      {/* Recent reviews preview */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-white mb-3">Top Reviews</h2>
        <div className="space-y-2">
          {popular
            .filter((p) => p.total_votos && p.total_votos > 0)
            .slice(0, 3)
            .map((p) => (
              <Link key={p.id} href={`/partido/${p.id}`}>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3 hover:border-gray-600 transition-all mb-2">
                  <div className="flex-shrink-0 flex items-center gap-1">
                    {p.logo_local && <img src={p.logo_local} alt="" className="w-5 h-5" />}
                    <span className="text-xs text-gray-400">vs</span>
                    {p.logo_visitante && <img src={p.logo_visitante} alt="" className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {p.equipo_local} {p.goles_local}-{p.goles_visitante} {p.equipo_visitante}
                    </p>
                    <p className="text-[10px] text-gray-400">{p.competicion}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-orange-400">{Number(p.promedio_general).toFixed(1)}</p>
                    <p className="text-[10px] text-gray-500">{p.total_votos} reviews</p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
