import Database from "better-sqlite3";
import path from "path";

// In production, use the persistent volume path
const DB_PATH = process.env.NODE_ENV === "production"
  ? "/app/data/futbol-ratings.db"
  : path.join(process.cwd(), "futbol-ratings.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      avatar_color TEXT DEFAULT '#22c55e',
      avatar_url TEXT,
      bio TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS equipos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      logo_url TEXT,
      pais TEXT
    );

    CREATE TABLE IF NOT EXISTS competiciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      pais TEXT,
      temporada TEXT,
      UNIQUE(nombre, pais)
    );

    CREATE TABLE IF NOT EXISTS partidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fixture_id INTEGER UNIQUE,
      equipo_local_id INTEGER NOT NULL,
      equipo_visitante_id INTEGER NOT NULL,
      goles_local INTEGER DEFAULT 0,
      goles_visitante INTEGER DEFAULT 0,
      competicion_id INTEGER,
      fecha TEXT NOT NULL,
      estadio TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (equipo_local_id) REFERENCES equipos(id),
      FOREIGN KEY (equipo_visitante_id) REFERENCES equipos(id),
      FOREIGN KEY (competicion_id) REFERENCES competiciones(id)
    );

    CREATE TABLE IF NOT EXISTS calificaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partido_id INTEGER NOT NULL,
      usuario_id INTEGER,
      usuario TEXT NOT NULL,
      emocion REAL CHECK(emocion BETWEEN 0 AND 10),
      calidad REAL CHECK(calidad BETWEEN 0 AND 10),
      arbitraje REAL CHECK(arbitraje BETWEEN 0 AND 10),
      general REAL CHECK(general BETWEEN 0 AND 10) NOT NULL,
      comentario TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (partido_id) REFERENCES partidos(id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      UNIQUE(partido_id, usuario)
    );

    CREATE TABLE IF NOT EXISTS diario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      partido_id INTEGER NOT NULL,
      visto INTEGER DEFAULT 1,
      quiero_ver INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (partido_id) REFERENCES partidos(id),
      UNIQUE(usuario_id, partido_id)
    );

    CREATE TABLE IF NOT EXISTS amigos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      amigo_id INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (amigo_id) REFERENCES usuarios(id),
      UNIQUE(usuario_id, amigo_id)
    );

    CREATE TABLE IF NOT EXISTS seguidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      seguido_id INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (seguido_id) REFERENCES usuarios(id),
      UNIQUE(usuario_id, seguido_id)
    );

    CREATE TABLE IF NOT EXISTS listas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS lista_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lista_id INTEGER NOT NULL,
      partido_id INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (lista_id) REFERENCES listas(id),
      FOREIGN KEY (partido_id) REFERENCES partidos(id),
      UNIQUE(lista_id, partido_id)
    );

    CREATE TABLE IF NOT EXISTS game_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      game TEXT NOT NULL,
      score INTEGER NOT NULL,
      fecha TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      UNIQUE(usuario_id, game, fecha)
    );
  `);

  // La base de datos se llena con datos reales via /api/sync
}

