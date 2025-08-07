export function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-secondary-200 pb-4">
        <h1 className="text-2xl font-semibold text-secondary-900">Configuración</h1>
        <p className="text-secondary-600 mt-1">
          Configuración general del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Sidebar */}
        <div className="card">
          <nav className="space-y-1">
            <a href="#" className="bg-primary-50 text-primary-700 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <svg className="text-primary-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              General
            </a>
            
            <a href="#" className="text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <svg className="text-secondary-400 group-hover:text-secondary-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Usuario
            </a>
            
            <a href="#" className="text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <svg className="text-secondary-400 group-hover:text-secondary-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Seguridad
            </a>
            
            <a href="#" className="text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <svg className="text-secondary-400 group-hover:text-secondary-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 17h5l-5-5V9c0-3-2-5-5-5s-5 2-5 5v3l-5 5h5m5 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notificaciones
            </a>
            
            <a href="#" className="text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
              <svg className="text-secondary-400 group-hover:text-secondary-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              API
            </a>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-secondary-900">Configuración General</h2>
            </div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Nombre de la Aplicación</label>
                  <input 
                    type="text" 
                    className="input"
                    defaultValue="NovedadLiq"
                  />
                </div>
                <div>
                  <label className="label">Empresa Principal</label>
                  <select className="input">
                    <option>Empresa ABC</option>
                    <option>Empresa XYZ</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="label">Zona Horaria</label>
                <select className="input">
                  <option>America/Argentina/Buenos_Aires</option>
                  <option>America/Montevideo</option>
                  <option>America/Santiago</option>
                </select>
              </div>
              
              <div>
                <label className="label">Formato de Fecha</label>
                <select className="input">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="backup" className="h-4 w-4 text-primary-600 border-secondary-300 rounded" />
                <label htmlFor="backup" className="ml-2 text-sm text-secondary-700">
                  Realizar backup automático diario
                </label>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="notifications" className="h-4 w-4 text-primary-600 border-secondary-300 rounded" />
                <label htmlFor="notifications" className="ml-2 text-sm text-secondary-700">
                  Enviar notificaciones por email
                </label>
              </div>
            </form>
          </div>

          {/* API Configuration */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-secondary-900">Configuración de API</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Endpoint ApiIdeafix</label>
                <input 
                  type="url" 
                  className="input"
                  placeholder="https://api.ideafix.com"
                />
              </div>
              
              <div>
                <label className="label">Timeout (segundos)</label>
                <input 
                  type="number" 
                  className="input"
                  defaultValue="30"
                />
              </div>
              
              <div className="bg-secondary-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-secondary-900 mb-2">Endpoints Disponibles</h4>
                <div className="space-y-1 text-sm text-secondary-600">
                  <div>GET /idx/liq - Liquidaciones</div>
                  <div>GET /idx/emps - Empresas</div>
                  <div>GET /idx/tliq - Tipos de liquidación</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button type="button" className="btn btn-secondary">
              Restablecer
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}