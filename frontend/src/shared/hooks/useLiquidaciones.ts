import { useAsync, useAsyncMutation } from './useAsync';
import { liquidacionesService } from '@/shared/services';
import type { 
  Liquidacion, 
  CreateLiquidacionData, 
  UpdateLiquidacionData, 
  LiquidacionFilters,
  PaginatedResponse 
} from '@/shared/types/api';

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