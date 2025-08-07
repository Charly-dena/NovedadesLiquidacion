export function LiquidacionCreate() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-secondary-200 pb-4">
        <h1 className="text-2xl font-semibold text-secondary-900">Nueva Liquidación</h1>
        <p className="text-secondary-600 mt-1">
          Crear una nueva liquidación de sueldos
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
                placeholder="2024004"
                required
              />
            </div>
            <div>
              <label className="label">Empresa *</label>
              <select className="input" required>
                <option value="">Seleccionar empresa</option>
                <option value="1">Empresa ABC</option>
                <option value="2">Empresa XYZ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Tipo de Liquidación *</label>
              <select className="input" required>
                <option value="">Seleccionar tipo</option>
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
                required
              />
            </div>
            <div>
              <label className="label">Fecha Liquidación *</label>
              <input 
                type="date" 
                className="input"
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
                required
              />
            </div>
            <div>
              <label className="label">Fecha de Pago *</label>
              <input 
                type="date" 
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Observaciones</label>
            <textarea 
              className="input" 
              rows={3}
              placeholder="Notas adicionales sobre la liquidación"
            />
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
              Crear Liquidación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}