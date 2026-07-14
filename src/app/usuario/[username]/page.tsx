"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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
    goles_local: number;
    goles_visitante: number;
    competicion: string;
  }>;
  stats: { reviews: number; vistos: number };
}

export default function UserProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/${username}`)
      .then((r) => r.json())
      .then((data) => { setProfile(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [username]);

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
      <div className="text-center mb-6">
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

      {/* Reviews */}
      <h2 className="text-sm font-bold text-gray-300 mb-3">Reviews</h2>
      {profile.reviews.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-4">Sin reviews aún</p>
      ) : (
        <div className="space-y-2">
          {profile.reviews.map((r) => (
            <Link key={r.id} href={`/partido/${r.partido_id}`}>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 mb-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-white font-medium truncate flex-1">
                    {r.equipo_local} {r.goles_local}-{r.goles_visitante} {r.equipo_visitante}
                  </p>
                  <span className="text-sm font-bold text-orange-400 ml-2">{r.general}</span>
                </div>
                <p className="text-[10px] text-gray-400">{r.competicion} • {r.created_at.split("T")[0]}</p>
                {r.comentario && <p className="text-xs text-gray-300 mt-1">{r.comentario}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
