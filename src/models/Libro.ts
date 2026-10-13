/**
 * Modelo de dominio: representa un libro con encapsulamiento (POO).
 */
export class Libro {
  private readonly _id: string;
  private _titulo: string;
  private _autor: string;
  private _anio: number;

  constructor(id: string, titulo: string, autor: string, anio: number) {
    this._id = id;
    this._titulo = titulo.trim();
    this._autor = autor.trim();
    this._anio = anio;
  }

  public get id(): string {
    return this._id;
  }

  public get titulo(): string {
    return this._titulo;
  }

  public get autor(): string {
    return this._autor;
  }

  public get anio(): number {
    return this._anio;
  }

  /** Resumen legible del libro para mostrar en la lista. */
  public obtenerResumen(): string {
    return `"${this._titulo}" — ${this._autor} (${this._anio})`;
  }

  /** Indica si el libro tiene más de 50 años de antigüedad. */
  public esClasico(): boolean {
    const anioActual = new Date().getFullYear();
    return anioActual - this._anio >= 50;
  }
}
