export function LiquidacionEdit() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-secondary-200 pb-4">
        <h1 className="text-2xl font-semibold text-secondary-900">Editar Liquidación #2024001</h1>
        <p className="text-secondary-600 mt-1">
          Empresa ABC - Enero 2024
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Número de Liquidación *</label>
              <input 
                type="text" 
                className="input" 
                defaultValue="2024001"
                required
                disabled
              />
              <p className="text-xs text-secondary-500 mt-1">
                El número no se puede modificar una vez creada la liquidación
              </p>
            </div>
            <div>
              <label className="label">Empresa *</label>
              <select className="input" required disabled>
                <option value="1">Empresa ABC</option>
              </select>
              <p className="text-xs text-secondary-500 mt-1">
                La empresa no se puede modificar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Tipo de Liquidación *</label>
              <select className="input" required defaultValue="mensual">
                <option value="mensual">Mensual</option>
                <option value="quincenal">Quincenal</option>
                <option value="semanal">Semanal</option>
                <option value="aguinaldo">Aguinaldo</option>
              </select>
            </div>
            <div>
              <label className="label">Periodo *</label>
              <input 
                type="month" 
                className="input"
                defaultValue="2024-01"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Fecha Valor Contable *</label>
              <input 
                type="date" 
                className="input"
                defaultValue="2024-01-31"
                required
              />
            </div>
            <div>
              <label className="label">Fecha Liquidación *</label>
              <input 
                type="date" 
                className="input"
                defaultValue="2024-01-31"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Fecha Último Depósito *</label>
              <input 
                type="date" 
                className="input"
                defaultValue="2024-01-30"
                required
              />
              <p className="text-xs text-secondary-500 mt-1">
                No puede ser domingo ni feriado, y debe ser anterior a la fecha de liquidación
              </p>
            </div>
            <div>
              <label className="label">Fecha de Pago *</label>
              <input 
                type="date" 
                className="input"
                defaultValue="2024-02-05"
                required
              />
              <p className="text-xs text-secondary-500 mt-1">
                Debe ser igual o posterior a la fecha de liquidación
              </p>
            </div>
          </div>

          <div>
            <label className="label">Observaciones</label>
            <textarea 
              className="input" 
              rows={3}
              placeholder="Notas adicionales sobre la liquidación"
              defaultValue="Liquidación mensual de enero 2024"
            />
          </div>

          {/* Warning */}
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-warning-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-warning-800 font-medium">
                  Importante
                </p>
                <p className="text-sm text-warning-700 mt-1">
                  Solo se pueden editar liquidaciones en estado "Abierta". 
                  Una vez cerrada, los datos no podrán modificarse.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-secondary-200">
            <button 
              type="button" 
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}