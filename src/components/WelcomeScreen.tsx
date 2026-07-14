"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function WelcomeScreen({ onSkip }: { onSkip: () => void }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"welcome" | "login" | "register">("welcome");
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

  if (mode === "welcome") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-900">
        {/* Logo */}
        <div className="text-center mb-10">
          <img src="/logo-falso9.png" alt="Falso 9" className="mx-auto mb-4 object-contain" style={{ width: "500px" }} />
          <p className="text-gray-400 text-sm">Tu diario de fútbol</p>
        </div>

        {/* Taglines */}
        <div className="text-center mb-10 space-y-2">
          <p className="text-gray-300 text-sm">⚽ Califica partidos</p>
          <p className="text-gray-300 text-sm">📔 Lleva tu diario personal</p>
          <p className="text-gray-300 text-sm">👥 Comparte con amigos</p>
          <p className="text-gray-300 text-sm">📋 Crea listas y colecciones</p>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={() => setMode("login")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setMode("register")}
            className="w-full bg-gray-800 border border-gray-600 hover:border-green-500 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
          >
            Crear cuenta
          </button>
          <button
            onClick={onSkip}
            className="w-full text-gray-400 hover:text-white py-3 text-sm transition-colors"
          >
            Continuar sin cuenta →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-900">
      <div className="w-full max-w-xs">
        {/* Back button */}
        <button
          onClick={() => { setMode("welcome"); setError(""); }}
          className="text-green-400 text-sm mb-6"
        >
          ← Volver
        </button>

        <h2 className="text-2xl font-bold text-white mb-1">
          {mode === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta"}
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          {mode === "login" ? "Inicia sesión para continuar" : "Únete a la comunidad futbolera"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu_nombre"
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none"
              required
              autoFocus
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
                className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none"
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
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-900/20 p-2.5 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-3.5 rounded-xl transition-colors text-sm mt-2"
          >
            {loading ? "..." : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-green-400 hover:underline"
          >
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>

        <button
          onClick={onSkip}
          className="w-full text-gray-500 hover:text-gray-300 py-3 text-xs transition-colors mt-2 text-center"
        >
          Continuar sin cuenta →
        </button>
      </div>
    </div>
  );
}
