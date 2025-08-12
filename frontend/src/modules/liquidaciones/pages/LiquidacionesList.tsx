import { useEffect, useMemo, useState } from 'react';
import { useLiquidacionesHybrid } from '@/shared/hooks';
import { useEmpresasCombo } from '@/shared/hooks/useEmpresas';
import type { Liquidacion } from '@/shared/types/api';

export function LiquidacionesList() {
  const [selectedPeriod, setSelectedPeriod] = useState('todos');
  const [selectedStatus, setSelectedStatus] = useState<'todos' | 'abierta' | 'cerrada'>('todos');
  const [selectedCompany, setSelectedCompany] = useState('todas');
  const [selectedNumero, setSelectedNumero] = useState(''); // Nuevo filtro por número
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25); // Límite eficiente restaurado

  const apiFilters = useMemo(() => {
    const filters = {
      empresaId: selectedCompany !== 'todas' ? selectedCompany : undefined,
      // REMOVIDO: filtro de estado porque ApiIdeafix no lo soporta
      // El filtrado por estado se hace en el frontend usando fcieliq
      search: selectedPeriod !== 'todos' ? selectedPeriod : undefined,
      page,
      limit,
    } as const;
    
    // DEBUG: Log de filtros aplicados
    console.log('⚙️ [LiquidacionesList] Filtros aplicados al API:', {
      selectedCompany,
      selectedPeriod,
      selectedStatus,
      selectedNumero,
      page,
      limit,
      apiFilters: filters
    });
    
    return filters;
  }, [selectedCompany, selectedPeriod, selectedStatus, selectedNumero, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [selectedCompany, selectedPeriod, selectedNumero]);

  // Hook híbrido: Búsqueda inteligente
  const { liquidaciones, pagination, loading, error, mode } = useLiquidacionesHybrid(
    selectedNumero.trim() || undefined,  // Si hay número, búsqueda directa
    selectedNumero.trim() ? undefined : apiFilters  // Si no hay número, filtros normales
  );
  const { empresas: empresasCombo } = useEmpresasCombo();

  /**
   * Detecta si una fecha es un placeholder (fecha vacía/nula del backend)
   * Condiciones para considerar una fecha como placeholder (liquidación ABIERTA):
   * - null, undefined, string vacío
   * - Patrones como 00/00/0000, 01/01/1900, etc.
   * - Cualquier valor que indique "sin fecha de cierre"
   */
  const isPlaceholderDate = (dateStr?: string): boolean => {
    // null, undefined, o no es string
    if (!dateStr || typeof dateStr !== 'string') {
      console.log('🔍 [isPlaceholderDate] Valor null/undefined/no-string:', dateStr, '-> TRUE (Abierta)');
      return true;
    }
    
    const trimmed = dateStr.trim();
    
    // String vacío
    if (trimmed.length === 0) {
      console.log('🔍 [isPlaceholderDate] String vacío:', JSON.stringify(dateStr), '-> TRUE (Abierta)');
      return true;
    }
    
    // Patrones comunes de fechas placeholder
    const placeholderPatterns = [
      /^00?\/00?\/0+$/,           // 00/00/0000, 0/0/0000
      /^01\/01\/1900$/,           // 01/01/1900 (fecha mínima común)
      /^31\/12\/1899$/,           // 31/12/1899 (otra fecha mínima)
      /^__\/__\/____$/,           // __/__/____
      /^\s*\/\s*\/\s*$/,          // espacios y barras
      /^[\s_0\/]*$/,              // solo espacios, guiones bajos, ceros y barras
      /^[-\s]*$/,                 // solo guiones y espacios
    ];
    
    const isPlaceholder = placeholderPatterns.some(pattern => pattern.test(trimmed));
    console.log('🔍 [isPlaceholderDate] Análisis:', {
      original: dateStr,
      trimmed,
      isPlaceholder,
      estado: isPlaceholder ? 'Abierta' : 'Cerrada'
    });
    
    return isPlaceholder;
  };

  const parseFecha = (value?: string): number => {
    if (!value) return 0;
    const v = value.trim();
    // dd/mm/yyyy
    const ddmmyyyy = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyy) {
      const [, dd, mm, yyyy] = ddmmyyyy;
      const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return date.getTime();
    }
    // yyyy-mm or yyyy/mm fallback -> first day of month
    const yyyymm = v.match(/^(\d{4})[-\/.](\d{2})$/);
    if (yyyymm) {
      const [, yyyy, mm] = yyyymm;
      const date = new Date(Number(yyyy), Number(mm) - 1, 1);
      return date.getTime();
    }
    // ISO u otros formatos que Date.parse pueda manejar
    const t = Date.parse(v);
    return Number.isNaN(t) ? 0 : t;
  };

  const uiLiquidaciones = useMemo(() => {
    // DEBUG: Log de datos crudos del API
    console.log('📡 Datos del API liquidaciones:', {
      liquidaciones,
      liquidacionesType: typeof liquidaciones,
      liquidacionesLength: Array.isArray(liquidaciones) ? liquidaciones.length : 'N/A',
      firstItem: Array.isArray(liquidaciones) && liquidaciones.length > 0 ? liquidaciones[0] : 'N/A'
    });
    
    // DEBUG: Log de todos los números de liquidación que llegan del API
    const items = ((liquidaciones as any[]) || []).map((it: any) => it && typeof it === 'object' && it.row1 ? it.row1 : it);
    const numerosEncontrados = items.map((raw: any, index: number) => {
      const numero = (raw?.nroliq ?? raw?.liqnro ?? raw?.nro ?? raw?.num ?? raw?.numero)?.toString();
      return { index, numero, hasData: !!raw, raw };
    }).filter(item => item.numero);
    
    console.log('🔢 NÚMEROS DE LIQUIDACIÓN EN EL API:', {
      total: numerosEncontrados.length,
      numeros: numerosEncontrados.map(n => n.numero).sort((a, b) => Number(a) - Number(b)),
      tiene3002: numerosEncontrados.some(n => n.numero === '3002'),
      primeros10: numerosEncontrados.slice(0, 10)
    });
    
    // DEBUG: Analizar estructura de datos para encontrar dónde está el número de liquidación
    console.log('🔍 ANÁLISIS ESTRUCTURA DE DATOS (primeros 3 items):');
    items.slice(0, 3).forEach((raw, index) => {
      console.log(`📄 Item ${index}:`, {
        tipoObjeto: typeof raw,
        claves: Object.keys(raw || {}),
        valoresPosiblesNumero: {
          nroliq: raw?.nroliq,
          liqnro: raw?.liqnro,  
          nro: raw?.nro,
          num: raw?.num,
          numero: raw?.numero,
          id: raw?.id
        },
        objetoCompleto: raw
      });
    });
    
    // DEBUG: Buscar específicamente liquidación 3002 en datos crudos
    const liq3002 = numerosEncontrados.find(item => item.numero === '3002');
    if (liq3002) {
      console.log('✅ ENCONTRADA liquidación 3002 en datos del API:', liq3002);
    } else {
      console.log('❌ NO ENCONTRADA liquidación 3002 en el API');
      console.log('🔍 Revisando todos los datos crudos para buscar 3002...');
      
      // Búsqueda exhaustiva en toda la respuesta
      const busquedaExhaustiva = items.map((raw: any, index: number) => {
        if (!raw || typeof raw !== 'object') return null;
        
        const camposConValores: any = {};
        const allValues = Object.entries(raw).map(([key, value]) => {
          const strValue = String(value);
          camposConValores[key] = strValue;
          return { key, value: strValue, contiene3002: strValue.includes('3002') };
        });
        
        const tieneAlgun3002 = allValues.some(item => item.contiene3002);
        const camposCon3002 = allValues.filter(item => item.contiene3002);
        
        return tieneAlgun3002 ? { 
          index, 
          camposCon3002,
          todosLosCampos: camposConValores,
          raw 
        } : null;
      }).filter(item => item !== null);
      
      if (busquedaExhaustiva.length > 0) {
        console.log('🔍 Encontrados datos que contienen "3002":', busquedaExhaustiva);
        
        // Log específico de cada campo que contiene 3002
        busquedaExhaustiva.forEach((item, idx) => {
          console.log(`📋 Resultado ${idx + 1} con "3002":`, {
            indiceEnArray: item.index,
            camposQueTienen3002: item.camposCon3002,
            objetoCompleto: item.raw
          });
        });
      } else {
        console.log('❌ No se encontró "3002" en ningún lugar de los datos del API');
        
        // Log de muestra de la estructura para debug
        if (items.length > 0) {
          console.log('📋 Muestra de estructura de datos (primer item completo):', items[0]);
          console.log('📋 Claves disponibles en el primer item:', Object.keys(items[0] || {}));
        }
      }
    }
    const mapped = items.map((raw: any, index: number) => {
      const numero: string | undefined = (raw?.nroliq ?? raw?.liqnro ?? raw?.nro ?? raw?.num ?? raw?.numero)?.toString();
      // Si viene razon social en payload, preferirla para la grilla
      const empresaNombre: string = raw?.empresa?.razonSocial ?? raw?.razonSocial ?? raw?.empresa?.nombre ?? raw?.empresaNombre ?? raw?.empresa ?? String(raw?.emp ?? '-')
      const fechaLiquidacionText: string = raw?.fliq ?? raw?.periodo ?? raw?.per ?? raw?.mes ?? '-';
      const fechaCierreText: string = raw?.fcieliq ?? '-';
      const titulo: string | undefined = raw?.titulo ?? raw?.title ?? raw?.descripcion;
      const tipoNombre: string = raw?.tipoLiquidacion?.nombre ?? raw?.tipo ?? raw?.tliqNombre ?? String(raw?.tliq ?? '-');
      const empleados: number = Number(raw?.empleados ?? raw?.cantEmpleados ?? 0) || 0;
      const monto: number = Number(raw?.totalNeto ?? raw?.totalBruto ?? raw?.total ?? raw?.monto ?? 0) || 0;
      // Regla: fcieliq con fecha válida (no placeholder) => Cerrada, si no => Abierta
      const fcieliqVal = raw?.fcieliq;
      const isPlaceholder = isPlaceholderDate(fcieliqVal);
      
      // DEBUG: Log detallado para liquidaciones específicas
      if (String(numero) === '1' || String(numero) === '3002') {
        console.log(`🔍 DEBUG Liquidación ${numero} - COMPLETO:`, {
          numero,
          fcieliq: fcieliqVal,
          fcieliqType: typeof fcieliqVal,
          fcieliqValue: JSON.stringify(fcieliqVal),
          fcieliqLength: typeof fcieliqVal === 'string' ? fcieliqVal.length : 'N/A',
          fcieliqTrimmed: typeof fcieliqVal === 'string' ? fcieliqVal.trim() : 'N/A',
          isPlaceholder,
          estadoCalculado: !isPlaceholder ? 'Cerrada' : 'Abierta',
          allRawKeys: Object.keys(raw || {}),
          rawData: raw
        });
        
        // Log adicional para analizar todos los campos de fecha
        console.log(`🔍 DEBUG Liquidación ${numero} - FECHAS:`, {
          fvalor: raw?.fvalor,
          fliq: raw?.fliq,
          fdep: raw?.fdep,
          fecpag: raw?.fecpag,
          fcieliq: raw?.fcieliq,
          fechaCierreText: raw?.fcieliq ?? '-'
        });
      }
      
      const estado: string = !isPlaceholder ? 'Cerrada' : 'Abierta';
      const fechaOrdenStr: string | undefined = fechaLiquidacionText;
      const fechaOrden = parseFecha(fechaOrdenStr);

      const id: string = (raw?.id ?? numero ?? `${empresaNombre}-${fechaLiquidacionText}-${tipoNombre}-${index}`).toString();

      const empresaId: string | undefined = raw?.empresa?.id ?? (raw?.emp != null ? String(raw.emp) : undefined);

      return { id, numero, titulo, empresaId, empresaNombre, fechaLiquidacion: fechaLiquidacionText, fechaCierre: fechaCierreText, tipoNombre, empleados, monto, estado, fechaOrden } as const;
    });
    
    // DEBUG: Log resumen de estados calculados
    const abiertas = mapped.filter(l => l.estado === 'Abierta');
    const cerradas = mapped.filter(l => l.estado === 'Cerrada');
    
    console.log('📊 RESUMEN ESTADOS:', {
      totalLiquidaciones: mapped.length,
      abiertas: abiertas.length,
      cerradas: cerradas.length,
      ejemplos: mapped.slice(0, 3).map(l => ({
        numero: l.numero,
        estado: l.estado,
        fcieliq: l.fechaCierre
      }))
    });
    
    // DEBUG: Log específico de liquidaciones abiertas
    if (abiertas.length > 0) {
      console.log('📋 LIQUIDACIONES ABIERTAS:', abiertas.map(l => ({
        numero: l.numero,
        empresa: l.empresaNombre,
        fechaCierre: l.fechaCierre,
        fechaLiq: l.fechaLiquidacion
      })));
    }
    
    // DEBUG: Log específico de liquidaciones cerradas (primeras 5)
    if (cerradas.length > 0) {
      console.log('🔒 LIQUIDACIONES CERRADAS (primeras 5):', cerradas.slice(0, 5).map(l => ({
        numero: l.numero,
        empresa: l.empresaNombre,
        fechaCierre: l.fechaCierre,
        fechaLiq: l.fechaLiquidacion
      })));
    }
    
    // Orden descendente por fecha de liquidación (fliq)
    mapped.sort((a, b) => (b.fechaOrden || 0) - (a.fechaOrden || 0));
    // Remover fechaOrden del objeto expuesto
    return mapped.map(({ fechaOrden, ...rest }) => rest);
  }, [liquidaciones]);

  // Filtrado frontend: el estado se filtra aquí porque ApiIdeafix no soporta filtros de estado
  // El estado se determina por el campo fcieliq: con valor = Cerrada, sin valor = Abierta
  const filteredLiquidaciones = useMemo(() => {
    return uiLiquidaciones.filter((it: any) => {
      const okEstado =
        selectedStatus === 'todos' ||
        (it.estado ?? '').toLowerCase() === (selectedStatus === 'abierta' ? 'abierta' : 'cerrada');
      const okEmpresa = selectedCompany === 'todas' || String(it.empresaId ?? '') === selectedCompany;
      const okPeriodo = selectedPeriod === 'todos' || String(it.fechaLiquidacion ?? '').includes(selectedPeriod);
      const okNumero = !selectedNumero.trim() || String(it.numero ?? it.id ?? '').toLowerCase() === selectedNumero.toLowerCase().trim();
      return okEstado && okEmpresa && okPeriodo && okNumero;
    });
  }, [uiLiquidaciones, selectedStatus, selectedCompany, selectedPeriod, selectedNumero]);

  const stats = useMemo(() => {
    const abiertas = uiLiquidaciones.filter((l) => l.estado === 'Abierta').length;
    const cerradas = uiLiquidaciones.filter((l) => l.estado === 'Cerrada').length;
    const montoTotal = uiLiquidaciones.reduce((sum, l) => sum + (Number(l.monto) || 0), 0);
    return {
      total: pagination?.total ?? uiLiquidaciones.length,
      abiertas,
      cerradas,
      montoTotal,
    };
  }, [pagination?.total, uiLiquidaciones]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: '0' }}>
            Liquidaciones
          </h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '16px' }}>
            Gestión completa de liquidaciones de sueldos y jornales
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ fontSize: '14px' }}>
            <span style={{ marginRight: '8px' }}>+</span>
            Nueva Liquidación
          </button>
          <button style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            background: 'white',
            color: '#374151',
            cursor: 'pointer'
          }}>
            📊 Exportar
          </button>
          <button style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            background: 'white',
            color: '#374151',
            cursor: 'pointer'
          }}>
            🔍 Búsqueda Avanzada
          </button>
        </div>
      </div>

      {/* Mode indicator */}
      {selectedNumero.trim() && (
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
          }}
        >
          <span>🎯</span>
          <span>Búsqueda directa por número: <strong>{selectedNumero}</strong></span>
          {mode === 'specific' && !loading && liquidaciones.length === 0 && (
            <span style={{ color: '#dc2626', marginLeft: '8px' }}>- No encontrada</span>
          )}
        </div>
      )}

      {/* Loading banner */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1e40af',
          }}
        >
          <span>⏳</span>
          <span>
            {mode === 'specific' 
              ? `Buscando liquidación #${selectedNumero}...` 
              : 'Cargando datos de liquidaciones...'
            }
          </span>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {/* Total Liquidaciones */}
        <div className="card" style={{
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
                Total Liquidaciones
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                {stats.total}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                En el sistema
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>📋</span>
            </div>
          </div>
        </div>

        {/* Liquidaciones Abiertas */}
        <div className="card" style={{
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
                Liquidaciones Abiertas
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                {stats.abiertas}
              </p>
              <p style={{ fontSize: '12px', color: '#d97706', margin: '0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>⏰</span> Requieren atención
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>⏳</span>
            </div>
          </div>
        </div>

        {/* Liquidaciones Cerradas */}
        <div className="card" style={{
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
                Liquidaciones Cerradas
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                {stats.cerradas}
              </p>
              <p style={{ fontSize: '12px', color: '#16a34a', margin: '0' }}>
                Completadas
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>✅</span>
            </div>
          </div>
        </div>

        {/* Monto Total */}
        <div className="card" style={{
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
                Monto Total
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                ${(stats.montoTotal / 1000).toFixed(0)}K
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                En liquidaciones
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔍</span> Filtros
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
              Empresa
            </label>
            <select 
              value={selectedCompany}
              onChange={(e) => { setSelectedCompany(e.target.value); setPage(1); }}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="todas">Todas las empresas</option>
              {empresasCombo.map((e) => {
                const label = e.razonSocial && e.razonSocial.trim().length > 0 ? e.razonSocial : e.nombre;
                return (
                  <option key={`${e.id}-${label}`} value={e.id}>{label}</option>
                );
              })}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
              Estado
            </label>
            <select 
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value as typeof selectedStatus); setPage(1); }}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="todos">Todos los estados</option>
              <option value="abierta">Abierta</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
              🎯 Número de Liquidación
            </label>
            <input 
              type="text"
              placeholder="Búsqueda directa (ej: 3002)"
              value={selectedNumero}
              onChange={(e) => { setSelectedNumero(e.target.value); setPage(1); }}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: selectedNumero.trim() ? '2px solid #3b82f6' : '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: selectedNumero.trim() ? '#eff6ff' : 'white'
              }}
            />
            {selectedNumero.trim() && (
              <div style={{ fontSize: '11px', color: '#3b82f6', marginTop: '4px' }}>
                💡 Usando endpoint directo /idx/liq/{selectedNumero}
              </div>
            )}
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
              Periodo
            </label>
            <select 
              value={selectedPeriod}
              onChange={(e) => { setSelectedPeriod(e.target.value); setPage(1); }}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="todos">Todos los periodos</option>
              {/* Opcional: selector YYYY-MM */}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'end', gap: '8px' }}>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }} onClick={(e) => { e.preventDefault(); /* filtros reactivan automáticamente */ }}>
              Aplicar
            </button>
            <button style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }} onClick={() => { setSelectedCompany('todas'); setSelectedStatus('todos'); setSelectedPeriod('todos'); setSelectedNumero(''); }}>
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Liquidaciones Table */}
      <div className="card">
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{mode === 'specific' ? '🎯' : '📋'}</span> 
              {mode === 'specific' 
                ? `Resultado de Búsqueda (${filteredLiquidaciones.length})`
                : `Liquidaciones (${filteredLiquidaciones.length}${typeof stats.total === 'number' ? ` / ${stats.total}` : ''})`
              }
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: '#f9fafb',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Vista Lista
              </button>
              <button style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: 'white',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Vista Cards
              </button>
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {loading && (
            <div style={{ padding: '16px', color: '#6b7280' }}>Cargando liquidaciones...</div>
          )}
          {error && !loading && (
            <div style={{ padding: '16px', color: '#b91c1c' }}>Error: {error}</div>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                  Nro. Liquidación
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                  Empresa
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                  Fecha Liquidación
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                  Fecha Cierre
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                  Estado
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLiquidaciones.map((liquidacion) => (
                <tr 
                  key={liquidacion.id} 
                  style={{ 
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#1f2937'
                      }}>
                        #{liquidacion.numero ?? liquidacion.id}
                      </span>
                      {liquidacion.titulo && (
                        <span
                          title={liquidacion.titulo}
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                          }}
                        >
                          — {liquidacion.titulo}
                        </span>
                      )}
                      {liquidacion.tipoNombre && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: liquidacion.tipoNombre === 'Aguinaldo' ? '#7c2d12' : '#1f2937',
                            backgroundColor: liquidacion.tipoNombre === 'Aguinaldo' ? '#fef3c7' : '#f3f4f6',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            border: '1px solid #e5e7eb',
                          }}
                        >
                          {liquidacion.tipoNombre}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: '0' }}>
                        {liquidacion.empresaNombre}
                      </p>
                      {typeof liquidacion.empleados === 'number' && (
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                          {liquidacion.empleados} empleados
                        </p>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>
                    {liquidacion.fechaLiquidacion}
                  </td>
                  
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>
                    {liquidacion.fechaCierre}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: liquidacion.estado === 'Abierta' ? '#d97706' : '#16a34a',
                      backgroundColor: liquidacion.estado === 'Abierta' ? '#fef3c7' : '#dcfce7',
                      padding: '4px 12px',
                      borderRadius: '12px'
                    }}>
                      {liquidacion.estado}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button style={{
                        padding: '6px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }} onClick={() => {
                        // Navegar al detalle usando el número de liquidación como parámetro principal
                        const nroliq = liquidacion.numero || liquidacion.id;
                        window.location.href = `/liquidaciones/detalle?nroliq=${encodeURIComponent(nroliq)}`;
                      }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {liquidacion.estado === 'Abierta' && (
                        <button style={{
                          padding: '6px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      <button style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}>
                        •••
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !error && filteredLiquidaciones.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '16px', color: '#6b7280', textAlign: 'center' }}>
                    No se encontraron liquidaciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
            Mostrando {filteredLiquidaciones.length}{typeof stats.total === 'number' ? ` de ${stats.total}` : ''} liquidaciones
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              disabled={pagination?.hasPrevious === false || (pagination?.page ?? page) <= 1}
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.max(1, p - 1));
              }}
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Anterior
            </button>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              Página {pagination?.page ?? page} de {pagination?.totalPages ?? 1}
            </span>
            <button
              disabled={!pagination?.hasNext}
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => p + 1);
              }}
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Siguiente
            </button>
            <select
              value={limit}
              onChange={(e) => { setLimit(parseInt(e.target.value) || 25); setPage(1); }}
              style={{
                padding: '6px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#374151',
                background: 'white'
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}