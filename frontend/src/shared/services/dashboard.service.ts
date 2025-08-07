import { apiClient } from './api/client';
import { API_CONFIG } from './api/config';
import type { DashboardStats } from '@/shared/types/api';

/**
 * Servicio para dashboard y estadísticas generales
 */
class DashboardService {
  /**
   * Obtener estadísticas generales para el dashboard
   */
  async getStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  }

  /**
   * Obtener actividad reciente
   */
  async getActividadReciente(limite: number = 10): Promise<{
    id: string;
    tipo: 'liquidacion_creada' | 'liquidacion_cerrada' | 'empresa_creada';
    descripcion: string;
    fecha: string;
    usuario?: string;
  }[]> {
    return apiClient.get<{
      id: string;
      tipo: 'liquidacion_creada' | 'liquidacion_cerrada' | 'empresa_creada';
      descripcion: string;
      fecha: string;
      usuario?: string;
    }[]>('/dashboard/actividad', { params: { limite } });
  }

  /**
   * Obtener gráfico de liquidaciones por mes
   */
  async getGraficoLiquidaciones(meses: number = 12): Promise<{
    mes: string;
    abiertas: number;
    cerradas: number;
    total: number;
  }[]> {
    return apiClient.get<{
      mes: string;
      abiertas: number;
      cerradas: number;
      total: number;
    }[]>('/dashboard/grafico-liquidaciones', { params: { meses } });
  }

  /**
   * Obtener distribución por empresa
   */
  async getDistribucionEmpresas(): Promise<{
    empresaId: string;
    empresa: string;
    liquidaciones: number;
    porcentaje: number;
  }[]> {
    return apiClient.get<{
      empresaId: string;
      empresa: string;
      liquidaciones: number;
      porcentaje: number;
    }[]>('/dashboard/distribucion-empresas');
  }

  /**
   * Obtener alertas y notificaciones
   */
  async getAlertas(): Promise<{
    id: string;
    tipo: 'info' | 'warning' | 'error';
    titulo: string;
    mensaje: string;
    fecha: string;
    leida: boolean;
    accion?: string;
  }[]> {
    return apiClient.get<{
      id: string;
      tipo: 'info' | 'warning' | 'error';
      titulo: string;
      mensaje: string;
      fecha: string;
      leida: boolean;
      accion?: string;
    }[]>('/dashboard/alertas');
  }

  /**
   * Marcar alerta como leída
   */
  async marcarAlertaLeida(alertaId: string): Promise<void> {
    await apiClient.put(`/dashboard/alertas/${alertaId}/leer`);
  }

  /**
   * Obtener resumen de performance del sistema
   */
  async getPerformance(): Promise<{
    tiempoRespuestaPromedio: number;
    disponibilidad: number;
    errores24h: number;
    usuariosActivos: number;
    operacionesHoy: number;
  }> {
    return apiClient.get<{
      tiempoRespuestaPromedio: number;
      disponibilidad: number;
      errores24h: number;
      usuariosActivos: number;
      operacionesHoy: number;
    }>('/dashboard/performance');
  }
}

// Instancia singleton del servicio
export const dashboardService = new DashboardService();