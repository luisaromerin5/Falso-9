"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ListDetail {
  id: number;
  nombre: string;
  descripcion: string | null;
  username: string;
  avatar_color: string;
  items: Array<{
    id: number;
    equipo_local: string;
    equipo_visitante: string;
    logo_local: string | null;
    logo_visitante: string | null;
    goles_local: number;
    goles_visitante: number;
    competicion: string;
    fecha: string;
  }>;
}

export default function ListaDetallePage() {
  const { id } = useParams();
  const [list, setList] = useState<ListDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/listas/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setList(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="py-8 text-center">
        <p>Lista no encontrada</p>
        <Link href="/listas" className="text-green-400 mt-4 inline-block">← Volver</Link>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Link href="/listas" className="text-green-400 text-sm mb-4 inline-block">← Volver a listas</Link>

      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: list.avatar_color }}
          >
            {list.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-gray-400">@{list.username}</span>
        </div>
        <h1 className="text-lg font-bold text-white">{list.nombre}</h1>
        {list.descripcion && <p className="text-sm text-gray-400 mt-1">{list.descripcion}</p>}
        <p className="text-[10px] text-gray-500 mt-2">{list.items.length} partidos</p>
      </div>

      {/* Items */}
      {list.items.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">Esta lista está vacía</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.items.map((p) => (
            <Link key={p.id} href={`/partido/${p.id}`}>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3 hover:border-gray-600 mb-2">
                <div className="flex-shrink-0 flex items-center gap-1">
                  {p.logo_local && <img src={p.logo_local} alt="" className="w-6 h-6" />}
                  <span className="text-xs font-bold text-white">{p.goles_local}-{p.goles_visitante}</span>
                  {p.logo_visitante && <img src={p.logo_visitante} alt="" className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {p.equipo_local} vs {p.equipo_visitante}
                  </p>
                  <p className="text-[10px] text-gray-400">{p.competicion} • {p.fecha}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
