export function NovedadesPage() {
  return (
    <div className="space-y-6">
      {/* Fase 2 Notice */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="ml-4 flex-1">
            <h2 className="text-xl font-semibold text-primary-900">
              Módulo de Novedades - Fase 2
            </h2>
            <p className="text-primary-700 mt-1">
              Este módulo estará disponible en la Fase 2 del proyecto, una vez completado el MVP de liquidaciones.
            </p>
          </div>
          <div className="ml-6">
            <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800">
              Próximamente
            </span>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-secondary-900">Vista Previa - Funcionalidades Planificadas</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Dashboard de Novedades',
              description: 'Vista general de novedades por empleado y empresa',
              icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
            },
            {
              title: 'Gestión por Empleado',
              description: 'CRUD completo de novedades individuales',
              icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
            },
            {
              title: 'Reportes Avanzados',
              description: 'Exportación y análisis de datos de novedades',
              icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
            },
            {
              title: 'Integración con Liquidaciones',
              description: 'Conexión directa con el módulo de liquidaciones',
              icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              ),
            },
          ].map((feature, index) => (
            <div key={index} className="p-4 border border-secondary-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="h-8 w-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <div className="text-secondary-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="ml-3 text-sm font-semibold text-secondary-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm text-secondary-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-secondary-900">Roadmap de Desarrollo</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-success-100 rounded-full flex items-center justify-center">
              <svg className="h-4 w-4 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-secondary-900">Fase 1: MVP Liquidaciones</h4>
              <p className="text-sm text-secondary-600">En desarrollo - 33% completado</p>
            </div>
            <span className="text-sm font-medium text-success-600">En Progreso</span>
          </div>
          
          <div className="flex items-center">
            <div className="h-8 w-8 bg-secondary-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-secondary-600">2</span>
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-secondary-900">Fase 2: Módulo de Novedades</h4>
              <p className="text-sm text-secondary-600">Planificado - Inicio Q2 2025</p>
            </div>
            <span className="text-sm font-medium text-secondary-500">Planificado</span>
          </div>
          
          <div className="flex items-center">
            <div className="h-8 w-8 bg-secondary-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-secondary-600">3</span>
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-secondary-900">Fase 3: Integraciones Avanzadas</h4>
              <p className="text-sm text-secondary-600">Futuro - Q3 2025</p>
            </div>
            <span className="text-sm font-medium text-secondary-500">Futuro</span>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="text-center">
        <p className="text-secondary-600">
          ¿Tienes sugerencias para el módulo de novedades?{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
            Comparte tus ideas
          </a>
        </p>
      </div>
    </div>
  );
}