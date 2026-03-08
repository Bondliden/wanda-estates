/**
 * CONFIGURACIÓN BLINDADA - ResalesOnline API
 * 
 * Este archivo centraliza y valida la configuración de la API de ResalesOnline
 * para evitar errores de hardcoding y parámetros incorrectos.
 */

export interface ResalesConfig {
  p1: string;
  p2: string;
  baseUrl: string;
  agencyFilterId: string;
}

/**
 * Validar que las variables de entorno estén correctamente configuradas
 */
function validateEnvironmentVariables(): ResalesConfig {
  const p1 = process.env.RESALES_P1;
  const p2 = process.env.RESALES_P2;

  // ✅ VALIDACIÓN CRÍTICA: API keys deben existir
  if (!p1 || !p2) {
    throw new Error(`
    🚨 CONFIGURACIÓN FALTANTE - ResalesOnline API
    
    Variables de entorno requeridas:
    - RESALES_P1=${p1 ? '✅ Configurada' : '❌ FALTANTE'}  
    - RESALES_P2=${p2 ? '✅ Configurada' : '❌ FALTANTE'}
    
    Configurar en Railway → Variables de entorno:
    RESALES_P1=1022290
    RESALES_P2=c985be4dc15535fb73878a444b7ba2a475290c37
    `);
  }

  // ✅ VALIDACIÓN: P1 debe ser el ID de cliente correcto
  if (p1 !== '1022290') {
    console.warn(`⚠️  RESALES_P1 inesperado: ${p1} (esperado: 1022290)`);
  }

  // ✅ VALIDACIÓN: P2 debe tener formato de API key válida (64 caracteres hex)
  if (p2.length !== 40 || !/^[a-f0-9]+$/i.test(p2)) {
    console.warn(`⚠️  RESALES_P2 formato inválido: ${p2.length} caracteres (esperado: 40 hex)`);
  }

  console.log(`✅ ResalesOnline API configurada correctamente - P1: ${p1}, P2: ${p2.substring(0, 8)}...`);

  return {
    p1,
    p2,
    baseUrl: 'https://webapi.resales-online.com/V6',
    agencyFilterId: '1' // ⚠️ CRÍTICO: Debe ser '1', NO '71569'
  };
}

/**
 * Configuración blindada de ResalesOnline API
 * Usar SIEMPRE estas constantes en lugar de valores hardcodeados
 */
export const RESALES_CONFIG = validateEnvironmentVariables();

/**
 * Parámetros base correctos para todas las llamadas a la API
 * 
 * ✅ USAR SIEMPRE ESTOS PARÁMETROS:
 * - p_Agency_FilterId: '1' (NO FilterAgencyId ni 71569)  
 * - p1 y p2 desde environment variables
 */
export const BASE_API_PARAMS = {
  p1: RESALES_CONFIG.p1,
  p2: RESALES_CONFIG.p2,
  p_output: 'json',
  p_Agency_FilterId: RESALES_CONFIG.agencyFilterId,
  p_PropertyStatus: 'Available',
  p_MustHavePictures: '1'
} as const;

/**
 * Helper para construir URLs de la API de manera segura
 */
export function buildResalesApiUrl(endpoint: 'SearchProperties' | 'PropertyDetails', customParams: Record<string, string> = {}): string {
  const params = new URLSearchParams({
    ...BASE_API_PARAMS,
    ...customParams
  });
  
  const url = `${RESALES_CONFIG.baseUrl}/${endpoint}?${params.toString()}`;
  
  // Log para debugging (visible en Railway)
  console.log(`[ResalesAPI] ${endpoint}: ${url}`);
  
  return url;
}

/**
 * Monitoreo básico de errores de API
 */
export function logApiError(endpoint: string, error: any, url?: string) {
  const timestamp = new Date().toISOString();
  console.error(`
🚨 [${timestamp}] RESALES API ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Endpoint: ${endpoint}
URL: ${url || 'No URL provided'}
Error: ${error instanceof Error ? error.message : JSON.stringify(error)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);

  // Si es un error 401, dar instrucciones específicas
  if (error.message?.includes('401') || error.message?.includes('not authorised')) {
    console.error(`
🔧 SOLUCIÓN PARA ERROR 401:
1. Verificar variables de entorno en Railway:
   RESALES_P1=${RESALES_CONFIG.p1}
   RESALES_P2=${RESALES_CONFIG.p2.substring(0, 8)}...

2. Verificar IP del servidor está en whitelist de ResalesOnline
   IP actual: Consultar /api/health

3. Verificar que se usan parámetros correctos:
   - p_Agency_FilterId='1' (NO '71569')
   - p1 y p2 desde environment variables
    `);
  }
}

/**
 * REGLAS DE USO:
 * 
 * ❌ NUNCA hacer esto:
 * const p1 = '1022290';
 * const p2 = 'c985be4dc15535fb73878a444b7ba2a475290c37';
 * 
 * ✅ SIEMPRE hacer esto:
 * import { BASE_API_PARAMS, buildResalesApiUrl } from './config';
 * const url = buildResalesApiUrl('SearchProperties', { p_PageSize: '18' });
 */