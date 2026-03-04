# 🔒 CONFIGURACIÓN BLINDADA — WANDA ESTATES
>
> Última actualización: 2026-03-04
> **NO MODIFICAR** sin entender el impacto. Cada sección indica POR QUÉ está así.

---

## 1. API Resales Online V6

### Credenciales

```
p1 = 1022290
p2 = 13b9e88dcae7bf03423e2e5c08f2df629a103c1a
Agency FilterId = 1
Base URL = https://webapi.resales-online.com/V6
```

### ⚠️ Reglas Críticas de la API (NO ROMPER)

**IMAGEN — Nunca reemplazar el tamaño en la URL del CDN**

```
❌ MAL:  url.replace('/w400/', '/w1200/')   ← El CDN devuelve placeholder de 2.6KB si no hay ese tamaño
✅ BIEN: usar la URL original tal cual viene de la API (generalmente /w400/)
```

> MOTIVO: El CDN de Resales sirve cada imagen solo en los tamaños que existen para esa propiedad.
> Si pides un tamaño que no existe, devuelve un placeholder genérico en lugar del error 404.

**ESTRUCTURA DE RESPUESTA — No envolver dos veces**

```
fetchProperties()      → devuelve { success, data: { Property[], Pagination } }
fetchNewDevelopments() → devuelve { success, data: { Property[], Pagination } }

routes.ts debe hacer:
  res.json(result)         ← ✅ CORRECTO: pasar directamente
  res.json({ data: result }) ← ❌ MAL: crea data.data en el frontend
```

**IMÁGENES — Campos por endpoint**

```
SearchProperties → p.Pictures.Picture[]  → { PictureURL, HighResURL }
PropertyDetails  → p.PicturesContent.Picture[] → { PictureURL, HighResURL }
```

### IP Estática de Railway en Whitelist Resales

- La IP estática de Railway debe estar añadida en el panel de Resales Online
- Para verla: `GET /api/my-ip`
- Para validar todo: `GET /api/health`

---

## 2. Estructura de Respuesta de la API (Frontend)

El frontend espera SIEMPRE esta estructura:

```json
{
  "success": true,
  "data": {
    "Property": [...],
    "Pagination": {
      "CurrentPage": 1,
      "PageSize": 18,
      "TotalProperties": 250,
      "TotalPages": 14
    }
  }
}
```

El componente que consume esto: `ResalesPropertyGrid.tsx` y `NewDevelopmentGrid.tsx`

```tsx
// Lectura correcta:
const propsArray = data.data?.Property || [];
const pagination = data.data?.Pagination || {};
```

---

## 3. Propiedad del Mes

Archivo: `client/src/components/PropertyOfTheMonth.tsx`

**Propiedad actual (2026-03-04):**

```
Id:       R4814416
Título:   Villa Independiente en Mijas
Precio:   1.000.000 €
Camas:    4
Baños:    3
Construido: 820 m²
Parcela:  1.727 m²
Imagen:   https://cdn.resales-online.com/public/6u5vbuh1hk/properties/d8b977ed62ab11ef90df0217bc231ef4/w400/1-8feb9a13440344d11ba504bcb1dd499c.jpg
```

**Cómo cambiarla:** Editar solo el objeto `featuredProperty` en el componente.
**Importante:** Verificar SIEMPRE que la imagen URL devuelva 200 OK antes de desplegar.

```bash
curl -I "https://cdn.resales-online.com/..."   # debe decir HTTP/1.1 200 OK
```

---

## 4. Despliegue

### Flujo normal

```
git add [archivos modificados]
git commit -m "descripción"
git push origin main
# → Railway detecta el push y redespliega automáticamente
```

### Verificar despliegue en producción

```
GET https://wandaestates.com/api/health
```

Debe devolver `{ "status": "ok", ... }` con HTTP 200.

### Variables de entorno Railway

```
NODE_ENV=production
DATABASE_URL=[PostgreSQL de Railway]
```

---

## 5. Lightbox / Galería de Fotos

Archivo: `client/src/pages/PropertyDetail.tsx`

**Regla de tamaño:**

```tsx
// Contenedor del lightbox:
className="max-w-5xl max-h-[85vh] w-full mx-8 flex flex-col"
// Imagen dentro:
className="w-full max-h-[80vh] object-contain"
```

> MOTIVO: Sin `max-h-[80vh]` el lightbox desbordaba la pantalla y el usuario tenía que hacer zoom al 33%.
> `object-contain` garantiza que se ve la foto entera sin recortar.

---

## 6. mapProperty — Campos multiformato

La función `mapProperty` en `server/resales.ts` maneja variaciones de la API:

| Campo    | V6 SearchProperties | V6 PropertyDetails |
|----------|--------------------|--------------------|
| Camas    | `Bedrooms`         | `Beds`             |
| Baños    | `Bathrooms`        | `Baths`            |
| Construido | `Built`          | `BuiltArea`        |
| Parcela  | `GardenPlot`       | `PlotArea`         |
| Fotos    | `Pictures.Picture` | `PicturesContent.Picture` |

**NUNCA** limpiar estos fallbacks sin testear ambos endpoints.

---

## 7. Health Check

```
GET /api/health
```

Respuesta si todo funciona:

```json
{
  "status": "ok",
  "timestamp": "2026-03-04T16:53:00.000Z",
  "checks": {
    "resales_api": { "ok": true, "has_properties": true, "has_images": true, "ref": "R1234567" },
    "server_ip":   { "ok": true, "ip": "X.X.X.X" },
    "api_structure": { "ok": true }
  }
}
```

Si `resales_api.ok` es `false` → la IP no está en whitelist o las credenciales expiraron.
