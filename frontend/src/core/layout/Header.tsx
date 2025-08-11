interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  
  const handleMenuClick = () => {
    console.log('Menu clicked!'); // Debug
    onMenuClick();
  };
  return (
    <header className="bg-white border-b border-secondary-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section: Menu + Logo */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Button - Always visible */}
          <button
            onClick={handleMenuClick}
            aria-label="Abrir menú"
            style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '2px solid #0284c7',
              color: '#0284c7',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '48px',
              minHeight: '48px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0284c7';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.color = '#0284c7';
            }}
          >
            ☰
          </button>

          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
            }}>
              <span style={{ fontSize: '16px', filter: 'brightness(1.2)' }}>💰</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-secondary-900">NovedadLiq</h1>
              <p className="text-xs text-secondary-500 hidden sm:block">Gestión de Liquidaciones</p>
            </div>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center space-x-3">
          {/* Search (Desktop only) */}
          <div className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar liquidaciones..."
                className="input w-64 pl-10 pr-4 py-2 text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <button 
            className="p-3 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-200 relative hover:scale-105"
            style={{
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}
          >
            <span style={{ fontSize: '18px' }}>🔔</span>
            <span 
              className="absolute -top-1 -right-1 h-5 w-5 text-white text-xs rounded-full flex items-center justify-center font-bold"
              style={{ 
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)'
              }}
            >
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div 
              className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
              }}
            >
              <span style={{ fontSize: '14px' }}>👤</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-semibold text-secondary-900">
                Usuario Admin
              </span>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: '0' }}>
                Administrador
              </p>
            </div>
            <button 
              className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-all duration-200"
              style={{ minWidth: '32px', height: '32px' }}
            >
              <span style={{ fontSize: '16px' }}>▼</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}