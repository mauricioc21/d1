/**
 * HomeScreen - Pantalla principal de la app
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const quickActions = [
    {
      id: '1',
      title: 'Escaneo 3D',
      icon: '📐',
      description: 'Captura espacios en 3D',
      action: () => navigation.navigate('Cámara'),
    },
    {
      id: '2',
      title: 'Foto 360°',
      icon: '🌐',
      description: 'Toma fotos panorámicas',
      action: () => navigation.navigate('Cámara'),
    },
    {
      id: '3',
      title: 'Proyectos',
      icon: '📁',
      description: 'Ver mis proyectos',
      action: () => navigation.navigate('Proyectos'),
    },
    {
      id: '4',
      title: 'Cámara 360',
      icon: '📷',
      description: 'Conectar Insta360',
      action: () => alert('Próximamente: Conexión a cámara externa'),
    },
  ];

  const recentProjects = [
    { id: '1', name: 'Casa Ejemplo', date: '2026-02-01', images: 24 },
    { id: '2', name: 'Apartamento 402', date: '2026-01-28', images: 18 },
    { id: '3', name: 'Oficina Central', date: '2026-01-25', images: 42 },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Su Todero D1</Text>
        <Text style={styles.subtitle}>¡Bienvenido! 👋</Text>
      </View>

      {/* Acciones Rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={action.action}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Proyectos Recientes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Proyectos Recientes</Text>
        {recentProjects.map((project) => (
          <TouchableOpacity
            key={project.id}
            style={styles.projectCard}
            onPress={() =>
              navigation.navigate('Proyectos', { projectId: project.id })
            }>
            <View style={styles.projectIcon}>
              <Text style={styles.projectIconText}>📋</Text>
            </View>
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>{project.name}</Text>
              <Text style={styles.projectDate}>
                {project.date} • {project.images} imágenes
              </Text>
            </View>
            <Text style={styles.projectArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Estadísticas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Proyectos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>284</Text>
            <Text style={styles.statLabel}>Capturas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Escaneos 3D</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Versión 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteSoft,
  },
  header: {
    padding: 20,
    backgroundColor: colors.black,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.whiteSoft,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 48) / 2,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectIconText: {
    fontSize: 24,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  projectDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  projectArrow: {
    fontSize: 24,
    color: '#C7C7CC',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#C7C7CC',
  },
});

export default HomeScreen;
