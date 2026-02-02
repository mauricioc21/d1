/**
 * CameraScreen - Pantalla de captura con cámara
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
// import { Camera } from 'react-native-vision-camera';

const CameraScreen = () => {
  const [captureMode, setCaptureMode] = useState('photo'); // photo, photo360, scan3d

  const captureModes = [
    { id: 'photo', label: 'Foto', icon: '📷' },
    { id: 'photo360', label: '360°', icon: '🌐' },
    { id: 'scan3d', label: 'Escaneo 3D', icon: '📐' },
  ];

  const handleCapture = () => {
    Alert.alert(
      'Captura',
      `Modo: ${captureMode}\n\nNOTA: La funcionalidad de cámara se implementará después de configurar los permisos necesarios.`,
      [{ text: 'OK' }]
    );
  };

  const handleConnectExternalCamera = () => {
    Alert.alert(
      'Conectar Cámara Externa',
      'Detectando cámaras 360° disponibles...\n\n• Insta360 ONE X2\n• Insta360 ONE X3\n• Insta360 ONE RS\n\nPróximamente disponible',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Vista previa de la cámara (placeholder) */}
      <View style={styles.cameraPreview}>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={styles.placeholderText}>Vista Previa de Cámara</Text>
          <Text style={styles.placeholderSubtext}>
            La cámara se activará después de{'\n'}configurar los permisos necesarios
          </Text>
        </View>
      </View>

      {/* Controles */}
      <View style={styles.controls}>
        {/* Selector de modo */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.modeSelector}
          contentContainerStyle={styles.modeSelectorContent}>
          {captureModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.modeButton,
                captureMode === mode.id && styles.modeButtonActive,
              ]}
              onPress={() => setCaptureMode(mode.id)}>
              <Text style={styles.modeIcon}>{mode.icon}</Text>
              <Text
                style={[
                  styles.modeLabel,
                  captureMode === mode.id && styles.modeLabelActive,
                ]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Información del modo */}
        <View style={styles.modeInfo}>
          {captureMode === 'photo' && (
            <Text style={styles.modeDescription}>
              Captura fotos normales de alta calidad
            </Text>
          )}
          {captureMode === 'photo360' && (
            <Text style={styles.modeDescription}>
              Captura fotos panorámicas 360° para recorridos virtuales
            </Text>
          )}
          {captureMode === 'scan3d' && (
            <Text style={styles.modeDescription}>
              Captura múltiples fotos para generar modelo 3D del espacio
            </Text>
          )}
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleConnectExternalCamera}>
            <Text style={styles.secondaryButtonText}>🔗 Cámara Externa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              Alert.alert('Galería', 'Abrir galería de capturas')
            }>
            <Text style={styles.secondaryButtonText}>📁 Galería</Text>
          </TouchableOpacity>
        </View>

        {/* Configuración rápida */}
        <View style={styles.quickSettings}>
          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingText}>⚡ Flash</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingText}>⏱️ Timer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingText}>🎨 Filtros</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingText}>⚙️ Ajustes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  controls: {
    backgroundColor: '#000000',
    paddingBottom: 20,
  },
  modeSelector: {
    maxHeight: 80,
  },
  modeSelectorContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modeButton: {
    alignItems: 'center',
    marginRight: 20,
    padding: 8,
  },
  modeButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 8,
  },
  modeIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  modeLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  modeLabelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  modeInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  modeDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#007AFF',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  quickSettings: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  settingButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  settingText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
});

export default CameraScreen;
