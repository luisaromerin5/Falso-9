"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

interface FeedItem {
  id: number;
  partido_id: number;
  usuario: string;
  avatar_color: string;
  general: number;
  emocion: number;
  calidad: number;
  arbitraje: number;
  comentario: string | null;
  created_at: string;
  equipo_local: string;
  equipo_visitante: string;
  logo_local: string | null;
  logo_visitante: string | null;
  goles_local: number;
  goles_visitante: number;
  competicion: string;
}

interface Friend {
  id: number;
  username: string;
  avatar_color: string;
  tipo?: string;
}

export default function AmigosPage() {
  const { user } = useAuth();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [compañeros, setCompañeros] = useState<Friend[]>([]);
  const [seguidos, setSeguidos] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<Friend & { isFriend: boolean; isFollowing: boolean }>>([]);
  const [activeTab, setActiveTab] = useState<"feed" | "compañeros" | "seguidos">("feed");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/feed").then((r) => r.json()),
      fetch("/api/amigos").then((r) => r.json()),
    ]).then(([f, relations]) => {
      setFeed(Array.isArray(f) ? f : []);
      setCompañeros(Array.isArray(relations.compañeros) ? relations.compañeros : []);
      setSeguidos(Array.isArray(relations.seguidos) ? relations.seguidos : []);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/usuarios?q=${encodeURIComponent(searchQuery)}`)
        .then((r) => r.json())
        .then(setSearchResults);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const addFriend = async (username: string) => {
    await fetch("/api/amigos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", username }),
    });
    refreshData();
  };

  const followUser = async (username: string) => {
    await fetch("/api/amigos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "follow", username }),
    });
    refreshData();
  };

  const removeFriend = async (username: string) => {
    await fetch("/api/amigos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", username }),
    });
    setCompañeros(compañeros.filter((f) => f.username !== username));
  };

  const unfollowUser = async (username: string) => {
    await fetch("/api/amigos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unfollow", username }),
    });
    setSeguidos(seguidos.filter((f) => f.username !== username));
  };

  const refreshData = async () => {
    const [f, relations] = await Promise.all([
      fetch("/api/feed").then((r) => r.json()),
      fetch("/api/amigos").then((r) => r.json()),
    ]);
    setFeed(Array.isArray(f) ? f : []);
    setCompañeros(Array.isArray(relations.compañeros) ? relations.compañeros : []);
    setSeguidos(Array.isArray(relations.seguidos) ? relations.seguidos : []);
    setSearchQuery("");
    setSearchResults([]);
  };

  if (!user) {
    return (
      <div className="py-8 text-center">
        <img src="/icon-companeros.png" alt="" className="w-12 h-12 mx-auto mb-3 object-contain" />
        <h1 className="text-lg font-bold text-white mb-2">Compañeros de compañeros</h1>
        <p className="text-sm text-gray-400 mb-4">Inicia sesión para ver qué opinan tus amigos</p>
        <Link href="/perfil" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-white">Compañeros</h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("feed")}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
            activeTab === "feed" ? "bg-orange-500 text-white" : "text-gray-400"
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => setActiveTab("compañeros")}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
            activeTab === "compañeros" ? "bg-orange-500 text-white" : "text-gray-400"
          }`}
        >
          Compañeros ({compañeros.length})
        </button>
        <button
          onClick={() => setActiveTab("seguidos")}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
            activeTab === "seguidos" ? "bg-orange-500 text-white" : "text-gray-400"
          }`}
        >
          Seguidos ({seguidos.length})
        </button>
      </div>

      {/* Feed tab */}
      {activeTab === "feed" && (
        <div>
          {feed.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <img src="/icon-companeros.png" alt="" className="w-12 h-12 mx-auto mb-3 object-contain" />
              <p className="text-sm font-medium">Tu feed está vacío</p>
              <p className="text-xs mt-1">Agrega compañeros para ver sus reviews aquí</p>
              <button
                onClick={() => setActiveTab("compañeros")}
                className="mt-3 text-green-400 text-sm hover:underline"
              >
                Buscar compañeros →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {feed.map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  {/* User header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: item.avatar_color }}
                    >
                      {item.usuario.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-white">@{item.usuario}</span>
                      <span className="text-[10px] text-gray-500 ml-2">
                        {new Date(item.created_at).toLocaleDateString("es", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`text-xs ${i < Math.round(item.general / 2) ? "text-green-400" : "text-gray-700"}`}>★</span>
                      ))}
                    </div>
                  </div>

                  {/* Match info */}
                  <Link href={`/partido/${item.partido_id}`}>
                    <div className="flex items-center gap-3 bg-gray-900 rounded-lg p-2.5 mb-2 hover:bg-gray-850 transition-colors">
                      <div className="flex items-center gap-1.5">
                        {item.logo_local && <img src={item.logo_local} alt="" className="w-5 h-5" />}
                        <span className="text-xs font-bold text-white">{item.goles_local}-{item.goles_visitante}</span>
                        {item.logo_visitante && <img src={item.logo_visitante} alt="" className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-white truncate">{item.equipo_local} vs {item.equipo_visitante}</p>
                        <p className="text-[9px] text-gray-400">{item.competicion}</p>
                      </div>
                    </div>
                  </Link>

                  {/* Comment */}
                  {item.comentario && (
                    <p className="text-sm text-gray-300 leading-relaxed">{item.comentario}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Compañeros tab */}
      {activeTab === "compañeros" && (
        <div>
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar usuarios..."
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className="text-[10px] text-gray-400 uppercase">Resultados</p>
              {searchResults.map((u) => (
                <div key={u.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: u.avatar_color }}>
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">@{u.username}</p>
                  </div>
                  {u.isFriend ? (
                    <span className="text-[10px] text-green-400 bg-green-900/30 px-2 py-1 rounded">✓ Compañero</span>
                  ) : u.isFollowing ? (
                    <span className="text-[10px] text-blue-400 bg-blue-900/30 px-2 py-1 rounded">Siguiendo</span>
                  ) : (
                    <div className="flex gap-1">
                      <button onClick={() => addFriend(u.username)} className="text-[9px] text-white bg-orange-500 px-2 py-1 rounded font-medium">Compañero</button>
                      <button onClick={() => followUser(u.username)} className="text-[9px] text-white bg-blue-600 px-2 py-1 rounded font-medium">Seguir</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-gray-400 uppercase mb-2">Tus compañeros ({compañeros.length})</p>
          {compañeros.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">Busca usuarios arriba</p>
              <p className="text-[10px] mt-1">Los compañeros son mutuos</p>
            </div>
          ) : (
            <div className="space-y-2">
              {compañeros.map((f) => (
                <div key={f.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: f.avatar_color }}>
                    {f.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">@{f.username}</p>
                    <p className="text-[9px] text-green-400">Compañero</p>
                  </div>
                  <button onClick={() => removeFriend(f.username)} className="text-[10px] text-red-400">Eliminar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Seguidos tab */}
      {activeTab === "seguidos" && (
        <div>
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar usuarios para seguir..."
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mb-4 space-y-2">
              {searchResults.map((u) => (
                <div key={u.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: u.avatar_color }}>
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">@{u.username}</p>
                  </div>
                  {u.isFriend ? (
                    <span className="text-[10px] text-green-400 bg-green-900/30 px-2 py-1 rounded">Compañero</span>
                  ) : u.isFollowing ? (
                    <span className="text-[10px] text-blue-400 bg-blue-900/30 px-2 py-1 rounded">Siguiendo</span>
                  ) : (
                    <button onClick={() => followUser(u.username)} className="text-[9px] text-white bg-blue-600 px-2 py-1 rounded font-medium">Seguir</button>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-gray-400 uppercase mb-2">Siguiendo ({seguidos.length})</p>
          {seguidos.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">No sigues a nadie aún</p>
              <p className="text-[10px] mt-1">Sigue usuarios para ver sus reviews en tu feed</p>
            </div>
          ) : (
            <div className="space-y-2">
              {seguidos.map((f) => (
                <div key={f.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: f.avatar_color }}>
                    {f.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">@{f.username}</p>
                    <p className="text-[9px] text-blue-400">Siguiendo</p>
                  </div>
                  <button onClick={() => unfollowUser(f.username)} className="text-[10px] text-red-400">Dejar de seguir</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
