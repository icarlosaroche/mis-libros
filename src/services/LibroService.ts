import { Libro } from '../models/Libro';
import { LibroRepository } from '../repositories/LibroRepository';

/**
 * Capa de servicio: reglas de negocio y coordinación; delega persistencia al repositorio.
 */
export class LibroService {
  private readonly repositorio: LibroRepository;

  constructor() {
    this.repositorio = LibroRepository.getInstance();
  }

  public async agregar(titulo: string, autor: string, anio: number): Promise<Libro> {
    return this.repositorio.agregar(titulo, autor, anio);
  }

  public async eliminar(id: string): Promise<boolean> {
    return this.repositorio.eliminar(id);
  }

  public async obtenerTodos(): Promise<Libro[]> {
    return this.repositorio.obtenerTodos();
  }

  public async cantidad(): Promise<number> {
    return this.repositorio.cantidad();
  }
}
