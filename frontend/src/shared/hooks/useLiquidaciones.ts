import { useAsync, useAsyncMutation } from './useAsync';
import { liquidacionesService } from '@/shared/services';
import type { 
  Liquidacion, 
  CreateLiquidacionData, 
  UpdateLiquidacionData, 
  LiquidacionFilters,
  PaginatedResponse 
} from '@/shared/types/api';
import { useMemo } from 'react';

/**
 * Hook para manejo de liquidaciones
 */
export function useLiquidaciones(filters?: LiquidacionFilters) {
  const {
    data: liquidaciones,
    loading,
    error,
    execute: refetch,
  } = useAsync<PaginatedResponse<Liquidacion>>(
    () => liquidacionesService.getAll(filters),
    [filters],
    true
  );

  return {
    liquidaciones: liquidaciones?.data || [],
    pagination: liquidaciones?.pagination,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para obtener liquidación individual
 */
export function useLiquidacion(id: string | undefined) {
  const {
    data: liquidacion,
    loading,
    error,
    execute: refetch,
  } = useAsync<Liquidacion>(
    () => liquidacionesService.getById(id!),
    [id],
    !!id
  );

  return {
    liquidacion,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para crear liquidación
 */
export function useCreateLiquidacion() {
  const {
    data: liquidacion,
    loading,
    error,
    execute,
    reset,
  } = useAsyncMutation<Liquidacion, CreateLiquidacionData>();

  const createLiquidacion = async (data: CreateLiquidacionData) => {
    return execute(liquidacionesService.create.bind(liquidacionesService), data);
  };

  return {
    liquidacion,
    loading,
    error,
    createLiquidacion,
    reset,
  };
}

/**
 * Hook para actualizar liquidación
 */
export function useUpdateLiquidacion() {
  const {
    data: liquidacion,
    loading,
    error,
    execute,
    reset,
  } = useAsyncMutation<Liquidacion, UpdateLiquidacionData>();

  const updateLiquidacion = async (data: UpdateLiquidacionData) => {
    return execute(liquidacionesService.update.bind(liquidacionesService), data);
  };

  return {
    liquidacion,
    loading,
    error,
    updateLiquidacion,
    reset,
  };
}

/**
 * Hook para cerrar liquidación
 */
export function useCerrarLiquidacion() {
  const {
    data: liquidacion,
    loading,
    error,
    execute,
    reset,
  } = useAsyncMutation<Liquidacion, string>();

  const cerrarLiquidacion = async (id: string) => {
    return execute(liquidacionesService.cerrar.bind(liquidacionesService), id);
  };

  return {
    liquidacion,
    loading,
    error,
    cerrarLiquidacion,
    reset,
  };
}

/**
 * Hook para eliminar liquidación
 */
export function useDeleteLiquidacion() {
  const {
    loading,
    error,
    execute,
    reset,
  } = useAsyncMutation<void, string>();

  const deleteLiquidacion = async (id: string) => {
    return execute(liquidacionesService.delete.bind(liquidacionesService), id);
  };

  return {
    loading,
    error,
    deleteLiquidacion,
    reset,
  };
}

/**
 * Hook para obtener liquidaciones recientes
 */
export function useLiquidacionesRecientes(limite = 5) {
  const {
    data: liquidaciones,
    loading,
    error,
    execute: refetch,
  } = useAsync<Liquidacion[]>(
    () => liquidacionesService.getRecientes(limite),
    [limite],
    true
  );

  return {
    liquidaciones: liquidaciones || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para obtener liquidación por número usando el nuevo endpoint /idx/liq/:nroliq
 */
export function useLiquidacionByNroliq(nroliq: string | number | undefined) {
  const {
    data: liquidacion,
    loading,
    error,
    execute: refetch,
  } = useAsync<Record<string, unknown> | null>(
    () => {
      console.log('🎯 [useLiquidacionByNroliq] Buscando liquidación:', nroliq);
      return liquidacionesService.getByNroliq(nroliq!);
    },
    [nroliq],
    !!nroliq
  );

  return {
    liquidacion,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook híbrido para búsqueda inteligente de liquidaciones
 * - Si se especifica un número, busca directamente esa liquidación
 * - Si no, usa filtros normales con paginación eficiente
 */
export function useLiquidacionesHybrid(numeroEspecifico?: string, filters?: LiquidacionFilters) {
  // Si hay número específico, buscar solo esa liquidación usando el nuevo endpoint
  const {
    data: liquidacionEspecifica,
    loading: loadingEspecifica,
    error: errorEspecifica,
  } = useAsync<Record<string, unknown> | null>(
    () => {
      console.log('🔍 [useLiquidacionesHybrid] Buscando liquidación por número:', numeroEspecifico);
      // Priorizar el nuevo endpoint getByNroliq, con fallback a getByNroFast
      return liquidacionesService.getByNroliq(numeroEspecifico!).then(result => {
        if (result) {
          console.log('✅ [useLiquidacionesHybrid] Encontrada con getByNroliq:', result);
          return result;
        }
        console.log('🔄 [useLiquidacionesHybrid] getByNroliq no encontró resultado, intentando getByNroFast...');
        return liquidacionesService.getByNroFast(numeroEspecifico!);
      });
    },
    [numeroEspecifico],
    !!numeroEspecifico?.trim()
  );

  // Si no hay número específico, usar búsqueda normal
  const {
    data: liquidacionesNormales,
    loading: loadingNormales,
    error: errorNormales,
  } = useAsync<PaginatedResponse<Liquidacion>>(
    () => liquidacionesService.getAll(filters),
    [filters],
    !numeroEspecifico?.trim() && !!filters
  );

  return useMemo(() => {
    if (numeroEspecifico?.trim()) {
      // Modo búsqueda específica
      return {
        liquidaciones: liquidacionEspecifica ? [liquidacionEspecifica as any] : [],
        pagination: {
          page: 1,
          limit: 1,
          total: liquidacionEspecifica ? 1 : 0,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
        loading: loadingEspecifica,
        error: errorEspecifica,
        mode: 'specific' as const,
      };
    } else {
      // Modo normal con paginación
      return {
        liquidaciones: liquidacionesNormales?.data || [],
        pagination: liquidacionesNormales?.pagination,
        loading: loadingNormales,
        error: errorNormales,
        mode: 'normal' as const,
      };
    }
  }, [
    numeroEspecifico,
    liquidacionEspecifica,
    liquidacionesNormales,
    loadingEspecifica,
    loadingNormales,
    errorEspecifica,
    errorNormales,
  ]);
}