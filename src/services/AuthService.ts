import type { AuthChangeEvent, Session, Subscription } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export class AuthService {
  public async registrar(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw error;
    }
  }

  public async iniciarSesion(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  }

  public async cerrarSesion(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  public async obtenerSesion(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return data.session;
  }

  public escucharCambiosSesion(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ): Subscription {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return data.subscription;
  }
}
