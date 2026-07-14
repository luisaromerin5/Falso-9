export interface Equipo {
  id: number;
  nombre: string;
  logo_url: string | null;
  pais: string;
}

export interface Competicion {
  id: number;
  nombre: string;
  pais: string;
  temporada: string;
}

export interface Partido {
  id: number;
  fixture_id: number | null;
  equipo_local_id: number;
  equipo_visitante_id: number;
  goles_local: number;
  goles_visitante: number;
  competicion_id: number;
  fecha: string;
  estadio: string;
  created_at: string;
  // Joined fields
  equipo_local?: string;
  equipo_visitante?: string;
  logo_local?: string;
  logo_visitante?: string;
  competicion?: string;
  promedio_general?: number;
  total_votos?: number;
}

export interface Calificacion {
  id: number;
  partido_id: number;
  usuario: string;
  emocion: number;
  calidad: number;
  arbitraje: number;
  general: number;
  comentario: string | null;
  created_at: string;
}

export interface CalificacionInput {
  partido_id: number;
  usuario: string;
  emocion: number;
  calidad: number;
  arbitraje: number;
  general: number;
  comentario?: string;
}

export interface PartidoDetalle extends Partido {
  calificaciones: Calificacion[];
  promedios: {
    emocion: number;
    calidad: number;
    arbitraje: number;
    general: number;
  };
}
