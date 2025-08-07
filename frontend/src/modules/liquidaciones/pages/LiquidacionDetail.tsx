export function LiquidacionDetail() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-secondary-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900">Liquidación #2024001</h1>
          <p className="text-secondary-600 mt-1">
            Empresa ABC - Enero 2024
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-warning-100 text-warning-800">
            Abierta
          </span>
          <button className="btn btn-secondary">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          <button className="btn btn-success">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Cerrar Liquidación
          </button>
        </div>
      </div>

      {/* Liquidación Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-secondary-900">Información General</h2>
          </div>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-secondary-600">Número</dt>
              <dd className="text-sm text-secondary-900">#2024001</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-secondary-600">Empresa</dt>
              <dd className="text-sm text-secondary-900">Empresa ABC</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-secondary-600">Tipo</dt>
              <dd className="text-sm text-secondary-900">Mensual</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-secondary-600">Periodo</dt>
              <dd className="text-sm text-secondary-900">Enero 2024</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-secondary-600">Estado</dt>
              <dd className="text-sm">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-warning-100 text-warning-800">
                  Abierta
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Dates */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-secondary-900">Fechas</h2>
          </div>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-secondary-600">Valor Contable</dt>
              <dd className="text-sm text-secondary-900">31/01/2024</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-secondary-600">Liquidación</dt>
              <dd className="text-sm text-secondary-900">31/01/2024</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-secondary-600">Último Depósito</dt>
              <dd className="text-sm text-secondary-900">30/01/2024</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-secondary-600">Pago</dt>
              <dd className="text-sm text-secondary-900">05/02/2024</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-secondary-600">Creada</dt>
              <dd className="text-sm text-secondary-900">15/01/2024</dd>
            </div>
          </dl>
        </div>

        {/* Stats */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-secondary-900">Estadísticas</h2>
          </div>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-secondary-600">Empleados</dt>
              <dd className="text-2xl font-semibold text-secondary-900">45</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-secondary-600">Total Bruto</dt>
              <dd className="text-2xl font-semibold text-success-600">$2,450,000</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-secondary-600">Total Neto</dt>
              <dd className="text-2xl font-semibold text-primary-600">$1,890,500</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-secondary-600">Descuentos</dt>
              <dd className="text-2xl font-semibold text-danger-600">$559,500</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-secondary-900">Acciones Disponibles</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn btn-primary">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar PDF
          </button>
          <button className="btn btn-secondary">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Duplicar
          </button>
          <button className="btn btn-secondary">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Ver Reportes
          </button>
          <button className="btn btn-warning">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Validar Datos
          </button>
        </div>
      </div>
    </div>
  );
}