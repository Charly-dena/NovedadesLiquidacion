import { useEffect, useMemo, useState } from 'react';
import { liquidacionesService, empresasService, bancosService } from '@/shared/services';

/**
 * Detecta si una fecha es un placeholder (fecha vacía/nula del backend)
 * y debe mostrarse como vacía en la UI
 */
const isPlaceholderDate = (dateStr?: string): boolean => {
  if (!dateStr || typeof dateStr !== 'string') {
    return true;
  }
  
  const trimmed = dateStr.trim();
  
  if (trimmed.length === 0) {
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
  
  return placeholderPatterns.some(pattern => pattern.test(trimmed));
};

/**
 * Formatea una fecha para mostrar en la UI, mostrando "—" para placeholders
 */
const formatDateForDisplay = (dateStr?: string): string => {
  if (isPlaceholderDate(dateStr)) {
    return '—';
  }
  return dateStr || '—';
};

export function LiquidacionDetail() {
  const params = new URLSearchParams(window.location.search);
  const nroliq = params.get('nroliq') || params.get('id') || '';
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validaciones, setValidaciones] = useState<{
    fechasValidas: boolean;
    estadoConsistente: boolean;
    errores: string[];
  } | null>(null);
  const [metadatos, setMetadatos] = useState<{
    ultimaConsulta: string;
    tiempoRespuesta: number;
  } | null>(null);
  const [empresaData, setEmpresaData] = useState<Record<string, unknown> | null>(null);
  const [bancoData, setBancoData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        setValidaciones(null);
        setMetadatos(null);
        setEmpresaData(null);
        setBancoData(null);
        
        // Debug logging
        console.log('🔍 [LiquidacionDetail] Parámetros recibidos:', {
          nroliq,
          url: window.location.href,
          searchParams: window.location.search,
          allParams: Object.fromEntries(params.entries())
        });
        
        if (nroliq) {
          console.log('📡 [LiquidacionDetail] Consultando liquidación:', nroliq);
          const resultado = await liquidacionesService.getDetallado(nroliq);
          
          console.log('📄 [LiquidacionDetail] Resultado obtenido:', {
            data: resultado.data,
            nroliqEncontrado: resultado.data ? ((resultado.data as any)?.nroliq ?? (resultado.data as any)?.liqnro) : null
          });
          
          if (mounted) {
            setData(resultado.data);
            setValidaciones(resultado.validaciones);
            setMetadatos(resultado.metadatos);
            
            if (!resultado.data) {
              setError('Liquidación no encontrada');
            } else {
              // Cargar datos de empresa por código
              const codigoEmpresa = (resultado.data as any)?.emp ?? (resultado.data as any)?.empresaId ?? (resultado.data as any)?.empresa?.id;
              if (codigoEmpresa) {
                console.log('🏢 [LiquidacionDetail] Cargando empresa con código:', codigoEmpresa);
                try {
                  const empresa = await empresasService.getByCodigo(codigoEmpresa);
                  if (mounted) {
                    setEmpresaData(empresa);
                    console.log('🏢 [LiquidacionDetail] Datos de empresa cargados:', empresa);
                  }
                } catch (e) {
                  console.error('💥 [LiquidacionDetail] Error al cargar empresa:', e);
                }
              }

              // Cargar datos de banco por código
              const codigoBanco = (resultado.data as any)?.bdep;
              if (codigoBanco) {
                console.log('🏦 [LiquidacionDetail] Cargando banco con código:', codigoBanco);
                try {
                  const banco = await bancosService.getByCodigo(codigoBanco);
                  if (mounted) {
                    setBancoData(banco);
                    console.log('🏦 [LiquidacionDetail] Datos de banco cargados:', banco);
                  }
                } catch (e) {
                  console.error('💥 [LiquidacionDetail] Error al cargar banco:', e);
                }
              }
            }
          }
        } else {
          console.log('❌ [LiquidacionDetail] No se recibió nroliq');
        }
      } catch (e: any) {
        console.error('💥 [LiquidacionDetail] Error:', e);
        if (mounted) {
          setError(e?.message || 'Error al cargar la liquidación');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [nroliq]);

  // Valores calculados
  const numeroLiquidacion = useMemo(() => {
    return ((data as any)?.nroliq ?? (data as any)?.liqnro ?? nroliq) || '—';
  }, [data, nroliq]);

  const empresa = useMemo(() => {
    const d: any = data || {};
    return d?.empresa?.razonSocial || d?.razonSocial || d?.empresa?.nombre || d?.empresa || d?.emp || '—';
  }, [data]);

  const tipo = useMemo(() => {
    const d: any = data || {};
    return d?.tipoLiquidacion?.nombre || d?.tipo || d?.tliq || '—';
  }, [data]);

  const fliq = useMemo(() => {
    const d: any = data || {};
    return d?.fliq || '—';
  }, [data]);

  const fcieliq = useMemo(() => {
    const d: any = data || {};
    return formatDateForDisplay(d?.fcieliq);
  }, [data]);

  const estado = useMemo(() => {
    const d: any = data || {};
    const fcieliqRaw = d?.fcieliq;
    // Usar la función de validación de placeholders para determinar estado
    return isPlaceholderDate(fcieliqRaw) ? 'Abierta' : 'Cerrada';
  }, [data]);


  if (loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: '#6b7280', margin: 0 }}>🔄 Cargando liquidación...</h2>
          <p style={{ color: '#6b7280', margin: '10px 0 0 0' }}>
            Obteniendo datos de la liquidación #{nroliq}
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: '#dc2626', margin: '0 0 16px 0' }}>
            ⚠️ {error || 'Liquidación no encontrada'}
          </h2>
          <p style={{ color: '#6b7280', margin: '0 0 24px 0' }}>
            {error ? 'Ocurrió un error al cargar los datos.' : `No se encontró la liquidación #${nroliq}`}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-secondary"
            >
              ← Volver
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => window.history.back()}
                style={{
                  padding: '8px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                ← 
              </button>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <h1 style={{ margin: '0', fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>
                    Liquidación #{numeroLiquidacion}
                  </h1>
                  {(data as any)?.titulo && (
                    <span style={{ 
                      fontSize: '20px', 
                      fontWeight: '500', 
                      color: '#6b7280',
                      fontStyle: 'italic'
                    }}>
                      - {(data as any).titulo}
                    </span>
                  )}
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: estado === 'Abierta' ? '#fef3c7' : '#dcfce7',
                    color: estado === 'Abierta' ? '#d97706' : '#16a34a',
                    border: `1px solid ${estado === 'Abierta' ? '#fbbf24' : '#22c55e'}`
                  }}>
                    {estado === 'Abierta' ? '🔓' : '🔒'} {estado}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                  <span>🏢 {empresa}</span>
                  <span>📅 {fliq}</span>
                  <span>📄 {tipo}</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {estado === 'Abierta' && (
                <button className="btn btn-secondary">
                  ✏️ Editar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Alertas de Validación */}
        {validaciones && validaciones.errores.length > 0 && (
          <div className="card" style={{ 
            marginBottom: '24px',
            backgroundColor: '#fef3c7',
            border: '1px solid #fbbf24'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#d97706' }}>
                  Advertencias de Validación
                </h3>
                <ul style={{ margin: '0', paddingLeft: '20px', color: '#b45309' }}>
                  {validaciones.errores.map((error, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Contenido Principal - Layout Horizontal */}
        
        {/* Fila 1: Información General + Estado y Configuración */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Información General */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '20px' }}>🏢</span>
              <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                Información General
              </h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <dt style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
                  Empresa
                </dt>
                <dd style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0' }}>
                  {empresa}
                </dd>
                {(empresaData?.descripcion || empresaData?.descrip || empresaData?.desc) && (
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px', fontStyle: 'italic' }}>
                    {(empresaData.descripcion || empresaData.descrip || empresaData.desc) as string}
                  </div>
                )}
              </div>
              
              <div>
                <dt style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
                  Tipo de Liquidación
                </dt>
                <dd style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0' }}>
                  {tipo}
                </dd>
              </div>
              
              <div>
                <dt style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
                  Título
                </dt>
                <dd style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0' }}>
                  {(data as any)?.titulo || 'Sin título especificado'}
                </dd>
              </div>
              
              <div>
                <dt style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
                  Forma de Pago
                </dt>
                <dd style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0' }}>
                  {(data as any)?.formpag || (data as any)?.forpag || '—'}
                </dd>
              </div>
              
              <div>
                <dt style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
                  Banco de Depósito
                </dt>
                <dd style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0' }}>
                  {(data as any)?.bdep || '—'}
                  {((data as any)?.bdep && (bancoData?.det || bancoData?.detalle || bancoData?.descripcion || bancoData?.nombre)) && (
                    <span style={{ fontWeight: '400', color: '#6b7280' }}>
                      {' - '}{(bancoData.det || bancoData.detalle || bancoData.descripcion || bancoData.nombre) as string}
                    </span>
                  )}
                </dd>
              </div>
              
              <div>
                <dt style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
                  Mes de Depósito
                </dt>
                <dd style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0' }}>
                  {(data as any)?.mesdep || '—'}
                </dd>
              </div>
            </div>
          </div>

          {/* Estado y Configuración */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '20px' }}>⚙️</span>
              <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                Estado y Configuración
              </h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', alignItems: 'start' }}>
              <div>
                <dt style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                  Estado Actual
                </dt>
                <dd style={{ margin: '0' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: estado === 'Abierta' ? '#fef3c7' : '#dcfce7',
                    color: estado === 'Abierta' ? '#d97706' : '#16a34a',
                    border: `1px solid ${estado === 'Abierta' ? '#fbbf24' : '#22c55e'}`,
                    display: 'block',
                    textAlign: 'center'
                  }}>
                    {estado === 'Abierta' ? '🔓' : '🔒'} {estado}
                  </span>
                </dd>
              </div>
              
              <div>
                <dt style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                  Actualizar Novedades
                </dt>
                <dd style={{ margin: '0' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: ((data as any)?.novebloq === 1 || (data as any)?.novebloq === '1') ? '#dcfce7' : '#fecaca',
                    color: ((data as any)?.novebloq === 1 || (data as any)?.novebloq === '1') ? '#16a34a' : '#dc2626',
                    border: `1px solid ${((data as any)?.novebloq === 1 || (data as any)?.novebloq === '1') ? '#22c55e' : '#f87171'}`,
                    display: 'block',
                    textAlign: 'center'
                  }}>
                    {((data as any)?.novebloq === 1 || (data as any)?.novebloq === '1') ? '✅ Permitido' : '🚫 No Permitido'}
                  </span>
                </dd>
              </div>
              
              <div>
                <dt style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                  Confirmación
                </dt>
                <dd style={{ margin: '0' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: (data as any)?.confirm ? '#dcfce7' : '#f3f4f6',
                    color: (data as any)?.confirm ? '#16a34a' : '#6b7280',
                    border: `1px solid ${(data as any)?.confirm ? '#22c55e' : '#d1d5db'}`,
                    display: 'block',
                    textAlign: 'center'
                  }}>
                    {(data as any)?.confirm ? '✅ Confirmada' : '⏳ Pendiente'}
                  </span>
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Fila 2: Cronograma de Fechas - Ancho completo */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '20px' }}>📅</span>
            <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
              Cronograma de Fechas
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: '#e0f2fe', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
              <dt style={{ fontSize: '14px', fontWeight: '600', color: '#0369a1', marginBottom: '4px' }}>
                Fecha Valor Contable
              </dt>
              <dd style={{ fontSize: '18px', fontWeight: '700', color: '#0c4a6e', margin: '0' }}>
                {formatDateForDisplay((data as any)?.fvalor)}
              </dd>
            </div>
            
            <div style={{ padding: '16px', backgroundColor: '#dcfce7', borderRadius: '8px', border: '1px solid #22c55e' }}>
              <dt style={{ fontSize: '14px', fontWeight: '600', color: '#15803d', marginBottom: '4px' }}>
                Fecha de Liquidación
              </dt>
              <dd style={{ fontSize: '18px', fontWeight: '700', color: '#166534', margin: '0' }}>
                {formatDateForDisplay((data as any)?.fliq)}
              </dd>
            </div>
            
            <div style={{ padding: '16px', backgroundColor: '#fed7aa', borderRadius: '8px', border: '1px solid #f59e0b' }}>
              <dt style={{ fontSize: '14px', fontWeight: '600', color: '#d97706', marginBottom: '4px' }}>
                Último Depósito
              </dt>
              <dd style={{ fontSize: '18px', fontWeight: '700', color: '#b45309', margin: '0' }}>
                {formatDateForDisplay((data as any)?.fdep)}
              </dd>
            </div>
            
            <div style={{ padding: '16px', backgroundColor: '#e9d5ff', borderRadius: '8px', border: '1px solid #8b5cf6' }}>
              <dt style={{ fontSize: '14px', fontWeight: '600', color: '#7c3aed', marginBottom: '4px' }}>
                Fecha de Pago
              </dt>
              <dd style={{ fontSize: '18px', fontWeight: '700', color: '#6d28d9', margin: '0' }}>
                {formatDateForDisplay((data as any)?.fecpag)}
                {(data as any)?.diasVencimiento !== null && (data as any)?.diasVencimiento !== undefined && (
                  <div style={{ 
                    fontSize: '12px',
                    marginTop: '4px',
                    color: (data as any).diasVencimiento < 0 ? '#dc2626' : 
                          (data as any).diasVencimiento <= 7 ? '#f59e0b' : '#16a34a'
                  }}>
                    {(data as any).diasVencimiento < 0 
                      ? `Venció hace ${Math.abs((data as any).diasVencimiento)} días`
                      : (data as any).diasVencimiento === 0
                      ? 'Vence hoy'
                      : `Vence en ${(data as any).diasVencimiento} días`
                    }
                  </div>
                )}
              </dd>
            </div>

            {estado === 'Cerrada' && (
              <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                <dt style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                  Fecha de Cierre
                </dt>
                <dd style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: '0' }}>
                  {fcieliq}
                </dd>
              </div>
            )}
          </div>
        </div>

        {/* Metadatos del Sistema */}
        {metadatos && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '12px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              fontSize: '12px', 
              color: '#6b7280',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <span>📅 Última consulta: {new Date(metadatos.ultimaConsulta).toLocaleString('es-AR')}</span>
              <span>⚡ Tiempo de respuesta: {metadatos.tiempoRespuesta}ms</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  color: validaciones?.fechasValidas ? '#16a34a' : '#dc2626'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: validaciones?.fechasValidas ? '#22c55e' : '#ef4444'
                  }}></span>
                  Fechas
                </span>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  color: validaciones?.estadoConsistente ? '#16a34a' : '#dc2626'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: validaciones?.estadoConsistente ? '#22c55e' : '#ef4444'
                  }}></span>
                  Estado
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}