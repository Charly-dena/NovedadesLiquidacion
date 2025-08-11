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
    return <span className="flex items-center justify-center">{icon}</span>;
  };

  if (disabled) {
    return (
      <div className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-secondary-400 cursor-not-allowed bg-secondary-50/50">
        <span className="flex-shrink-0 text-secondary-300 w-6 h-6 flex items-center justify-center">
          {renderIcon()}
        </span>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{children}</span>
            {badge && (
              <span className="ml-2 inline-block py-1 px-2 text-xs rounded-lg bg-secondary-200 text-secondary-500 font-medium">
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
        className="group flex items-center px-4 py-4 text-sm font-bold rounded-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-700 active:scale-95"
      >
        {() => (
          <>
            <span className="flex-shrink-0 mr-3 text-white drop-shadow-sm">
              {renderIcon()}
            </span>
            <span className="flex-1 font-bold text-white drop-shadow-sm">
              {children}
            </span>
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-white/10 group-hover:bg-white/20 transition-all duration-300" />
          </>
        )}
      </RouterNavLink>
    );
  }

  return (
    <RouterNavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) => `
        group flex items-center px-3 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 relative overflow-hidden
        ${isActive 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 hover:shadow-sm'
        }
      `.trim()}
    >
      {({ isActive }) => (
        <>
          <span className={`flex-shrink-0 mr-3 transition-all duration-300 ${
            isActive ? 'text-white drop-shadow-sm' : 'text-gray-500 group-hover:text-blue-600'
          }`}>
            {renderIcon()}
          </span>
          <span className={`flex-1 font-semibold transition-all duration-300 ${
            isActive ? 'text-white drop-shadow-sm' : 'text-gray-700 group-hover:text-gray-900'
          }`}>
            {children}
          </span>
          {badge && (
            <span className={`ml-2 px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
              urgent
                ? 'bg-red-500 text-white shadow-sm' 
                : isActive 
                  ? 'bg-white/20 text-white backdrop-blur-sm' 
                  : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700'
            }`}>
              {badge}
            </span>
          )}
          {/* Hover effect overlay */}
          <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
            isActive 
              ? 'bg-white/5' 
              : 'bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:via-blue-50/30 group-hover:to-blue-50/50'
          }`} />
        </>
      )}
    </RouterNavLink>
  );
}