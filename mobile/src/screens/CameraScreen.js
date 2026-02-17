/**
 * CameraScreen - Pantalla de captura con cámara
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import {
  createCapture,
  listenProjectsByUser,
  updateProject,
  uploadFile,
} from '../services/firebase.service';
import { CaptureType } from '../../../shared/data';
import {
  formatBytes,
  generateUniqueFileName,
  getFileExtension,
  getStoragePath,
  isImageFile,
  validateFileSize,
} from '../../../shared/utils/storage.utils';
import { storageConfig } from '../../../shared/config/firebase.config';

const STORAGE_FOLDER_BY_MODE = {
  [CaptureType.PHOTO]: 'photos',
  [CaptureType.PHOTO_360]: 'photos360',
  [CaptureType.SCAN_3D]: 'scans',
  [CaptureType.VIDEO]: 'videos',
};

const SIZE_KEY_BY_MODE = {
  [CaptureType.PHOTO]: 'photo',
  [CaptureType.PHOTO_360]: 'photo360',
  [CaptureType.SCAN_3D]: 'scan',
  [CaptureType.VIDEO]: 'video',
};

const CameraScreen = () => {
  const { user } = useAuth();
  const [captureMode, setCaptureMode] = useState('photo');
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const captureType = useMemo(() => {
    if (captureMode === 'photo360') return CaptureType.PHOTO_360;
    if (captureMode === 'scan3d') return CaptureType.SCAN_3D;
    return CaptureType.PHOTO;
  }, [captureMode]);

  const captureSizeKey = useMemo(
    () => SIZE_KEY_BY_MODE[captureType] || 'photo',
    [captureType]
  );

  const captureSizeLimitMB =
    storageConfig?.maxSizes?.[captureSizeKey] || storageConfig.maxSizes.photo;

  const totalSelectedBytes = useMemo(
    () => selectedAssets.reduce((acc, asset) => acc + (asset.fileSize || 0), 0),
    [selectedAssets]
  );

  useEffect(() => {
    if (!user?.uid) {
      setProjects([]);
      setSelectedProjectId('');
      setLoadingProjects(false);
      return undefined;
    }

    setLoadingProjects(true);
    setLoadError('');

    const unsubscribe = listenProjectsByUser(
      user.uid,
      (data) => {
        setProjects(data || []);
        setLoadingProjects(false);
        if (!selectedProjectId && data?.length) {
          setSelectedProjectId(data[0].id);
        }
      },
      {
        onError: (error) => {
          console.error('Error cargando proyectos:', error);
          setLoadError('No pudimos cargar los proyectos.');
          setLoadingProjects(false);
        },
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.uid, selectedProjectId]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  const captureModes = [
    { id: 'photo', label: 'Foto', icon: '📷' },
    { id: 'photo360', label: '360°', icon: '🌐' },
    { id: 'scan3d', label: 'Escaneo 3D', icon: '📐' },
  ];

  const resetUploadMessages = () => {
    setUploadError('');
    setUploadSuccess('');
  };

  const normalizeExtension = (asset) => {
    const fromName = asset.fileName ? getFileExtension(asset.fileName) : '';
    if (fromName) return fromName.toLowerCase();
    const typeExt = asset.type?.split('/')?.[1];
    if (typeExt) return typeExt.toLowerCase();
    return 'jpg';
  };

  const buildAssetEntry = (asset) => {
    const extension = normalizeExtension(asset);
    const fallbackName = `capture.${extension}`;
    const fileName = asset.fileName || fallbackName;
    const fileSize = Number(asset.fileSize || 0);
    const uri = asset.uri;
    const id = `${uri}-${fileSize}-${fileName}`;

    return {
      id,
      uri,
      fileName,
      fileSize,
      type: asset.type,
      extension,
    };
  };

  const handlePickFromLibrary = async () => {
    if (!user?.uid) {
      setUploadError('Inicia sesión para subir capturas.');
      return;
    }

    if (!selectedProjectId) {
      setUploadError('Selecciona un proyecto antes de subir capturas.');
      return;
    }

    resetUploadMessages();

    const response = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 0,
    });

    if (response?.didCancel) return;
    if (response?.errorMessage) {
      setUploadError(response.errorMessage);
      return;
    }

    const assets = response?.assets || [];
    const normalized = assets
      .filter((asset) => asset?.uri)
      .map(buildAssetEntry);

    if (!normalized.length) {
      setUploadError('No seleccionaste archivos válidos.');
      return;
    }

    setSelectedAssets(normalized);
    setUploadProgress({});
  };

  const handleCapture = () => {
    Alert.alert(
      'Captura',
      `Modo: ${captureMode}\n\nLa cámara nativa estará disponible luego de habilitar permisos.`
    );
  };

  const handleUpload = async () => {
    if (!user?.uid) {
      setUploadError('Inicia sesión para subir capturas.');
      return;
    }

    if (!selectedProjectId) {
      setUploadError('Selecciona un proyecto antes de subir capturas.');
      return;
    }

    if (selectedAssets.length === 0) {
      setUploadError('Selecciona al menos una captura.');
      return;
    }

    setUploading(true);
    resetUploadMessages();
    setUploadProgress({});

    const storageFolder = STORAGE_FOLDER_BY_MODE[captureType] || 'photos';
    let coverImageUrl = selectedProject?.coverImageUrl || null;
    let uploadedCount = 0;
    let uploadedBytes = 0;
    const failedAssets = [];

    for (const asset of selectedAssets) {
      if (!validateFileSize(asset.fileSize, captureSizeKey)) {
        failedAssets.push({
          id: asset.id,
          message: `El archivo ${asset.fileName} supera el límite de ${captureSizeLimitMB} MB.`,
        });
        continue;
      }

      const storageFileName = generateUniqueFileName('capture', asset.extension);
      const storagePath = getStoragePath(storageFolder, user.uid, storageFileName);

      try {
        const downloadURL = await uploadFile(asset.uri, storagePath, (progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [asset.id]: progress,
          }));
        });

        await createCapture({
          projectId: selectedProjectId,
          userId: user.uid,
          type: captureType,
          storagePath,
          downloadURL,
          thumbnailURL: isImageFile(asset.fileName) ? downloadURL : null,
          fileName: storageFileName,
          fileSize: asset.fileSize,
          captureMetadata: {
            originalName: asset.fileName,
            storageLocation: 'firebase',
            uploadSource: 'mobile',
            extension: asset.extension,
            fileSizeReadable: formatBytes(asset.fileSize),
          },
          processing: {
            state: 'completed',
            progress: 100,
            priority: 'normal',
          },
        });

        uploadedCount += 1;
        uploadedBytes += asset.fileSize || 0;

        if (!coverImageUrl && isImageFile(asset.fileName)) {
          coverImageUrl = downloadURL;
        }
      } catch (error) {
        console.error('Error subiendo captura:', error);
        failedAssets.push({
          id: asset.id,
          message: `No pudimos subir ${asset.fileName}.`,
        });
      }
    }

    if (uploadedCount > 0) {
      const existingMetadata = selectedProject?.metadata || {};
      const previousTotalFiles = Number(existingMetadata.totalFiles || 0);
      const previousTotalBytes = Number(existingMetadata.totalSizeBytes || 0);
      const newTotalFiles = previousTotalFiles + uploadedCount;
      const newTotalBytes = previousTotalBytes + uploadedBytes;

      try {
        await updateProject(selectedProjectId, {
          coverImageUrl,
          metadata: {
            ...existingMetadata,
            storageLocation: 'firebase',
            lastUploadSource: 'mobile',
            lastUploadUser: user.uid,
            lastUploadAt: new Date().toISOString(),
            lastCaptureType: captureType,
            totalFiles: newTotalFiles,
            totalSizeBytes: newTotalBytes,
            totalSizeReadable: formatBytes(newTotalBytes),
          },
        });
      } catch (error) {
        console.error('Error actualizando metadata del proyecto:', error);
      }
    }

    if (failedAssets.length > 0) {
      setUploadError(`No se subieron ${failedAssets.length} captura(s).`);
    }

    if (uploadedCount === 0) {
      setUploadError('No pudimos subir ninguna captura.');
    } else {
      setUploadSuccess(
        `Subimos ${uploadedCount} captura${uploadedCount !== 1 ? 's' : ''} correctamente.`
      );
      setSelectedAssets([]);
      setUploadProgress({});
    }

    setUploading(false);
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
      <View style={styles.cameraPreview}>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={styles.placeholderText}>Vista Previa de Cámara</Text>
          <Text style={styles.placeholderSubtext}>
            La cámara se activará después de{'
'}configurar los permisos necesarios
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <View style={styles.projectSelector}>
          <Text style={styles.sectionLabel}>Proyecto activo</Text>
          {loadingProjects ? (
            <View style={styles.inlineRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.helperText}>Cargando proyectos...</Text>
            </View>
          ) : loadError ? (
            <Text style={styles.errorText}>{loadError}</Text>
          ) : projects.length === 0 ? (
            <Text style={styles.helperText}>Aún no tienes proyectos creados.</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.projectList}
            >
              {projects.map((project) => {
                const isActive = project.id === selectedProjectId;
                return (
                  <TouchableOpacity
                    key={project.id}
                    style={[styles.projectChip, isActive && styles.projectChipActive]}
                    onPress={() => setSelectedProjectId(project.id)}
                  >
                    <Text
                      style={[
                        styles.projectChipText,
                        isActive && styles.projectChipTextActive,
                      ]}
                    >
                      {project.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.modeSelector}
          contentContainerStyle={styles.modeSelectorContent}
        >
          {captureModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.modeButton,
                captureMode === mode.id && styles.modeButtonActive,
              ]}
              onPress={() => setCaptureMode(mode.id)}
            >
              <Text style={styles.modeIcon}>{mode.icon}</Text>
              <Text
                style={[
                  styles.modeLabel,
                  captureMode === mode.id && styles.modeLabelActive,
                ]}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
          <Text style={styles.helperText}>Límite por archivo: {captureSizeLimitMB} MB</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleConnectExternalCamera}
          >
            <Text style={styles.secondaryButtonText}>🔗 Cámara Externa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handlePickFromLibrary}
          >
            <Text style={styles.secondaryButtonText}>📁 Galería</Text>
          </TouchableOpacity>
        </View>

        {uploadError ? <Text style={styles.errorBanner}>{uploadError}</Text> : null}
        {uploadSuccess ? (
          <Text style={styles.successBanner}>{uploadSuccess}</Text>
        ) : null}

        {selectedAssets.length > 0 && (
          <View style={styles.uploadCard}>
            <View style={styles.uploadHeader}>
              <Text style={styles.uploadTitle}>
                Archivos seleccionados ({selectedAssets.length})
              </Text>
              <Text style={styles.uploadSubtitle}>{formatBytes(totalSelectedBytes)}</Text>
            </View>

            {selectedAssets.map((asset) => {
              const progress = uploadProgress[asset.id] || 0;
              return (
                <View key={asset.id} style={styles.uploadRow}>
                  <View style={styles.uploadRowInfo}>
                    <Text style={styles.uploadFileName}>{asset.fileName}</Text>
                    <Text style={styles.uploadFileMeta}>
                      {formatBytes(asset.fileSize)} · {asset.extension.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.progressPill}>
                    <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                  </View>
                </View>
              );
            })}

            <TouchableOpacity
              style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
              onPress={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color={colors.black} />
              ) : (
                <Text style={styles.uploadButtonText}>Subir capturas</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

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
    backgroundColor: colors.black,
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: colors.blackSoft,
    borderBottomWidth: 1,
    borderColor: colors.borderGold,
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
    color: colors.primary,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.62)',
    textAlign: 'center',
  },
  controls: {
    backgroundColor: colors.black,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: colors.borderGold,
  },
  projectSelector: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
    fontWeight: '700',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helperText: {
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 8,
    fontSize: 12,
  },
  projectList: {
    paddingBottom: 4,
  },
  projectChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(247, 199, 74, 0.4)',
    marginRight: 10,
  },
  projectChipActive: {
    backgroundColor: 'rgba(247, 199, 74, 0.2)',
    borderColor: colors.primary,
  },
  projectChipText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    fontSize: 13,
  },
  projectChipTextActive: {
    color: colors.primary,
  },
  modeSelector: {
    maxHeight: 80,
    marginTop: 8,
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
    backgroundColor: 'rgba(247, 199, 74, 0.18)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGold,
    paddingHorizontal: 10,
  },
  modeIcon: {
    fontSize: 32,
    marginBottom: 4,
    color: colors.primary,
  },
  modeLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  modeLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  modeInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
    alignItems: 'center',
  },
  modeDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.78)',
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
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(247, 199, 74, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  secondaryButtonText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  errorBanner: {
    color: '#ffb4b4',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  successBanner: {
    color: '#9fe6b8',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  uploadCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(15, 15, 15, 0.9)',
  },
  uploadHeader: {
    marginBottom: 12,
  },
  uploadTitle: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: '700',
  },
  uploadSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
  },
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  uploadRowInfo: {
    flex: 1,
    marginRight: 10,
  },
  uploadFileName: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: '600',
  },
  uploadFileMeta: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
  },
  progressPill: {
    backgroundColor: 'rgba(247, 199, 74, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  uploadButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: colors.black,
    fontWeight: '700',
  },
  quickSettings: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  settingText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
  },
  errorText: {
    color: '#ffb4b4',
  },
});

export default CameraScreen;
