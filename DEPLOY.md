# 🚀 Guía de Despliegue - Fútbol Ratings

## API de Fútbol Real

1. Regístrate gratis en: https://www.football-data.org/client/register
2. Te envían un API key por email
3. Crea un archivo `.env.local`:
   ```
   FOOTBALL_API_KEY=tu_api_key_aqui
   ```
4. Para sincronizar partidos, haz un POST a `/api/sync`:
   ```bash
   curl -X POST http://localhost:3000/api/sync \
     -H "Content-Type: application/json" \
     -d '{"competition": "PL"}'
   ```

**Competiciones disponibles (plan gratis):**
| Código | Competición |
|--------|-------------|
| PL | Premier League |
| PD | La Liga |
| BL1 | Bundesliga |
| SA | Serie A |
| FL1 | Ligue 1 |
| CL | Champions League |

---

## Opción 1: Vercel (Recomendado - GRATIS)

La forma más fácil. Vercel es de los creadores de Next.js.

### Pasos:
1. Sube el código a GitHub:
   ```bash
   cd futbol-ratings
   git init
   git add .
   git commit -m "Fútbol Ratings v1"
   # Crea un repo en github.com, luego:
   git remote add origin https://github.com/TU_USUARIO/futbol-ratings.git
   git push -u origin main
   ```

2. Ve a https://vercel.com y registrate con GitHub

3. Click "Import Project" → selecciona tu repo

4. En "Environment Variables" agrega:
   ```
   FOOTBALL_API_KEY = tu_api_key
   ```

5. Click "Deploy" — ¡listo!

**Nota:** SQLite no persiste en Vercel (es serverless). Para producción real, cambia a:
- **Vercel Postgres** (gratis hasta 256MB)
- **Turso** (SQLite en la nube, gratis hasta 500MB)
- **PlanetScale** (MySQL serverless)

---

## Opción 2: Railway ($5/mes - Muy fácil)

Railway soporta Docker y SQLite persiste.

### Pasos:
1. Ve a https://railway.app y registrate con GitHub
2. "New Project" → "Deploy from GitHub Repo"
3. Selecciona tu repo
4. Agrega variable de entorno: `FOOTBALL_API_KEY`
5. Railway detecta el Dockerfile automáticamente
6. Te da una URL tipo: `futbol-ratings.up.railway.app`

---

## Opción 3: VPS barato (DigitalOcean, Hetzner, Contabo)

Más control, desde $4-5/mes.

### Pasos:
1. Crea un servidor Ubuntu (el más barato funciona)

2. Instala Docker:
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```

3. Clona tu repo:
   ```bash
   git clone https://github.com/TU_USUARIO/futbol-ratings.git
   cd futbol-ratings
   ```

4. Crea `.env.local`:
   ```bash
   echo "FOOTBALL_API_KEY=tu_key" > .env.local
   ```

5. Construye y ejecuta:
   ```bash
   docker build -t futbol-ratings .
   docker run -d -p 3000:3000 --env-file .env.local \
     -v futbol-data:/app \
     --restart unless-stopped \
     --name futbol-ratings \
     futbol-ratings
   ```

6. (Opcional) Usa Caddy o Nginx como reverse proxy con SSL:
   ```bash
   # Instalar Caddy
   apt install -y caddy

   # /etc/caddy/Caddyfile
   tudominio.com {
     reverse_proxy localhost:3000
   }

   systemctl restart caddy
   ```

---

## Opción 4: Render (Gratis con limitaciones)

1. Ve a https://render.com
2. "New Web Service" → conecta GitHub
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Agrega env vars

**Limitación:** En plan gratis se duerme después de 15min sin actividad.

---

## Comparación rápida

| Plataforma | Precio | SQLite persiste | Dificultad | URL custom |
|-----------|--------|----------------|------------|------------|
| Vercel | Gratis | ❌ (usar Turso) | ⭐ Fácil | ✅ |
| Railway | ~$5/mes | ✅ | ⭐ Fácil | ✅ |
| Render | Gratis | ❌ | ⭐ Fácil | ✅ |
| VPS | ~$5/mes | ✅ | ⭐⭐ Media | ✅ |

---

## Mi recomendación

**Para empezar rápido:** Vercel + Turso (todo gratis)
**Para no complicarte:** Railway ($5/mes, todo funciona directo)
**Para aprender y tener control:** VPS con Docker

---

## Dominio personalizado

En cualquier opción puedes comprar un dominio (~$10/año):
- Namecheap: https://namecheap.com
- Cloudflare: https://dash.cloudflare.com/domains

Luego apuntas el DNS a tu servidor y listo.
