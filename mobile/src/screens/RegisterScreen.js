import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';

const LOGO = require('../../assets/images/logo-d1.png');

const AUTH_FEATURES = [
  {
    icon: '🧭',
    title: 'Proyectos guiados',
    description: 'Organiza cada captura con flujos pensados para inmobiliario y retail.',
  },
  {
    icon: '🏗️',
    title: 'Modelos 2D/3D',
    description: 'Genera planos, mallas y recorridos virtuales con un solo repositorio.',
  },
  {
    icon: '🤝',
    title: 'Equipo sincronizado',
    description: 'Comparte avances entre web y app móvil con permisos seguros.',
  },
];

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');

    if (!name.trim()) {
      setError('Ingresa tu nombre o alias.');
      return;
    }

    if (!email.trim()) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      await register({ name: name.trim(), email: email.trim(), password });
    } catch (err) {
      console.error('Error al registrar usuario', err);
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandCard}>
          <Image source={LOGO} style={styles.brandLogo} resizeMode="contain" />
          <Text style={styles.brandTitle}>Su Todero D1</Text>
          <Text style={styles.brandSubtitle}>
            Crea tu cuenta para capturar espacios, planificar proyectos y compartir recorridos inmersivos con tu equipo.
          </Text>

          <View style={styles.brandHighlights}>
            {AUTH_FEATURES.map((feature) => (
              <View key={feature.title} style={styles.highlightItem}>
                <Text style={styles.highlightIcon}>{feature.icon}</Text>
                <View style={styles.highlightTextContainer}>
                  <Text style={styles.highlightTitle}>{feature.title}</Text>
                  <Text style={styles.highlightDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formKicker}>Comienza hoy</Text>
            <Text style={styles.formTitle}>Crear cuenta</Text>
            <Text style={styles.formSubtitle}>
              Regístrate para sincronizar tus capturas, archivos y modelos 3D desde cualquier dispositivo.
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre o alias</Text>
            <TextInput
              style={styles.input}
              placeholder="Mauricio Demo"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              textContentType="name"
              returnKeyType="next"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@correo.com"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 8 caracteres"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="next"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Repite tu contraseña"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="done"
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#0A0A0A" />
            ) : (
              <Text style={styles.primaryButtonText}>Crear cuenta</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const parseFirebaseError = (error) => {
  if (!error) return 'No pudimos crear la cuenta. Intenta nuevamente.';

  const message = error.code || error.message || '';

  if (message.includes('auth/email-already-in-use')) return 'Este correo ya está registrado.';
  if (message.includes('auth/invalid-email')) return 'El correo no es válido.';
  if (message.includes('auth/weak-password')) return 'La contraseña es demasiado débil.';

  return 'No pudimos crear la cuenta. Intenta nuevamente.';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'stretch',
  },
  brandCard: {
    backgroundColor: '#050505',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(247, 199, 74, 0.25)',
    padding: 28,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#F7C74A',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 18 },
    elevation: 8,
  },
  brandLogo: {
    width: 220,
    height: 200,
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F7C74A',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(105, 73, 17, 0.5)',
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 6 },
  },
  brandSubtitle: {
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
  },
  brandHighlights: {
    marginTop: 20,
    width: '100%',
    paddingBottom: 4,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#0C0C0C',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(247, 199, 74, 0.18)',
    marginBottom: 12,
  },
  highlightIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  highlightTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  highlightTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
    fontSize: 15,
  },
  highlightDescription: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 13,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: '#050505',
    borderRadius: 28,
    padding: 26,
    borderWidth: 1,
    borderColor: 'rgba(247, 199, 74, 0.22)',
    shadowColor: 'rgba(0,0,0,0.9)',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10,
  },
  formHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  formKicker: {
    color: 'rgba(247, 199, 74, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 4,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  formSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#121212',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(247, 199, 74, 0.28)',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#F7C74A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#F7C74A',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  primaryButtonText: {
    color: '#0A0A0A',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 26,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.75)',
    marginRight: 6,
  },
  footerLink: {
    color: '#F7C74A',
    fontWeight: '700',
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
});

export default RegisterScreen;
