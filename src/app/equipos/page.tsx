"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Equipo } from "@/lib/types";

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("/api/equipos")
      .then((res) => res.json())
      .then((data) => {
        setEquipos(data);
        setLoading(false);
      });
  }, []);

  const equiposFiltrados = equipos.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="py-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Equipos</h1>
        <p className="text-gray-400 text-sm mt-1">
          Explora partidos por equipo
        </p>
      </header>

      {/* Búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="🔍 Buscar equipo..."
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {equiposFiltrados.map((equipo) => (
            <Link key={equipo.id} href={`/equipo/${equipo.id}`}>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-orange-500 transition-all active:scale-[0.98] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {equipo.logo_url ? (
                    <img src={equipo.logo_url} alt="" className="w-8 h-8" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-600 rounded-full" />
                  )}
                  <div>
                    <p className="font-semibold text-white">{equipo.nombre}</p>
                    <p className="text-xs text-gray-400">{equipo.pais}</p>
                  </div>
                </div>
                <span className="text-gray-500">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
