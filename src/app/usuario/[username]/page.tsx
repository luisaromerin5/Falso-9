"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

interface UserProfile {
  id: number;
  username: string;
  avatar_color: string;
  avatar_url: string | null;
  bio: string | null;
  reviews: Array<{
    id: number;
    partido_id: number;
    general: number;
    comentario: string | null;
    created_at: string;
    equipo_local: string;
    equipo_visitante: string;
    logo_local: string | null;
    logo_visitante: string | null;
    goles_local: number;
    goles_visitante: number;
    competicion: string;
  }>;
  stats: { reviews: number; vistos: number; watchlist: number; amigos: number; seguidos: number };
  companeros: Array<{ id: number; username: string; avatar_color: string; avatar_url: string | null }>;
  seguidos: Array<{ id: number; username: string; avatar_color: string; avatar_url: string | null }>;
}

export default function UserProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [relationship, setRelationship] = useState<"none" | "friend" | "following" | "pending">("none");
  const [activeTab, setActiveTab] = useState<"reviews" | "companeros" | "seguidos">("reviews");

  useEffect(() => {
    fetch(`/api/user/${username}`)
      .then((r) => r.json())
      .then((data) => { setProfile(data); setLoading(false); })
      .catch(() => setLoading(false));

    // Check relationship status
    if (user) {
      fetch(`/api/usuarios?q=${username}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const u = data.find((d: any) => d.username === username);
            if (u) {
              if (u.isFriend) setRelationship("friend");
              else if (u.isPending) setRelationship("pending");
              else if (u.isFollowing) setRelationship("following");
            }
          }
        });
    }
  }, [username, user]);

  const handleAction = async (action: string) => {
    await fetch("/api/amigos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, username }),
    });
    // Refresh relationship
    if (action === "follow") setRelationship("following");
    else if (action === "request") setRelationship("pending");
    else if (action === "remove" || action === "unfollow") setRelationship("none");
  };

  if (loading) {
    return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>;
  }

  if (!profile) {
    return <div className="py-8 text-center"><p className="text-white">Usuario no encontrado</p><Link href="/" className="text-orange-400 text-sm">← Volver</Link></div>;
  }

  return (
    <div className="py-4">
      <Link href="/actividad" className="text-orange-400 text-sm mb-4 inline-block">← Volver</Link>

      {/* Profile header */}
      <div className="text-center mb-5">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-xl font-bold text-white" style={{ background: profile.avatar_color }}>
            {profile.username.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className="text-lg font-bold text-white">@{profile.username}</h1>
        {profile.bio && <p className="text-xs text-gray-400 mt-1">{profile.bio}</p>}
        <p className="text-[10px] text-gray-500 mt-1">{profile.stats.reviews} reviews • {profile.stats.vistos} partidos vistos</p>
      </div>

      {/* Relationship buttons */}
      {user && user.username !== profile.username && (
        <div className="flex gap-2 mb-5">
          {relationship === "none" && (
            <>
              <button onClick={() => handleAction("request")} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium py-2.5 rounded-lg">
                Solicitar Compañero
              </button>
              <button onClick={() => handleAction("follow")} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2.5 rounded-lg">
                Seguir
              </button>
            </>
          )}
          {relationship === "pending" && (
            <div className="flex-1 bg-yellow-900/30 text-yellow-400 text-xs font-medium py-2.5 rounded-lg text-center border border-yellow-700/50">
              Solicitud pendiente
            </div>
          )}
          {relationship === "following" && (
            <button onClick={() => { if(confirm("¿Dejar de seguir a @" + profile.username + "?")) handleAction("unfollow"); }} className="flex-1 bg-gray-700 text-blue-400 text-xs font-medium py-2.5 rounded-lg border border-blue-700/50">
              Siguiendo ✓
            </button>
          )}
          {relationship === "friend" && (
            <button onClick={() => { if(confirm("¿Eliminar a @" + profile.username + " como compañero?")) handleAction("remove"); }} className="flex-1 bg-gray-700 text-orange-400 text-xs font-medium py-2.5 rounded-lg border border-orange-700/50">
              Compañero ✓
            </button>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        <button onClick={() => setActiveTab("reviews")} className="text-center">
          <p className="text-lg font-bold text-green-400">{profile.stats.vistos || 0}</p>
          <p className="text-[8px] text-gray-400">Vistos</p>
        </button>
        <button onClick={() => setActiveTab("reviews")} className="text-center">
          <p className="text-lg font-bold text-blue-400">{profile.stats.reviews || 0}</p>
          <p className="text-[8px] text-gray-400">Reviews</p>
        </button>
        <button className="text-center">
          <p className="text-lg font-bold text-yellow-400">{profile.stats.watchlist || 0}</p>
          <p className="text-[8px] text-gray-400">Por ver</p>
        </button>
        <button onClick={() => setActiveTab("companeros")} className="text-center">
          <p className="text-lg font-bold text-purple-400">{profile.stats.amigos || 0}</p>
          <p className="text-[8px] text-gray-400">Compañeros</p>
        </button>
        <button onClick={() => setActiveTab("seguidos")} className="text-center">
          <p className="text-lg font-bold text-cyan-400">{profile.stats.seguidos || 0}</p>
          <p className="text-[8px] text-gray-400">Seguidos</p>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-800 rounded-lg p-1">
        <button onClick={() => setActiveTab("reviews")} className={`flex-1 py-2 text-xs font-medium rounded-md ${activeTab === "reviews" ? "bg-orange-500 text-white" : "text-gray-400"}`}>Reviews</button>
        <button onClick={() => setActiveTab("companeros")} className={`flex-1 py-2 text-xs font-medium rounded-md ${activeTab === "companeros" ? "bg-orange-500 text-white" : "text-gray-400"}`}>Compañeros</button>
        <button onClick={() => setActiveTab("seguidos")} className={`flex-1 py-2 text-xs font-medium rounded-md ${activeTab === "seguidos" ? "bg-orange-500 text-white" : "text-gray-400"}`}>Seguidos</button>
      </div>

      {/* Reviews tab */}
      {activeTab === "reviews" && (
        <>
      <h2 className="text-sm font-bold text-gray-300 mb-3">Reviews</h2>
      {profile.reviews.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-4">Sin reviews aún</p>
      ) : (
        <div className="space-y-2">
          {profile.reviews.map((r) => (
            <Link key={r.id} href={`/partido/${r.partido_id}`}>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 mb-2">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {r.logo_local && <img src={r.logo_local} alt="" className="w-4 h-4" />}
                    <p className="text-xs text-white font-medium truncate">
                      {r.equipo_local} {r.goles_local}-{r.goles_visitante} {r.equipo_visitante}
                    </p>
                    {r.logo_visitante && <img src={r.logo_visitante} alt="" className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-bold text-orange-400 ml-2">{r.general}</span>
                </div>
                <p className="text-[10px] text-gray-400">{r.competicion} • {r.created_at.split("T")[0].split(" ")[0]}</p>
                {r.comentario && <p className="text-xs text-gray-300 mt-1">{r.comentario}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
        </>
      )}

      {/* Compañeros tab */}
      {activeTab === "companeros" && (
        <div className="space-y-2">
          {(!profile.companeros || profile.companeros.length === 0) ? (
            <p className="text-center text-gray-500 text-sm py-4">Sin compañeros</p>
          ) : (
            profile.companeros.map((f) => (
              <Link key={f.id} href={`/usuario/${f.username}`}>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3 hover:border-gray-600 mb-2">
                  {f.avatar_url ? (
                    <img src={f.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: f.avatar_color }}>
                      {f.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <p className="text-sm text-white font-medium">@{f.username}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Seguidos tab */}
      {activeTab === "seguidos" && (
        <div className="space-y-2">
          {(!profile.seguidos || profile.seguidos.length === 0) ? (
            <p className="text-center text-gray-500 text-sm py-4">No sigue a nadie</p>
          ) : (
            profile.seguidos.map((f) => (
              <Link key={f.id} href={`/usuario/${f.username}`}>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3 hover:border-gray-600 mb-2">
                  {f.avatar_url ? (
                    <img src={f.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: f.avatar_color }}>
                      {f.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <p className="text-sm text-white font-medium">@{f.username}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
