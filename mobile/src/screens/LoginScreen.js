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
    icon: '🌀',
    title: 'Captura 360°',
    description: 'Integra cámaras 360° o tu smartphone para recorridos inmersivos.',
  },
  {
    icon: '📐',
    title: 'Planos inteligentes',
    description: 'Genera modelos 2D/3D listos para CAD/BIM con precisión milimétrica.',
  },
  {
    icon: '☁️',
    title: 'Sincronización segura',
    description: 'Gestiona tus proyectos desde web y móvil gracias a Firebase.',
  },
];

const LoginScreen = ({ navigation }) => {
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleLogin = async () => {
    setError('');
    setInfoMessage('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (err) {
      console.error('Error al iniciar sesión', err);
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Ingresa tu correo para recuperar la contraseña.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await resetPassword(email.trim());
      setInfoMessage('Te enviamos un correo con instrucciones.');
    } catch (err) {
      console.error('Error enviando correo de recuperación', err);
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
            Escaneo 3D profesional, recorridos virtuales y planos inteligentes listos para tus proyectos.
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
            <Text style={styles.formKicker}>Acceso seguro</Text>
            <Text style={styles.formTitle}>Inicia sesión</Text>
            <Text style={styles.formSubtitle}>
              Gestiona proyectos, capturas 3D y recorridos inmersivos sin salir de la oficina.
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@correo.com"
              placeholderTextColor="rgba(255,255,255,0.35)"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              textContentType="emailAddress"
              returnKeyType="next"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.35)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              textContentType="password"
              returnKeyType="done"
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {infoMessage ? <Text style={styles.infoText}>{infoMessage}</Text> : null}

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#0A0A0A" />
            ) : (
              <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleResetPassword} style={styles.linkButton}>
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const parseFirebaseError = (error) => {
  if (!error) return 'Ocurrió un error inesperado. Inténtalo de nuevo.';

  const message = error.code || error.message || '';

  if (message.includes('auth/invalid-email')) return 'El correo electrónico no es válido.';
  if (message.includes('auth/user-not-found')) return 'No encontramos una cuenta con ese correo.';
  if (message.includes('auth/wrong-password')) return 'La contraseña es incorrecta.';
  if (message.includes('auth/too-many-requests')) {
    return 'Demasiados intentos fallidos. Inténtalo más tarde.';
  }

  return 'No pudimos iniciar sesión. Revisa tus datos e intenta nuevamente.';
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
  linkButton: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    color: '#F7C74A',
    fontSize: 14,
    fontWeight: '600',
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
  infoText: {
    color: '#5AE395',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
});

export default LoginScreen;
