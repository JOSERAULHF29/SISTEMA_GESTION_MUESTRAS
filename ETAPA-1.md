# SIGMA — ETAPA 1: Proyecto Base

## Arquitectura

SIGMA utiliza una arquitectura **modular por dominio** con separación de responsabilidades en 4 capas:

```
React Component (Presentación)
      ↓
Hook / Use Case (Aplicación)
      ↓
Service (Infrastructure)
      ↓
Supabase → PostgreSQL / Storage / Auth
```

---

## Estructura del proyecto

```
sigma/
├── src/
│   ├── app/
│   │   ├── router/
│   │   │   ├── AppRouter.tsx          # Definición de rutas principales
│   │   │   └── ProtectedRoute.tsx     # Guard de autenticación
│   │   ├── providers/                 # (预留 para providers globales)
│   │   └── config/                    # (预留 para configuraciones)
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── presentation/pages/
│   │   │   │   └── LoginPage.tsx      # Pantalla de login con Google OAuth
│   │   │   ├── application/useCases/
│   │   │   │   ├── authUseCases.ts    # signIn, signOut, getCurrentUser
│   │   │   │   └── getRoleFromEmail.ts # Determinar rol por email
│   │   │   ├── domain/types/          # (预留 para tipos de auth)
│   │   │   └── infrastructure/
│   │   │       └── auth.service.ts    # Operaciones CRUD de profiles
│   │   │
│   │   ├── envios/
│   │   │   ├── presentation/pages/
│   │   │   │   ├── MisEnviosPage.tsx       # Listado del asesor (placeholder)
│   │   │   │   ├── NuevoEnvioPage.tsx      # Formulario de registro (placeholder)
│   │   │   │   └── ControlEnviosPage.tsx   # Panel del tribólogo (placeholder)
│   │   │   └── infrastructure/
│   │   │       └── envios.service.ts   # CRUD de envíos_muestras
│   │   │
│   │   ├── usuarios/
│   │   │   └── presentation/pages/
│   │   │       └── UsuariosPage.tsx    # Gestión de usuarios (placeholder)
│   │   │
│   │   └── dashboard/
│   │       └── presentation/pages/
│   │           └── DashboardPage.tsx   # Dashboard principal con KPIs
│   │
│   ├── shared/
│   │   ├── components/                 # (预留 para componentes reutilizables)
│   │   ├── layouts/
│   │   │   ├── AppLayout.tsx           # Layout con sidebar + header
│   │   │   └── AuthLayout.tsx          # Layout para login
│   │   ├── hooks/
│   │   │   └── useAuth.ts             # Hook de autenticación
│   │   ├── utils/                      # (预留 para utilidades)
│   │   ├── constants/
│   │   │   └── index.ts               # Dominio permitido, emails, config archivos
│   │   └── types/
│   │       └── index.ts               # Profile, EnvioMuestra, Role, EstadoEnvio
│   │
│   ├── infrastructure/
│   │   └── supabase/
│   │       ├── client.ts              # Cliente Supabase singleton
│   │       └── storage.ts             # Funciones de upload/download/delete
│   │
│   ├── App.tsx                         # Root component
│   ├── main.tsx                        # Entry point
│   └── index.css                       # Tailwind CSS import
│
├── .env.example                        # Variables de entorno de ejemplo
├── .prettierrc                         # Configuración de Prettier
├── vite.config.ts                      # Vite + Tailwind + path alias
├── tsconfig.app.json                   # TypeScript config con path alias
└── package.json
```

---

## Carpetas principales

| Carpeta | Responsabilidad |
|---------|----------------|
| `src/app/` | Configuración global: router, providers, config de Supabase |
| `src/modules/` | Módulos por dominio (auth, envios, usuarios, dashboard) — cada uno con sus 4 capas |
| `src/shared/` | Componentes, hooks, layouts y utilidades reutilizables |
| `src/infrastructure/` | Cliente de Supabase y configuración de Storage |

---

## Dependencias instaladas

### Producción
| Paquete | Versión | Uso |
|---------|---------|-----|
| `react` | ^19 | UI library |
| `react-dom` | ^19 | DOM rendering |
| `react-router-dom` | ^7 | Enrutamiento |
| `@supabase/supabase-js` | ^2 | Cliente Supabase |
| `lucide-react` | ^0.525 | Iconos |

### Desarrollo
| Paquete | Versión | Uso |
|---------|---------|-----|
| `typescript` | ^6 | Type checking |
| `vite` | ^8 | Build tool |
| `@tailwindcss/vite` | ^4 | Tailwind CSS plugin |
| `tailwindcss` | ^4 | Utility-first CSS |
| `prettier` | ^3 | Code formatting |

---

## Pantallas implementadas

| Ruta | Pantalla | Estado |
|------|----------|--------|
| `/login` | Login con Google OAuth | Implementada |
| `/app` | Dashboard principal con KPIs | Implementada |
| `/app/envios` | Listado de envíos del asesor | Placeholder |
| `/app/envios/nuevo` | Formulario de registro | Placeholder |
| `/app/control-envios` | Panel del tribólogo | Placeholder |
| `/app/usuarios` | Gestión de usuarios (admin) | Placeholder |

---

## Rutas protegidas

- `/login` — Accesible sin autenticación
- `/app/*` — Requiere sesión activa
- Cualquier otra ruta → redirige a `/login`

---

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

```
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-aqui
```

---

## Cómo probar

1. **Instalar dependencias:**
   ```bash
   cd sigma
   npm install
   ```

2. **Crear archivo `.env`:**
   ```bash
   cp .env.example .env
   ```
   Completar con las credenciales de Supabase.

3. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```
   Abrir `http://localhost:5173`

4. **Build de producción:**
   ```bash
   npm run build
   ```

---

## Notas para ETAPA 2

- Crear tabla `profiles` en Supabase
- Crear tabla `envios_muestras` en Supabase
- Configurar RLS y políticas de seguridad
- Crear trigger para creación automática de profiles

---

## Errores verificados

- ✅ TypeScript: 0 errores
- ✅ Build: exitoso (233 KB JS, 14 KB CSS)
- ✅ Sin warnings de Vite
