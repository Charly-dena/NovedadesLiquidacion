import { type ReactNode } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

interface NavLinkProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  badge?: string;
  disabled?: boolean;
  onClick: () => void;
}

export function NavLink({ href, icon, children, badge, disabled = false, onClick }: NavLinkProps) {

  if (disabled) {
    return (
      <div className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-secondary-400 cursor-not-allowed">
        <span className="flex-shrink-0 text-secondary-300">
          {icon}
        </span>
        <span className="ml-3 flex-1">{children}</span>
        {badge && (
          <span className="ml-3 inline-block py-0.5 px-2 text-xs rounded-full bg-secondary-100 text-secondary-400">
            {badge}
          </span>
        )}
      </div>
    );
  }

  return (
    <RouterNavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) => `
        group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
        ${isActive 
          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500' 
          : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
        }
      `.trim()}
    >
      {({ isActive }) => (
        <>
          <span className={`flex-shrink-0 ${
            isActive ? 'text-primary-500' : 'text-secondary-400 group-hover:text-secondary-500'
          }`}>
            {icon}
          </span>
          <span className="ml-3 flex-1">{children}</span>
          {badge && (
            <span className={`ml-3 inline-block py-0.5 px-2 text-xs rounded-full ${
              isActive 
                ? 'bg-primary-100 text-primary-800' 
                : 'bg-secondary-100 text-secondary-600'
            }`}>
              {badge}
            </span>
          )}
        </>
      )}
    </RouterNavLink>
  );
}