# Frontend - NovedadesLiquidacion

Sistema de gestión de liquidaciones de sueldos desarrollado con React + TypeScript + Vite.

## 🚀 Setup Completo

### Stack Técnico
- **React 19** con TypeScript estricto
- **Vite** para desarrollo y build optimizado
- **ESLint + Prettier** configurados
- **Husky + lint-staged** para pre-commit hooks
- **Path aliases** configurados para imports limpios

## 📋 Scripts Disponibles

```bash
npm run dev         # Servidor de desarrollo
npm run build       # Build de producción
npm run preview     # Preview del build
npm run lint        # Verificar código con ESLint
npm run lint:fix    # Corregir problemas de ESLint
npm run format      # Formatear código con Prettier
npm run format:check # Verificar formato
```

## 🏗️ Arquitectura Modular

```
src/
├── modules/
│   ├── liquidaciones/      # 📋 Módulo liquidaciones (Fase 1)
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   └── novedades/          # 📝 Módulo novedades (Fase 2)
├── shared/                 # 🟡 Componentes compartidos
│   ├── components/
│   ├── services/
│   └── types/
├── core/                   # 🟣 Configuración base
│   ├── layout/
│   └── routing/
└── utils/                  # Utilidades
```

## 🎯 Path Aliases

```typescript
import Component from '@/components/Component'
import { service } from '@/services/api'
import { Type } from '@/types/common'
```

## ✅ Configuraciones

- ✅ TypeScript modo estricto
- ✅ ESLint con reglas React + TypeScript
- ✅ Prettier configurado
- ✅ Path aliases funcionando
- ✅ Pre-commit hooks configurados
- ✅ Build y dev scripts funcionando
- ✅ Estructura modular preparada

## 🔄 Próximos Pasos

- Issue #6: Configurar TailwindCSS
- Issue #7: Layout base y navegación
- Issue #8: React Router
- Issue #9: Servicios API
- Issue #10: Componentes base