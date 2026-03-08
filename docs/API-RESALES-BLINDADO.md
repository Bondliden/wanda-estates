# 🛡️ CONFIGURACIÓN BLINDADA - ResalesOnline API

## ✅ CONFIGURACIÓN CORRECTA (2026)

### Variables de Entorno (Railway)
```bash
RESALES_P1=1022290
RESALES_P2=c985be4dc15535fb73878a444b7ba2a475290c37
```

### Parámetros API Correctos
```javascript
{
  p1: "1022290",                    // ID cliente 
  p2: "c985be4dc15535fb73878a444b7ba2a475290c37",  // API key activa
  p_output: "json",
  p_Agency_FilterId: "1",           // ⚠️ CRÍTICO: '1', NO '71569'
  p_PropertyStatus: "Available",
  p_MustHavePictures: "1"
}
```

### Nombre de Parámetros Correctos
- ✅ `p_Agency_FilterId` (funciona)
- ❌ `FilterAgencyId` (causa 401)

## 🚨 PROBLEMAS COMUNES

### Error 401: "You are not authorised to access this service"
**Causa**: Parámetros incorrectos
**Solución**:
1. Usar `p_Agency_FilterId='1'` (NO `FilterAgencyId='71569'`)
2. Verificar que p1 y p2 vienen de environment variables
3. Verificar IP en whitelist de ResalesOnline

### Error 401: "the IP does not match with your API key"  
**Causa**: IP del servidor no está en whitelist
**Solución**:
1. Obtener IP actual: `curl https://www.wandaestates.com/api/health`
2. Contactar ResalesOnline para agregar IP a whitelist
3. IP actual Railway: **208.77.244.15**

### "No properties found matching your criteria"
**Causa**: API devuelve datos vacíos por error 401
**Solución**: Aplicar las soluciones de error 401 arriba

## 🔧 CÓMO USAR LA CONFIGURACIÓN BLINDADA

### ✅ CORRECTO - Usar config.ts
```typescript
import { BASE_API_PARAMS, buildResalesApiUrl } from './config';

// Para SearchProperties
const url = buildResalesApiUrl('SearchProperties', { 
  p_PageSize: '18',
  p_location: 'Marbella' 
});

// Para PropertyDetails  
const url = buildResalesApiUrl('PropertyDetails', {
  p_RefId: 'R1234567'
});
```

### ❌ INCORRECTO - Hardcoding
```typescript
// ❌ NUNCA hacer esto:
const p1 = '1022290';
const p2 = 'c985be4dc15535fb73878a444b7ba2a475290c37';
const url = `https://webapi.resales-online.com/V6/SearchProperties?p1=${p1}&p2=${p2}...`;
```

## 📊 ENDPOINTS DE MONITOREO

### Health Check
```
GET https://www.wandaestates.com/api/health
```
Respuesta exitosa:
```json
{
  "status": "ok",
  "checks": {
    "resales_api": { "ok": true, "has_properties": true },
    "server_ip": { "ok": true, "ip": "208.77.244.15" }
  }
}
```

### Debug ResalesOnline
```  
GET https://www.wandaestates.com/api/debug-resales
```

### Propiedades  
```
GET https://www.wandaestates.com/api/properties
```

## 🚀 PROCESO DE DEPLOY

1. **Modificar código** → Usar siempre `config.ts`
2. **Commit y push** → Railway auto-deploy
3. **Verificar logs** → Buscar errores 401
4. **Probar endpoints** → /api/health y /api/properties
5. **Verificar web** → Propiedades deben aparecer

## 📞 CONTACTOS DE EMERGENCIA

- **ResalesOnline Support**: Para whitelist de IP
- **Railway Logs**: Dashboard → wanda-estates → Deploy Logs
- **Git History**: `git log --oneline` para ver cambios recientes

---

**Última actualización**: Marzo 2026  
**Estado**: ✅ Funcionando correctamente  
**IP Servidor**: 208.77.244.15  
**API Key**: c985be4d... (activa)