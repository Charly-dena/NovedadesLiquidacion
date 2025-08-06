# 🤝 Guía de Contribución - NovedadesLiquidacion

## 📋 Flujo de Desarrollo

### Branches
- `main` - Código estable y deployable
- `develop` - Integración de nuevas funcionalidades  
- `feature/*` - Nuevas funcionalidades
- `bugfix/*` - Corrección de errores

### Commits
Seguir formato [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: agregar grid de liquidaciones
fix: corregir validación de fechas
docs: actualizar README con roadmap
style: aplicar formato TailwindCSS
refactor: reorganizar estructura de componentes
test: agregar tests unitarios para LiquidacionForm
```

## 🏗️ Estructura de Desarrollo

### Directorios de Trabajo
```
/frontend/src/
├── modules/
│   ├── liquidaciones/          # Fase 1 actual
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   └── novedades/              # Fase 2 futura
├── shared/                     # Componentes compartidos
└── core/                       # Configuraciones base
```

### Convenciones de Código
- **TypeScript** estricto (no `any`)
- **TailwindCSS** para todos los estilos
- **React Hooks** (funcional components)
- **Error boundaries** para manejo de errores

## 📝 Documentación

### Mantener Actualizado
- `README.md` - Estado y progreso general
- `docs/PLAN_REFORMULADO.md` - Estrategia técnica
- Issues de GitHub - Seguimiento detallado

### Documentar APIs
```typescript
/**
 * Servicio para gestión de liquidaciones
 * Integra con endpoints /idx/* de ApiIdeafix
 */
interface LiquidacionService {
  /** Obtener todas las liquidaciones */
  getLiquidaciones(): Promise<Liquidacion[]>
  /** Crear nueva liquidación */
  createLiquidacion(data: NuevaLiquidacion): Promise<Liquidacion>
}
```

## 🧪 Testing

### Estrategia de Testing
- **Unit Tests**: Componentes aislados
- **Integration Tests**: Servicios API
- **E2E Tests**: Flujos críticos

### Cobertura Mínima
- 80% cobertura en servicios
- 70% cobertura en componentes
- 100% cobertura en validaciones críticas

## 🚀 Deploy

### Ambientes
- **Development**: Local + Hot Reload
- **Staging**: Pre-producción con datos de prueba
- **Production**: Integración con ApiIdeafix real

### Checklist Pre-Deploy
- [ ] Tests pasando ✅
- [ ] Build sin errores ✅  
- [ ] Validaciones frontend completas ✅
- [ ] Integración API funcionando ✅
- [ ] Documentación actualizada ✅

## 📞 Comunicación

### Reporting Issues
1. **Template de Bug Report**
2. **Template de Feature Request**  
3. **Labels organizados** por módulo/prioridad

### Code Review
- Al menos 1 reviewer por PR
- Focus en arquitectura evolutiva
- Verificar preparación para Fase 2