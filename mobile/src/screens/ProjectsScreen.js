/**
 * ProjectsScreen - Pantalla de gestión de proyectos
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { createProject, listenProjectsByUser } from '../services/firebase.service';
import { ProjectStatus } from '../../../shared/data';

const STATUS_LABELS = {
  [ProjectStatus.DRAFT]: 'Borrador',
  [ProjectStatus.ACTIVE]: 'En proceso',
  [ProjectStatus.PROCESSING]: 'Procesando',
  [ProjectStatus.COMPLETED]: 'Completado',
  [ProjectStatus.ARCHIVED]: 'Archivado',
};

const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return 'Sin fecha';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return 'Sin fecha';
  }
};

const ProjectsScreen = () => {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    if (!user?.uid) {
      setProjects([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setLoadError('');

    const unsubscribe = listenProjectsByUser(
      user.uid,
      (data) => {
        setProjects(data || []);
        setLoading(false);
      },
      {
        onError: (error) => {
          console.error('Error cargando proyectos:', error);
          setLoadError('No pudimos cargar tus proyectos. Intenta nuevamente.');
          setLoading(false);
        },
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.uid]);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    return projects.filter((project) => {
      if (!normalizedSearch) return true;
      return project.name?.toLowerCase().includes(normalizedSearch);
    });
  }, [projects, searchText]);

  const handleToggleCreate = () => {
    setIsCreating((prev) => !prev);
    setCreateError('');
  };

  const handleCreateProject = async () => {
    if (!user?.uid) {
      setCreateError('Inicia sesión para crear un proyecto.');
      return;
    }

    if (!createName.trim()) {
      setCreateError('El nombre del proyecto es obligatorio.');
      return;
    }

    setCreating(true);
    setCreateError('');

    try {
      await createProject({
        name: createName.trim(),
        description: createDescription.trim(),
        createdBy: user.uid,
        status: ProjectStatus.ACTIVE,
        metadata: {
          source: 'mobile',
        },
      });

      setCreateName('');
      setCreateDescription('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creando proyecto:', error);
      setCreateError('No pudimos crear el proyecto. Intenta nuevamente.');
    } finally {
      setCreating(false);
    }
  };

  const handleProjectPress = (project) => {
    const statusLabel = STATUS_LABELS[project.status] || 'En proceso';
    const metrics = project.metrics || {};
    const storageLabel = project.settings?.syncToCloud ? 'Firebase' : 'Local';

    Alert.alert(
      project.name,
      `Fecha: ${formatDate(project.createdAt)}\nImágenes: ${metrics.totalCaptures || 0}\nEscaneos 3D: ${metrics.totalScans || 0}\nEstado: ${statusLabel}\nAlmacenamiento: ${storageLabel}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir', onPress: () => console.log('Abrir proyecto', project.id) },
        { text: 'Exportar', onPress: () => handleExport(project) },
      ]
    );
  };

  const handleExport = (project) => {
    Alert.alert('Exportar Proyecto', 'Selecciona el formato de exportación:', [
      { text: 'DWG (AutoCAD)', onPress: () => console.log('Export DWG', project.id) },
      { text: 'IFC (BIM)', onPress: () => console.log('Export IFC', project.id) },
      { text: 'OBJ (3D)', onPress: () => console.log('Export OBJ', project.id) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Tus proyectos</Text>
        <Text style={styles.heroSubtitle}>
          Gestiona espacios, escaneos y exportaciones desde un solo lugar.
        </Text>
      </View>

      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar proyectos..."
            placeholderTextColor="rgba(255,255,255,0.45)"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleToggleCreate}>
          <Text style={styles.createButtonText}>{isCreating ? 'Cancelar' : '+ Nuevo proyecto'}</Text>
        </TouchableOpacity>
      </View>

      {isCreating && (
        <View style={styles.createCard}>
          <Text style={styles.createTitle}>Nuevo proyecto</Text>
          <TextInput
            style={styles.createInput}
            placeholder="Nombre del proyecto"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={createName}
            onChangeText={setCreateName}
          />
          <TextInput
            style={[styles.createInput, styles.createTextarea]}
            placeholder="Descripción (opcional)"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={createDescription}
            onChangeText={setCreateDescription}
            multiline
          />
          {createError ? <Text style={styles.errorText}>{createError}</Text> : null}
          <TouchableOpacity
            style={[styles.createSubmitButton, creating && styles.createSubmitButtonDisabled]}
            onPress={handleCreateProject}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator color={colors.black} />
            ) : (
              <Text style={styles.createSubmitText}>Crear proyecto</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {loadError ? <Text style={styles.errorBanner}>{loadError}</Text> : null}

      <ScrollView style={styles.projectsList}>
        <Text style={styles.sectionTitle}>Mis proyectos ({filteredProjects.length})</Text>

        {loading && (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando proyectos...</Text>
          </View>
        )}

        {!loading &&
          filteredProjects.map((project) => {
            const statusLabel = STATUS_LABELS[project.status] || 'En proceso';
            const metrics = project.metrics || {};
            const storageLabel = project.settings?.syncToCloud ? 'Firebase' : 'Local';
            const isCompleted = project.status === ProjectStatus.COMPLETED;
            const isArchived = project.status === ProjectStatus.ARCHIVED;

            return (
              <TouchableOpacity
                key={project.id}
                style={styles.projectCard}
                activeOpacity={0.85}
                onPress={() => handleProjectPress(project)}
              >
                <View style={styles.projectHeader}>
                  <View style={styles.projectIconContainer}>
                    <Text style={styles.projectIcon}>📋</Text>
                  </View>
                  <View style={styles.projectInfo}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <Text style={styles.projectDate}>{formatDate(project.createdAt)}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      isCompleted
                        ? styles.statusComplete
                        : isArchived
                          ? styles.statusArchived
                          : styles.statusInProgress,
                    ]}
                  >
                    <Text style={styles.statusText}>{statusLabel}</Text>
                  </View>
                </View>

                <View style={styles.projectStats}>
                  <View style={styles.stat}>
                    <Text style={styles.statIcon}>📷</Text>
                    <Text style={styles.statValue}>{metrics.totalCaptures || 0}</Text>
                    <Text style={styles.statLabel}>Fotos</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statIcon}>📐</Text>
                    <Text style={styles.statValue}>{metrics.totalScans || 0}</Text>
                    <Text style={styles.statLabel}>Escaneos</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statIcon}>{storageLabel === 'Firebase' ? '☁️' : '📱'}</Text>
                    <Text style={styles.statValue}>{storageLabel}</Text>
                    <Text style={styles.statLabel}>Storage</Text>
                  </View>
                </View>

                <View style={styles.projectActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Ver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonPrimary]}
                    onPress={() => handleExport(project)}
                  >
                    <Text style={styles.actionButtonTextPrimary}>Exportar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}

        {!loading && filteredProjects.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📁</Text>
            <Text style={styles.emptyText}>No hay proyectos</Text>
            <Text style={styles.emptySubtext}>Crea tu primer proyecto para comenzar</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: colors.black,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 21,
    maxWidth: 320,
  },
  header: {
    backgroundColor: colors.blackSoft,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderGold,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blackLight,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  searchIcon: {
    fontSize: 18,
    color: colors.textLight,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textLight,
  },
  clearIcon: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    padding: 4,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: colors.shadowGold,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 6,
  },
  createButtonText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  createCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderGold,
    backgroundColor: colors.blackSoft,
  },
  createTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 12,
  },
  createInput: {
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textLight,
    marginBottom: 12,
    backgroundColor: colors.blackLight,
  },
  createTextarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  createSubmitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  createSubmitButtonDisabled: {
    opacity: 0.6,
  },
  createSubmitText: {
    color: colors.black,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  errorBanner: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 77, 0.5)',
    backgroundColor: 'rgba(255, 77, 77, 0.16)',
    color: '#ffb3b3',
    fontWeight: '600',
  },
  errorText: {
    color: '#ffb3b3',
    marginBottom: 12,
    fontSize: 13,
  },
  projectsList: {
    flex: 1,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
    paddingHorizontal: 20,
    paddingBottom: 12,
    letterSpacing: 0.5,
  },
  loadingState: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: colors.textLight,
  },
  projectCard: {
    backgroundColor: colors.blackSoft,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderGold,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.4,
    shadowRadius: 22,
    elevation: 6,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  projectIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  projectIcon: {
    fontSize: 26,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 6,
  },
  projectDate: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusComplete: {
    backgroundColor: 'rgba(52, 199, 89, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.45)',
  },
  statusInProgress: {
    backgroundColor: 'rgba(247, 199, 74, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(247, 199, 74, 0.45)',
  },
  statusArchived: {
    backgroundColor: 'rgba(148, 149, 153, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(148, 149, 153, 0.4)',
  },
  statusText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '700',
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderGold,
  },
  stat: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  projectActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.blackLight,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
  },
  actionButtonTextPrimary: {
    color: colors.black,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 38,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textLight,
  },
  emptySubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
    textAlign: 'center',
  },
});

export default ProjectsScreen;
