# Mis Libros

Aplicación móvil con **React Native**, **Expo**, **TypeScript** y **Supabase** (Programación II).

## Funcionalidades

- Registro, inicio y cierre de sesión (Supabase Auth).
- Listar, agregar y eliminar libros persistidos en Supabase.
- Navegación guiada por el **estado de sesión** (sin sesión → Login; con sesión → Home).

## Estructura del proyecto

```
proyecto/
├── App.tsx
├── .env.example
├── supabase/
│   └── schema.sql
└── src/
    ├── lib/
    │   └── supabase.ts
    ├── models/
    │   └── Libro.ts
    ├── repositories/
    │   └── LibroRepository.ts
    ├── services/
    │   ├── AuthService.ts
    │   └── LibroService.ts
    └── screens/
        ├── LoginScreen.tsx
        ├── RegisterScreen.tsx
        └── HomeScreen.tsx
```

Flujo de datos: **App.tsx** → **LibroService** → **LibroRepository (Singleton)** → **Supabase**.

Flujo de autenticación: **App.tsx** escucha la sesión con **AuthService** → Login / Registro / Home / Cerrar sesión.

## Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com).
2. En **SQL Editor**, ejecuta el script `supabase/schema.sql` (tabla `libros`, **GRANT** y políticas **RLS**).
3. Copia `.env.example` a `.env` y completa:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` (anon/public key)
4. (Recomendado para pruebas) En **Authentication → Providers → Email**, desactiva *Confirm email* si quieres iniciar sesión justo después del registro.

```bash
npm install
npm start
```

## Tabla `libros`

| Campo   | Tipo    |
|---------|---------|
| id      | uuid    |
| titulo  | text    |
| autor   | text    |
| anio    | integer |
| user_id | uuid (dueño del registro) |

## Autenticación y acceso a datos (RLS)

Supabase Auth emite un **JWT** cuando el usuario inicia sesión. El cliente (`@supabase/supabase-js`) envía ese token en cada petición a la API.

- **GRANT** (`select`, `insert`, `delete` para el rol `authenticated`) define qué operaciones puede intentar un usuario logueado sobre la tabla.
- **RLS** filtra **filas**: las políticas comparan `auth.uid()` con `user_id`, de modo que cada usuario solo **consulta, inserta y elimina sus propios libros**.

Sin sesión válida no hay JWT de usuario autenticado; las políticas RLS bloquean el acceso a filas ajenas (y a la tabla si no hay permiso). Así la autenticación **identifica** al usuario y RLS **autoriza** qué datos puede tocar.

## Tareas anteriores (resumen)

- **POO**: clase `Libro` con encapsulamiento y métodos de dominio.
- **Repository + Singleton**: `LibroRepository.getInstance()` y prueba en consola al iniciar la app.
- **Supabase**: persistencia real; el mock (`src/data/librosMock.ts`) ya no alimenta la app.

## Capturas para entrega

| Archivo | Contenido |
|---------|-----------|
| `docs/captura-registro.png` | Pantalla de registro |
| `docs/captura-login.png` | Pantalla de login |
| `docs/captura-libros-supabase.png` | Home con libros en Supabase |
| `docs/captura-logout.png` | Cierre de sesión (botón o vuelta a Login) |
| `docs/captura-singleton.png` | Consola: misma instancia Singleton |

## Reflexión (tarea POO)

### ¿Por qué separar la lógica de los libros de App.tsx?

Para que la UI solo coordine pantallas y eventos; la lógica vive en servicios, repositorio y modelo.

### ¿Qué responsabilidad tiene LibroService?

Reglas de negocio y coordinación; delega lectura/escritura a `LibroRepository`.

### ¿Qué responsabilidad tiene la clase Libro?

Representar un libro en memoria con datos encapsulados y métodos como `obtenerResumen()`.

## Autor

Curso: Programación II.
