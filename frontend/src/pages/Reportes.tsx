export function ReportesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-secondary-200 pb-4">
        <h1 className="text-2xl font-semibold text-secondary-900">Reportes</h1>
        <p className="text-secondary-600 mt-1">
          Análisis y reportes del sistema de liquidaciones
        </p>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'Liquidaciones por Empresa',
            description: 'Resumen de liquidaciones agrupadas por empresa',
            icon: (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            ),
            color: 'primary'
          },
          {
            title: 'Análisis de Períodos',
            description: 'Comparativa de liquidaciones por período',
            icon: (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
            color: 'success'
          },
          {
            title: 'Estados de Liquidación',
            description: 'Distribución de liquidaciones por estado',
            icon: (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            ),
            color: 'warning'
          },
          {
            title: 'Montos y Totales',
            description: 'Resumen financiero de liquidaciones',
            icon: (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: 'secondary'
          },
          {
            title: 'Empleados por Empresa',
            description: 'Distribución de empleados en liquidaciones',
            icon: (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ),
            color: 'primary'
          },
          {
            title: 'Exportar Datos',
            description: 'Exportar reportes en diferentes formatos',
            icon: (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
            color: 'success'
          }
        ].map((report, index) => (
          <div key={index} className="card hover-lift cursor-pointer">
            <div className={`h-12 w-12 bg-${report.color}-100 rounded-lg flex items-center justify-center mb-4`}>
              <div className={`text-${report.color}-600`}>
                {report.icon}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {report.title}
            </h3>
            
            <p className="text-secondary-600 text-sm mb-4">
              {report.description}
            </p>
            
            <button className={`btn btn-${report.color === 'secondary' ? 'secondary' : 'primary'} w-full`}>
              Ver Reporte
            </button>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-secondary-900">Estadísticas Rápidas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">12</div>
            <div className="text-sm text-secondary-600 mt-1">Total Liquidaciones</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success-600">8</div>
            <div className="text-sm text-secondary-600 mt-1">Liquidaciones Cerradas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning-600">4</div>
            <div className="text-sm text-secondary-600 mt-1">Liquidaciones Abiertas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary-900">3</div>
            <div className="text-sm text-secondary-600 mt-1">Empresas Activas</div>
          </div>
        </div>
      </div>
    </div>
  );
}