/** Datos de ejemplo de la tarea anterior (referencia; la app usa Supabase). */
export type LibroMock = {
  id: string;
  titulo: string;
  autor: string;
  anio: number;
};

export const LIBROS_MOCK: LibroMock[] = [
  {
    id: 'mock-1',
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    anio: 1967,
  },
  {
    id: 'mock-2',
    titulo: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    anio: 1943,
  },
  {
    id: 'mock-3',
    titulo: '1984',
    autor: 'George Orwell',
    anio: 1949,
  },
];
