import { useAsync, useAsyncMutation } from './useAsync';
import { empresasService } from '@/shared/services';
import type { 
  Empresa, 
  CreateEmpresaData, 
  UpdateEmpresaData, 
  QueryParams,
  PaginatedResponse 
} from '@/shared/types/api';

/**
 * Hook para obtener todas las empresas
 */
export function useEmpresas(params?: QueryParams) {
  const {
    data: empresas,
    loading,
    error,
    execute: refetch,
  } = useAsync<PaginatedResponse<Empresa>>(
    () => empresasService.getAll(params),
    [params],
    true
  );

  return {
    empresas: empresas?.data || [],
    pagination: empresas?.pagination,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para obtener empresas activas (para selects)
 */
export function useEmpresasActivas() {
  const {
    data: empresas,
    loading,
    error,
    execute: refetch,
  } = useAsync<Empresa[]>(
    () => empresasService.getActivas(),
    [],
    true
  );

  return {
    empresas: empresas || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para obtener empresa individual
 */
export function useEmpresa(id: string | undefined) {
  const {
    data: empresa,
    loading,
    error,
    execute: refetch,
  } = useAsync<Empresa>(
    () => empresasService.getById(id!),
    [id],
    !!id
  );

  return {
    empresa,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para crear empresa
 */
export function useCreateEmpresa() {
  const {
    data: empresa,
    loading,
    error,
    execute,
    reset,
  } = useAsyncMutation<Empresa, CreateEmpresaData>();

  const createEmpresa = async (data: CreateEmpresaData) => {
    return execute(empresasService.create.bind(empresasService), data);
  };

  return {
    empresa,
    loading,
    error,
    createEmpresa,
    reset,
  };
}

/**
 * Hook para actualizar empresa
 */
export function useUpdateEmpresa() {
  const {
    data: empresa,
    loading,
    error,
    execute,
    reset,
  } = useAsyncMutation<Empresa, UpdateEmpresaData>();

  const updateEmpresa = async (data: UpdateEmpresaData) => {
    return execute(empresasService.update.bind(empresasService), data);
  };

  return {
    empresa,
    loading,
    error,
    updateEmpresa,
    reset,
  };
}