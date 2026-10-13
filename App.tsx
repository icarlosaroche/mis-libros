import type { Session } from '@supabase/supabase-js';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { supabaseConfigurado } from './src/lib/supabase';
import { LibroRepository } from './src/repositories/LibroRepository';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { AuthService } from './src/services/AuthService';

type VistaAuth = 'login' | 'registro';

export default function App() {
  const authService = useMemo(() => new AuthService(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [inicializando, setInicializando] = useState(true);
  const [vistaAuth, setVistaAuth] = useState<VistaAuth>('login');

  useEffect(() => {
    LibroRepository.verificarSingletonEnConsola();

    authService
      .obtenerSesion()
      .then((sesionActual) => {
        setSession(sesionActual);
      })
      .finally(() => {
        setInicializando(false);
      });

    const suscripcion = authService.escucharCambiosSesion((_evento, sesionActual) => {
      setSession(sesionActual);
    });

    return () => {
      suscripcion.unsubscribe();
    };
  }, [authService]);

  if (!supabaseConfigurado) {
    return (
      <View style={styles.centro}>
        <StatusBar style="dark" />
        <Text style={styles.avisoTitulo}>Configura Supabase</Text>
        <Text style={styles.avisoTexto}>
          Copia `.env.example` a `.env` y define EXPO_PUBLIC_SUPABASE_URL y
          EXPO_PUBLIC_SUPABASE_ANON_KEY. Reinicia con `npm start`.
        </Text>
      </View>
    );
  }

  if (inicializando) {
    return (
      <View style={styles.centro}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.cargandoTexto}>Verificando sesión…</Text>
      </View>
    );
  }

  if (!session) {
    if (vistaAuth === 'registro') {
      return (
        <RegisterScreen
          authService={authService}
          onIrALogin={() => setVistaAuth('login')}
        />
      );
    }

    return (
      <LoginScreen
        authService={authService}
        onIrARegistro={() => setVistaAuth('registro')}
      />
    );
  }

  return <HomeScreen session={session} authService={authService} />;
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f7fb',
  },
  cargandoTexto: {
    marginTop: 12,
    color: '#5c6b82',
  },
  avisoTitulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a2b4a',
    marginBottom: 12,
    textAlign: 'center',
  },
  avisoTexto: {
    fontSize: 15,
    color: '#5c6b82',
    textAlign: 'center',
    lineHeight: 22,
  },
});
