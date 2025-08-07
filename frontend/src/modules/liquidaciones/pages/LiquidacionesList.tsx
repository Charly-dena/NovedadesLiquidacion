export function LiquidacionesList() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-secondary-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900">Liquidaciones</h1>
          <p className="text-secondary-600 mt-1">
            Gestión de liquidaciones de sueldos
          </p>
        </div>
        <button className="btn btn-primary">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Liquidación
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Empresa</label>
            <select className="input">
              <option>Todas las empresas</option>
              <option>Empresa ABC</option>
              <option>Empresa XYZ</option>
            </select>
          </div>
          <div>
            <label className="label">Estado</label>
            <select className="input">
              <option>Todos los estados</option>
              <option>Abierta</option>
              <option>Cerrada</option>
            </select>
          </div>
          <div>
            <label className="label">Desde</label>
            <input type="date" className="input" />
          </div>
          <div>
            <label className="label">Hasta</label>
            <input type="date" className="input" />
          </div>
        </div>
      </div>

      {/* Liquidaciones Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 font-semibold text-secondary-700">Número</th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-700">Empresa</th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-700">Periodo</th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-700">Tipo</th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-700">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: '2024001', empresa: 'Empresa ABC', periodo: 'Enero 2024', tipo: 'Mensual', estado: 'Abierta' },
                { id: '2024002', empresa: 'Empresa XYZ', periodo: 'Enero 2024', tipo: 'Mensual', estado: 'Cerrada' },
                { id: '2024003', empresa: 'Empresa ABC', periodo: 'Febrero 2024', tipo: 'Mensual', estado: 'Abierta' },
              ].map((liquidacion) => (
                <tr key={liquidacion.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="py-3 px-4 font-medium text-secondary-900">#{liquidacion.id}</td>
                  <td className="py-3 px-4 text-secondary-600">{liquidacion.empresa}</td>
                  <td className="py-3 px-4 text-secondary-600">{liquidacion.periodo}</td>
                  <td className="py-3 px-4 text-secondary-600">{liquidacion.tipo}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      liquidacion.estado === 'Abierta' 
                        ? 'bg-warning-100 text-warning-800' 
                        : 'bg-success-100 text-success-800'
                    }`}>
                      {liquidacion.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-primary-600 hover:text-primary-800">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {liquidacion.estado === 'Abierta' && (
                        <button className="text-secondary-600 hover:text-secondary-800">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}