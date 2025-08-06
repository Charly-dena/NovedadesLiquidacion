# 🚀 NovedadesLiquidacion - Dashboard Evolutivo

Sistema de gestión de liquidaciones de sueldos con arquitectura evolutiva para expandir hacia módulo completo de novedades.

## 📊 Estado del Proyecto

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-orange)
![Fase](https://img.shields.io/badge/Fase%20Actual-1%20MVP%20Liquidaciones-blue)
![Stack](https://img.shields.io/badge/Stack-Node%20%2B%20React%20%2B%20Tailwind-green)

## 🎯 Evolución del Proyecto

### 🏗️ **Fase 1: Dashboard de Liquidaciones** *(En Desarrollo)*
> MVP funcional para gestión completa de liquidaciones

- ✅ Grid de liquidaciones con filtros avanzados
- ✅ CRUD completo de liquidaciones
- ✅ Estados (Abierta/Cerrada) y validaciones
- ✅ Integración con APIs `/idx/*` de ApiIdeafix

### 🔮 **Fase 2: Módulo de Novedades** *(Planificado)*
> Expansión hacia sistema completo de novedades por empleado

- 📋 Dashboard de métricas de novedades
- 👥 Gestión por empleado/empresa
- 📊 Reportes y exportaciones
- 🔗 Integración completa con liquidaciones

---

## 🛠️ Stack Técnico

| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| **Frontend** | React 18 + TypeScript + Vite | Interfaz de usuario |
| **Estilos** | TailwindCSS | Sistema de diseño |
| **Backend** | Node.js | Proxy/Cliente para ApiIdeafix |
| **APIs** | Servicios `/idx/*` (ApiIdeafix) | Datos de liquidaciones |

## 📋 Funcionalidades MVP (Fase 1)

### 🏢 Dashboard Principal
- **Grid de Liquidaciones** con datos en tiempo real
- **Filtros Avanzados**: Por empresa, fecha, estado
- **Acciones**: Ver detalle, crear, editar (solo abiertas)

### ✨ Gestión de Liquidaciones
- **Crear liquidaciones** con validaciones completas
- **Estados controlados**: Abierta → Cerrada (irreversible)
- **Validaciones de negocio** según especificaciones

### 🔍 APIs Integradas
```bash
GET /idx/liq     # Liquidaciones
GET /idx/emps    # Empresas  
GET /idx/tliq    # Tipos de liquidación
```

---

## 🎨 Vista Previa de Pantallas

### Consulta de Liquidación
<img width="665" height="593" alt="Detalle de liquidación" src="https://github.com/user-attachments/assets/c51a4735-f594-48dd-8005-ebc83cd51348" />

### Estructura de Datos
<img width="706" height="898" alt="Modelo de datos" src="https://github.com/user-attachments/assets/0b68b798-74e5-47cb-90a7-44e5a60e67e7" />

---

## 📁 Estructura del Proyecto

```
NovedadesLiquidacion/
├── 📂 frontend/                # React Application
│   ├── 📂 src/
│   │   ├── 📂 modules/
│   │   │   ├── 📋 liquidaciones/   # Fase 1 (Actual)
│   │   │   └── 📝 novedades/       # Fase 2 (Futuro)
│   │   ├── 📂 shared/
│   │   │   ├── 🎨 components/      # Tailwind Components
│   │   │   ├── 🔗 services/        # API Services
│   │   │   └── 📝 types/           # TypeScript Types
│   │   └── 📂 core/
│   │       ├── 🏗️ layout/          # Layout Principal
│   │       └── 🧭 routing/         # Navegación
│   └── 📄 package.json
├── 📂 docs/                    # Documentación
│   ├── 📋 PLAN_REFORMULADO.md
│   └── 📊 ANALISIS_INICIAL_NOVEDADES.md
└── 📄 README.md
```

---

## ⚡ Quick Start

### Prerrequisitos
- Node.js 18+
- npm/yarn
- Acceso a ApiIdeafix

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/Charly-dena/NovedadesLiquidacion.git
cd NovedadesLiquidacion

# Instalar dependencias (cuando esté listo)
npm install

# Ejecutar en desarrollo
npm run dev
```

---

## 📋 Roadmap

### ✅ Completado
- [x] Análisis de requerimientos
- [x] Planificación arquitectónica  
- [x] Setup de repositorio y documentación

### 🔄 En Progreso
- [ ] Setup React + Vite + Tailwind
- [ ] Layout base y navegación
- [ ] Integración con APIs ApiIdeafix

### 📅 Próximos Pasos
- [ ] Grid de liquidaciones funcional
- [ ] CRUD completo con validaciones
- [ ] Sistema de filtros avanzados
- [ ] Deploy MVP

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [📋 Plan Reformulado](docs/PLAN_REFORMULADO.md) | Estrategia evolutiva y arquitectura |
| [📊 Análisis Inicial](docs/ANALISIS_INICIAL_NOVEDADES.md) | Investigación de novedades (Fase 2) |
| [🚀 Issue #1](https://github.com/Charly-dena/NovedadesLiquidacion/issues/1) | Plan evolutivo detallado |

---

## 🎯 Criterios de Éxito MVP

### Funcionales
- ✅ Listado de liquidaciones con filtros
- ✅ Crear/editar liquidaciones con validaciones  
- ✅ Vista detalle según mockup
- ✅ Estados controlados (Abierta/Cerrada)

### Técnicos
- ⚡ Tiempo de carga < 3 segundos
- 📱 Responsive design
- 🔒 Validaciones completas
- 🏗️ Arquitectura escalable para Fase 2

---

## 💡 Consideraciones Técnicas

### Validaciones Críticas
- 🚫 No duplicar números de liquidación por empresa
- 📅 Fecha último depósito: no domingo/feriado, anterior a liquidación
- 📅 Fecha de pago: igual o posterior a fecha liquidación
- ✏️ Edición solo permitida en estado "Abierta"

### Integración con ApiIdeafix
> **IMPORTANTE:** No se persisten datos localmente. Todo a través de servicios web.

---

## 📞 Contacto y Contribución

- **Issues:** [GitHub Issues](https://github.com/Charly-dena/NovedadesLiquidacion/issues)
- **Documentación:** Ver carpeta `/docs/`
- **Estado:** Seguir progreso en Issues y Projects

---

*🔄 Proyecto en evolución - README actualizado según avance del desarrollo*



