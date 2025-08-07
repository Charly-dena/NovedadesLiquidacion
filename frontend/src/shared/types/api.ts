/**
 * Tipos base para respuestas de API
 */
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Estados de loading y error
 */
export interface AsyncState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch?: number;
}

/**
 * Parámetros de filtrado y paginación
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: unknown;
}

/**
 * Tipos específicos para liquidaciones
 */
export interface Liquidacion {
  id: string;
  numero: string;
  empresaId: string;
  empresa: Empresa;
  tipoLiquidacionId: string;
  tipoLiquidacion: TipoLiquidacion;
  periodo: string; // YYYY-MM
  fechaValorContable: string; // ISO date
  fechaLiquidacion: string; // ISO date
  fechaUltimoDeposito: string; // ISO date
  fechaPago: string; // ISO date
  estado: EstadoLiquidacion;
  observaciones?: string;
  empleados?: number;
  totalBruto?: number;
  totalNeto?: number;
  totalDescuentos?: number;
  fechaCreacion: string; // ISO date
  fechaActualizacion: string; // ISO date
}

export type EstadoLiquidacion = 'Abierta' | 'Cerrada';

/**
 * Datos para crear/editar liquidación
 */
export interface CreateLiquidacionData {
  numero: string;
  empresaId: string;
  tipoLiquidacionId: string;
  periodo: string;
  fechaValorContable: string;
  fechaLiquidacion: string;
  fechaUltimoDeposito: string;
  fechaPago: string;
  observaciones?: string;
}

export interface UpdateLiquidacionData extends Partial<CreateLiquidacionData> {
  id: string;
}

/**
 * Filtros para liquidaciones
 */
export interface LiquidacionFilters extends QueryParams {
  empresaId?: string;
  estado?: EstadoLiquidacion;
  fechaDesde?: string;
  fechaHasta?: string;
  tipoLiquidacionId?: string;
}

/**
 * Tipos para empresas
 */
export interface Empresa {
  id: string;
  nombre: string;
  razonSocial: string;
  cuit?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado: EstadoEmpresa;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export type EstadoEmpresa = 'Activa' | 'Inactiva';

export interface CreateEmpresaData {
  nombre: string;
  razonSocial: string;
  cuit?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

export interface UpdateEmpresaData extends Partial<CreateEmpresaData> {
  id: string;
}

/**
 * Tipos para tipos de liquidación
 */
export interface TipoLiquidacion {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateTipoLiquidacionData {
  nombre: string;
  codigo: string;
  descripcion?: string;
}

export interface UpdateTipoLiquidacionData extends Partial<CreateTipoLiquidacionData> {
  id: string;
}

/**
 * Tipos para estadísticas y dashboard
 */
export interface DashboardStats {
  totalLiquidaciones: number;
  liquidacionesAbiertas: number;
  liquidacionesCerradas: number;
  totalEmpresas: number;
  empresasActivas: number;
  montoTotalBruto: number;
  montoTotalNeto: number;
  ultimaActualizacion: string;
}

/**
 * Tipos para reportes
 */
export interface ReporteParams {
  tipo: 'liquidaciones' | 'empresas' | 'periodos' | 'montos';
  fechaDesde?: string;
  fechaHasta?: string;
  empresaId?: string;
  formato?: 'pdf' | 'excel' | 'csv';
}

export interface ReporteResponse {
  url: string;
  nombre: string;
  formato: string;
  fechaGeneracion: string;
  validoHasta: string;
}

/**
 * Utility types para formularios
 */
export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type FormTouchedFields<T> = {
  [K in keyof T]?: boolean;
};