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
    const res = await apiClient.get<unknown>(`${this.endpoint}`, { params });
    if (import.meta.env.DEV) {
      // Logging no intrusivo para entender el shape real del endpoint
      // eslint-disable-next-line no-console
      console.log('🔎 [/idx/liq] response preview:',
        Array.isArray(res)
          ? { kind: 'array', length: res.length, sample: (res as unknown[])[0] }
          : { kind: 'object', keys: Object.keys((res as Record<string, unknown>) || {}), sample: res }
      );
    }

    // Normalizar distintas formas de respuesta posibles
    // 1) Array directo
    if (Array.isArray(res)) {
      const data = res as Liquidacion[];
      return {
        data,
        pagination: {
          page: Number(params.page) || 1,
          limit: Number(params.limit) || data.length,
          total: data.length,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }

    const obj = res as Record<string, unknown>;

    // 1.b) Objeto plano con claves row1, row2, ... -> convertir a array y paginar localmente
    if (obj && typeof obj === 'object') {
      const keys = Object.keys(obj);
      const rowKeys = keys.filter((k) => /^row\d+$/i.test(k));
      if (rowKeys.length > 0) {
        // Ordenar por índice numérico
        rowKeys.sort((a, b) => parseInt(a.replace(/\D/g, ''), 10) - parseInt(b.replace(/\D/g, ''), 10));
        const allItems = rowKeys.map((k) => (obj as any)[k]) as Liquidacion[];
        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || allItems.length;
        const total = allItems.length;
        const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
        const start = Math.max(0, (page - 1) * limit);
        const end = Math.min(total, start + limit);
        const pageItems = allItems.slice(start, end);
        return {
          data: pageItems,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1,
          },
        };
      }
    }

    // 2) { data: [], pagination: {} }
    if (obj && Array.isArray((obj as any).data) && (obj as any).pagination && typeof (obj as any).pagination === 'object') {
      return obj as unknown as PaginatedResponse<Liquidacion>;
    }

    // 3) { items: [], total, page, limit }
    if (obj && Array.isArray((obj as any).items)) {
      const items = (obj as any).items as Liquidacion[];
      const total = Number((obj as any).total) || items.length;
      const page = Number((obj as any).page) || Number(params.page) || 1;
      const limit = Number((obj as any).limit) || Number(params.limit) || items.length;
      const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
      return {
        data: items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      };
    }

    // 4) { results: [], count }
    if (obj && Array.isArray((obj as any).results)) {
      const results = (obj as any).results as Liquidacion[];
      const total = Number((obj as any).count) || results.length;
      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || results.length;
      const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
      return {
        data: results,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      };
    }

    // 5) Claves comunes alternativas
    const possibleKeys = ['liquidaciones', 'rows', 'list'];
    for (const key of possibleKeys) {
      const maybe = (obj as any)[key];
      if (Array.isArray(maybe)) {
        const data = maybe as Liquidacion[];
        return {
          data,
          pagination: {
            page: Number(params.page) || 1,
            limit: Number(params.limit) || data.length,
            total: Number((obj as any).total) || data.length,
            totalPages: Math.max(1, Math.ceil((Number((obj as any).total) || data.length) / Math.max(1, Number(params.limit) || data.length))),
            hasNext: false,
            hasPrevious: false,
          },
        };
      }
    }

    // 6) { data: {} } con objeto paginado anidado
    if (obj && obj.data && typeof obj.data === 'object') {
      const inner = obj.data as any;
      if (Array.isArray(inner.items) || Array.isArray(inner.results) || Array.isArray(inner.data)) {
        const items = (inner.items || inner.results || inner.data) as Liquidacion[];
        const total = Number(inner.total) || items.length;
        const page = Number(inner.page) || Number(params.page) || 1;
        const limit = Number(inner.limit) || Number(params.limit) || items.length;
        const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
        return {
          data: items,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1,
          },
        };
      }
    }

    // Fallback: intento de parseo mínimo
    return {
      data: [],
      pagination: {
        page: Number(params.page) || 1,
        limit: Number(params.limit) || 0,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
    };
  }

  /**
   * Obtener liquidación por ID
   */
  async getById(id: string): Promise<Liquidacion> {
    const res = await apiClient.get<unknown>(`${this.endpoint}/${id}`);
    if (res && typeof res === 'object' && (res as any).data) {
      return (res as any).data as Liquidacion;
    }
    return res as Liquidacion;
  }

  /**
   * Obtener una liquidación por número (nroliq) cuando el backend no expone /:id
   * Busca dentro de una respuesta tipo array o tipo { row1, row2, ... }
   * Incluye enriquecimiento de datos.
   */
  async getByNro(nroliq: string | number): Promise<Record<string, unknown> | null> {
    console.log('🔍 [getByNro] Buscando liquidación:', nroliq, 'en listado completo');
    
    const enrichData = (data: Record<string, unknown>): Record<string, unknown> => {
      const enriched = { ...data };
      const fcieliq = data.fcieliq;
      enriched.estado = fcieliq && String(fcieliq).trim().length > 0 ? 'Cerrada' : 'Abierta';
      enriched.isEditable = enriched.estado === 'Abierta';
      return enriched;
    };

    const res = await apiClient.get<unknown>(`${this.endpoint}`);
    console.log('📡 [getByNro] Respuesta del endpoint:', {
      isArray: Array.isArray(res),
      type: typeof res,
      keys: res && typeof res === 'object' ? Object.keys(res) : []
    });
    
    // Array directo
    if (Array.isArray(res)) {
      console.log('📋 [getByNro] Buscando en array de', res.length, 'elementos');
      const found = (res as any[]).find((r) => {
        const itemNroliq = String((r as any)?.nroliq ?? (r as any)?.liqnro ?? (r as any)?.nro ?? (r as any)?.num);
        const match = itemNroliq === String(nroliq);
        if (match) {
          console.log('✅ [getByNro] Encontrado elemento:', r);
        }
        return match;
      });
      return found ? enrichData(found as Record<string, unknown>) : null;
    }
    const obj = res as Record<string, unknown>;
    if (obj && typeof obj === 'object') {
      // { row1: {...}, row2: {...} }
      const keys = Object.keys(obj).filter((k) => /^row\d+$/i.test(k));
      console.log('🗂️ [getByNro] Claves row encontradas:', keys);
      if (keys.length) {
        for (const k of keys) {
          const r = (obj as any)[k];
          const itemNroliq = String(r?.nroliq ?? r?.liqnro ?? r?.nro ?? r?.num);
          const match = itemNroliq === String(nroliq);
          console.log('🔍 [getByNro] Revisando', k, ':', { itemNroliq, buscando: String(nroliq), match });
          if (match) {
            console.log('✅ [getByNro] Encontrado en', k, ':', r);
            return enrichData(r as Record<string, unknown>);
          }
        }
        console.log('❌ [getByNro] No encontrado en ninguna clave row');
        return null;
      }
      // { data: [...] } u otros envoltorios
      const list = Array.isArray((obj as any).data)
        ? (obj as any).data
        : Array.isArray((obj as any).items)
        ? (obj as any).items
        : [];
      if (Array.isArray(list)) {
        const found = (list as any[]).find((r) => String((r as any)?.nroliq ?? (r as any)?.liqnro ?? (r as any)?.nro ?? (r as any)?.num) === String(nroliq));
        return found ? enrichData(found as Record<string, unknown>) : null;
      }
    }
    return null;
  }

  /**
   * Intento rápido de obtener detalle por número usando variantes de endpoint/params
   * para evitar traer toda la lista. Incluye enriquecimiento de datos.
   */
  async getByNroFast(nro: string | number): Promise<Record<string, unknown> | null> {
    const tryPick = (res: unknown): Record<string, unknown> | null => {
      if (!res) return null;
      
      // Si es array, buscar el elemento específico, no tomar el primero
      if (Array.isArray(res)) {
        console.log('🔍 [tryPick] Buscando en array de', res.length, 'elementos para nro:', nro);
        const found = (res as any[]).find((item: any) => {
          const itemNroliq = String(item?.nroliq ?? item?.liqnro ?? item?.nro ?? item?.num);
          const match = itemNroliq === String(nro);
          if (match) {
            console.log('✅ [tryPick] Encontrado en array:', { itemNroliq, item });
          }
          return match;
        });
        return found || null;
      }
      
      const obj = res as Record<string, unknown>;
      const rowKeys = Object.keys(obj || {}).filter((k) => /^row\d+$/i.test(k));
      if (rowKeys.length) {
        console.log('🔍 [tryPick] Buscando en rows para nro:', nro);
        // Buscar en todas las rows, no solo la primera
        for (const key of rowKeys) {
          const rowItem = (obj as any)[key];
          const itemNroliq = String(rowItem?.nroliq ?? rowItem?.liqnro ?? rowItem?.nro ?? rowItem?.num);
          if (itemNroliq === String(nro)) {
            console.log('✅ [tryPick] Encontrado en row', key, ':', { itemNroliq, rowItem });
            return rowItem as Record<string, unknown>;
          }
        }
        console.log('❌ [tryPick] No encontrado en ninguna row');
        return null;
      }
      
      if ((obj as any).data && typeof (obj as any).data === 'object') {
        const inner = (obj as any).data;
        if (Array.isArray(inner)) {
          // Buscar en el array interno
          const found = (inner as any[]).find((item: any) => {
            const itemNroliq = String(item?.nroliq ?? item?.liqnro ?? item?.nro ?? item?.num);
            return itemNroliq === String(nro);
          });
          return found || null;
        }
        const innerRows = Object.keys(inner).filter((k) => /^row\d+$/i.test(k));
        if (innerRows.length) {
          // Buscar en las rows internas
          for (const key of innerRows) {
            const rowItem = inner[key];
            const itemNroliq = String(rowItem?.nroliq ?? rowItem?.liqnro ?? rowItem?.nro ?? rowItem?.num);
            if (itemNroliq === String(nro)) {
              return rowItem as Record<string, unknown>;
            }
          }
          return null;
        }
      }
      
      // Si es un objeto simple, verificar que coincida con el nro buscado
      const objNroliq = String((obj as any)?.nroliq ?? (obj as any)?.liqnro ?? (obj as any)?.nro ?? (obj as any)?.num);
      if (objNroliq === String(nro)) {
        return obj;
      }
      
      return null;
    };

    const enrichData = (data: Record<string, unknown>): Record<string, unknown> => {
      // Enriquecer datos con información calculada
      const enriched = { ...data };
      
      // Calcular estado basado en fcieliq
      const fcieliq = data.fcieliq;
      enriched.estado = fcieliq && String(fcieliq).trim().length > 0 ? 'Cerrada' : 'Abierta';
      
      // Formatear fechas si están disponibles
      const dateFields = ['fvalor', 'fliq', 'fdep', 'fecpag', 'fcieliq'];
      dateFields.forEach(field => {
        if (data[field] && typeof data[field] === 'string') {
          try {
            const date = new Date(data[field] as string);
            if (!isNaN(date.getTime())) {
              enriched[`${field}_formatted`] = date.toLocaleDateString('es-AR');
            }
          } catch {}
        }
      });
      
      // Información adicional
      enriched.isEditable = enriched.estado === 'Abierta';
      enriched.diasVencimiento = enriched.fecpag ? this.calcularDiasVencimiento(enriched.fecpag as string) : null;
      
      return enriched;
    };

    // 1) /idx/liq/:nro
    try {
      console.log('🎯 [getByNroFast] Probando endpoint:', `${this.endpoint}/${nro}`);
      const res = await apiClient.get<unknown>(`${this.endpoint}/${nro}`);
      const picked = tryPick(res);
      if (picked) {
        console.log('✅ [getByNroFast] Encontrado con endpoint directo:', picked);
        return enrichData(picked);
      }
    } catch (e) {
      console.log('❌ [getByNroFast] Falló endpoint directo:', e);
    }

    // 2) /idx/liq?nroliq=...  3) /idx/liq?nro=...  4) /idx/liq?num=...
    const paramNames = ['nroliq', 'nro', 'num'];
    for (const p of paramNames) {
      try {
        const endpoint = `${this.endpoint}?${p}=${nro}`;
        console.log('🎯 [getByNroFast] Probando parámetro:', endpoint);
        const res = await apiClient.get<unknown>(`${this.endpoint}`, { params: { [p]: nro } });
        const picked = tryPick(res);
        if (picked) {
          console.log('✅ [getByNroFast] Encontrado con parámetro:', { param: p, data: picked });
          return enrichData(picked);
        }
      } catch (e) {
        console.log('❌ [getByNroFast] Falló parámetro:', p, e);
      }
    }

    return null;
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
   * Calcular días hasta vencimiento de pago
   */
  private calcularDiasVencimiento(fechaPago: string): number | null {
    try {
      const fecha = new Date(fechaPago);
      const hoy = new Date();
      const diferencia = fecha.getTime() - hoy.getTime();
      return Math.ceil(diferencia / (1000 * 3600 * 24));
    } catch {
      return null;
    }
  }

  /**
   * Obtener liquidación con datos enriquecidos y validaciones adicionales
   */
  async getDetallado(nroliq: string | number): Promise<{
    data: Record<string, unknown> | null;
    validaciones: {
      fechasValidas: boolean;
      estadoConsistente: boolean;
      errores: string[];
    };
    metadatos: {
      ultimaConsulta: string;
      tiempoRespuesta: number;
    };
  }> {
    const inicioTiempo = Date.now();
    const errores: string[] = [];

    console.log('🔎 [getDetallado] Iniciando búsqueda para nroliq:', nroliq);

    try {
      // Intentar obtener datos
      console.log('🚀 [getDetallado] Probando getByNroFast...');
      let data = await this.getByNroFast(nroliq);
      if (!data) {
        console.log('🔄 [getDetallado] getByNroFast no encontró datos, probando getByNro...');
        data = await this.getByNro(nroliq);
      }
      
      console.log('📋 [getDetallado] Datos encontrados:', {
        found: !!data,
        nroliqInData: data ? ((data as any)?.nroliq ?? (data as any)?.liqnro) : null,
        dataKeys: data ? Object.keys(data) : []
      });

      if (!data) {
        return {
          data: null,
          validaciones: {
            fechasValidas: false,
            estadoConsistente: false,
            errores: ['Liquidación no encontrada']
          },
          metadatos: {
            ultimaConsulta: new Date().toISOString(),
            tiempoRespuesta: Date.now() - inicioTiempo
          }
        };
      }

      // Validaciones
      const fechasValidas = this.validarFechas(data);
      if (!fechasValidas.valido) {
        errores.push(...fechasValidas.errores);
      }

      const estadoConsistente = this.validarEstado(data);
      if (!estadoConsistente.valido) {
        errores.push(...estadoConsistente.errores);
      }

      return {
        data,
        validaciones: {
          fechasValidas: fechasValidas.valido,
          estadoConsistente: estadoConsistente.valido,
          errores
        },
        metadatos: {
          ultimaConsulta: new Date().toISOString(),
          tiempoRespuesta: Date.now() - inicioTiempo
        }
      };
    } catch (error: any) {
      return {
        data: null,
        validaciones: {
          fechasValidas: false,
          estadoConsistente: false,
          errores: [error?.message || 'Error al consultar liquidación']
        },
        metadatos: {
          ultimaConsulta: new Date().toISOString(),
          tiempoRespuesta: Date.now() - inicioTiempo
        }
      };
    }
  }

  /**
   * Validar fechas de la liquidación
   */
  private validarFechas(data: Record<string, unknown>): { valido: boolean; errores: string[] } {
    const errores: string[] = [];
    
    try {
      const fvalor = data.fvalor as string;
      const fliq = data.fliq as string;
      const fdep = data.fdep as string;
      const fecpag = data.fecpag as string;
      const fcieliq = data.fcieliq as string;

      if (fvalor && fliq) {
        const fechaValor = new Date(fvalor);
        const fechaLiq = new Date(fliq);
        if (fechaValor > fechaLiq) {
          errores.push('La fecha valor contable no puede ser posterior a la fecha de liquidación');
        }
      }

      if (fdep && fliq) {
        const fechaDep = new Date(fdep);
        const fechaLiq = new Date(fliq);
        if (fechaDep > fechaLiq) {
          errores.push('La fecha de último depósito no puede ser posterior a la fecha de liquidación');
        }
      }

      if (fecpag && fliq) {
        const fechaPago = new Date(fecpag);
        const fechaLiq = new Date(fliq);
        if (fechaPago < fechaLiq) {
          errores.push('La fecha de pago no puede ser anterior a la fecha de liquidación');
        }
      }

      // Validar que fecha de cierre existe si el estado es Cerrada
      const estado = data.estado as string;
      if (estado === 'Cerrada' && (!fcieliq || fcieliq.trim().length === 0)) {
        errores.push('Una liquidación cerrada debe tener fecha de cierre');
      }

    } catch {
      errores.push('Error al validar fechas');
    }

    return { valido: errores.length === 0, errores };
  }

  /**
   * Validar consistencia del estado
   */
  private validarEstado(data: Record<string, unknown>): { valido: boolean; errores: string[] } {
    const errores: string[] = [];
    
    try {
      const fcieliq = data.fcieliq as string;
      const estado = data.estado as string;
      
      // Validar consistencia estado vs fecha cierre
      const tieneFeciaCierre = fcieliq && fcieliq.trim().length > 0;
      
      if (estado === 'Cerrada' && !tieneFeciaCierre) {
        errores.push('Estado inconsistente: marcada como Cerrada pero sin fecha de cierre');
      }
      
      if (estado === 'Abierta' && tieneFeciaCierre) {
        errores.push('Estado inconsistente: marcada como Abierta pero tiene fecha de cierre');
      }
      
    } catch {
      errores.push('Error al validar estado');
    }

    return { valido: errores.length === 0, errores };
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