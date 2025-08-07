/**
 * Configuración de breakpoints responsive para el layout
 * Alineado con TailwindCSS breakpoints
 */

export const BREAKPOINTS = {
  sm: 640,   // Tablets pequeñas
  md: 768,   // Tablets 
  lg: 1024,  // Desktop pequeño
  xl: 1280,  // Desktop grande
  '2xl': 1536, // Desktop extra grande
} as const;

export const LAYOUT_CONFIG = {
  // Sidebar
  sidebar: {
    width: 256, // 64 * 4 = w-64 en Tailwind
    collapsedWidth: 64, // w-16 en Tailwind
    mobileBreakpoint: BREAKPOINTS.lg, // Hidden en mobile, visible en lg+
  },
  
  // Header
  header: {
    height: 64, // h-16 en Tailwind
    mobileHeight: 56, // h-14 en Tailwind para mobile
  },
  
  // Content
  content: {
    maxWidth: 1280, // max-w-7xl en Tailwind
    padding: {
      mobile: 16,   // px-4 en Tailwind
      tablet: 24,   // px-6 en Tailwind  
      desktop: 32,  // px-8 en Tailwind
    },
  },
  
  // Z-index layers
  zIndex: {
    mobileSidebar: 50,    // z-50
    mobileOverlay: 40,    // z-40
    header: 30,           // z-30
    dropdown: 20,         // z-20
  }
} as const;

/**
 * Hook personalizado para detectar breakpoints
 * Nota: Para implementar en el futuro cuando necesitemos
 * lógica condicional basada en tamaño de pantalla
 */
export function getBreakpointConfig() {
  return {
    isMobile: window.innerWidth < BREAKPOINTS.lg,
    isTablet: window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg,
    isDesktop: window.innerWidth >= BREAKPOINTS.lg,
    currentBreakpoint: getCurrentBreakpoint(),
  };
}

function getCurrentBreakpoint(): keyof typeof BREAKPOINTS {
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  return 'sm';
}

/**
 * Utility classes para responsive design
 */
export const RESPONSIVE_CLASSES = {
  // Container responsive
  container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  
  // Grid responsive común
  grid: {
    cards: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    stats: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    dashboard: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  },
  
  // Spacing responsive
  spacing: {
    section: 'py-6 sm:py-8 lg:py-12',
    card: 'p-4 sm:p-6',
    tight: 'p-3 sm:p-4',
  },
  
  // Typography responsive
  typography: {
    hero: 'text-2xl sm:text-3xl lg:text-4xl font-bold',
    title: 'text-xl sm:text-2xl font-semibold',
    subtitle: 'text-lg sm:text-xl font-medium',
    body: 'text-sm sm:text-base',
  }
} as const;