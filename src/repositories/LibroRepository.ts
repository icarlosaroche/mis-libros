import { supabase } from '../lib/supabase';
import { Libro } from '../models/Libro';

type LibroRow = {
  id: string;
  titulo: string;
  autor: string;
  anio: number;
  user_id: string;
};

/**
 * Acceso a datos en Supabase: Singleton que administra la colección de libros.
 */
export class LibroRepository {
  private static instancia: LibroRepository;

  private constructor() {}

  public static getInstance(): LibroRepository {
    if (!LibroRepository.instancia) {
      LibroRepository.instancia = new LibroRepository();
    }
    return LibroRepository.instancia;
  }

  private mapFilaALibro(fila: LibroRow): Libro {
    return new Libro(fila.id, fila.titulo, fila.autor, fila.anio);
  }

  public async obtenerTodos(): Promise<Libro[]> {
    const { data, error } = await supabase
      .from('libros')
      .select('id, titulo, autor, anio, user_id')
      .order('titulo', { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map((fila) => this.mapFilaALibro(fila as LibroRow));
  }

  public async agregar(titulo: string, autor: string, anio: number): Promise<Libro> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }
    if (!user) {
      throw new Error('Debes iniciar sesión para agregar libros.');
    }

    const { data, error } = await supabase
      .from('libros')
      .insert({
        titulo: titulo.trim(),
        autor: autor.trim(),
        anio,
        user_id: user.id,
      })
      .select('id, titulo, autor, anio, user_id')
      .single();

    if (error) {
      throw error;
    }

    return this.mapFilaALibro(data as LibroRow);
  }

  public async eliminar(id: string): Promise<boolean> {
    const { data, error } = await supabase.from('libros').delete().eq('id', id).select('id');

    if (error) {
      throw error;
    }

    return (data?.length ?? 0) > 0;
  }

  public async cantidad(): Promise<number> {
    const libros = await this.obtenerTodos();
    return libros.length;
  }

  /** Evidencia en consola de que getInstance() devuelve la misma referencia. */
  public static verificarSingletonEnConsola(): void {
    const primera = LibroRepository.getInstance();
    const segunda = LibroRepository.getInstance();
    const mismaInstancia = primera === segunda;

    console.log('--- Prueba Singleton LibroRepository ---');
    console.log('Primera instancia:', primera);
    console.log('Segunda instancia:', segunda);
    console.log('¿Es la misma instancia?', mismaInstancia);
    console.log('--------------------------------------');
  }
}
