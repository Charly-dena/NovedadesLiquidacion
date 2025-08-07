import { useState, useEffect, useCallback } from 'react';
import type { AsyncState } from '@/shared/types/api';
import { ApiError } from '@/shared/services';

/**
 * Hook para manejo de operaciones async con estado de loading y error
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = [],
  immediate = true
): AsyncState<T> & {
  execute: () => Promise<T | null>;
  reset: () => void;
} {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async (): Promise<T | null> => {
    setState(prevState => ({
      ...prevState,
      loading: true,
      error: null,
    }));

    try {
      const data = await asyncFunction();
      setState({
        data,
        loading: false,
        error: null,
        lastFetch: Date.now(),
      });
      return data;
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.getUserFriendlyMessage()
        : error instanceof Error 
        ? error.message 
        : 'Error inesperado';

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      // Log del error para debugging
      if (import.meta.env.DEV) {
        console.error('useAsync error:', error);
      }

      return null;
    }
  }, dependencies);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook para manejo de mutaciones (POST, PUT, DELETE)
 */
export function useAsyncMutation<T, P = void>(): {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (asyncFunction: (params: P) => Promise<T>, params: P) => Promise<T | null>;
  reset: () => void;
} {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    asyncFunction: (params: P) => Promise<T>,
    params: P
  ): Promise<T | null> => {
    setState(prevState => ({
      ...prevState,
      loading: true,
      error: null,
    }));

    try {
      const data = await asyncFunction(params);
      setState({
        data,
        loading: false,
        error: null,
        lastFetch: Date.now(),
      });
      return data;
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.getUserFriendlyMessage()
        : error instanceof Error 
        ? error.message 
        : 'Error inesperado';

      setState(prevState => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));

      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}