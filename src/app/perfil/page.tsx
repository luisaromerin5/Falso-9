"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

interface DiaryEntry {
  id: number;
  partido_id: number;
  equipo_local: string;
  equipo_visitante: string;
  logo_local: string | null;
  logo_visitante: string | null;
  goles_local: number;
  goles_visitante: number;
  competicion: string;
  fecha: string;
  mi_calificacion: number | null;
  mi_comentario: string | null;
  visto: number;
  quiero_ver: number;
}

function AuthForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await register(username, password, email || undefined);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <img src="/logo-falso9.png" alt="Falso 9" className="mx-auto mb-4 object-contain" style={{ width: "500px" }} />
        <p className="text-sm text-gray-400 mt-1">
          {mode === "login" ? "Inicia sesión para guardar tu diario" : "Crea tu cuenta"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu_nombre"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="text-xs text-gray-400 block mb-1">Email (opcional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 block mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-xs mt-3 bg-red-900/20 p-2 rounded">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
        >
          {loading ? "..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-green-400 hover:underline"
          >
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </form>
    </div>
  );
}

function ProfileView() {
  const { user, stats, logout } = useAuth();
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [badges, setBadges] = useState<Array<{ name: string; icon: string; description: string }>>([]);
  const [activeTab, setActiveTab] = useState<"vistos" | "watchlist" | "listas">("vistos");

  useEffect(() => {
    Promise.all([
      fetch("/api/diario").then((r) => r.json()),
      fetch(`/api/listas?user=${user?.id}`).then((r) => r.json()),
    ]).then(([d, l]) => {
      setDiary(Array.isArray(d) ? d : []);
      setLists(Array.isArray(l) ? l : []);

      // Calculate badges
      const newBadges: Array<{ name: string; icon: string; description: string }> = [];
      const entries = Array.isArray(d) ? d : [];

      if (entries.length >= 10) newBadges.push({ name: "Espectador", icon: "👁️", description: "10+ partidos vistos" });
      if (entries.length >= 50) newBadges.push({ name: "Fanático", icon: "🔥", description: "50+ partidos vistos" });
      if (entries.length >= 100) newBadges.push({ name: "Leyenda", icon: "⭐", description: "100+ partidos vistos" });

      // Check if watched all matches from a competition
      const byCompetition: Record<string, number> = {};
      entries.forEach((e) => {
        if (e.competicion) {
          byCompetition[e.competicion] = (byCompetition[e.competicion] || 0) + 1;
        }
      });
      for (const [comp, count] of Object.entries(byCompetition)) {
        if (count >= 20) {
          newBadges.push({ name: `Fan ${comp}`, icon: "🏆", description: `${count} partidos de ${comp}` });
        }
      }

      // Check if watched all matches from a team
      const byTeam: Record<string, number> = {};
      entries.forEach((e) => {
        if (e.equipo_local) byTeam[e.equipo_local] = (byTeam[e.equipo_local] || 0) + 1;
        if (e.equipo_visitante) byTeam[e.equipo_visitante] = (byTeam[e.equipo_visitante] || 0) + 1;
      });
      for (const [team, count] of Object.entries(byTeam)) {
        if (count >= 10) {
          newBadges.push({ name: `Hincha ${team}`, icon: "🛡️", description: `${count} partidos de ${team}` });
        }
      }

      if (entries.filter((e) => e.mi_calificacion).length >= 5) {
        newBadges.push({ name: "Crítico", icon: "✍️", description: "5+ reviews escritas" });
      }

      setBadges(newBadges);
    });
  }, [user]);

  if (!user) return null;

  const vistos = diary.filter((d) => d.visto);
  const watchlist = diary.filter((d) => d.quiero_ver);

  return (
    <div className="py-4">
      {/* Profile header */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt=""
              className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-xl font-bold text-white"
              style={{ background: user.avatar_color }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <label className="absolute bottom-1 right-0 bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-orange-600">
            <span className="text-white text-sm font-bold">+</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("avatar", file);
                const res = await fetch("/api/profile", { method: "POST", body: formData });
                if (res.ok) {
                  window.location.reload();
                }
              }}
            />
          </label>
        </div>
        <h1 className="text-lg font-bold text-white">@{user.username}</h1>
        {user.bio && <p className="text-xs text-gray-400 mt-1">{user.bio}</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-green-400">{stats?.vistos || 0}</p>
          <p className="text-[8px] text-gray-400">Vistos</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-blue-400">{stats?.reviews || 0}</p>
          <p className="text-[8px] text-gray-400">Reviews</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-400">{stats?.watchlist || 0}</p>
          <p className="text-[8px] text-gray-400">Por ver</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-purple-400">{stats?.amigos || 0}</p>
          <p className="text-[8px] text-gray-400">Compañeros</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-cyan-400">{stats?.seguidos || 0}</p>
          <p className="text-[8px] text-gray-400">Seguidos</p>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-3 border border-gray-700 mb-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Badges</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {badges.map((badge, i) => (
              <div key={i} className="flex-shrink-0 bg-gray-900 rounded-lg px-3 py-2 text-center min-w-[80px]">
                <span className="text-xl">{badge.icon}</span>
                <p className="text-[9px] text-white font-medium mt-0.5">{badge.name}</p>
                <p className="text-[7px] text-gray-500">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diary tabs */}
      <div className="flex gap-1 mb-4 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("vistos")}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
            activeTab === "vistos" ? "bg-orange-500 text-white" : "text-gray-400"
          }`}
        >
          Vistos ({vistos.length})
        </button>
        <button
          onClick={() => setActiveTab("watchlist")}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
            activeTab === "watchlist" ? "bg-orange-500 text-white" : "text-gray-400"
          }`}
        >
          Por ver ({watchlist.length})
        </button>
        <button
          onClick={() => setActiveTab("listas")}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
            activeTab === "listas" ? "bg-orange-500 text-white" : "text-gray-400"
          }`}
        >
          Listas ({lists.length})
        </button>
      </div>

      {/* Diary content */}
      <div className="space-y-2">
        {activeTab === "listas" ? (
          lists.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm mb-2">—</p>
              <p className="text-sm">No tienes listas</p>
              <Link href="/listas" className="text-green-400 text-xs mt-2 inline-block">Crear una →</Link>
            </div>
          ) : (
            lists.map((list: any) => (
              <Link key={list.id} href={`/lista/${list.id}`}>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-green-500 transition-all mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-white">{list.nombre}</p>
                      {list.descripcion && <p className="text-[10px] text-gray-400">{list.descripcion}</p>}
                    </div>
                    <span className="text-xs text-gray-400">{list.total_partidos} partidos</span>
                  </div>
                </div>
              </Link>
            ))
          )
        ) : (activeTab === "vistos" ? vistos : watchlist).length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm mb-2">—</p>
            <p className="text-sm">
              {activeTab === "vistos"
                ? "Califica un partido para agregarlo a tu diario"
                : "Aún no tienes partidos en tu watchlist"}
            </p>
          </div>
        ) : (
          (activeTab === "vistos" ? vistos : watchlist).map((entry) => (
            <Link key={entry.id} href={`/partido/${entry.partido_id}`}>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3 hover:border-gray-600 mb-2">
                <div className="flex-shrink-0 flex items-center gap-1">
                  {entry.logo_local && <img src={entry.logo_local} alt="" className="w-5 h-5" />}
                  <span className="text-[9px] text-gray-500">vs</span>
                  {entry.logo_visitante && <img src={entry.logo_visitante} alt="" className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {entry.equipo_local} {entry.goles_local}-{entry.goles_visitante} {entry.equipo_visitante}
                  </p>
                  <p className="text-[10px] text-gray-400">{entry.competicion} • {entry.fecha}</p>
                </div>
                {entry.mi_calificacion && (
                  <span className="text-sm font-bold text-green-400">{entry.mi_calificacion}</span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full mt-6 bg-gray-800 border border-gray-700 text-gray-400 text-sm py-2.5 rounded-lg hover:text-white transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default function PerfilPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return user ? <ProfileView /> : <AuthForm />;
}
