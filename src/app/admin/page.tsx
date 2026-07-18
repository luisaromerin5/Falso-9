"use client";

import { useState } from "react";

interface AdminUser {
  id: number;
  username: string;
  email: string | null;
  avatar_color: string;
  avatar_url: string | null;
  created_at: string;
  reviews: number;
  vistos: number;
  companeros: number;
  seguidos: number;
}

interface AdminData {
  stats: { totalUsuarios: number; totalPartidos: number; totalReviews: number; totalRespuestas: number };
  usuarios: AdminUser[];
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/usuarios?key=${key}`);
    if (res.ok) {
      const d = await res.json();
      setData(d);
    } else {
      setError("Clave incorrecta");
    }
    setLoading(false);
  };

  const deleteUser = async (userId: number, username: string) => {
    if (!confirm(`¿Estás seguro de eliminar a @${username}? Se borrarán todas sus reviews, compañeros y datos. Esto NO se puede deshacer.`)) return;
    if (!confirm(`ÚLTIMA CONFIRMACIÓN: ¿Borrar permanentemente a @${username}?`)) return;

    await fetch(`/api/admin/usuarios?key=${key}&userId=${userId}`, { method: "DELETE" });

    // Refresh
    const res = await fetch(`/api/admin/usuarios?key=${key}`);
    if (res.ok) setData(await res.json());
  };

  // Login screen
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <form onSubmit={login} className="bg-gray-800 rounded-xl p-6 border border-gray-700 w-full max-w-sm">
          <h1 className="text-xl font-bold text-white mb-4 text-center">Admin Panel</h1>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Clave de administrador"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none mb-3"
          />
          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg">
            {loading ? "..." : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel — Falso 9</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
          <p className="text-2xl font-bold text-orange-400">{data.stats.totalUsuarios}</p>
          <p className="text-[9px] text-gray-400">Usuarios</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
          <p className="text-2xl font-bold text-blue-400">{data.stats.totalPartidos}</p>
          <p className="text-[9px] text-gray-400">Partidos</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
          <p className="text-2xl font-bold text-green-400">{data.stats.totalReviews}</p>
          <p className="text-[9px] text-gray-400">Reviews</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
          <p className="text-2xl font-bold text-purple-400">{data.stats.totalRespuestas}</p>
          <p className="text-[9px] text-gray-400">Respuestas</p>
        </div>
      </div>

      {/* Users list */}
      <h2 className="text-sm font-bold text-gray-300 mb-3">Usuarios ({data.usuarios.length})</h2>
      <div className="space-y-2">
        {data.usuarios.map((u) => (
          <div key={u.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3">
            {u.avatar_url ? (
              <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: u.avatar_color }}>
                {u.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">@{u.username}</p>
              <p className="text-[9px] text-gray-400">
                {u.reviews} reviews • {u.vistos} vistos • {u.companeros} compañeros • {u.seguidos} seguidos
              </p>
              <p className="text-[8px] text-gray-500">Registro: {u.created_at.split("T")[0].split(" ")[0]} {u.email ? `• ${u.email}` : ""}</p>
            </div>
            <button
              onClick={() => deleteUser(u.id, u.username)}
              className="text-[10px] text-red-400 hover:text-red-300 bg-red-900/20 px-2 py-1 rounded flex-shrink-0"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
