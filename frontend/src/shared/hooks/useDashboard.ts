import { useAsync } from './useAsync';
import { dashboardService } from '@/shared/services';
import type { DashboardStats } from '@/shared/types/api';

/**
 * Hook para datos del dashboard
 */
export function useDashboard() {
  const {
    data: stats,
    loading: loadingStats,
    error: errorStats,
    execute: refetchStats,
  } = useAsync<DashboardStats>(
    () => dashboardService.getStats(),
    [],
    true
  );

  const {
    data: actividad,
    loading: loadingActividad,
    error: errorActividad,
    execute: refetchActividad,
  } = useAsync<{
    id: string;
    tipo: 'liquidacion_creada' | 'liquidacion_cerrada' | 'empresa_creada';
    descripcion: string;
    fecha: string;
    usuario?: string;
  }[]>(
    () => dashboardService.getActividadReciente(),
    [],
    true
  );

  const refetchAll = async () => {
    await Promise.all([refetchStats(), refetchActividad()]);
  };

  return {
    stats,
    actividad: actividad || [],
    loading: loadingStats || loadingActividad,
    error: errorStats || errorActividad,
    refetch: refetchAll,
  };
}

/**
 * Hook para alertas del dashboard
 */
export function useAlertas() {
  const {
    data: alertas,
    loading,
    error,
    execute: refetch,
  } = useAsync<{
    id: string;
    tipo: 'info' | 'warning' | 'error';
    titulo: string;
    mensaje: string;
    fecha: string;
    leida: boolean;
    accion?: string;
  }[]>(
    () => dashboardService.getAlertas(),
    [],
    true
  );

  return {
    alertas: alertas || [],
    alertasNoLeidas: alertas?.filter(a => !a.leida).length || 0,
    loading,
    error,
    refetch,
  };
}