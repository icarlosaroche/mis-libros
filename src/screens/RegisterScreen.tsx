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
  onIrALogin: () => void;
};

export function RegisterScreen({ authService, onIrALogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Datos incompletos', 'Completa correo y contraseña.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Contraseña débil', 'Usa al menos 6 caracteres.');
      return;
    }
    if (password !== confirmacion) {
      Alert.alert('Contraseñas distintas', 'La confirmación no coincide.');
      return;
    }

    setCargando(true);
    try {
      await authService.registrar(email.trim(), password);
      Alert.alert(
        'Cuenta creada',
        'Si tu proyecto exige confirmación por correo, revisa tu bandeja. Luego inicia sesión.',
      );
      onIrALogin();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'No se pudo registrar.';
      Alert.alert('Error de registro', mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.titulo}>Registro</Text>
      <Text style={styles.subtitulo}>Crea tu cuenta para guardar libros en Supabase</Text>

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
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmacion}
        onChangeText={setConfirmacion}
      />

      <Pressable style={styles.botonPrimario} onPress={handleRegistro} disabled={cargando}>
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botonPrimarioTexto}>Registrarme</Text>
        )}
      </Pressable>

      <Pressable onPress={onIrALogin} disabled={cargando}>
        <Text style={styles.enlace}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    backgroundColor: '#059669',
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
