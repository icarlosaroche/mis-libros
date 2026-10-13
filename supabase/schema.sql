-- Ejecutar en el SQL Editor de Supabase (proyecto Mis Libros)

create extension if not exists "pgcrypto";

create table if not exists public.libros (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  autor text not null,
  anio integer not null check (anio >= 0),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- GRANT: permisos de tabla para usuarios autenticados
grant usage on schema public to authenticated;
grant select, insert, delete on table public.libros to authenticated;

-- RLS: control de filas por usuario
alter table public.libros enable row level security;

create policy "libros_select_propios"
  on public.libros
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "libros_insert_propios"
  on public.libros
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "libros_delete_propios"
  on public.libros
  for delete
  to authenticated
  using (auth.uid() = user_id);
