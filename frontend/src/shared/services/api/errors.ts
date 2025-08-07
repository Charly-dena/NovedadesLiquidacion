import { ApiErrorType } from './config';

/**
 * Clase personalizada para errores de API
 */
export class ApiError extends Error {
  public readonly type: ApiErrorType;
  public readonly details?: unknown;
  public readonly timestamp: number;

  constructor(type: ApiErrorType, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.details = details;
    this.timestamp = Date.now();
    
    // Mantener stack trace para debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Verificar si es un error de red
   */
  isNetworkError(): boolean {
    return this.type === ApiErrorType.NETWORK_ERROR || this.type === ApiErrorType.TIMEOUT_ERROR;
  }

  /**
   * Verificar si es un error del servidor
   */
  isServerError(): boolean {
    return this.type === ApiErrorType.SERVER_ERROR;
  }

  /**
   * Verificar si es un error del cliente
   */
  isClientError(): boolean {
    return this.type === ApiErrorType.CLIENT_ERROR || this.type === ApiErrorType.VALIDATION_ERROR;
  }

  /**
   * Verificar si es un error de autorización
   */
  isAuthError(): boolean {
    return this.type === ApiErrorType.UNAUTHORIZED_ERROR || this.type === ApiErrorType.FORBIDDEN_ERROR;
  }

  /**
   * Obtener mensaje amigable para el usuario
   */
  getUserFriendlyMessage(): string {
    switch (this.type) {
      case ApiErrorType.NETWORK_ERROR:
        return 'Error de conexión. Verifica tu conexión a internet.';
      
      case ApiErrorType.TIMEOUT_ERROR:
        return 'La operación tardó demasiado tiempo. Intenta nuevamente.';
      
      case ApiErrorType.SERVER_ERROR:
        return 'Error interno del servidor. Intenta más tarde.';
      
      case ApiErrorType.UNAUTHORIZED_ERROR:
        return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      
      case ApiErrorType.FORBIDDEN_ERROR:
        return 'No tienes permisos para realizar esta acción.';
      
      case ApiErrorType.NOT_FOUND_ERROR:
        return 'El recurso solicitado no fue encontrado.';
      
      case ApiErrorType.VALIDATION_ERROR:
        return 'Los datos enviados no son válidos. Verifica la información.';
      
      default:
        return 'Ha ocurrido un error inesperado. Intenta nuevamente.';
    }
  }

  /**
   * Convertir a objeto JSON para logging
   */
  toJSON(): object {
    return {
      name: this.name,
      type: this.type,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}