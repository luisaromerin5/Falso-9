"use client";

import Link from "next/link";
import StarRating from "./StarRating";
import { Partido } from "@/lib/types";
import { getCompetitionFlag } from "@/lib/flags";

interface PartidoCardProps {
  partido: Partido;
}

export default function PartidoCard({ partido }: PartidoCardProps) {
  const compFlag = getCompetitionFlag(partido.competicion || "");

  return (
    <Link href={`/partido/${partido.id}`}>
      <div className="relative bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-green-500 transition-all active:scale-[0.98] overflow-hidden">
        {/* Background logos */}
        {partido.logo_local && (
          <img
            src={partido.logo_local}
            alt=""
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-24 h-24 opacity-[0.07] pointer-events-none"
          />
        )}
        {partido.logo_visitante && (
          <img
            src={partido.logo_visitante}
            alt=""
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-24 h-24 opacity-[0.07] pointer-events-none"
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {/* Competición y fecha */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-green-400 bg-green-900/30 px-2 py-0.5 rounded">
              {compFlag} {partido.competicion || "Amistoso"}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(partido.fecha).toLocaleDateString("es", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>

          {/* Equipos y marcador */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 text-center flex flex-col items-center gap-1">
              {partido.logo_local ? (
                <img src={partido.logo_local} alt="" className="w-8 h-8" />
              ) : (
                <div className="w-8 h-8 bg-gray-600 rounded-full" />
              )}
              <p className="text-xs font-semibold text-white truncate max-w-[90px]">
                {partido.equipo_local}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3">
              <span className="text-2xl font-bold text-white">{partido.goles_local}</span>
              <span className="text-gray-500">-</span>
              <span className="text-2xl font-bold text-white">{partido.goles_visitante}</span>
            </div>
            <div className="flex-1 text-center flex flex-col items-center gap-1">
              {partido.logo_visitante ? (
                <img src={partido.logo_visitante} alt="" className="w-8 h-8" />
              ) : (
                <div className="w-8 h-8 bg-gray-600 rounded-full" />
              )}
              <p className="text-xs font-semibold text-white truncate max-w-[90px]">
                {partido.equipo_visitante}
              </p>
            </div>
          </div>

          {/* Rating y votos */}
          <div className="flex justify-between items-center border-t border-gray-700 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⭐</span>
              <StarRating
                value={partido.promedio_general || 0}
                readonly
                size="sm"
              />
            </div>
            <span className="text-xs text-gray-400">
              {partido.total_votos || 0} voto{(partido.total_votos || 0) !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
