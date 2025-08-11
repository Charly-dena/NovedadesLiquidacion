import { useState } from 'react';

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: '3 liquidaciones pendientes de revisión', time: '2 min ago', unread: true },
    { id: 2, type: 'success', message: 'Liquidación LC-2024-001 procesada correctamente', time: '1 hora ago', unread: true },
    { id: 3, type: 'info', message: 'Respaldo automático completado', time: '3 horas ago', unread: false }
  ]);

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: '0' }}>Dashboard</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '16px' }}>
            Bienvenido al sistema de gestión de liquidaciones
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          >
            <option value="dia">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="trimestre">Trimestre</option>
          </select>
          
          <button className="btn btn-primary" style={{ fontSize: '14px' }}>
            <span style={{ marginRight: '8px' }}>+</span>
            Nueva Liquidación
          </button>
        </div>
      </div>

      {/* Notifications Bar */}
      {notifications.filter(n => n.unread).length > 0 && (
        <div style={{
          backgroundColor: '#dbeafe',
          borderLeft: '4px solid #3b82f6',
          padding: '16px',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🔔</span>
              <span style={{ color: '#1e40af', fontWeight: '500' }}>
                Tienes {notifications.filter(n => n.unread).length} notificaciones pendientes
              </span>
            </div>
            <button 
              onClick={() => setNotifications(prev => prev.map(n => ({...n, unread: false})))}
              style={{
                color: '#2563eb',
                fontSize: '14px',
                fontWeight: '500',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Marcar todas como leídas
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {/* Total Liquidaciones */}
        <div className="card" style={{
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
                Total Liquidaciones
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                156
              </p>
              <p style={{ fontSize: '12px', color: '#16a34a', margin: '0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>📈</span> +12% vs mes anterior
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>📊</span>
            </div>
          </div>
        </div>

        {/* Liquidaciones Cerradas */}
        <div className="card" style={{
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
                Cerradas
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                89
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                57% del total
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>✅</span>
            </div>
          </div>
        </div>

        {/* Liquidaciones Abiertas */}
        <div className="card" style={{
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
                Abiertas
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                67
              </p>
              <p style={{ fontSize: '12px', color: '#d97706', margin: '0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>⏰</span> 3 vencen hoy
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>⏳</span>
            </div>
          </div>
        </div>

        {/* Empresas Activas */}
        <div className="card" style={{
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
                Empresas Activas
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                12
              </p>
              <p style={{ fontSize: '12px', color: '#2563eb', margin: '0' }}>
                2 nuevas este mes
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#e0e7ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>🏢</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚡</span> Acciones Rápidas
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px'
          }}>
            <button className="btn btn-primary" style={{
              padding: '16px',
              height: 'auto',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              gap: '8px'
            }}>
              <span style={{ fontSize: '18px' }}>➕</span>
              <span style={{ fontWeight: '600', fontSize: '14px' }}>Nueva Liquidación</span>
              <span style={{ fontSize: '12px', opacity: '0.8' }}>Crear liquidación para una empresa</span>
            </button>
            
            <button className="btn btn-secondary" style={{
              padding: '16px',
              height: 'auto',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              gap: '8px'
            }}>
              <span style={{ fontSize: '18px' }}>📊</span>
              <span style={{ fontWeight: '600', fontSize: '14px' }}>Ver Reportes</span>
              <span style={{ fontSize: '12px', opacity: '0.8' }}>Análisis y estadísticas</span>
            </button>
            
            <button className="btn btn-secondary" style={{
              padding: '16px',
              height: 'auto',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              gap: '8px'
            }}>
              <span style={{ fontSize: '18px' }}>🔍</span>
              <span style={{ fontWeight: '600', fontSize: '14px' }}>Buscar Liquidación</span>
              <span style={{ fontSize: '12px', opacity: '0.8' }}>Por número o empresa</span>
            </button>
            
            <button className="btn btn-secondary" style={{
              padding: '16px',
              height: 'auto',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              gap: '8px'
            }}>
              <span style={{ fontSize: '18px' }}>⚙️</span>
              <span style={{ fontWeight: '600', fontSize: '14px' }}>Configuración</span>
              <span style={{ fontSize: '12px', opacity: '0.8' }}>Parámetros del sistema</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🕐</span> Actividad Reciente
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#dcfce7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: '0'
              }}>
                <span style={{ fontSize: '14px' }}>✅</span>
              </div>
              <div style={{ minWidth: '0', flex: '1' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: '0' }}>
                  Liquidación procesada exitosamente
                </p>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0 0' }}>
                  LC-2024-001 • Empresa ABC Corp
                </p>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                  Hace 2 horas
                </p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: '0'
              }}>
                <span style={{ fontSize: '14px' }}>➕</span>
              </div>
              <div style={{ minWidth: '0', flex: '1' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: '0' }}>
                  Nueva liquidación creada
                </p>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0 0' }}>
                  LC-2024-002 • TechStart SRL
                </p>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                  Hace 4 horas
                </p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#fef3c7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: '0'
              }}>
                <span style={{ fontSize: '14px' }}>✏️</span>
              </div>
              <div style={{ minWidth: '0', flex: '1' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: '0' }}>
                  Liquidación modificada
                </p>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0 0' }}>
                  LC-2024-003 • Industrial Mendoza SA
                </p>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                  Ayer
                </p>
              </div>
            </div>
            
            <div style={{ paddingTop: '8px' }}>
              <button style={{
                fontSize: '14px',
                color: '#2563eb',
                fontWeight: '500',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}>
                Ver toda la actividad →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔔</span> Notificaciones
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '8px',
                  borderLeft: '4px solid',
                  borderLeftColor: 
                    notification.type === 'warning' ? '#f59e0b' :
                    notification.type === 'success' ? '#10b981' : '#3b82f6',
                  backgroundColor: 
                    notification.type === 'warning' ? '#fffbeb' :
                    notification.type === 'success' ? '#f0fdf4' : '#eff6ff',
                  border: notification.unread ? '2px solid #93c5fd' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 
                      notification.type === 'warning' ? '#fbbf24' :
                      notification.type === 'success' ? '#34d399' : '#60a5fa'
                  }}>
                    <span style={{ fontSize: '12px', color: 'white' }}>
                      {notification.type === 'warning' ? '⚠️' : 
                       notification.type === 'success' ? '✅' : 'ℹ️'}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: '0' }}>
                      {notification.message}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                      {notification.time}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => dismissNotification(notification.id)}
                  style={{
                    color: '#9ca3af',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '0',
                    width: '20px',
                    height: '20px'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}