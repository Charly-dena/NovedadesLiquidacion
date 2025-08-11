import { apiClient } from './api/client';
import { API_CONFIG } from './api/config';

/**
 * Servicio para manejo de bancos
 * Conecta con endpoints /idx/bancos de ApiIdeafix
 */
class BancosService {
  private readonly endpoint = '/idx/bancos';

  /**
   * Obtener banco por código desde /idx/bancos
   * Busca en toda la lista para encontrar el banco por código
   */
  async getByCodigo(codigo: string | number): Promise<Record<string, unknown> | null> {
    console.log('🏦 [getByCodigo] Buscando banco con código:', codigo);
    
    try {
      const res = await apiClient.get<unknown>(`${this.endpoint}`);
      console.log('📡 [getByCodigo] Respuesta del endpoint:', {
        isArray: Array.isArray(res),
        type: typeof res,
        keys: res && typeof res === 'object' ? Object.keys(res) : []
      });
      
      // Array directo
      if (Array.isArray(res)) {
        console.log('📋 [getByCodigo] Buscando en array de', res.length, 'bancos');
        const found = (res as any[]).find((banco: any) => {
          const bancoCodigo = String(banco?.codigo ?? banco?.cod ?? banco?.id ?? banco?.banco);
          const match = bancoCodigo === String(codigo);
          if (match) {
            console.log('✅ [getByCodigo] Banco encontrado:', banco);
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
            const banco = (obj as any)[k];
            const bancoCodigo = String(banco?.codigo ?? banco?.cod ?? banco?.id ?? banco?.banco);
            const match = bancoCodigo === String(codigo);
            console.log('🔍 [getByCodigo] Revisando', k, ':', { bancoCodigo, buscando: String(codigo), match });
            if (match) {
              console.log('✅ [getByCodigo] Banco encontrado en', k, ':', banco);
              return banco as Record<string, unknown>;
            }
          }
          console.log('❌ [getByCodigo] No encontrado en ninguna clave row');
          return null;
        }

        // { data: [...] } u otros envoltorios
        const list = Array.isArray((obj as any).data)
          ? (obj as any).data
          : Array.isArray((obj as any).items)
          ? (obj as any).items
          : [];
        if (Array.isArray(list)) {
          const found = (list as any[]).find((banco: any) => 
            String(banco?.codigo ?? banco?.cod ?? banco?.id ?? banco?.banco) === String(codigo)
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
   * Obtener todos los bancos
   */
  async getAll(): Promise<any[]> {
    try {
      const res = await apiClient.get<unknown>(`${this.endpoint}`);
      
      // Array directo
      if (Array.isArray(res)) {
        return res;
      }

      const obj = res as Record<string, unknown>;
      if (obj && typeof obj === 'object') {
        // { row1: {...}, row2: {...} }
        const keys = Object.keys(obj).filter((k) => /^row\d+$/i.test(k));
        if (keys.length) {
          keys.sort((a, b) => parseInt(a.replace(/\D/g, ''), 10) - parseInt(b.replace(/\D/g, ''), 10));
          return keys.map((k) => (obj as any)[k]);
        }

        // { data: [...] } u otros envoltorios
        const list = Array.isArray((obj as any).data)
          ? (obj as any).data
          : Array.isArray((obj as any).items)
          ? (obj as any).items
          : [];
        if (Array.isArray(list)) {
          return list;
        }
      }

      return [];
    } catch (error: any) {
      console.error('💥 [getAll] Error:', error);
      return [];
    }
  }
}

// Instancia singleton del servicio
export const bancosService = new BancosService();