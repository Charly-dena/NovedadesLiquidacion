import { useEffect, useMemo, useState } from 'react';
import { useLiquidaciones } from '@/shared/hooks';
import { useEmpresasCombo } from '@/shared/hooks/useEmpresas';
import type { Liquidacion } from '@/shared/types/api';

export function LiquidacionesList() {
  const [selectedPeriod, setSelectedPeriod] = useState('todos');
  const [selectedStatus, setSelectedStatus] = useState<'todos' | 'abierta' | 'cerrada'>('todos');
  const [selectedCompany, setSelectedCompany] = useState('todas');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const apiFilters = useMemo(() => {
    return {
      empresaId: selectedCompany !== 'todas' ? selectedCompany : undefined,
      estado:
        selectedStatus === 'abierta' ? 'Abierta' : selectedStatus === 'cerrada' ? 'Cerrada' : undefined,
      search: selectedPeriod !== 'todos' ? selectedPeriod : undefined,
      page,
      limit,
    } as const;
  }, [selectedCompany, selectedPeriod, selectedStatus, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [selectedCompany, selectedPeriod, selectedStatus]);

  const { liquidaciones, pagination, loading, error } = useLiquidaciones(apiFilters);
  const { empresas: empresasCombo } = useEmpresasCombo();

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
    const items = ((liquidaciones as Liquidacion[]) || []).map((it: any) => it && typeof it === 'object' && it.row1 ? it.row1 : it);
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
      // Regla: fcieliq con valor => Cerrada, si no => Abierta
      const fcieliqVal = raw?.fcieliq;
      const estado: string = (typeof fcieliqVal === 'string' ? fcieliqVal.trim().length > 0 : Boolean(fcieliqVal))
        ? 'Cerrada'
        : 'Abierta';
      const fechaOrdenStr: string | undefined = fechaLiquidacionText;
      const fechaOrden = parseFecha(fechaOrdenStr);

      const id: string = (raw?.id ?? numero ?? `${empresaNombre}-${fechaLiquidacionText}-${tipoNombre}-${index}`).toString();

      const empresaId: string | undefined = raw?.empresa?.id ?? (raw?.emp != null ? String(raw.emp) : undefined);

      return { id, numero, titulo, empresaId, empresaNombre, fechaLiquidacion: fechaLiquidacionText, fechaCierre: fechaCierreText, tipoNombre, empleados, monto, estado, fechaOrden } as const;
    });
    // Orden descendente por fecha de liquidación (fliq)
    mapped.sort((a, b) => (b.fechaOrden || 0) - (a.fechaOrden || 0));
    // Remover fechaOrden del objeto expuesto
    return mapped.map(({ fechaOrden, ...rest }) => rest);
  }, [liquidaciones]);

  const filteredLiquidaciones = useMemo(() => {
    return uiLiquidaciones.filter((it: any) => {
      const okEstado =
        selectedStatus === 'todos' ||
        (it.estado ?? '').toLowerCase() === (selectedStatus === 'abierta' ? 'abierta' : 'cerrada');
      const okEmpresa = selectedCompany === 'todas' || String(it.empresaId ?? '') === selectedCompany;
      const okPeriodo = selectedPeriod === 'todos' || String(it.fechaLiquidacion ?? '').includes(selectedPeriod);
      return okEstado && okEmpresa && okPeriodo;
    });
  }, [uiLiquidaciones, selectedStatus, selectedCompany, selectedPeriod]);

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
          <span>Cargando datos de liquidaciones...</span>
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
            }} onClick={() => { setSelectedCompany('todas'); setSelectedStatus('todos'); setSelectedPeriod('todos'); }}>
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
              <span>📋</span> Liquidaciones ({filteredLiquidaciones.length}{typeof stats.total === 'number' ? ` / ${stats.total}` : ''})
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