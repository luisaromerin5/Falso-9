"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { generateMatchSummary } from "@/lib/match-summary";
import RatingForm from "@/components/RatingForm";
import PitchLineups from "@/components/PitchLineups";
import MatchEvents from "@/components/MatchEvents";
import MatchStats from "@/components/MatchStats";
import PenaltyShootout from "@/components/PenaltyShootout";

function DiaryActions({ partidoId }: { partidoId: number }) {
  const { user } = useAuth();
  const [watched, setWatched] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [lists, setLists] = useState<Array<{ id: number; nombre: string }>>([]);
  const [showLists, setShowLists] = useState(false);

  useEffect(() => {
    if (user) {
      fetch(`/api/listas?user=${user.id}`).then((r) => r.json()).then((data) => {
        if (Array.isArray(data)) setLists(data);
      });
    }
  }, [user]);

  if (!user) return null;

  const markWatched = async () => {
    await fetch("/api/diario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partido_id: partidoId, visto: true, quiero_ver: false }),
    });
    setWatched(true);
    setWatchlist(false);
  };

  const markWatchlist = async () => {
    await fetch("/api/diario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partido_id: partidoId, visto: false, quiero_ver: true }),
    });
    setWatchlist(true);
    setWatched(false);
  };

  const addToList = async (listaId: number) => {
    await fetch("/api/listas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add-match", lista_id: listaId, partido_id: partidoId }),
    });
    setShowLists(false);
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <button
          onClick={markWatched}
          className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
            watched
              ? "bg-orange-500 border-green-600 text-white"
              : "bg-gray-800 border-gray-700 text-gray-300 hover:border-orange-500"
          }`}
        >
          {watched ? "✅ Visto" : "👁️ Visto"}
        </button>
        <button
          onClick={markWatchlist}
          className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
            watchlist
              ? "bg-yellow-600 border-yellow-600 text-white"
              : "bg-gray-800 border-gray-700 text-gray-300 hover:border-yellow-500"
          }`}
        >
          {watchlist ? "📋 En lista" : "📋 Por ver"}
        </button>
        <button
          onClick={() => setShowLists(!showLists)}
          className="px-3 py-2 text-xs font-medium rounded-lg border bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-500 transition-colors"
        >
          +📋
        </button>
      </div>

      {/* List selector dropdown */}
      {showLists && (
        <div className="mt-2 bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
          {lists.length === 0 ? (
            <div className="p-3 text-center">
              <p className="text-xs text-gray-400">No tienes listas</p>
              <Link href="/listas" className="text-[10px] text-orange-400">Crear una →</Link>
            </div>
          ) : (
            lists.map((list) => (
              <button
                key={list.id}
                onClick={() => addToList(list.id)}
                className="w-full text-left px-3 py-2 text-xs text-white hover:bg-gray-700 border-b border-gray-700 last:border-0"
              >
                📋 {list.nombre}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface PartidoDetail {
  id: number;
  fixture_id: number | null;
  equipo_local: string;
  equipo_visitante: string;
  logo_local: string | null;
  logo_visitante: string | null;
  goles_local: number;
  goles_visitante: number;
  competicion: string;
  fecha: string;
  estadio: string;
  calificaciones: Array<{
    id: number;
    usuario: string;
    general: number;
    emocion: number;
    calidad: number;
    arbitraje: number;
    comentario: string | null;
    created_at: string;
  }>;
  promedios: { emocion: number; calidad: number; arbitraje: number; general: number };
  details: {
    lineups: Array<unknown>;
    events: Array<unknown>;
    statistics: Array<unknown>;
  } | null;
}

function RatingDistribution({ calificaciones }: { calificaciones: PartidoDetail["calificaciones"] }) {
  if (calificaciones.length === 0) return null;

  // Create distribution buckets (1-10)
  const dist = Array(10).fill(0);
  calificaciones.forEach((c) => {
    const bucket = Math.min(Math.max(Math.round(c.general) - 1, 0), 9);
    dist[bucket]++;
  });
  const max = Math.max(...dist, 1);

  return (
    <div className="flex items-end gap-[2px] h-12">
      {dist.map((count, i) => (
        <div
          key={i}
          className="flex-1 bg-green-500/60 rounded-t-sm min-h-[2px] transition-all hover:bg-green-400"
          style={{ height: `${(count / max) * 100}%` }}
          title={`${i + 1}: ${count} votos`}
        />
      ))}
    </div>
  );
}

function EditableReview({ review, onUpdate }: { review: any; onUpdate: () => void }) {
  const [editing, setEditing] = useState(false);
  const [comentario, setComentario] = useState(review.comentario || "");

  const saveEdit = async () => {
    await fetch(`/api/calificaciones/${review.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comentario }),
    });
    setEditing(false);
    onUpdate();
  };

  const deleteReview = async () => {
    if (confirm("¿Estás seguro de borrar tu review?")) {
      await fetch(`/api/calificaciones/${review.id}`, { method: "DELETE" });
      onUpdate();
    }
  };

  if (editing) {
    return (
      <div className="mt-2 pt-2 border-t border-gray-700">
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none resize-none"
          rows={3}
        />
        <div className="flex gap-2 mt-2">
          <button onClick={saveEdit} className="text-xs text-white bg-orange-500 px-3 py-1.5 rounded font-medium">Guardar</button>
          <button onClick={() => setEditing(false)} className="text-xs text-gray-400 px-3 py-1.5 rounded">Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mt-2 pt-2 border-t border-gray-700">
      <button onClick={() => setEditing(true)} className="text-[10px] text-orange-400 hover:text-orange-300">Editar</button>
      <button onClick={deleteReview} className="text-[10px] text-red-400 hover:text-red-300">Borrar</button>
    </div>
  );
}

function LikeButton({ calificacionId }: { calificacionId: number }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`/api/likes?partido_id=${calificacionId}`)
      .then(() => {});
  }, []);

  const toggleLike = async () => {
    if (!user) return;
    const res = await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ calificacion_id: calificacionId }),
    });
    const data = await res.json();
    setLiked(data.liked);
    setCount((prev) => data.liked ? prev + 1 : Math.max(0, prev - 1));
  };

  return (
    <button onClick={toggleLike} className={`flex items-center gap-1 mt-1 text-[10px] ${liked ? "text-red-400" : "text-gray-500"}`}>
      <span>{liked ? "❤️" : "🤍"}</span>
      {count > 0 && <span>{count}</span>}
    </button>
  );
}

function ReplySection({ calificacionId }: { calificacionId: number }) {
  const { user } = useAuth();
  const [replies, setReplies] = useState<any[]>([]);
  const [showReply, setShowReply] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loaded, setLoaded] = useState(false);

  const loadReplies = () => {
    fetch(`/api/respuestas?calificacion_id=${calificacionId}`)
      .then((r) => r.json())
      .then((data) => { setReplies(Array.isArray(data) ? data : []); setLoaded(true); });
  };

  const submitReply = async () => {
    if (!mensaje.trim()) return;
    await fetch("/api/respuestas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ calificacion_id: calificacionId, mensaje: mensaje.trim() }),
    });
    setMensaje("");
    setShowReply(false);
    loadReplies();
  };

  return (
    <div className="mt-2">
      {/* Show/load replies button */}
      {!loaded && (
        <button onClick={loadReplies} className="text-[10px] text-gray-400 hover:text-gray-300">
          Ver respuestas
        </button>
      )}

      {/* Replies list */}
      {loaded && replies.length > 0 && (
        <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-700 pl-3">
          {replies.map((r: any) => (
            <div key={r.id} className="flex gap-2">
              {r.avatar_url ? (
                <img src={r.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0 mt-0.5" />
              ) : (
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0 mt-0.5" style={{ background: r.avatar_color || "#f97316" }}>
                  {r.usuario.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <span className="text-[10px] text-orange-400 font-medium">@{r.usuario}</span>
                <p className="text-xs text-gray-300">{r.mensaje}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {loaded && replies.length === 0 && !showReply && (
        <span className="text-[10px] text-gray-500">Sin respuestas</span>
      )}

      {/* Reply button + form */}
      {user && !showReply && (
        <button onClick={() => { setShowReply(true); if (!loaded) loadReplies(); }} className="text-[10px] text-orange-400 hover:text-orange-300 ml-2">
          Responder
        </button>
      )}

      {showReply && (
        <div className="mt-2 ml-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-2 py-1.5 text-xs text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
              onKeyDown={(e) => { if (e.key === "Enter") submitReply(); }}
            />
            <button onClick={submitReply} className="text-xs text-white bg-orange-500 px-2 py-1.5 rounded font-medium">Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PartidoDetallePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [partido, setPartido] = useState<PartidoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"reviews" | "details" | "stats">("reviews");

  const fetchPartido = () => {
    setLoading(true);
    fetch(`/api/partidos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPartido(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPartido();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!partido) {
    return (
      <div className="py-8 text-center">
        <p className="text-xl">Partido no encontrado</p>
        <Link href="/" className="text-orange-400 mt-4 inline-block">← Volver</Link>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Back */}
      <Link href="/" className="text-orange-400 text-sm mb-3 inline-flex items-center gap-1">
        ← Volver
      </Link>

      {/* Hero header - Letterboxd style */}
      <div className="relative bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 rounded-xl overflow-hidden mb-4">
        {/* Background logos as decoration */}
        {partido.logo_local && (
          <img src={partido.logo_local} alt="" className="absolute left-4 top-1/2 -translate-y-1/2 w-32 h-32 opacity-[0.05]" />
        )}
        {partido.logo_visitante && (
          <img src={partido.logo_visitante} alt="" className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 opacity-[0.05]" />
        )}

        <div className="relative p-5">
          {/* Competition & date */}
          <div className="text-center mb-4">
            <span className="text-[11px] font-medium text-orange-400 bg-orange-900/40 px-2 py-0.5 rounded">
              {partido.competicion || "Amistoso"}
            </span>
            <p className="text-[10px] text-gray-400 mt-1">
              {new Date(partido.fecha).toLocaleDateString("es", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              {partido.logo_local && (
                <img src={partido.logo_local} alt="" className="w-14 h-14 mx-auto mb-2" />
              )}
              <Link href={`/equipo/${(partido as any).equipo_local_id}`} className="text-sm font-bold text-white hover:text-orange-400 transition-colors">{partido.equipo_local}</Link>
            </div>
            <div className="px-4 text-center">
              <div className="text-4xl font-black text-white">
                {partido.goles_local} - {partido.goles_visitante}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Final</p>
              {(partido as any).penales_local != null && (
                <p className="text-xs text-yellow-400 mt-1">
                  ({(partido as any).penales_local} - {(partido as any).penales_visitante} pen.)
                </p>
              )}
            </div>
            <div className="flex-1 text-center">
              {partido.logo_visitante && (
                <img src={partido.logo_visitante} alt="" className="w-14 h-14 mx-auto mb-2" />
              )}
              <Link href={`/equipo/${(partido as any).equipo_visitante_id}`} className="text-sm font-bold text-white hover:text-orange-400 transition-colors">{partido.equipo_visitante}</Link>
            </div>
          </div>

          {/* Stadium */}
          <p className="text-[10px] text-gray-400 text-center mt-3">🏟️ {partido.estadio}</p>
        </div>
      </div>

      {/* Quick actions */}
      <DiaryActions partidoId={Number(id)} />

      {/* Rating section */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
        <div className="flex items-center gap-4">
          {/* Big score */}
          <div className="text-center">
            <p className="text-3xl font-black text-orange-400">
              {partido.calificaciones.length > 0
                ? Number(partido.promedios.general).toFixed(1)
                : "—"}
            </p>
            <p className="text-[10px] text-gray-400">
              {partido.calificaciones.length} {partido.calificaciones.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Distribution chart */}
          <div className="flex-1">
            <RatingDistribution calificaciones={partido.calificaciones} />
            <div className="flex justify-between text-[8px] text-gray-500 mt-0.5">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          {/* Sub ratings */}
          {partido.calificaciones.length > 0 && (
            <div className="text-right space-y-0.5">
              <p className="text-[10px]"><span className="text-gray-400">🔥</span> <span className="text-orange-400 font-medium">{Number(partido.promedios.emocion).toFixed(1)}</span></p>
              <p className="text-[10px]"><span className="text-gray-400">🎯</span> <span className="text-blue-400 font-medium">{Number(partido.promedios.calidad).toFixed(1)}</span></p>
              <p className="text-[10px]"><span className="text-gray-400">👨‍⚖️</span> <span className="text-purple-400 font-medium">{Number(partido.promedios.arbitraje).toFixed(1)}</span></p>
            </div>
          )}
        </div>
      </div>

      {/* Members who reviewed */}
      {partido.calificaciones.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] text-gray-400 mb-2">REVIEWED BY</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {partido.calificaciones.map((c) => (
              <Link key={c.id} href={`/usuario/${c.usuario}`} className="flex-shrink-0 flex flex-col items-center gap-0.5">
                {(c as any).avatar_url ? (
                  <img src={(c as any).avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: (c as any).avatar_color || "#f97316" }}>
                    {c.usuario.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-[8px] text-gray-400 max-w-[40px] truncate">@{c.usuario}</span>
                <span className="text-[9px] text-orange-400 font-bold">{c.general}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-800 rounded-lg p-1 border border-gray-700">
        {[
          { key: "reviews" as const, label: "Reviews" },
          { key: "details" as const, label: "Detalles" },
          { key: "stats" as const, label: "Stats" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === tab.key
                ? "bg-orange-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Reviews */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          {/* Match summary */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Resumen</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {generateMatchSummary({
                equipo_local: partido.equipo_local,
                equipo_visitante: partido.equipo_visitante,
                goles_local: partido.goles_local,
                goles_visitante: partido.goles_visitante,
                competicion: partido.competicion,
                fecha: partido.fecha,
                estadio: partido.estadio,
                events: partido.details?.events as any,
              })}
            </p>
          </div>

          {/* Write review */}
          <RatingForm partidoId={Number(id)} onSuccess={fetchPartido} />

          {/* Reviews list */}
          {partido.calificaciones.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs text-gray-400 uppercase tracking-wider">Todas las reviews</h3>
              {partido.calificaciones.map((cal) => (
                <div key={cal.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Link href={`/usuario/${cal.usuario}`} className="flex items-center gap-2">
                      {(cal as any).avatar_url ? (
                        <img src={(cal as any).avatar_url} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: (cal as any).avatar_color || "#f97316" }}>
                          {cal.usuario.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-medium text-white hover:text-orange-400">@{cal.usuario}</span>
                    </Link>
                    <div className="flex-1"></div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`text-sm ${i < Math.round(cal.general / 2) ? "text-orange-400" : "text-gray-600"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {cal.comentario && (
                    <p className="text-sm text-gray-300 leading-relaxed">{cal.comentario}</p>
                  )}
                  <div className="flex gap-3 mt-2 text-[10px] text-gray-500">
                    <span>🔥 {cal.emocion}/10</span>
                    <span>🎯 {cal.calidad}/10</span>
                    <span>👨‍⚖️ {cal.arbitraje}/10</span>
                  </div>
                  <LikeButton calificacionId={cal.id} />
                  {user && cal.usuario === user.username && (
                    <EditableReview review={cal} onUpdate={fetchPartido} />
                  )}
                  <ReplySection calificacionId={cal.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Details (Events + Lineups) */}
      {activeTab === "details" && (
        <div className="space-y-4">
          {partido.details?.events && (
            <PenaltyShootout
              events={partido.details.events as Array<any>}
              homeTeam={partido.equipo_local}
              awayTeam={partido.equipo_visitante}
            />
          )}
          {partido.details?.events && (
            <MatchEvents
              events={partido.details.events as Array<any>}
              homeTeam={partido.equipo_local}
              golesLocal={partido.goles_local}
              golesVisitante={partido.goles_visitante}
            />
          )}
          {partido.details?.lineups && (
            <PitchLineups lineups={partido.details.lineups as Array<any>} />
          )}
          {!partido.details && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <p className="text-gray-400 text-sm">📋 Detalles no disponibles para este partido</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Stats */}
      {activeTab === "stats" && (
        <div className="space-y-4">
          {partido.details?.statistics && (
            <MatchStats statistics={partido.details.statistics as Array<any>} />
          )}
          {!partido.details?.statistics && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <p className="text-gray-400 text-sm">📊 Estadísticas no disponibles</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
