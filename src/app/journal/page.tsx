"use client";

import { useEffect, useState } from "react";
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
  created_at: string;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function JournalPage() {
  const { user } = useAuth();
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetch("/api/diario").then((r) => r.json()).then((data) => {
      setDiary(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [user]);

  if (!user) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm mb-3">—</p>
        <h1 className="text-lg font-bold text-white mb-2">Tu Journal</h1>
        <p className="text-sm text-gray-400 mb-4">Inicia sesión para ver tu diario de partidos</p>
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

  // Group diary entries by date they were added
  const entriesByDate: Record<string, DiaryEntry[]> = {};
  diary.forEach((entry) => {
    const date = entry.created_at.split("T")[0].split(" ")[0];
    if (!entriesByDate[date]) entriesByDate[date] = [];
    entriesByDate[date].push(entry);
  });

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const selectedEntries = selectedDate ? (entriesByDate[selectedDate] || []) : [];

  return (
    <div className="py-4">
      <header className="mb-5">
        <h1 className="text-xl font-bold text-white">Journal</h1>
        <p className="text-[11px] text-gray-400">Tu historial de partidos vistos</p>
      </header>

      {/* Calendar */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
        {/* Month navigation */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="text-gray-400 hover:text-white p-1">
            ←
          </button>
          <h2 className="text-sm font-bold text-white">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <button onClick={nextMonth} className="text-gray-400 hover:text-white p-1">
            →
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-[9px] text-gray-500 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const hasEntries = entriesByDate[dateStr] && entriesByDate[dateStr].length > 0;
            const entryCount = entriesByDate[dateStr]?.length || 0;
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === new Date().toISOString().split("T")[0];

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs transition-all relative ${
                  isSelected
                    ? "bg-orange-500 text-white"
                    : hasEntries
                    ? "bg-orange-900/40 text-orange-400 hover:bg-orange-900/60"
                    : isToday
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-700"
                }`}
              >
                <span className="font-medium">{day}</span>
                {hasEntries && (
                  <span className="absolute bottom-0.5 text-[7px]">
                    {"•".repeat(Math.min(entryCount, 3))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats summary */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
          <p className="text-lg font-bold text-green-400">{diary.length}</p>
          <p className="text-[9px] text-gray-400">Total vistos</p>
        </div>
        <div className="flex-1 bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
          <p className="text-lg font-bold text-blue-400">{Object.keys(entriesByDate).length}</p>
          <p className="text-[9px] text-gray-400">Días activos</p>
        </div>
        <div className="flex-1 bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
          <p className="text-lg font-bold text-yellow-400">
            {diary.length > 0
              ? (diary.filter((d) => d.mi_calificacion).reduce((sum, d) => sum + (d.mi_calificacion || 0), 0) / diary.filter((d) => d.mi_calificacion).length || 0).toFixed(1)
              : "—"}
          </p>
          <p className="text-[9px] text-gray-400">Promedio</p>
        </div>
      </div>

      {/* Selected date entries */}
      {selectedDate && (
        <div>
          <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-2">
            {new Date(selectedDate + "T12:00:00").toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}
          </h3>
          {selectedEntries.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Sin partidos este día</p>
          ) : (
            <div className="space-y-2">
              {selectedEntries.map((entry) => (
                <Link key={entry.id} href={`/partido/${entry.partido_id}`}>
                  <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3 hover:border-gray-600 mb-2">
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {entry.logo_local && <img src={entry.logo_local} alt="" className="w-5 h-5" />}
                      <span className="text-[10px] text-gray-500">vs</span>
                      {entry.logo_visitante && <img src={entry.logo_visitante} alt="" className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        {entry.equipo_local} {entry.goles_local}-{entry.goles_visitante} {entry.equipo_visitante}
                      </p>
                      <p className="text-[10px] text-gray-400">{entry.competicion}</p>
                    </div>
                    {entry.mi_calificacion && (
                      <span className="text-sm font-bold text-green-400">{entry.mi_calificacion}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent diary if no date selected */}
      {!selectedDate && diary.length > 0 && (
        <div>
          <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-2">Últimos vistos</h3>
          <div className="space-y-2">
            {diary.slice(0, 5).map((entry) => (
              <Link key={entry.id} href={`/partido/${entry.partido_id}`}>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3 hover:border-gray-600 mb-2">
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {entry.logo_local && <img src={entry.logo_local} alt="" className="w-5 h-5" />}
                    <span className="text-[10px] text-gray-500">vs</span>
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
            ))}
          </div>
        </div>
      )}

      {diary.length === 0 && !selectedDate && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm mb-2">—</p>
          <p className="text-sm">Tu journal está vacío</p>
          <p className="text-xs mt-1">Califica partidos o márcalos como vistos para llenar tu diario</p>
          <Link href="/" className="text-green-400 text-sm mt-3 inline-block">Explorar partidos →</Link>
        </div>
      )}
    </div>
  );
}
