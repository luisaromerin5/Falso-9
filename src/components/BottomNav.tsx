"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = user
    ? [
        { href: "/", label: "Inicio", icon: "⚽", color: "" },
        { href: "/buscar", label: "Buscar", icon: "🔍", color: "" },
        { href: "/actividad", label: "Compañeros", icon: "👥", color: "text-orange-400" },
        { href: "/juegos", label: "Juegos", icon: "🎮", color: "" },
        { href: "/journal", label: "Journal", icon: "📔", color: "" },
        { href: "/perfil", label: "Perfil", icon: "avatar", color: "" },
      ]
    : [
        { href: "/", label: "Inicio", icon: "⚽", color: "" },
        { href: "/buscar", label: "Buscar", icon: "🔍", color: "" },
        { href: "/ranking", label: "Top", icon: "🏆", color: "" },
        { href: "/equipos", label: "Equipos", icon: "🛡️", color: "" },
        { href: "/perfil", label: "Entrar", icon: "👤", color: "" },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-colors ${
                isActive
                  ? item.color || "text-orange-400"
                  : item.color ? `${item.color} opacity-60 hover:opacity-100` : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {item.href === "/buscar" ? (
                <>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                  </svg>
                  <span className={`text-[9px] mt-0.5 font-medium ${isActive ? "text-orange-400" : "text-gray-500"}`}>{item.label}</span>
                </>
              ) : item.href === "/" ? (
                <img src="/icon-home.png" alt="" className="w-6 h-6 object-contain" />
              ) : item.href === "/actividad" ? (
                <img src="/icon-companeros.png" alt="" className="w-6 h-6 object-contain" />
              ) : item.href === "/journal" ? (
                <img src="/icon-journal.png" alt="" className="w-6 h-6 object-contain" />
              ) : item.href === "/juegos" ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 6H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zM7 13H5v-2h2v-2h2v2h2v2H9v2H7v-2zm8 2a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
              ) : item.href === "/equipos" ? (
                <img src="/icon-journal.png" alt="" className="w-6 h-6 object-contain" />
              ) : item.href === "/ranking" ? (
                <img src="/icon-top.png" alt="" className="w-6 h-6 object-contain" />
              ) : item.href === "/perfil" && !user ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 14c-6 0-8 3-8 5v1h16v-1c0-2-2-5-8-5z" />
                </svg>
              ) : item.icon === "avatar" && user ? (
                user.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover border border-gray-600" />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-gray-600"
                    style={{ background: user.avatar_color }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )
              ) : (
                <span className="text-lg">{item.icon}</span>
              )}
              {item.href !== "/buscar" && (
                <span className={`text-[9px] mt-0.5 font-medium ${isActive ? "text-orange-400" : "text-white"}`}>{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
