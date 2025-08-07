import { apiClient } from './api/client';
import { API_CONFIG } from './api/config';
import type { 
  Liquidacion, 
  CreateLiquidacionData, 
  UpdateLiquidacionData, 
  LiquidacionFilters,
  ApiResponse,
  PaginatedResponse 
} from '@/shared/types/api';

/**
 * Servicio para manejo de liquidaciones
 * Conecta con endpoints /idx/liq de ApiIdeafix
 */
class LiquidacionesService {
  private readonly endpoint = API_CONFIG.ENDPOINTS.LIQUIDACIONES;

  /**
   * Obtener todas las liquidaciones con filtros
   */
  async getAll(filters?: LiquidacionFilters): Promise<PaginatedResponse<Liquidacion>> {
    const params = this.buildQueryParams(filters);
    return apiClient.get<PaginatedResponse<Liquidacion>>(`${this.endpoint}`, { params });
  }

  /**
   * Obtener liquidación por ID
   */
  async getById(id: string): Promise<Liquidacion> {
    return apiClient.get<Liquidacion>(`${this.endpoint}/${id}`);
  }

  /**
   * Crear nueva liquidación
   */
  async create(data: CreateLiquidacionData): Promise<Liquidacion> {
    return apiClient.post<Liquidacion>(this.endpoint, data);
  }

  /**
   * Actualizar liquidación existente
   */
  async update(data: UpdateLiquidacionData): Promise<Liquidacion> {
    const { id, ...updateData } = data;
    return apiClient.put<Liquidacion>(`${this.endpoint}/${id}`, updateData);
  }

  /**
   * Eliminar liquidación (solo si está en estado Abierta)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Cerrar liquidación (cambiar estado de Abierta a Cerrada)
   */
  async cerrar(id: string): Promise<Liquidacion> {
    return apiClient.put<Liquidacion>(`${this.endpoint}/${id}/cerrar`);
  }

  /**
   * Duplicar liquidación (crear copia con nuevo número)
   */
  async duplicar(id: string, nuevoNumero: string): Promise<Liquidacion> {
    return apiClient.post<Liquidacion>(`${this.endpoint}/${id}/duplicar`, { numero: nuevoNumero });
  }

  /**
   * Validar datos de liquidación
   */
  async validar(data: CreateLiquidacionData | UpdateLiquidacionData): Promise<ApiResponse<{ valida: boolean; errores: string[] }>> {
    return apiClient.post<ApiResponse<{ valida: boolean; errores: string[] }>>(`${this.endpoint}/validar`, data);
  }

  /**
   * Obtener estadísticas de liquidaciones por empresa
   */
  async getEstadisticasPorEmpresa(empresaId?: string): Promise<{
    empresa: string;
    totalLiquidaciones: number;
    abiertas: number;
    cerradas: number;
    montoTotal: number;
  }[]> {
    const params = empresaId ? { empresaId } : undefined;
    return apiClient.get<{
      empresa: string;
      totalLiquidaciones: number;
      abiertas: number;
      cerradas: number;
      montoTotal: number;
    }[]>(`${this.endpoint}/estadisticas/empresa`, { params });
  }

  /**
   * Obtener liquidaciones recientes
   */
  async getRecientes(limite: number = 5): Promise<Liquidacion[]> {
    return apiClient.get<Liquidacion[]>(`${this.endpoint}/recientes`, { 
      params: { limite } 
    });
  }

  /**
   * Generar reporte de liquidación
   */
  async generarReporte(id: string, formato: 'pdf' | 'excel' = 'pdf'): Promise<{ url: string; nombre: string }> {
    return apiClient.post<{ url: string; nombre: string }>(`${this.endpoint}/${id}/reporte`, { formato });
  }

  /**
   * Verificar si número de liquidación ya existe para una empresa
   */
  async verificarNumeroUnico(numero: string, empresaId: string, idExcluir?: string): Promise<{ disponible: boolean }> {
    const params: Record<string, string> = { numero, empresaId };
    if (idExcluir) {
      params.exclude = idExcluir;
    }
    
    return apiClient.get<{ disponible: boolean }>(`${this.endpoint}/verificar-numero`, { params });
  }

  /**
   * Construir parámetros de consulta para filtros
   */
  private buildQueryParams(filters?: LiquidacionFilters): Record<string, unknown> {
    if (!filters) return {};
    
    const params: Record<string, unknown> = {};
    
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.search) params.search = filters.search;
    if (filters.sort) params.sort = filters.sort;
    if (filters.order) params.order = filters.order;
    if (filters.empresaId) params.empresaId = filters.empresaId;
    if (filters.estado) params.estado = filters.estado;
    if (filters.fechaDesde) params.fechaDesde = filters.fechaDesde;
    if (filters.fechaHasta) params.fechaHasta = filters.fechaHasta;
    if (filters.tipoLiquidacionId) params.tipoLiquidacionId = filters.tipoLiquidacionId;
    
    return params;
  }
}

// Instancia singleton del servicio
export const liquidacionesService = new LiquidacionesService();