"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

interface Lista {
  id: number;
  nombre: string;
  descripcion: string | null;
  username: string;
  avatar_color: string;
  total_partidos: number;
  created_at: string;
}

export default function ListasPage() {
  const { user } = useAuth();
  const [myLists, setMyLists] = useState<Lista[]>([]);
  const [allLists, setAllLists] = useState<Lista[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLists = () => {
    const promises: Promise<any>[] = [
      fetch("/api/listas").then((r) => r.json()),
    ];
    if (user) {
      promises.push(fetch(`/api/listas?user=${user.id}`).then((r) => r.json()));
    }
    Promise.all(promises).then(([all, mine]) => {
      setAllLists(Array.isArray(all) ? all : []);
      setMyLists(Array.isArray(mine) ? mine : []);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchLists();
  }, [user]);

  const createList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    await fetch("/api/listas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", nombre: nombre.trim(), descripcion: descripcion.trim() }),
    });

    setNombre("");
    setDescripcion("");
    setShowCreate(false);
    fetchLists();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <header className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold text-white">Listas</h1>
          <p className="text-[11px] text-gray-400">Colecciones de partidos</p>
        </div>
        {user && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-2 rounded-lg"
          >
            + Nueva lista
          </button>
        )}
      </header>

      {/* Create list form */}
      {showCreate && (
        <form onSubmit={createList} className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
          <div className="space-y-3">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la lista (ej: Mejores Clásicos)"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none"
              required
            />
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción (opcional)"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg text-sm"
            >
              Crear lista
            </button>
          </div>
        </form>
      )}

      {/* My lists */}
      {user && myLists.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-2">Mis listas</h2>
          <div className="space-y-2">
            {myLists.map((list) => (
              <Link key={list.id} href={`/lista/${list.id}`}>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-green-500 transition-all mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-white">{list.nombre}</p>
                      {list.descripcion && <p className="text-[10px] text-gray-400 mt-0.5">{list.descripcion}</p>}
                    </div>
                    <span className="text-xs text-gray-400">{list.total_partidos} partidos</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All public lists */}
      <section>
        <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-2">Listas de la comunidad</h2>
        {allLists.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-2xl mb-2">📋</p>
            <p className="text-sm">Aún no hay listas</p>
            {user && <p className="text-xs mt-1">¡Crea la primera!</p>}
          </div>
        ) : (
          <div className="space-y-2">
            {allLists.map((list) => (
              <Link key={list.id} href={`/lista/${list.id}`}>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-all mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                      style={{ background: list.avatar_color }}
                    >
                      {list.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{list.nombre}</p>
                      <p className="text-[10px] text-gray-400">@{list.username} • {list.total_partidos} partidos</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
