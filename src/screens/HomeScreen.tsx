import { StatusBar } from 'expo-status-bar';
import type { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Libro } from '../models/Libro';
import { AuthService } from '../services/AuthService';
import { LibroService } from '../services/LibroService';

type Props = {
  session: Session;
  authService: AuthService;
};

export function HomeScreen({ session, authService }: Props) {
  const servicio = useMemo(() => new LibroService(), []);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [total, setTotal] = useState(0);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [anioTexto, setAnioTexto] = useState('');
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const sincronizarLista = useCallback(async () => {
    setCargandoLista(true);
    try {
      const lista = await servicio.obtenerTodos();
      setLibros(lista);
      setTotal(lista.length);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'No se pudieron cargar los libros.';
      Alert.alert('Error', mensaje);
    } finally {
      setCargandoLista(false);
    }
  }, [servicio]);

  useEffect(() => {
    sincronizarLista();
  }, [sincronizarLista, session.user.id]);

  const handleAgregar = async () => {
    const anio = parseInt(anioTexto, 10);
    if (!titulo.trim() || !autor.trim() || Number.isNaN(anio)) {
      Alert.alert('Datos incompletos', 'Ingresa título, autor y año válido.');
      return;
    }
    if (anio < 0 || anio > new Date().getFullYear()) {
      Alert.alert('Año inválido', 'El año debe ser razonable.');
      return;
    }

    try {
      await servicio.agregar(titulo, autor, anio);
      setTitulo('');
      setAutor('');
      setAnioTexto('');
      await sincronizarLista();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'No se pudo agregar el libro.';
      Alert.alert('Error', mensaje);
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await servicio.eliminar(id);
      await sincronizarLista();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'No se pudo eliminar.';
      Alert.alert('Error', mensaje);
    }
  };

  const handleCerrarSesion = async () => {
    setCerrandoSesion(true);
    try {
      await authService.cerrarSesion();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'No se pudo cerrar sesión.';
      Alert.alert('Error', mensaje);
    } finally {
      setCerrandoSesion(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      <View style={styles.encabezado}>
        <View>
          <Text style={styles.tituloApp}>Mis Libros</Text>
          <Text style={styles.subtitulo}>{total} en Supabase · {session.user.email}</Text>
        </View>
        <Pressable style={styles.botonSalir} onPress={handleCerrarSesion} disabled={cerrandoSesion}>
          {cerrandoSesion ? (
            <ActivityIndicator color="#b91c1c" />
          ) : (
            <Text style={styles.botonSalirTexto}>Cerrar sesión</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder="Autor"
          value={autor}
          onChangeText={setAutor}
        />
        <TextInput
          style={styles.input}
          placeholder="Año"
          value={anioTexto}
          onChangeText={setAnioTexto}
          keyboardType="number-pad"
        />
        <Pressable style={styles.botonAgregar} onPress={handleAgregar}>
          <Text style={styles.botonAgregarTexto}>Agregar libro</Text>
        </Pressable>
      </View>

      {cargandoLista ? (
        <ActivityIndicator size="large" color="#2563eb" style={styles.cargando} />
      ) : (
        <FlatList
          data={libros}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.vacio}>No hay libros aún. Agrega el primero arriba.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <View style={styles.tarjetaInfo}>
                <Text style={styles.tarjetaTitulo}>{item.titulo}</Text>
                <Text style={styles.tarjetaDetalle}>{item.obtenerResumen()}</Text>
                {item.esClasico() ? (
                  <Text style={styles.etiquetaClasico}>Clásico</Text>
                ) : null}
              </View>
              <Pressable style={styles.botonEliminar} onPress={() => handleEliminar(item.id)}>
                <Text style={styles.botonEliminarTexto}>Eliminar</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  tituloApp: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a2b4a',
  },
  subtitulo: {
    fontSize: 13,
    color: '#5c6b82',
    marginTop: 4,
    maxWidth: 240,
  },
  botonSalir: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 110,
    alignItems: 'center',
  },
  botonSalirTexto: {
    color: '#b91c1c',
    fontWeight: '600',
    fontSize: 13,
  },
  formulario: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d8dee9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafbfc',
  },
  botonAgregar: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  botonAgregarTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cargando: {
    marginTop: 40,
  },
  lista: {
    paddingBottom: 32,
    gap: 10,
  },
  vacio: {
    textAlign: 'center',
    color: '#7a8799',
    marginTop: 24,
  },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  tarjetaInfo: {
    flex: 1,
  },
  tarjetaTitulo: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a2b4a',
  },
  tarjetaDetalle: {
    fontSize: 14,
    color: '#5c6b82',
    marginTop: 4,
  },
  etiquetaClasico: {
    marginTop: 6,
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  botonEliminar: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botonEliminarTexto: {
    color: '#b91c1c',
    fontWeight: '600',
    fontSize: 14,
  },
});
