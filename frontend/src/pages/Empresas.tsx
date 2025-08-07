export function EmpresasPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-secondary-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900">Empresas</h1>
          <p className="text-secondary-600 mt-1">
            Gestión de empresas del sistema
          </p>
        </div>
        <button className="btn btn-primary">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Empresa
        </button>
      </div>

      {/* Empresas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 1, nombre: 'Empresa ABC', empleados: 45, liquidaciones: 12, estado: 'Activa' },
          { id: 2, nombre: 'Empresa XYZ', empleados: 23, liquidaciones: 8, estado: 'Activa' },
          { id: 3, nombre: 'Empresa 123', empleados: 67, liquidaciones: 15, estado: 'Inactiva' },
        ].map((empresa) => (
          <div key={empresa.id} className="card hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                empresa.estado === 'Activa' 
                  ? 'bg-success-100 text-success-800' 
                  : 'bg-secondary-100 text-secondary-600'
              }`}>
                {empresa.estado}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {empresa.nombre}
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Empleados</span>
                <span className="font-medium text-secondary-900">{empresa.empleados}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Liquidaciones</span>
                <span className="font-medium text-secondary-900">{empresa.liquidaciones}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-secondary-200 flex items-center justify-between">
              <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                Ver detalles
              </button>
              <div className="flex items-center space-x-2">
                <button className="text-secondary-600 hover:text-secondary-800">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="text-secondary-600 hover:text-secondary-800">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}