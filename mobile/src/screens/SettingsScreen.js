/**
 * SettingsScreen - Pantalla de configuración
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import colors from '../theme/colors';

const SettingsScreen = () => {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    autoUpload: true,
    useWifiOnly: true,
    saveLocal: false,
    highQuality: true,
    notifications: true,
  });

  const displayInitials = useMemo(() => {
    if (!user?.displayName) return '👤';
    const nameParts = user.displayName.toUpperCase().split(' ');
    const initials = nameParts.slice(0, 2).map((part) => part.charAt(0)).join('');
    return initials || '👤';
  }, [user]);

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Limpiar Caché',
      '¿Estás seguro de que quieres limpiar el caché? Los archivos en Firebase no se eliminarán.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => console.log('Limpiando caché...'),
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error('Error al cerrar sesión', error);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Perfil */}
      <View style={styles.section}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{displayInitials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName || 'Usuario Su Todero'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* Almacenamiento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Almacenamiento</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Subida Automática</Text>
            <Text style={styles.settingDescription}>
              Subir capturas a Firebase automáticamente
            </Text>
          </View>
          <Switch
            value={settings.autoUpload}
            onValueChange={() => toggleSetting('autoUpload')}
            trackColor={{ false: colors.blackLight, true: 'rgba(247, 199, 74, 0.65)' }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Solo WiFi</Text>
            <Text style={styles.settingDescription}>
              Subir archivos solo con conexión WiFi
            </Text>
          </View>
          <Switch
            value={settings.useWifiOnly}
            onValueChange={() => toggleSetting('useWifiOnly')}
            trackColor={{ false: colors.blackLight, true: 'rgba(247, 199, 74, 0.65)' }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Guardar Localmente</Text>
            <Text style={styles.settingDescription}>
              También guardar copias en el dispositivo
            </Text>
          </View>
          <Switch
            value={settings.saveLocal}
            onValueChange={() => toggleSetting('saveLocal')}
            trackColor={{ false: colors.blackLight, true: 'rgba(247, 199, 74, 0.65)' }}
            thumbColor={colors.white}
          />
        </View>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>☁️ Gestionar Almacenamiento</Text>
          <Text style={styles.linkButtonValue}>2.4 GB / 10 GB</Text>
        </TouchableOpacity>
      </View>

      {/* Captura */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Captura</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Alta Calidad</Text>
            <Text style={styles.settingDescription}>
              Capturar en máxima resolución
            </Text>
          </View>
          <Switch
            value={settings.highQuality}
            onValueChange={() => toggleSetting('highQuality')}
            trackColor={{ false: colors.blackLight, true: 'rgba(247, 199, 74, 0.65)' }}
            thumbColor={colors.white}
          />
        </View>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>📷 Configuración de Cámara</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>🔗 Cámaras Externas</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Exportación */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exportación</Text>
        
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>📐 Formatos CAD</Text>
          <Text style={styles.linkButtonValue}>DWG, DXF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>🏗️ Formatos BIM</Text>
          <Text style={styles.linkButtonValue}>IFC, RVT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>🎨 Formatos 3D</Text>
          <Text style={styles.linkButtonValue}>OBJ, FBX, GLB</Text>
        </TouchableOpacity>
      </View>

      {/* Notificaciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notificaciones Push</Text>
            <Text style={styles.settingDescription}>
              Recibir alertas sobre procesamiento y exportaciones
            </Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={() => toggleSetting('notifications')}
            trackColor={{ false: colors.blackLight, true: 'rgba(247, 199, 74, 0.65)' }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      {/* General */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>❓ Ayuda y Soporte</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>📖 Tutoriales</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>ℹ️ Acerca de</Text>
          <Text style={styles.linkButtonValue}>v1.0.0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={handleClearCache}>
          <Text style={styles.linkButtonText}>🗑️ Limpiar Caché</Text>
          <Text style={styles.linkButtonValue}>120 MB</Text>
        </TouchableOpacity>
      </View>

      {/* Cuenta */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.linkButton, styles.dangerButton]}
          onPress={handleLogout}>
          <Text style={styles.dangerButtonText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Su Todero D1 v1.0.0</Text>
        <Text style={styles.footerText}>© 2026 Todos los derechos reservados</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(247, 199, 74, 0.65)',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingVertical: 8,
    letterSpacing: 0.5,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blackSoft,
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderGold,
    shadowColor: colors.shadowGold,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.black,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  chevron: {
    fontSize: 24,
    color: colors.textGold,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.blackSoft,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGold,
    marginHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.blackSoft,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderGold,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  linkButtonText: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '600',
  },
  linkButtonValue: {
    fontSize: 14,
    color: colors.textGold,
    fontWeight: '600',
  },
  dangerButton: {
    borderBottomWidth: 0,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(220, 53, 69, 0.4)',
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
});

export default SettingsScreen;
