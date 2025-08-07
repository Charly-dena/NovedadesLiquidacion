import { apiClient } from './api/client';
import { API_CONFIG } from './api/config';
import type { 
  Empresa, 
  CreateEmpresaData, 
  UpdateEmpresaData,
  QueryParams,
  PaginatedResponse 
} from '@/shared/types/api';

/**
 * Servicio para manejo de empresas
 * Conecta con endpoints /idx/emps de ApiIdeafix
 */
class EmpresasService {
  private readonly endpoint = API_CONFIG.ENDPOINTS.EMPRESAS;

  /**
   * Obtener todas las empresas
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Empresa>> {
    return apiClient.get<PaginatedResponse<Empresa>>(this.endpoint, { params });
  }

  /**
   * Obtener solo empresas activas (para combos/selects)
   */
  async getActivas(): Promise<Empresa[]> {
    return apiClient.get<Empresa[]>(`${this.endpoint}/activas`);
  }

  /**
   * Obtener empresa por ID
   */
  async getById(id: string): Promise<Empresa> {
    return apiClient.get<Empresa>(`${this.endpoint}/${id}`);
  }

  /**
   * Crear nueva empresa
   */
  async create(data: CreateEmpresaData): Promise<Empresa> {
    return apiClient.post<Empresa>(this.endpoint, data);
  }

  /**
   * Actualizar empresa existente
   */
  async update(data: UpdateEmpresaData): Promise<Empresa> {
    const { id, ...updateData } = data;
    return apiClient.put<Empresa>(`${this.endpoint}/${id}`, updateData);
  }

  /**
   * Eliminar empresa (solo si no tiene liquidaciones asociadas)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Activar/Desactivar empresa
   */
  async toggleEstado(id: string): Promise<Empresa> {
    return apiClient.put<Empresa>(`${this.endpoint}/${id}/toggle-estado`);
  }

  /**
   * Obtener estadísticas de empresa
   */
  async getEstadisticas(id: string): Promise<{
    totalLiquidaciones: number;
    liquidacionesAbiertas: number;
    liquidacionesCerradas: number;
    totalEmpleados: number;
    montoTotalBruto: number;
    montoTotalNeto: number;
    ultimaLiquidacion: string | null;
  }> {
    return apiClient.get<{
      totalLiquidaciones: number;
      liquidacionesAbiertas: number;
      liquidacionesCerradas: number;
      totalEmpleados: number;
      montoTotalBruto: number;
      montoTotalNeto: number;
      ultimaLiquidacion: string | null;
    }>(`${this.endpoint}/${id}/estadisticas`);
  }

  /**
   * Verificar si CUIT ya existe
   */
  async verificarCuitUnico(cuit: string, idExcluir?: string): Promise<{ disponible: boolean }> {
    const params: Record<string, string> = { cuit };
    if (idExcluir) {
      params.exclude = idExcluir;
    }
    
    return apiClient.get<{ disponible: boolean }>(`${this.endpoint}/verificar-cuit`, { params });
  }

  /**
   * Buscar empresas por texto
   */
  async buscar(termino: string): Promise<Empresa[]> {
    return apiClient.get<Empresa[]>(`${this.endpoint}/buscar`, { 
      params: { q: termino } 
    });
  }

  /**
   * Obtener resumen para dashboard
   */
  async getResumen(): Promise<{
    totalEmpresas: number;
    empresasActivas: number;
    empresasInactivas: number;
    empresasConLiquidaciones: number;
  }> {
    return apiClient.get<{
      totalEmpresas: number;
      empresasActivas: number;
      empresasInactivas: number;
      empresasConLiquidaciones: number;
    }>(`${this.endpoint}/resumen`);
  }
}

// Instancia singleton del servicio
export const empresasService = new EmpresasService();