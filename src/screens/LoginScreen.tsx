import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AuthService } from '../services/AuthService';

type Props = {
  authService: AuthService;
  onIrARegistro: () => void;
};

export function LoginScreen({ authService, onIrARegistro }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Datos incompletos', 'Ingresa correo y contraseña.');
      return;
    }

    setCargando(true);
    try {
      await authService.iniciarSesion(email.trim(), password);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'No se pudo iniciar sesión.';
      Alert.alert('Error de login', mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.titulo}>Iniciar sesión</Text>
      <Text style={styles.subtitulo}>Mis Libros — accede a tu biblioteca</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.botonPrimario} onPress={handleLogin} disabled={cargando}>
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botonPrimarioTexto}>Entrar</Text>
        )}
      </Pressable>

      <Pressable onPress={onIrARegistro} disabled={cargando}>
        <Text style={styles.enlace}>¿No tienes cuenta? Regístrate</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a2b4a',
  },
  subtitulo: {
    fontSize: 15,
    color: '#5c6b82',
    marginBottom: 24,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d8dee9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  botonPrimario: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botonPrimarioTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  enlace: {
    marginTop: 20,
    textAlign: 'center',
    color: '#2563eb',
    fontWeight: '600',
  },
});
