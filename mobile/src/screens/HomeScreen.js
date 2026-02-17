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
  Image,
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Image
          source={require('../../assets/images/logo-d1.png')}
          style={styles.heroLogo}
          resizeMode="contain"
        />
        <Text style={styles.heroTitle}>Su Todero D1</Text>
        <Text style={styles.heroSubtitle}>
          Escaneo 3D profesional, recorridos virtuales y planos inteligentes en un entorno premium.
        </Text>
      </View>

      {/* Acciones Rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
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
        <Text style={styles.sectionTitle}>Proyectos recientes</Text>
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
        <Text style={styles.footerText}>Su Todero D1 • Versión 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
    backgroundColor: colors.black,
  },
  heroLogo: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: -8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(247, 199, 74, 0.45)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 14,
    marginTop: 12,
  },
  heroSubtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    maxWidth: 340,
  },
  section: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 16,
    letterSpacing: 0.6,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 56) / 2,
    backgroundColor: colors.blackSoft,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderGold,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 6,
  },
  actionIcon: {
    fontSize: 44,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  actionDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.64)',
    textAlign: 'center',
    lineHeight: 18,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blackSoft,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderGold,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 5,
  },
  projectIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  projectIconText: {
    fontSize: 26,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 6,
  },
  projectDate: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.62)',
  },
  projectArrow: {
    fontSize: 26,
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.blackSoft,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderGold,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 5,
  },
  statValue: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.58)',
    letterSpacing: 0.3,
  },
  footer: {
    padding: 28,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.8,
  },
});

export default HomeScreen;
