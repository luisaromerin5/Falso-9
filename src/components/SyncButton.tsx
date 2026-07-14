"use client";

import { useState } from "react";

const LEAGUE_OPTIONS = [
  { id: 0, label: "📅 Partidos de hoy", type: "date" },
  { id: 0, label: "📅 Partidos de ayer", type: "yesterday" },
  { id: 39, label: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League" },
  { id: 140, label: "🇪🇸 La Liga" },
  { id: 135, label: "🇮🇹 Serie A" },
  { id: 78, label: "🇩🇪 Bundesliga" },
  { id: 61, label: "🇫🇷 Ligue 1" },
  { id: 2, label: "🏆 Champions League" },
  { id: 13, label: "🏆 Copa Libertadores" },
  { id: 262, label: "🇲🇽 Liga MX" },
  { id: 253, label: "🇺🇸 MLS" },
];

export default function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const handleSync = async (option: (typeof LEAGUE_OPTIONS)[number]) => {
    setLoading(true);
    setResult("");

    try {
      let body: Record<string, unknown>;

      if (option.type === "date") {
        const today = new Date().toISOString().split("T")[0];
        body = { date: today };
      } else if (option.type === "yesterday") {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        body = { date: yesterday };
      } else {
        body = { league: option.id, season: 2024 };
      }

      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setResult(`✅ ${data.message}`);
      } else {
        setResult(`❌ ${data.error}`);
      }
    } catch {
      setResult("❌ Error de conexión");
    } finally {
      setLoading(false);
      setShowOptions(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors active:scale-[0.98]"
      >
        {loading ? "⏳ Sincronizando..." : "🔄 Filtros"}
      </button>

      {showOptions && (
        <div className="absolute top-12 right-0 bg-gray-800 border border-gray-600 rounded-xl shadow-xl z-50 w-64 max-h-80 overflow-y-auto">
          {LEAGUE_OPTIONS.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSync(option)}
              className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-700 border-b border-gray-700 last:border-0 transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {result && (
        <p className="text-xs mt-2 text-gray-300 bg-gray-800 p-2 rounded">
          {result}
        </p>
      )}
    </div>
  );
}
