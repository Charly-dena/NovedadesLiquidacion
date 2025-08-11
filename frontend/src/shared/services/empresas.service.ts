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
  private readonly comboEndpoint = API_CONFIG.ENDPOINTS.COMBO_EMPS;

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
   * Obtener combo de empresas para selects: /idx/combo/emps
   * Acepta múltiples formatos comunes y los normaliza a { id, nombre, razonSocial }
   */
  async getCombo(): Promise<Array<{ id: string; nombre: string; razonSocial?: string }>> {
    const res = await apiClient.get<unknown>(this.comboEndpoint);
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('🔎 [/idx/combo/emps] response preview:',
        Array.isArray(res)
          ? { kind: 'array', length: res.length, sample: (res as unknown[])[0] }
          : { kind: 'object', keys: Object.keys((res as Record<string, unknown>) || {}), sample: res }
      );
    }

    const buildItem = (r: any, i: number) => {
      if (typeof r === 'string') {
        // Intento simple: "<id> - <razon social>"
        const m = r.match(/^(\d+)\s*[-–:]\s*(.+)$/);
        if (m) {
          return { id: String(m[1]), nombre: m[2], razonSocial: m[2] };
        }
        return { id: String(i), nombre: r, razonSocial: r };
      }
      const id = String(r?.id ?? r?.emp ?? r?.codigo ?? r?.cod ?? i);
      const razon = r?.razonSocial ?? r?.razon ?? r?.rsocial ?? r?.rznsoc ?? r?.rsoc ?? r?.razonsocial;
      const nombre = r?.nombre ?? razon ?? r?.desc ?? r?.descripcion ?? '-';
      return { id, nombre: String(nombre), razonSocial: razon ? String(razon) : undefined };
    };
    if (Array.isArray(res)) {
      return res.map((r: any, i) => buildItem(r, i));
    }
    const obj = res as Record<string, any>;
    // Objetos tipo { row1: {...}, row2: {...} }
    const keys = Object.keys(obj || {}).filter((k) => /^row\d+$/i.test(k));
    if (keys.length) {
      keys.sort((a, b) => parseInt(a.replace(/\D/g, ''), 10) - parseInt(b.replace(/\D/g, ''), 10));
      return keys.map((k, i) => buildItem(obj[k], i));
    }
    // Otros envoltorios comunes
    const list = (obj?.data && Array.isArray(obj.data)) ? obj.data : (obj?.items && Array.isArray(obj.items)) ? obj.items : [];
    return (list as any[]).map((r: any, i) => buildItem(r, i));
  }

  /**
   * Obtener empresa por ID
   */
  async getById(id: string): Promise<Empresa> {
    return apiClient.get<Empresa>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtener empresa por código desde /idx/emps
   * Busca en toda la lista para encontrar la empresa por código
   */
  async getByCodigo(codigo: string | number): Promise<Record<string, unknown> | null> {
    console.log('🔍 [getByCodigo] Buscando empresa con código:', codigo);
    
    try {
      const res = await apiClient.get<unknown>(`${this.endpoint}`);
      console.log('📡 [getByCodigo] Respuesta del endpoint:', {
        isArray: Array.isArray(res),
        type: typeof res,
        keys: res && typeof res === 'object' ? Object.keys(res) : []
      });
      
      // Array directo
      if (Array.isArray(res)) {
        console.log('📋 [getByCodigo] Buscando en array de', res.length, 'empresas');
        const found = (res as any[]).find((empresa: any) => {
          const empresaCodigo = String(empresa?.codigo ?? empresa?.cod ?? empresa?.id ?? empresa?.emp);
          const match = empresaCodigo === String(codigo);
          if (match) {
            console.log('✅ [getByCodigo] Empresa encontrada:', empresa);
          }
          return match;
        });
        return found || null;
      }

      const obj = res as Record<string, unknown>;
      if (obj && typeof obj === 'object') {
        // { row1: {...}, row2: {...} }
        const keys = Object.keys(obj).filter((k) => /^row\d+$/i.test(k));
        console.log('🗂️ [getByCodigo] Claves row encontradas:', keys);
        if (keys.length) {
          for (const k of keys) {
            const empresa = (obj as any)[k];
            const empresaCodigo = String(empresa?.codigo ?? empresa?.cod ?? empresa?.id ?? empresa?.emp);
            const match = empresaCodigo === String(codigo);
            console.log('🔍 [getByCodigo] Revisando', k, ':', { empresaCodigo, buscando: String(codigo), match });
            if (match) {
              console.log('✅ [getByCodigo] Empresa encontrada en', k, ':', empresa);
              return empresa as Record<string, unknown>;
            }
          }
          console.log('❌ [getByCodigo] No encontrada en ninguna clave row');
          return null;
        }

        // { data: [...] } u otros envoltorios
        const list = Array.isArray((obj as any).data)
          ? (obj as any).data
          : Array.isArray((obj as any).items)
          ? (obj as any).items
          : [];
        if (Array.isArray(list)) {
          const found = (list as any[]).find((empresa: any) => 
            String(empresa?.codigo ?? empresa?.cod ?? empresa?.id ?? empresa?.emp) === String(codigo)
          );
          return found || null;
        }
      }

      return null;
    } catch (error: any) {
      console.error('💥 [getByCodigo] Error:', error);
      return null;
    }
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