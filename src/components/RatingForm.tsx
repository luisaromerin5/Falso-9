"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import StarRating from "./StarRating";

interface RatingFormProps {
  partidoId: number;
  onSuccess: () => void;
}

export default function RatingForm({ partidoId, onSuccess }: RatingFormProps) {
  const { user } = useAuth();
  const [usuario, setUsuario] = useState("");
  const [general, setGeneral] = useState(7.0);
  const [emocion, setEmocion] = useState(7.0);
  const [calidad, setCalidad] = useState(7.0);
  const [arbitraje, setArbitraje] = useState(7.0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!user) {
      setError("Debes iniciar sesión para calificar");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/calificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partido_id: partidoId,
          usuario: user?.username || usuario.trim(),
          general,
          emocion,
          calidad,
          arbitraje,
          comentario: comentario.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar calificación");
      }

      setSuccess(true);
      setComentario("");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <h3 className="text-lg font-bold text-white mb-4">⚽ Califica este partido</h3>

      {!user && (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm mb-3">Inicia sesión para dejar tu review</p>
          <a
            href="/perfil"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors text-sm"
          >
            Iniciar sesión
          </a>
        </div>
      )}

      {user && (
        <>
      {/* Usuario */}
      <div className="mb-4 flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: user.avatar_color }}
        >
          {user.username.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm text-gray-300">Publicando como <span className="text-green-400 font-medium">@{user.username}</span></span>
      </div>

      {/* Calificaciones */}
      <div className="space-y-3 mb-4">
        <StarRating value={general} onChange={setGeneral} label="⭐ General" />
        <StarRating value={emocion} onChange={setEmocion} label="🔥 Emoción" />
        <StarRating value={calidad} onChange={setCalidad} label="🎯 Calidad técnica" />
        <StarRating value={arbitraje} onChange={setArbitraje} label="👨‍⚖️ Arbitraje" />
      </div>

      {/* Comentario */}
      <div className="mb-4">
        <label className="text-sm text-gray-300 block mb-1">Comentario (opcional)</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="¿Qué te pareció el partido?"
          rows={3}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none resize-none"
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-3 bg-red-900/20 p-2 rounded">{error}</p>
      )}

      {success && (
        <p className="text-green-400 text-sm mb-3 bg-green-900/20 p-2 rounded">
          ✅ ¡Calificación guardada! Gracias por votar.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors active:scale-[0.98]"
      >
        {loading ? "Enviando..." : "Enviar calificación"}
      </button>
        </>
      )}
    </form>
  );
}
