# 📋 PLAN REFORMULADO - DASHBOARD DE LIQUIDACIONES

## 🎯 OBJETIVO REAL (según repositorio)
Dashboard de procesos para la carga de **liquidaciones de sueldos** a empleados de una o varias empresas.

## 🔄 DIFERENCIAS CON PLAN ANTERIOR
- **Antes:** Sistema de novedades individuales
- **Ahora:** Sistema de liquidaciones grupales
- **Enfoque:** Gestión de liquidaciones completas, no items individuales

## 📊 FUNCIONALIDADES ESPECÍFICAS

### 1. 🏢 Pantalla Principal - Listado de Liquidaciones

#### Grid de Liquidaciones
- **Endpoint:** `GET /idx/liq` (ApiIdeafix)
- **Campos a mostrar:**
  - Empresa
  - Número de Liquidación
  - Tipo de Liquidación
  - Descripción ("Liq. correspondiente a:")
  - Estado (Abierta/Cerrada)
  - Fecha de Liquidación
  - Fecha de Pago

#### Filtros Requeridos
- **Por Empresa:** Combo usando `GET /idx/emps`
- **Por Liquidación:** Selector de liquidaciones `GET /idx/liq`
- **Por Fecha:** Filtrado por campo `fcieliq`

#### Acciones por Fila
- **Consultar:** Ver detalle completo de liquidación
- **Editar:** Solo si estado = "Abierta"

### 2. ✨ Formulario Nueva Liquidación

#### Campos Obligatorios
- **Empresa** - Combo desde `GET /idx/emps`
- **Número de Liquidación** - Input único
- **Tipo de Liquidación** - Combo desde `GET /idx/tliq`
- **Descripción** - "Liq. correspondiente a:"

#### Campos con Valores por Defecto
- **Fecha valor contable** - Fecha actual
- **Fecha de Liquidación** - Fecha actual
- **Fecha último depósito DNRP** - Día 9 del mes actual
- **Numera Recibos** - "S" por defecto
- **Permite actualizar novedades** - True por defecto

#### Validaciones Específicas
- No duplicar números de liquidación por empresa
- Fecha último depósito: no domingo/feriado, anterior a fecha liquidación
- Fecha de pago: igual o posterior a fecha liquidación

### 3. 👁 Vista Detalle de Liquidación

Según mockup del README, mostrar:
- Información general de la liquidación
- Todos los campos del formulario en modo lectura
- Botón "Editar" solo si estado = "Abierta"
- Historial de cambios

## 🏗️ ARQUITECTURA TÉCNICA

### Stack Simplificado
- **Frontend:** React + TypeScript + Vite
- **UI:** TailwindCSS + Headless UI
- **Formularios:** React Hook Form + Zod
- **Estado:** Context API
- **HTTP:** Axios para APIs del proyecto ApiIdeafix

### Estructura de Proyecto
```
src/
├── components/
│   ├── liquidaciones/
│   │   ├── LiquidacionesGrid.tsx
│   │   ├── LiquidacionForm.tsx
│   │   ├── LiquidacionDetail.tsx
│   │   └── Filtros.tsx
│   └── common/
│       ├── Layout.tsx
│       └── Loader.tsx
├── services/
│   ├── liquidaciones.service.ts
│   ├── combos.service.ts
│   └── api.config.ts
├── types/
│   ├── liquidacion.types.ts
│   └── api.types.ts
└── pages/
    ├── LiquidacionesList.tsx
    ├── NuevaLiquidacion.tsx
    └── DetalleLiquidacion.tsx
```

## 🚀 ROADMAP MVP (3 SEMANAS)

### 📅 Semana 1: Base + Listado
- [ ] Setup React + TypeScript + Vite
- [ ] Conexión con APIs de ApiIdeafix
- [ ] Layout básico con navegación
- [ ] Grid de liquidaciones con datos mock
- [ ] Integración real con `GET /idx/liq`

### 📅 Semana 2: CRUD Básico
- [ ] Formulario nueva liquidación
- [ ] Integración con combos (`/idx/emps`, `/idx/tliq`)
- [ ] Validaciones según especificaciones
- [ ] Vista detalle de liquidación
- [ ] Estados y permisos (Abierta/Cerrada)

### 📅 Semana 3: Filtros + Polish
- [ ] Sistema de filtros avanzados
- [ ] Búsqueda y ordenamiento
- [ ] Validaciones completas
- [ ] UX improvements
- [ ] Testing básico

## 🎯 CRITERIOS DE ÉXITO

### Funcionales
- [ ] Listar todas las liquidaciones con filtros
- [ ] Crear nuevas liquidaciones con validaciones
- [ ] Editar solo liquidaciones abiertas
- [ ] Vista detalle completa
- [ ] Integración 100% con ApiIdeafix

### Técnicos
- [ ] Tiempo de carga < 3 segundos
- [ ] Responsive design
- [ ] Validaciones frontend + backend
- [ ] Manejo de errores robusto

## 📝 DIFERENCIAS CLAVE CON PLAN ANTERIOR

| Aspecto | Plan Anterior | Plan Nuevo |
|---------|---------------|------------|
| **Entidad Principal** | Novedades individuales | Liquidaciones grupales |
| **CRUD** | Items de novedad | Liquidaciones completas |
| **Estados** | Nuevo/Procesado/Aprobado | Abierta/Cerrada |
| **Validaciones** | Por empleado/concepto | Por liquidación/empresa |
| **API** | Genérica de novedades | Específica `/idx/*` |
| **Usuarios** | Multiple roles | Enfoque simple |
| **Complejidad** | Dashboard complejo | Grid + Form + Detail |

## 🔄 SIGUIENTE PASO
Implementar MVP enfocado en liquidaciones según especificaciones del repositorio original.