import { NavLink } from './NavLink';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  console.log('Sidebar isOpen:', isOpen); // Debug
  
  // OPERACIONES - Trabajo diario de liquidaciones
  const operacionesItems = [
    {
      name: 'Nueva Liquidación',
      href: '/liquidaciones/nueva',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4V6H16C17.1 6 18 6.9 18 8V19C18 20.1 17.1 21 16 21H8C6.9 21 6 20.1 6 19V8C6 6.9 6.9 6 8 6H10V4C10 2.9 10.9 2 12 2ZM12 4V6H12V4ZM8 8V19H16V8H8ZM10 10H14V12H12V14H10V12H8V10H10Z"/>
        </svg>
      ),
      action: true
    },
    {
      name: 'Liquidaciones',
      href: '/liquidaciones',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          <circle cx="8" cy="12" r="1"/>
          <circle cx="8" cy="15" r="1"/>
          <circle cx="8" cy="18" r="1"/>
          <path d="M10,12H16V13H10V12Z"/>
          <path d="M10,15H16V16H10V15Z"/>
          <path d="M10,18H14V19H10V18Z"/>
        </svg>
      )
    },
    {
      name: 'Búsqueda Rápida',
      href: '/liquidaciones/buscar',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          <path d="M12,10.5H7V8.5H12V10.5Z"/>
        </svg>
      )
    }
  ];

  // GESTIÓN - Administración y configuración
  const gestionItems = [
    {
      name: 'Empresas',
      href: '/empresas',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,7V3H2V21H22V7H12M6,19H4V17H6V19M6,15H4V13H6V15M6,11H4V9H6V11M6,7H4V5H6V7M10,19H8V17H10V19M10,15H8V13H10V15M10,11H8V9H10V11M10,7H8V5H10V7M20,19H18V17H20V19M20,15H18V13H20V15M20,11H18V9H20V11M16,19H14V17H16V19M16,15H14V13H16V15M16,11H14V9H16V11"/>
        </svg>
      )
    },
    {
      name: 'Usuarios',
      href: '/usuarios',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12C13.8 12 12 10.2 12 8S13.8 4 16 4M16 6C14.9 6 14 6.9 14 8S14.9 10 16 10 18 9.1 18 8 17.1 6 16 6M16 13C18.67 13 22 14.33 22 17V20H10V17C10 14.33 13.33 13 16 13M16 14.9C14.03 14.9 11.9 15.36 11.9 17V18.1H20.1V17C20.1 15.36 17.97 14.9 16 14.9M9 12C10.66 12 12 10.66 12 9S10.66 6 9 6 6 7.34 6 9 7.34 12 9 12M9 8C9.55 8 10 8.45 10 9S9.55 10 9 10 8 9.55 8 9 8.45 8 9 8M9 13C6.67 13 1 14.17 1 16.5V19H9V17.5H2.5V16.5C2.5 15.5 6.5 14.5 9 14.5S15.5 15.5 15.5 16.5H9V19H15.5V16.5C15.5 14.17 9.83 13 9 13Z"/>
        </svg>
      )
    },
    {
      name: 'Configuración',
      href: '/configuracion',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
        </svg>
      )
    }
  ];

  // ANÁLISIS - Dashboard y reportes
  const analisisItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z"/>
        </svg>
      )
    },
    {
      name: 'Reportes',
      href: '/reportes',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/>
        </svg>
      )
    }
  ];


  return (
    <>
      {/* Hamburger Sidebar - Always overlay for all screen sizes */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '320px',
          zIndex: 60,
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
          border: 'none',
          backdropFilter: 'blur(8px)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'auto' }}>
            {/* Header with Logo and Close Button */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '24px',
                backgroundColor: 'white',
                borderBottom: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                }}>
                  <span style={{ fontSize: '20px', filter: 'brightness(1.2)' }}>💰</span>
                </div>
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: '0' }}>NovedadLiq</h1>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>Gestión de Liquidaciones</p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: '8px',
                  borderRadius: '12px',
                  backgroundColor: '#f1f5f9',
                  border: '2px solid #e2e8f0',
                  color: '#475569',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#475569';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', paddingTop: '32px' }}>
              {/* Navigation by Work Flows */}
              <nav style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* OPERACIONES */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '12px' }}></div>
                    <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      OPERACIONES
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {operacionesItems.map((item) => (
                      <NavLink
                        key={item.name}
                        href={item.href}
                        icon={item.icon}
                        badge={item.badge}
                        action={item.action}
                        onClick={onClose}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>

                {/* GESTIÓN */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%', marginRight: '12px' }}></div>
                    <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      GESTIÓN
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {gestionItems.map((item) => (
                      <NavLink
                        key={item.name}
                        href={item.href}
                        icon={item.icon}
                        badge={item.badge}
                        onClick={onClose}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>

                {/* ANÁLISIS */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#a855f7', borderRadius: '50%', marginRight: '12px' }}></div>
                    <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      ANÁLISIS
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {analisisItems.map((item) => (
                      <NavLink
                        key={item.name}
                        href={item.href}
                        icon={item.icon}
                        onClick={onClose}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>

              </nav>

              {/* Bottom User Section */}
              <div 
                style={{
                  flexShrink: 0,
                  padding: '16px 24px',
                  backgroundColor: 'white',
                  borderTop: '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '14px', color: 'white' }}>CA</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: '0' }}>
                      Carlos Admin
                    </p>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '0' }}>
                      Administrador
                    </p>
                  </div>
                  <span style={{ fontSize: '8px', color: '#16a34a' }}>●</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}