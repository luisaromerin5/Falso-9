# 🚀 Deploy de Falso 9 en Railway

## Paso 1: Crear cuenta en GitHub (si no tienes)
1. Ve a https://github.com
2. Click "Sign up" y crea tu cuenta

## Paso 2: Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre: `falso-9`
3. Privado o público (como prefieras)
4. NO marques "Add a README" (ya tenemos código)
5. Click "Create repository"

## Paso 3: Subir el código
Desde tu terminal (o desde aquí), ejecuta:
```bash
cd /workspace/futbol-ratings
git remote add origin https://github.com/TU_USUARIO/falso-9.git
git push -u origin main
```

Te pedirá tu usuario y un token de GitHub (no contraseña).
Para crear el token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token (classic) → marca "repo" → Generate.

## Paso 4: Crear cuenta en Railway
1. Ve a https://railway.app
2. Click "Login" → "Login with GitHub"
3. Autoriza Railway

## Paso 5: Crear proyecto en Railway
1. Click "New Project"
2. Click "Deploy from GitHub Repo"
3. Selecciona tu repo `falso-9`
4. Railway detecta el Dockerfile automáticamente

## Paso 6: Configurar variables de entorno
En Railway → tu proyecto → "Variables" → agrega:
```
API_FOOTBALL_KEY = 94b4b7e77cc9267a10448100af986862
RAPIDAPI_KEY = 0cf48760e5mshcab9ecac0847ba8p17f9dbjsnd8b64573bfee
JWT_SECRET = falso9-produccion-cambia-esto-por-algo-random-largo
```

## Paso 7: Configurar volumen persistente
1. En Railway → tu servicio → "Settings" → "Volumes"
2. Click "Add Volume"
3. Mount path: `/app/data`
4. Esto asegura que la base de datos no se borra entre deploys

## Paso 8: Generar dominio
1. En Railway → tu servicio → "Settings" → "Networking"
2. Click "Generate Domain"
3. Te dará algo como: `falso-9-production.up.railway.app`

## Paso 9: Sincronizar partidos
Una vez online, abre tu app y usa el botón "Filtros" para sincronizar partidos.
O desde terminal:
```bash
curl -X POST https://TU-DOMINIO.up.railway.app/api/sync \
  -H "Content-Type: application/json" \
  -d '{"league": 140, "season": 2023}'
```

## Paso 10: Dominio personalizado (opcional)
1. Compra un dominio en Namecheap (~$10/año) ej: `falso9.app`
2. En Railway → Settings → Custom Domain → agrega tu dominio
3. En Namecheap → DNS → agrega un CNAME apuntando a Railway

---

## Resumen de costos

| Servicio | Costo |
|----------|-------|
| Railway | ~$5/mes |
| Dominio (opcional) | ~$10/año |
| API-Football Free | $0 |
| Total | ~$5/mes |

---

## Para actualizar la app después

Cada vez que hagas cambios:
```bash
git add -A
git commit -m "descripcion del cambio"
git push
```
Railway re-despliega automáticamente en ~30 segundos.
