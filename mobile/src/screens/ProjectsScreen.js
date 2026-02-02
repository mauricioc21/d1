/**
 * ProjectsScreen - Pantalla de gestión de proyectos
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

const ProjectsScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'Casa Ejemplo',
      date: '2026-02-01',
      images: 24,
      scans: 2,
      status: 'En proceso',
      storage: 'Firebase',
    },
    {
      id: '2',
      name: 'Apartamento 402',
      date: '2026-01-28',
      images: 18,
      scans: 1,
      status: 'Completado',
      storage: 'Local',
    },
    {
      id: '3',
      name: 'Oficina Central',
      date: '2026-01-25',
      images: 42,
      scans: 3,
      status: 'En proceso',
      storage: 'Firebase',
    },
  ]);

  const handleCreateProject = () => {
    Alert.alert(
      'Nuevo Proyecto',
      'Crear un nuevo proyecto de escaneo',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Crear',
          onPress: () => {
            // Lógica para crear proyecto
            console.log('Crear nuevo proyecto');
          },
        },
      ]
    );
  };

  const handleProjectPress = (project) => {
    Alert.alert(
      project.name,
      `Fecha: ${project.date}\nImágenes: ${project.images}\nEscaneos 3D: ${project.scans}\nEstado: ${project.status}\nAlmacenamiento: ${project.storage}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir', onPress: () => console.log('Abrir proyecto') },
        { text: 'Exportar', onPress: () => handleExport(project) },
      ]
    );
  };

  const handleExport = (project) => {
    Alert.alert(
      'Exportar Proyecto',
      'Selecciona el formato de exportación:',
      [
        { text: 'DWG (AutoCAD)', onPress: () => console.log('Export DWG') },
        { text: 'IFC (BIM)', onPress: () => console.log('Export IFC') },
        { text: 'OBJ (3D)', onPress: () => console.log('Export OBJ') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header con búsqueda */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar proyectos..."
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateProject}>
          <Text style={styles.createButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de proyectos */}
      <ScrollView style={styles.projectsList}>
        <Text style={styles.sectionTitle}>
          Mis Proyectos ({filteredProjects.length})
        </Text>

        {filteredProjects.map((project) => (
          <TouchableOpacity
            key={project.id}
            style={styles.projectCard}
            onPress={() => handleProjectPress(project)}>
            <View style={styles.projectHeader}>
              <View style={styles.projectIconContainer}>
                <Text style={styles.projectIcon}>📋</Text>
              </View>
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectDate}>{project.date}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  project.status === 'Completado'
                    ? styles.statusComplete
                    : styles.statusInProgress,
                ]}>
                <Text style={styles.statusText}>{project.status}</Text>
              </View>
            </View>

            <View style={styles.projectStats}>
              <View style={styles.stat}>
                <Text style={styles.statIcon}>📷</Text>
                <Text style={styles.statValue}>{project.images}</Text>
                <Text style={styles.statLabel}>Fotos</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statIcon}>📐</Text>
                <Text style={styles.statValue}>{project.scans}</Text>
                <Text style={styles.statLabel}>Escaneos</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statIcon}>
                  {project.storage === 'Firebase' ? '☁️' : '📱'}
                </Text>
                <Text style={styles.statValue}>{project.storage}</Text>
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
                onPress={() => handleExport(project)}>
                <Text style={styles.actionButtonTextPrimary}>Exportar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filteredProjects.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📁</Text>
            <Text style={styles.emptyText}>No hay proyectos</Text>
            <Text style={styles.emptySubtext}>
              Crea tu primer proyecto para comenzar
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  clearIcon: {
    fontSize: 16,
    color: '#8E8E93',
    padding: 4,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  projectsList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    padding: 16,
    paddingBottom: 8,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectIcon: {
    fontSize: 24,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  projectDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusComplete: {
    backgroundColor: '#34C759',
  },
  statusInProgress: {
    backgroundColor: '#FF9500',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F2F2F7',
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
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  projectActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  actionButtonTextPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default ProjectsScreen;
