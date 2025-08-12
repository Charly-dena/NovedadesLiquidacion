import { type ReactNode } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

interface NavLinkProps {
  href: string;
  icon: ReactNode | string;
  children: ReactNode;
  badge?: string;
  description?: string;
  disabled?: boolean;
  action?: boolean;
  urgent?: boolean;
  onClick: () => void;
}

export function NavLink({ href, icon, children, badge, description, disabled = false, action = false, urgent = false, onClick }: NavLinkProps) {
  const renderIcon = () => {
    if (typeof icon === 'string') {
      return <span style={{ fontSize: '16px' }}>{icon}</span>;
    }
    return <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>;
  };

  if (disabled) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '12px',
        color: '#94a3b8',
        cursor: 'not-allowed',
        backgroundColor: 'rgba(248, 250, 252, 0.5)'
      }}>
        <span style={{
          flexShrink: 0,
          color: '#cbd5e1',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {renderIcon()}
        </span>
        <div style={{ marginLeft: '12px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>{children}</span>
            {badge && (
              <span style={{
                marginLeft: '8px',
                display: 'inline-block',
                padding: '4px 8px',
                fontSize: '12px',
                borderRadius: '8px',
                backgroundColor: '#e2e8f0',
                color: '#64748b',
                fontWeight: '500'
              }}>
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0 0' }}>
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Estilos especiales para botones de acción
  if (action) {
    return (
      <RouterNavLink
        to={href}
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '700',
          borderRadius: '12px',
          transition: 'all 0.3s',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(to right, #10b981, #14b8a6)',
          color: 'white',
          textDecoration: 'none',
          boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -2px rgba(16, 185, 129, 0.05)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(16, 185, 129, 0.4), 0 10px 10px -5px rgba(16, 185, 129, 0.04)';
          e.currentTarget.style.background = 'linear-gradient(to right, #059669, #0d9488)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -2px rgba(16, 185, 129, 0.05)';
          e.currentTarget.style.background = 'linear-gradient(to right, #10b981, #14b8a6)';
        }}
      >
        <span style={{
          flexShrink: 0,
          marginRight: '12px',
          color: 'white',
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
        }}>
          {renderIcon()}
        </span>
        <span style={{
          flex: 1,
          fontWeight: '700',
          color: 'white',
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
        }}>
          {children}
        </span>
      </RouterNavLink>
    );
  }

  return (
    <RouterNavLink
      to={href}
      onClick={onClick}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        fontSize: '14px',
        fontWeight: '600',
        borderRadius: '12px',
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        background: isActive 
          ? 'linear-gradient(to right, #3b82f6, #2563eb)' 
          : 'transparent',
        color: isActive ? 'white' : '#374151',
        boxShadow: isActive ? '0 10px 15px -3px rgba(59, 130, 246, 0.25), 0 4px 6px -2px rgba(59, 130, 246, 0.05)' : 'none'
      })}
      onMouseEnter={(e) => {
        if (!e.currentTarget.pathname || window.location.pathname !== e.currentTarget.pathname) {
          e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 0.8)';
          e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        const isActive = window.location.pathname === href;
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {({ isActive }) => (
        <>
          <span style={{
            flexShrink: 0,
            marginRight: '12px',
            transition: 'all 0.3s',
            color: isActive ? 'white' : '#6b7280',
            filter: isActive ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' : 'none'
          }}>
            {renderIcon()}
          </span>
          <span style={{
            flex: 1,
            fontWeight: '600',
            transition: 'all 0.3s',
            color: isActive ? 'white' : '#374151',
            filter: isActive ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' : 'none'
          }}>
            {children}
          </span>
          {badge && (
            <span style={{
              marginLeft: '8px',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: '700',
              borderRadius: '9999px',
              transition: 'all 0.3s',
              background: urgent
                ? '#ef4444'
                : isActive 
                  ? 'rgba(255, 255, 255, 0.2)'
                  : '#f3f4f6',
              color: urgent
                ? 'white'
                : isActive 
                  ? 'white'
                  : '#4b5563',
              boxShadow: urgent ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
            }}>
              {badge}
            </span>
          )}
        </>
      )}
    </RouterNavLink>
  );
}