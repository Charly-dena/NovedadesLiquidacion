import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { API_CONFIG, HTTP_STATUS, ApiErrorType } from './config';
import { ApiError } from './errors';

/**
 * Cliente HTTP base para comunicación con ApiIdeafix
 */
class ApiClient {
  private instance: AxiosInstance;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    this.setupInterceptors();
  }

  /**
   * Configuración de interceptores para request y response
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Agregar timestamp para logging
        config.metadata = { startTime: Date.now() };
        
        // Log de request en desarrollo
        if (import.meta.env.DEV) {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(new ApiError(ApiErrorType.CLIENT_ERROR, 'Request configuration error', error));
      }
    );

    // Response interceptor  
    this.instance.interceptors.response.use(
      (response) => {
        const duration = Date.now() - (response.config.metadata?.startTime || 0);
        
        if (import.meta.env.DEV) {
          console.log(`✅ API Response: ${response.status} ${response.config.url} (${duration}ms)`);
        }
        
        return response;
      },
      (error: AxiosError) => {
        const duration = Date.now() - (error.config?.metadata?.startTime || 0);
        
        if (import.meta.env.DEV) {
          console.error(`❌ API Error: ${error.response?.status || 'Network'} ${error.config?.url} (${duration}ms)`, error.message);
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: AxiosError): ApiError {
    const status = error.response?.status;
    const message = error.message;
    const data = error.response?.data;

    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return new ApiError(ApiErrorType.VALIDATION_ERROR, 'Datos de entrada inválidos', { status, data });
      
      case HTTP_STATUS.UNAUTHORIZED:
        return new ApiError(ApiErrorType.UNAUTHORIZED_ERROR, 'No autorizado', { status, data });
      
      case HTTP_STATUS.FORBIDDEN:
        return new ApiError(ApiErrorType.FORBIDDEN_ERROR, 'Acceso denegado', { status, data });
      
      case HTTP_STATUS.NOT_FOUND:
        return new ApiError(ApiErrorType.NOT_FOUND_ERROR, 'Recurso no encontrado', { status, data });
      
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return new ApiError(ApiErrorType.SERVER_ERROR, 'Error interno del servidor', { status, data });
      
      default:
        if (error.code === 'ECONNABORTED') {
          return new ApiError(ApiErrorType.TIMEOUT_ERROR, 'Timeout de conexión', { message });
        }
        
        if (!error.response) {
          return new ApiError(ApiErrorType.NETWORK_ERROR, 'Error de conexión de red', { message });
        }
        
        return new ApiError(ApiErrorType.CLIENT_ERROR, message, { status, data });
    }
  }

  /**
   * Generar clave de cache
   */
  private getCacheKey(method: string, url: string, params?: unknown): string {
    return `${method}:${url}:${params ? JSON.stringify(params) : ''}`;
  }

  /**
   * Verificar si hay datos válidos en cache
   */
  private getCachedData<T>(cacheKey: string): T | null {
    if (!API_CONFIG.CACHE.enabled) return null;
    
    const cached = this.cache.get(cacheKey);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > API_CONFIG.CACHE.ttl;
    if (isExpired) {
      this.cache.delete(cacheKey);
      return null;
    }
    
    return cached.data as T;
  }

  /**
   * Almacenar datos en cache
   */
  private setCachedData(cacheKey: string, data: unknown): void {
    if (!API_CONFIG.CACHE.enabled) return;
    
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Realizar petición GET con cache
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const cacheKey = this.getCacheKey('GET', url, config?.params);
    
    // Intentar obtener de cache
    const cachedData = this.getCachedData<T>(cacheKey);
    if (cachedData) {
      if (import.meta.env.DEV) {
        console.log(`💾 Cache hit: GET ${url}`);
      }
      return cachedData;
    }
    
    // Realizar petición
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    
    // Almacenar en cache
    this.setCachedData(cacheKey, response.data);
    
    return response.data;
  }

  /**
   * Realizar petición POST
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data, config);
    
    // Limpiar cache relacionado
    this.clearCacheByUrl(url);
    
    return response.data;
  }

  /**
   * Realizar petición PUT
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, data, config);
    
    // Limpiar cache relacionado
    this.clearCacheByUrl(url);
    
    return response.data;
  }

  /**
   * Realizar petición DELETE
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    
    // Limpiar cache relacionado
    this.clearCacheByUrl(url);
    
    return response.data;
  }

  /**
   * Limpiar cache por URL
   */
  private clearCacheByUrl(url: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(url)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Limpiar todo el cache
   */
  clearCache(): void {
    this.cache.clear();
    if (import.meta.env.DEV) {
      console.log('🗑️ API Cache cleared');
    }
  }

  /**
   * Obtener información del cache
   */
  getCacheInfo(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient();

// Declarar tipos para metadata en axios config
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime?: number;
    };
  }
}