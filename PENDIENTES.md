# SIGMA — Pendientes

## Estado actual

| Etapa | Estado |
|-------|--------|
| ETAPA 1 — Proyecto base | Completada |
| ETAPA 2 — Base de datos + RLS + Trigger | Completada |
| ETAPA 3 — Autenticación (dominio restringido) | Completada |
| ETAPA 4 — Registro de envíos | Completada |
| ETAPA 5 — Listado de envíos del asesor | Completada |
| ETAPA 6 — Storage + archivos Excel | Completada |
| ETAPA 7 — Panel del tribólogo | Completada |
| ETAPA 8 — Gestión de usuarios (admin) | Completada |
| ETAPA 9 — UI/UX (dark theme profesional) | Completada |
| ETAPA 10 — Pruebas | Completada |
| ETAPA 11 — Flujo completo (almacenero + PDF) | Completada |
| ETAPA 12 — Mostrar asesor + formato Excel | Completada |
| ETAPA 13 — Deploy Vercel | **Pendiente** |
| ETAPA 14 — Compartir por red (dev tunnels) | Completada |

---

## Cambios aplicados

### Nuevos roles

| Rol | Correo | Descripción |
|-----|--------|-------------|
| admin | `jhuamanif@ipesa.com.pe` | Ve todo, gestiona usuarios |
| tribologo | `aquintero@ipesa.com.pe` | Ve todo, confirma envíos |
| asesor | `@ipesa.com.pe` | Registra envíos, descarga formato |
| almacenero | `almacen*@ipesa.com.pe` | Confirma envíos con PDF |

### Nuevos estados del envío

```
pendiente → enviado → confirmado
    │           │
    └──→ anulado (en cualquier momento)
```

| Estado | Quién lo cambia | Descripción |
|--------|-----------------|-------------|
| `pendiente` | Sistema | Asesor registró, pendiente de envío físico |
| `enviado` | Almacenero | Almacén confirmó envío y subió PDF |
| `confirmado` | Tribólogo | Tribólogo verificó el envío |
| `anulado` | Tribólogo / Admin | Envío cancelado |

### Nuevos campos en `envios_muestras`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `correo_almacen` | text | Correo del almacén destino |
| `comprobante_pdf_path` | text | Path del PDF en Storage |
| `comprobante_pdf_nombre` | text | Nombre original del PDF |

### Mostrar asesor a todos los roles

El tribólogo, admin y almacenero pueden ver el nombre y correo del asesor que registró el envío.

| Pantalla | Rol | Columna "Asesor" |
|----------|-----|:----------------:|
| Control de envíos | Tribólogo / Admin | ✅ |
| Envíos pendientes | Almacenero | ✅ |
| Detalle del envío | Todos | ✅ |

**Implementación:** JOIN con tabla `profiles` + función `mapEnvio()` para aplanar datos.

### Formato Excel de envíos

El asesor puede descargar un formato Excel estático desde el Dashboard.

| Archivo | Ubicación |
|---------|-----------|
| `formato_envio.xlsx` | `public/formato_envio.xlsx` |

**Botón:** "Descargar formato Excel" en el Dashboard del asesor.

### Archivos nuevos

| Archivo | Descripción |
|---------|-------------|
| `src/modules/almacen/presentation/pages/AlmacenPage.tsx` | Panel del almacenero |
| `src/modules/almacen/presentation/components/ConfirmarEnvioModal.tsx` | Modal para subir PDF |
| `src/shared/hooks/useEnviosAlmacen.ts` | Hook para envíos del almacén |

### Archivos modificados

| Archivo | Cambios |
|---------|---------|
| `src/shared/types/index.ts` | Nuevo rol `almacenero`, nuevos estados, campos nuevos, `asesor_nombre` y `asesor_email` |
| `src/shared/constants/index.ts` | `WAREHOUSE_EMAIL_PATTERN` |
| `src/shared/components/EstadoBadge.tsx` | 4 estados con colores |
| `src/shared/components/RoleBadge.tsx` | Rol `almacenero` amarillo |
| `src/modules/envios/presentation/components/EnvioForm.tsx` | Campo "Correo del almacén" |
| `src/infrastructure/supabase/storage.ts` | `uploadComprobante()` |
| `src/modules/envios/infrastructure/envios.service.ts` | JOIN con profiles, `mapEnvio()`, `getEnviosByAlmacen()`, `updateEnvioComprobante()` |
| `src/modules/envios/presentation/pages/DetalleEnvioPage.tsx` | PDF comprobante, botones confirmar/anular, campo "Asesor" |
| `src/modules/envios/presentation/pages/ControlEnviosPage.tsx` | Columna "Almacén" y "Asesor" |
| `src/modules/almacen/presentation/pages/AlmacenPage.tsx` | Columna "Asesor" |
| `src/shared/layouts/AppLayout.tsx` | Nav para almacenero |
| `src/app/router/AppRouter.tsx` | Ruta `/app/almacen` |
| `src/modules/auth/application/useCases/getRoleFromEmail.ts` | Lógica para almacenero |
| `src/modules/dashboard/presentation/pages/DashboardPage.tsx` | Botón "Descargar formato Excel", mensaje de bienvenida simplificado |

### Trigger SQL (ejecutado en Supabase)

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre, apellido, rol, activo, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'given_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'family_name', ''),
    CASE
      WHEN NEW.email = 'jhuamanif@ipesa.com.pe' THEN 'admin'
      WHEN NEW.email = 'aquintero@ipesa.com.pe' THEN 'tribologo'
      WHEN NEW.email LIKE 'almacen%' THEN 'almacenero'
      ELSE 'asesor'
    END,
    true,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### RLS Policies — envios_muestras

Políticas de Row Level Security para la tabla `envios_muestras`:

```sql
-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Asesores pueden ver sus propios envios" ON envios_muestras;
DROP POLICY IF EXISTS "Asesores pueden crear sus propios envios" ON envios_muestras;

-- SELECT: Asesor ve sus propios envíos
CREATE POLICY "Asesores ven sus propios envios"
ON envios_muestras FOR SELECT TO authenticated
USING (asesor_id = auth.uid());

-- SELECT: Almacenero ve envíos de su correo
CREATE POLICY "Almacenero ve envios de su almacen"
ON envios_muestras FOR SELECT TO authenticated
USING (correo_almacen = auth.email());

-- SELECT: Admin y tribólogo ven todos los envíos
CREATE POLICY "Admin y tribologo ven todos los envios"
ON envios_muestras FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.rol IN ('admin', 'tribologo')
  )
);

-- INSERT: Asesor crea envíos con su ID
CREATE POLICY "Asesores crean sus propios envios"
ON envios_muestras FOR INSERT TO authenticated
WITH CHECK (asesor_id = auth.uid());

-- UPDATE: Almacenero confirma envíos de su correo
CREATE POLICY "Almacenero confirma envios de su almacen"
ON envios_muestras FOR UPDATE TO authenticated
USING (correo_almacen = auth.email())
WITH CHECK (correo_almacen = auth.email());

-- UPDATE: Admin y tribólogo actualizan cualquier envío
CREATE POLICY "Admin y tribologo actualizan envios"
ON envios_muestras FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.rol IN ('admin', 'tribologo')
  )
);
```

### RLS Policies — profiles

Política para que los usuarios autenticados puedan ver perfiles de otros (necesario para JOIN y mostrar nombre del asesor):

```sql
CREATE POLICY "Usuarios autenticados pueden ver todos los perfiles"
ON profiles FOR SELECT TO authenticated
USING (true);
```

### SQL ejecutado en Supabase

```sql
-- CHECK constraint para nuevos estados
ALTER TABLE envios_muestras 
  DROP CONSTRAINT IF EXISTS envios_muestras_estado_check;

ALTER TABLE envios_muestras 
  ADD CONSTRAINT envios_muestras_estado_check 
  CHECK (estado IN ('pendiente', 'enviado', 'confirmado', 'anulado'));

-- Nuevos campos
ALTER TABLE envios_muestras 
  ADD COLUMN IF NOT EXISTS correo_almacen text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS comprobante_pdf_path text,
  ADD COLUMN IF NOT EXISTS comprobante_pdf_nombre text;

-- Migrar estados existentes
UPDATE envios_muestras SET estado = 'pendiente' WHERE estado = 'registrado';

-- Actualizar perfiles existentes con nombre vacío (usar parte del email)
UPDATE profiles
SET nombre = SPLIT_PART(email, '@', 1)
WHERE nombre = '' OR nombre IS NULL;
```

### Supabase URL Configuration (para dev tunnels)

Para compartir la app por la red con VS Code dev tunnels:

1. **Supabase Dashboard** → Authentication → URL Configuration:
   - Site URL: `https://01c4bx0t-5173.brs.devtunnels.ms`
   - Redirect URLs: agregar `https://01c4bx0t-5173.brs.devtunnels.ms/**`

2. **Google Cloud Console** → APIs & Services → Credentials → OAuth Client ID:
   - Verificar que esté: `https://limvvebxkvhibuobmpkx.supabase.co/auth/v1/callback`

### Mensaje de bienvenida

El saludo del Dashboard fue simplificado para evitar problemas con usuarios sin nombre:

```tsx
// Antes
Hola, {profile?.nombre}

// Ahora
Bienvenido al Sistema de Gestión de envíos de muestras
```

### Código de respaldo (no conectado)

`getRoleFromEmail()` existe en `src/modules/auth/application/useCases/getRoleFromEmail.ts` pero **no se usa** en la app. Se mantiene como respaldo por si el trigger falla.

---

## Pendientes

### 1. Repository en GitHub

```bash
cd sigma
git init
git add .
git commit -m "SIGMA v1.2 - Mostrar asesor + formato Excel"
git remote add origin https://github.com/TU-USUARIO/sigma.git
git push -u origin main
```

### 2. Deploy en Vercel

1. Ir a [vercel.com](https://vercel.com) → **Add New Project**
2. Importar el repositorio de GitHub
3. Vercel detecta automáticamente Vite → **Deploy**
4. Configurar variables de entorno en **Settings → Environment Variables**:

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://limvvebxkvhibuobmpkx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` (clave anon de Supabase) |

### 3. Google OAuth — Redirect URI para producción

Después del deploy, Vercel asigna un dominio como `https://sigma.vercel.app`.

Agregar ese dominio en:

1. **Google Cloud Console** → APIs & Services → Credentials → OAuth client ID
   - Agregar `https://sigma.vercel.app` en **Authorized redirect URIs**

2. **Supabase Dashboard** → Authentication → Providers → Google
   - Agregar `https://sigma.vercel.app` en los redirect URIs permitidos

### 4. Crear bucket en Supabase Storage

```
Nombre: envios-muestras
Público: NO (privado)
Límite: 50 MB
```

Políticas:
```sql
CREATE POLICY "Usuarios autenticados pueden subir archivos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'envios-muestras');

CREATE POLICY "Usuarios autenticados pueden ver archivos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'envios-muestras');
```

### 5. Agregar más admins (futuro)

```sql
-- Opción 1: Actualizar trigger SQL
-- Cambiar el CASE para incluir más emails de admin

-- Opción 2: Cambiar usuario existente
UPDATE profiles SET rol = 'admin' WHERE email = 'nuevo_admin@ipesa.com.pe';
```

---

## Flujo completo

```
ASESOR                    ALMACÉN                   TRIBÓLOGO
   │                         │                         │
   │ 1. Registra envío       │                         │
   │ + correo almacén        │                         │
   │ Estado: PENDIENTE       │                         │
   │────────────────────────>│                         │
   │                         │ 2. Ve envíos            │
   │                         │ pendientes              │
   │                         │ + ve nombre asesor      │
   │                         │                         │
   │                         │ 3. Sube PDF             │
   │                         │ y confirma              │
   │                         │ Estado: ENVIADO         │
   │                         │────────────────────────>│
   │                         │                         │
   │                         │                         │ 4. Revisa
   │                         │                         │ + ve nombre asesor
   │                         │                         │ y confirma
   │                         │                         │ Estado: CONFIRMADO
```

---

## Roles y permisos

| Acción | ASESOR | ALMACÉN | TRIBÓLOGO | ADMIN |
|--------|:------:|:-------:|:---------:|:-----:|
| Registrar envío | ✅ | ❌ | ❌ | ❌ |
| Ver mis envíos | ✅ | ❌ | ❌ | ❌ |
| Descargar formato Excel | ✅ | ❌ | ❌ | ❌ |
| Ver todos los envíos | ❌ | ❌ | ✅ | ✅ |
| Ver nombre/correo asesor | ❌ | ✅ | ✅ | ✅ |
| Filtrar/buscar | ❌ | ❌ | ✅ | ✅ |
| Confirmar envío | ❌ | ✅ | ✅ | ✅ |
| Subir PDF comprobante | ❌ | ✅ | ❌ | ❌ |
| Anular envío | ❌ | ❌ | ✅ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ❌ | ✅ |

---

## Archivos del proyecto

```
sigma/
├── src/
│   ├── app/router/           # Rutas y guards
│   ├── infrastructure/       # Supabase client + storage
│   ├── modules/              # Módulos por dominio
│   │   ├── auth/             # Autenticación
│   │   ├── dashboard/        # Panel principal
│   │   ├── envios/           # Gestión de envíos
│   │   ├── almacen/          # Panel del almacenero
│   │   └── usuarios/         # Gestión de usuarios
│   ├── shared/               # Componentes, hooks, layouts, types
│   ├── index.css             # Tailwind + dark theme
│   ├── App.tsx
│   └── main.tsx
├── public/
│   ├── foto_login.jpg        # Imagen del login
│   └── formato_envio.xlsx    # Formato Excel de envíos
├── .env                      # Variables de entorno (no commitear)
├── .env.example              # Ejemplo de variables
├── vite.config.ts
├── vitest.config.ts
├── package.json
├── ETAPA-1.md                # Documentación ETAPA 1
└── PENDIENTES.md             # Este archivo
```

---

## Comandos disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm test             # Vitest en watch mode
npm run test:run     # Ejecutar tests una vez
npm run lint         # Linting con oxlint
```

---

## Credenciales

| Servicio | Credencial |
|----------|------------|
| Supabase URL | `https://limvvebxkvhibuobmpkx.supabase.co` |
| Supabase Anon Key | Ver archivo `.env` |
| Admin | `jhuamanif@ipesa.com.pe` |
| Tribólogo | `aquintero@ipesa.com.pe` |
| Almacén | `almacen*@ipesa.com.pe` |
| Dominio permitido | `@ipesa.com.pe` |

---

## Verificación

- **Build:** ✅ Exitoso
- **Tests:** ✅ 21/21 pasan
- **RLS envios_muestras:** ✅ 6 políticas configuradas (asesor, almacenero, admin/tribólogo)
- **RLS profiles:** ✅ Política de SELECT para todos los autenticados
- **Compartir por red (tunnel):** ✅ Configurado para VS Code dev tunnels
