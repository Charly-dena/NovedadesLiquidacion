import { apiClient } from './api/client';
import { API_CONFIG } from './api/config';
import type { 
  TipoLiquidacion, 
  CreateTipoLiquidacionData, 
  UpdateTipoLiquidacionData,
  QueryParams,
  PaginatedResponse 
} from '@/shared/types/api';

/**
 * Servicio para manejo de tipos de liquidación
 * Conecta con endpoints /idx/tliq de ApiIdeafix
 */
class TiposLiquidacionService {
  private readonly endpoint = API_CONFIG.ENDPOINTS.TIPOS_LIQUIDACION;

  /**
   * Obtener todos los tipos de liquidación
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<TipoLiquidacion>> {
    return apiClient.get<PaginatedResponse<TipoLiquidacion>>(this.endpoint, { params });
  }

  /**
   * Obtener solo tipos de liquidación activos (para combos/selects)
   */
  async getActivos(): Promise<TipoLiquidacion[]> {
    return apiClient.get<TipoLiquidacion[]>(`${this.endpoint}/activos`);
  }

  /**
   * Obtener tipo de liquidación por ID
   */
  async getById(id: string): Promise<TipoLiquidacion> {
    return apiClient.get<TipoLiquidacion>(`${this.endpoint}/${id}`);
  }

  /**
   * Crear nuevo tipo de liquidación
   */
  async create(data: CreateTipoLiquidacionData): Promise<TipoLiquidacion> {
    return apiClient.post<TipoLiquidacion>(this.endpoint, data);
  }

  /**
   * Actualizar tipo de liquidación existente
   */
  async update(data: UpdateTipoLiquidacionData): Promise<TipoLiquidacion> {
    const { id, ...updateData } = data;
    return apiClient.put<TipoLiquidacion>(`${this.endpoint}/${id}`, updateData);
  }

  /**
   * Eliminar tipo de liquidación (solo si no tiene liquidaciones asociadas)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Activar/Desactivar tipo de liquidación
   */
  async toggleActivo(id: string): Promise<TipoLiquidacion> {
    return apiClient.put<TipoLiquidacion>(`${this.endpoint}/${id}/toggle-activo`);
  }

  /**
   * Verificar si código ya existe
   */
  async verificarCodigoUnico(codigo: string, idExcluir?: string): Promise<{ disponible: boolean }> {
    const params: Record<string, string> = { codigo };
    if (idExcluir) {
      params.exclude = idExcluir;
    }
    
    return apiClient.get<{ disponible: boolean }>(`${this.endpoint}/verificar-codigo`, { params });
  }

  /**
   * Obtener estadísticas de uso por tipo
   */
  async getEstadisticasUso(): Promise<{
    tipoId: string;
    nombre: string;
    totalLiquidaciones: number;
    liquidacionesAbiertas: number;
    liquidacionesCerradas: number;
    ultimaUso: string | null;
  }[]> {
    return apiClient.get<{
      tipoId: string;
      nombre: string;
      totalLiquidaciones: number;
      liquidacionesAbiertas: number;
      liquidacionesCerradas: number;
      ultimaUso: string | null;
    }[]>(`${this.endpoint}/estadisticas/uso`);
  }

  /**
   * Buscar tipos por texto
   */
  async buscar(termino: string): Promise<TipoLiquidacion[]> {
    return apiClient.get<TipoLiquidacion[]>(`${this.endpoint}/buscar`, { 
      params: { q: termino } 
    });
  }
}

// Instancia singleton del servicio
export const tiposLiquidacionService = new TiposLiquidacionService();