/**
 * Configuración base para servicios API
 */

export const API_CONFIG = {
  // Base URL de ApiIdeafix
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.ideafix.com',
  
  // Timeout por defecto (30 segundos)
  TIMEOUT: 30000,
  
  // Endpoints de ApiIdeafix según especificación
  ENDPOINTS: {
    LIQUIDACIONES: '/idx/liq',
    EMPRESAS: '/idx/emps', 
    TIPOS_LIQUIDACION: '/idx/tliq',
    COMBO_EMPS: '/idx/combo/emps',
  },
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuración de retry
  RETRY: {
    attempts: 3,
    delay: 1000, // 1 segundo
  },
  
  // Cache configuration
  CACHE: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutos
  }
} as const;

/**
 * Códigos de estado HTTP comunes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Tipos de errores de API
 */
export const ApiErrorType = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  CLIENT_ERROR: 'CLIENT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED_ERROR: 'UNAUTHORIZED_ERROR',
  FORBIDDEN_ERROR: 'FORBIDDEN_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
} as const;

export type ApiErrorType = typeof ApiErrorType[keyof typeof ApiErrorType];